#!/usr/bin/env python3
"""Safely convert one trusted local document to Markdown with MarkItDown.

Run this script inside the version-pinned uv environment documented in SKILL.md.
It intentionally uses convert_local(), disables plugins, and applies archive limits.
"""

from __future__ import annotations

import argparse
import os
import sys
import zipfile
from pathlib import Path
from urllib.parse import urlparse

MIB = 1024 * 1024
DEFAULT_MAX_INPUT = 100 * MIB
DEFAULT_MAX_ARCHIVE_TOTAL = 100 * MIB
DEFAULT_MAX_ARCHIVE_MEMBER = 25 * MIB
DEFAULT_MAX_ARCHIVE_ENTRIES = 200
DEFAULT_MAX_COMPRESSION_RATIO = 100.0


def fail(message: str, code: int = 2) -> "None":
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(code)


def is_uri_like(value: str) -> bool:
    parsed = urlparse(value)
    # Windows drive letters parse as schemes; only known URI prefixes are rejected.
    return parsed.scheme.lower() in {"http", "https", "file", "data", "ftp"}


def validate_archive(
    path: Path,
    *,
    max_entries: int,
    max_total: int,
    max_member: int,
    max_ratio: float,
) -> None:
    try:
        with zipfile.ZipFile(path, "r") as archive:
            members = [item for item in archive.infolist() if not item.is_dir()]
            if len(members) > max_entries:
                fail(
                    f"archive contains {len(members)} files; limit is {max_entries}"
                )

            total = 0
            for item in members:
                total += item.file_size
                if item.file_size > max_member:
                    fail(
                        f"archive member {item.filename!r} is {item.file_size} bytes; "
                        f"per-member limit is {max_member}"
                    )
                if total > max_total:
                    fail(
                        f"archive expands beyond {max_total} bytes; "
                        "possible oversized archive or decompression bomb"
                    )

                if item.file_size > 0:
                    if item.compress_size == 0:
                        fail(f"archive member {item.filename!r} has invalid compression size")
                    ratio = item.file_size / item.compress_size
                    if ratio > max_ratio:
                        fail(
                            f"archive member {item.filename!r} has compression ratio "
                            f"{ratio:.1f}:1; limit is {max_ratio:.1f}:1"
                        )

                if Path(item.filename).suffix.lower() == ".zip":
                    fail(f"nested ZIP member is not allowed: {item.filename!r}")
    except zipfile.BadZipFile as exc:
        fail(f"invalid ZIP archive: {exc}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Convert one trusted local file to Markdown using MarkItDown."
    )
    parser.add_argument("input", help="Trusted local input path; URLs are rejected")
    parser.add_argument("-o", "--output", required=True, help="Markdown output path")
    parser.add_argument("--force", action="store_true", help="Overwrite existing output")
    parser.add_argument(
        "--allow-archive",
        action="store_true",
        help="Permit ZIP conversion after archive safety checks",
    )
    parser.add_argument(
        "--max-input-mib", type=int, default=100, help="Maximum input size in MiB"
    )
    parser.add_argument(
        "--max-archive-total-mib",
        type=int,
        default=100,
        help="Maximum total uncompressed ZIP size in MiB",
    )
    parser.add_argument(
        "--max-archive-member-mib",
        type=int,
        default=25,
        help="Maximum uncompressed ZIP member size in MiB",
    )
    parser.add_argument(
        "--max-archive-entries", type=int, default=200, help="Maximum ZIP members"
    )
    parser.add_argument(
        "--max-compression-ratio",
        type=float,
        default=100.0,
        help="Maximum uncompressed/compressed ratio for a ZIP member",
    )
    return parser


def main() -> int:
    args = build_parser().parse_args()

    if is_uri_like(args.input):
        fail("URI input is not allowed; provide a trusted local path")
    if is_uri_like(args.output):
        fail("URI output is not allowed; provide a local path")

    source = Path(args.input).expanduser().resolve(strict=False)
    output = Path(args.output).expanduser().resolve(strict=False)

    if not source.exists():
        fail(f"input does not exist: {source}")
    if not source.is_file():
        fail(f"input is not a regular file: {source}")
    if source == output:
        fail("input and output paths must differ")
    if output.suffix.lower() not in {".md", ".markdown"}:
        fail("output must use .md or .markdown extension")
    if output.exists() and not args.force:
        fail(f"output already exists: {output}; pass --force only when approved")
    if not output.parent.exists():
        fail(f"output directory does not exist: {output.parent}")

    max_input = args.max_input_mib * MIB
    size = source.stat().st_size
    if size > max_input:
        fail(f"input is {size} bytes; limit is {max_input}")

    if source.suffix.lower() == ".zip":
        if not args.allow_archive:
            fail("ZIP conversion requires explicit --allow-archive")
        validate_archive(
            source,
            max_entries=args.max_archive_entries,
            max_total=args.max_archive_total_mib * MIB,
            max_member=args.max_archive_member_mib * MIB,
            max_ratio=args.max_compression_ratio,
        )

    # Import only after argument and path validation so unsafe input is rejected first.
    try:
        from markitdown import MarkItDown
    except ImportError:
        fail(
            "markitdown is unavailable; run through the pinned uv command in SKILL.md"
        )

    converter = MarkItDown(enable_plugins=False)
    result = converter.convert_local(str(source))
    markdown = result.markdown

    if not markdown or not markdown.strip():
        fail(
            "conversion produced empty Markdown; the document may require OCR, "
            "image understanding, or a different extractor"
        )

    # Normalize to one final newline while preserving extracted text otherwise.
    content = markdown.rstrip() + "\n"
    output.write_text(content, encoding="utf-8", newline="\n")

    print(
        f"OK input={source} output={output} input_bytes={size} "
        f"markdown_chars={len(content)}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
