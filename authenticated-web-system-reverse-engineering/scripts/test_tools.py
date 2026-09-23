from __future__ import annotations

import copy
import json
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent
SKILL = SCRIPTS.parent
sys.path.insert(0, str(SCRIPTS))

from build_catalogs import build  # noqa: E402
from validate_evidence import validate_document  # noqa: E402


class EvidenceToolsTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.template_path = SKILL / "templates" / "evidence-envelope.json"
        cls.valid = json.loads(cls.template_path.read_text(encoding="utf-8"))

    def test_template_is_valid(self) -> None:
        errors, warnings = validate_document(self.valid)
        self.assertEqual([], errors)
        self.assertEqual([], warnings)

    def test_rejects_pii_and_content_keys(self) -> None:
        invalid = copy.deepcopy(self.valid)
        invalid["routes"][0]["structure"]["headings"] = ["Usuário 12.345.678/0001-90"]
        invalid["routes"][0]["structure"]["buttons"].append("contato@example.org")
        errors, _ = validate_document(invalid)
        joined = "\n".join(errors)
        self.assertIn("chave proibida", joined)
        self.assertIn("possível CNPJ", joined)
        self.assertIn("possível e-mail", joined)

    def test_rejects_route_outside_scope(self) -> None:
        invalid = copy.deepcopy(self.valid)
        invalid["routes"][0]["path"] = "/financeiro/fechar"
        errors, _ = validate_document(invalid)
        self.assertTrue(any("fora do escopo" in error for error in errors))

    def test_scope_requires_path_boundary(self) -> None:
        invalid = copy.deepcopy(self.valid)
        invalid["routes"][0]["path"] = "/admin2"
        errors, _ = validate_document(invalid)
        self.assertTrue(any("fora do escopo" in error for error in errors))

    def test_rejects_unsafe_internal_link_and_form_query(self) -> None:
        invalid = copy.deepcopy(self.valid)
        structure = invalid["routes"][0]["structure"]
        structure["internal_links"] = ["/financeiro/fechar"]
        structure["forms"][0]["action_path"] = "/admin/pessoas?id=123"
        errors, _ = validate_document(invalid)
        joined = "\n".join(errors)
        self.assertIn("internal_links[0]: fora do escopo", joined)
        self.assertIn("não pode conter origem, query ou fragmento", joined)

    def test_builds_catalogs_from_valid_evidence(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            output = Path(temp)
            summary = build(self.template_path, output)
            self.assertEqual(1, summary["routes_total"])
            self.assertEqual(1, summary["unique_technical_fields"])
            for name in ("catalogo-paginas.md", "indice-campos.md", "resumo-evidencias.json"):
                self.assertTrue((output / name).is_file(), name)
            catalog = (output / "catalogo-paginas.md").read_text(encoding="utf-8")
            self.assertIn("/admin/pessoas", catalog)
            self.assertNotIn("example.org", catalog)


if __name__ == "__main__":
    unittest.main()
