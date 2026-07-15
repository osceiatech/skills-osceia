# OSCEIA Pilot Findings

Date: 2026-07-15
Upstream: `microsoft/markitdown`
Version: `0.1.6`
Release commit: `e144e0a2be95b34df17433bac904e635f2c5e551`
License: MIT

## Local installation discovered

```text
markitdown 0.1.6
Python 3.13 user-site install
No third-party MarkItDown plugins installed
```

All optional packages appeared installed, but the global CLI inherited Hermes' `PYTHONPATH`. That caused `python-pptx` to import an incompatible `lxml` from the Hermes venv and fail. Clearing `PYTHONPATH`, `PYTHONHOME`, and `VIRTUAL_ENV` in an isolated `uv` runtime fixed PPTX conversion.

## Read-only smoke results

Using upstream test fixtures and the local CLI:

| Format | Result | Approx. output |
|---|---:|---:|
| PDF | success | 5.2 KB / 65 lines |
| DOCX | success | 4.7 KB / 28 lines |
| XLSX | success | 841 B / 33 lines |
| XLS | success | 841 B / 33 lines |
| HTML | success | 10.9 KB / 140 lines |
| JSON | success | 239 B / 10 lines |
| EPUB | success | 509 B / 24 lines |
| ZIP | success | 283 KB / 1,563 lines |
| JPG without LLM client | empty | 0 B |
| PPTX via contaminated global environment | failed | `lxml` collision |
| PPTX via clean pinned environment | success | 2.1 KB / 41 lines |

PPTX successful command profile:

```bash
env -u PYTHONPATH -u PYTHONHOME -u VIRTUAL_ENV \
  uvx --from 'markitdown[pdf,docx,pptx,xlsx,xls,outlook]==0.1.6' \
  markitdown input.pptx -o output.md
```

The portfolio skill uses a Python wrapper and `uv run --isolated` instead of the permissive upstream CLI.

## Native Hermes comparison

In this runtime, native `read_file`:

- rejected DOCX, XLSX, PPTX, and ZIP as binary;
- returned raw binary-like content for PDF and EPUB fixtures.

MarkItDown therefore adds material capability rather than duplicating reliable native extraction. `read_file` remains preferable when it already returns clean text because it is cheaper and has no extra runtime.

## Quality observations

Positive:

- headings and paragraphs survived DOCX;
- worksheet names and tables survived XLS/XLSX;
- slide boundaries, titles, tables, chart data, and image alt text survived PPTX;
- EPUB metadata/chapters survived;
- ZIP preserved per-member headings and recursively converted supported files.

Limits:

- image conversion without an LLM client can be empty;
- PDF reading order is text-extractor quality, not high-fidelity layout reconstruction;
- embedded images without useful alt text are not understood offline;
- successful extraction does not prove every comment, note, formula, macro, object, or visual relationship survived;
- ZIP expansion can be large and has no upstream resource limits.

## Adoption decision

Create a thin local-only skill. Do not vendor the 28 MB upstream repo, install MCP, enable plugins, use `[all]`, or route documents to cloud services by default.
