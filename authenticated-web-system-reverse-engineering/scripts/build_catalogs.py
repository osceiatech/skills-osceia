#!/usr/bin/env python3
"""Gera catálogos Markdown e resumo JSON a partir de evidência validada."""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

from validate_evidence import validate_document


def md(value: Any) -> str:
    return str(value if value is not None else "").replace("|", "/").replace("\n", " ").strip()


def build(evidence: Path, output: Path) -> dict[str, Any]:
    doc = json.loads(evidence.read_text(encoding="utf-8"))
    errors, warnings = validate_document(doc)
    if errors:
        sample = "\n".join(f"- {error}" for error in errors[:20])
        raise ValueError(f"evidência inválida ({len(errors)} erros):\n{sample}")

    routes = doc["routes"]
    output.mkdir(parents=True, exist_ok=True)

    access_counts = Counter(route["access"] for route in routes)
    page_kind_counts = Counter(route["page_kind"] for route in routes)
    status_counts = Counter(str(route["status"]) if route["status"] is not None else "none" for route in routes)

    catalog = [
        "# Catálogo estrutural de páginas",
        "",
        "> Gerado de evidência validada em modo somente leitura; não contém valores de registros.",
        "",
        "| ID | Área | Caminho no menu | Rota | Tipo | HTTP | Acesso | Campos | Tabelas | Formulários | Ações observadas |",
        "|---|---|---|---|---|---:|---|---:|---:|---:|---|",
    ]

    field_routes: dict[str, set[str]] = defaultdict(set)
    field_areas: dict[str, set[str]] = defaultdict(set)
    field_types: dict[str, Counter[str]] = defaultdict(Counter)
    field_required: Counter[str] = Counter()

    for route in sorted(routes, key=lambda item: (item["menu_path"], item["path"])):
        structure = route.get("structure", {})
        menu_path = route["menu_path"]
        area = menu_path[0]
        menu = " › ".join(menu_path[1:]) or area
        controls = structure.get("controls", []) or []
        tables = structure.get("tables", []) or []
        forms = structure.get("forms", []) or []
        buttons = ", ".join(md(x) for x in structure.get("buttons", []) or [])
        catalog.append(
            f"| `{md(route['route_id'])}` | {md(area)} | {md(menu)} | `{md(route['path'])}` | "
            f"{md(route['page_kind'])} | {md(route['status'])} | {md(route['access'])} | "
            f"{len(controls)} | {len(tables)} | {len(forms)} | {md(buttons)} |"
        )
        if route["access"] != "ok":
            continue
        for control in controls:
            if not isinstance(control, dict):
                continue
            name = str(control.get("name") or control.get("id") or "").strip()
            if not name:
                continue
            field_routes[name].add(route["route_id"])
            field_areas[name].add(area)
            field_types[name][f"{control.get('tag', '')}/{control.get('type', '')}"] += 1
            if control.get("required") is True:
                field_required[name] += 1

    fields = [
        "# Índice técnico de campos",
        "",
        "> Nomes técnicos e ocorrências; não contém valores dos campos.",
        "",
        "| Campo técnico | Tipos observados | Áreas | Rotas | Ocorrências obrigatórias |",
        "|---|---|---|---:|---:|",
    ]
    for name in sorted(field_routes, key=lambda item: (-len(field_routes[item]), item.lower())):
        types = ", ".join(sorted(field_types[name]))
        areas = ", ".join(sorted(field_areas[name]))
        fields.append(
            f"| `{md(name)}` | {md(types)} | {md(areas)} | {len(field_routes[name])} | {field_required[name]} |"
        )

    shared = [
        {
            "field": name,
            "areas_count": len(field_areas[name]),
            "routes_count": len(field_routes[name]),
            "areas": sorted(field_areas[name]),
        }
        for name in field_routes
        if len(field_areas[name]) >= 3
    ]
    shared.sort(key=lambda item: (-item["areas_count"], -item["routes_count"], item["field"]))

    summary = {
        "schema_version": doc["schema_version"],
        "assessment_id": doc["assessment_id"],
        "routes_total": len(routes),
        "by_access": dict(sorted(access_counts.items())),
        "by_page_kind": dict(sorted(page_kind_counts.items())),
        "by_http_status": dict(sorted(status_counts.items())),
        "unique_technical_fields": len(field_routes),
        "fields_shared_by_3plus_areas": len(shared),
        "top_shared_fields": shared[:50],
        "validation_warnings": warnings,
    }

    (output / "catalogo-paginas.md").write_text("\n".join(catalog) + "\n", encoding="utf-8")
    (output / "indice-campos.md").write_text("\n".join(fields) + "\n", encoding="utf-8")
    (output / "resumo-evidencias.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    return summary


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("evidence", type=Path, help="Envelope JSON validado")
    parser.add_argument("--output", type=Path, required=True, help="Diretório dos artefatos")
    args = parser.parse_args()
    try:
        summary = build(args.evidence, args.output)
    except (OSError, UnicodeError, json.JSONDecodeError, ValueError) as exc:
        print(f"ERRO: {exc}", file=sys.stderr)
        return 1
    print(json.dumps({key: value for key, value in summary.items() if key != "top_shared_fields"}, ensure_ascii=False))
    print(f"OK: artefatos gerados em {args.output.resolve()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
