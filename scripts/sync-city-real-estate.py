#!/usr/bin/env python3
"""Compatibility entry: assemble the standalone city page from its editable blocks.

The obsolete Nuxt/CDN snapshot downloader was removed during package cleanup.
Historical source capture remains available in Git history; never overwrite the
new autonomous node with the old live snapshot workflow.
"""
from pathlib import Path
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
command = ["node", str(root / "gorodskaya-nedvizhimost" / "tools" / "build-page.cjs")]
if "--check" in sys.argv:
    command.append("--check")
raise SystemExit(subprocess.call(command, cwd=root))
