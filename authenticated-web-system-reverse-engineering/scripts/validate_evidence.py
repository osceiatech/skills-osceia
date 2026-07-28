#!/usr/bin/env python3
"""Valida evidências estruturais sem modificar o arquivo de entrada."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit

FORBIDDEN_KEYS = {
    "value", "values", "row", "rows", "cell", "cells", "record", "records",
    "innertext", "textcontent", "html", "outerhtml", "body", "responsebody",
    "cookie", "cookies", "header", "headers", "authorization", "token", "password",
    "localstorage", "sessionstorage", "screenshot", "payload", "requestbody",
    "response", "headings", "username", "user", "personname",
}

PII_PATTERNS = {
    "e-mail": re.compile(r"(?i)\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b"),
    "CPF": re.compile(r"(?<!\d)\d{3}\.\d{3}\.\d{3}-\d{2}(?!\d)"),
    "CNPJ": re.compile(r"(?<!\d)\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}(?!\d)"),
    "telefone": re.compile(r"(?<!\d)(?:\+?55\s*)?\(?\d{2}\)?\s*9?\d{4}[-\s]?\d{4}(?!\d)"),
    "JWT": re.compile(r"\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{5,}\b"),
    "token": re.compile(r"\b(?:sk|ghp|github_pat|nvapi)-[A-Za-z0-9_-]{12,}\b"),
    "Bearer": re.compile(r"(?i)\bBearer\s+[A-Za-z0-9._~-]{10,}"),
}

PAGE_KINDS = {"listing", "detail", "form", "report", "dashboard", "error", "unknown"}
ACCESS_KINDS = {"ok", "http_error", "blocked", "requires_parameter", "out_of_scope", "unknown"}


def _key_id(key: Any) -> str:
    return re.sub(r"[^a-z0-9]", "", str(key).lower())


def _walk(node: Any, path: str = "$"):
    yield path, node
    if isinstance(node, dict):
        for key, value in node.items():
            yield from _walk(value, f"{path}.{key}")
    elif isinstance(node, list):
        for index, value in enumerate(node):
            yield from _walk(value, f"{path}[{index}]")


def _relative_path(value: Any, location: str, errors: list[str], *, allow_root: bool = True) -> None:
    if not isinstance(value, str):
        errors.append(f"{location}: deve ser string")
        return
    if not value.startswith("/") or (not allow_root and value == "/"):
        errors.append(f"{location}: deve ser caminho relativo iniciado por /")
    parts = urlsplit(value)
    if parts.scheme or parts.netloc or parts.query or parts.fragment:
        errors.append(f"{location}: não pode conter origem, query ou fragmento")


def _in_scope(path: str, scope: str) -> bool:
    normalized = scope.rstrip("/") or "/"
    return normalized == "/" or path == normalized or path.startswith(f"{normalized}/")


def validate_document(doc: Any) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []

    if not isinstance(doc, dict):
        return ["$: o documento deve ser um objeto envelope"], warnings

    required = {"schema_version", "assessment_id", "captured_at", "source", "policy", "routes"}
    for key in sorted(required - set(doc)):
        errors.append(f"$.{key}: campo obrigatório ausente")

    if doc.get("schema_version") != "1.0":
        errors.append("$.schema_version: versão suportada é 1.0")

    source = doc.get("source")
    if not isinstance(source, dict):
        errors.append("$.source: deve ser objeto")
    else:
        origin = source.get("base_origin")
        if not isinstance(origin, str):
            errors.append("$.source.base_origin: deve ser string")
        else:
            parts = urlsplit(origin)
            if parts.scheme not in {"http", "https"} or not parts.netloc:
                errors.append("$.source.base_origin: origem HTTP(S) inválida")
            if parts.username or parts.password or parts.query or parts.fragment or parts.path not in {"", "/"}:
                errors.append("$.source.base_origin: use somente esquema + host + porta")

    policy = doc.get("policy")
    scopes: list[str] = []
    if not isinstance(policy, dict):
        errors.append("$.policy: deve ser objeto")
    else:
        if policy.get("mode") != "read_only":
            errors.append("$.policy.mode: deve ser read_only")
        if policy.get("pii_values_captured") is not False:
            errors.append("$.policy.pii_values_captured: deve ser false")
        scopes_value = policy.get("authorized_scope")
        if not isinstance(scopes_value, list) or not scopes_value:
            errors.append("$.policy.authorized_scope: deve ser lista não vazia")
        else:
            for index, scope in enumerate(scopes_value):
                _relative_path(scope, f"$.policy.authorized_scope[{index}]", errors)
                if isinstance(scope, str):
                    scopes.append(scope)

    routes = doc.get("routes")
    if not isinstance(routes, list):
        errors.append("$.routes: deve ser lista")
        routes = []

    route_ids: set[str] = set()
    for index, route in enumerate(routes):
        base = f"$.routes[{index}]"
        if not isinstance(route, dict):
            errors.append(f"{base}: deve ser objeto")
            continue
        for key in ("route_id", "menu_path", "path", "page_kind", "status", "access", "attempts", "structure"):
            if key not in route:
                errors.append(f"{base}.{key}: campo obrigatório ausente")
        route_id = route.get("route_id")
        if not isinstance(route_id, str) or not route_id.strip():
            errors.append(f"{base}.route_id: deve ser string não vazia")
        elif route_id in route_ids:
            errors.append(f"{base}.route_id: duplicado ({route_id})")
        else:
            route_ids.add(route_id)
        path = route.get("path")
        _relative_path(path, f"{base}.path", errors)
        if isinstance(path, str) and scopes and not any(_in_scope(path, scope) for scope in scopes):
            errors.append(f"{base}.path: fora do escopo autorizado")
        menu_path = route.get("menu_path")
        if not isinstance(menu_path, list) or not menu_path or not all(isinstance(x, str) and x.strip() for x in menu_path):
            errors.append(f"{base}.menu_path: deve ser lista não vazia de strings")
        if route.get("page_kind") not in PAGE_KINDS:
            errors.append(f"{base}.page_kind: valor inválido")
        if route.get("access") not in ACCESS_KINDS:
            errors.append(f"{base}.access: valor inválido")
        status = route.get("status")
        if status is not None and (not isinstance(status, int) or isinstance(status, bool) or not 100 <= status <= 599):
            errors.append(f"{base}.status: deve ser inteiro HTTP ou null")
        attempts = route.get("attempts")
        if not isinstance(attempts, int) or isinstance(attempts, bool) or attempts < 1:
            errors.append(f"{base}.attempts: deve ser inteiro >= 1")
        structure = route.get("structure")
        if not isinstance(structure, dict):
            errors.append(f"{base}.structure: deve ser objeto")
        else:
            links = structure.get("internal_links", [])
            if not isinstance(links, list):
                errors.append(f"{base}.structure.internal_links: deve ser lista")
            else:
                for link_index, link in enumerate(links):
                    location = f"{base}.structure.internal_links[{link_index}]"
                    _relative_path(link, location, errors)
                    if isinstance(link, str) and scopes and not any(_in_scope(link, scope) for scope in scopes):
                        errors.append(f"{location}: fora do escopo autorizado")

            forms = structure.get("forms", [])
            if not isinstance(forms, list):
                errors.append(f"{base}.structure.forms: deve ser lista")
            else:
                for form_index, form in enumerate(forms):
                    location = f"{base}.structure.forms[{form_index}]"
                    if not isinstance(form, dict):
                        errors.append(f"{location}: deve ser objeto")
                        continue
                    if "action_path" in form:
                        _relative_path(form["action_path"], f"{location}.action_path", errors)

    for location, node in _walk(doc):
        if isinstance(node, dict):
            for key in node:
                if _key_id(key) in FORBIDDEN_KEYS:
                    errors.append(f"{location}.{key}: chave proibida para evidência estrutural")
        elif isinstance(node, str):
            for label, pattern in PII_PATTERNS.items():
                if pattern.search(node):
                    errors.append(f"{location}: possível {label} detectado")

    if not routes:
        warnings.append("$.routes: nenhuma rota registrada")
    return sorted(set(errors)), sorted(set(warnings))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("evidence", type=Path, help="Arquivo JSON de evidências")
    args = parser.parse_args()
    try:
        doc = json.loads(args.evidence.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        print(f"ERRO: não foi possível ler JSON: {exc}", file=sys.stderr)
        return 2

    errors, warnings = validate_document(doc)
    for warning in warnings:
        print(f"AVISO: {warning}")
    for error in errors:
        print(f"ERRO: {error}")
    if errors:
        print(f"FALHOU: {len(errors)} erro(s), {len(warnings)} aviso(s)")
        return 1
    print(f"OK: evidência válida; {len(doc.get('routes', []))} rota(s); {len(warnings)} aviso(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
