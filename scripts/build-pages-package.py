"""Stage tracked public files byte-for-byte, excluding diagnostic tooling only."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import shutil
import subprocess

DIAGNOSTIC = re.compile(r'(^|[-_])(verification|audits?|checks|screenshots?|tests?|tools|scripts)([-_]|$)', re.I)


def excluded(path):
    parts = Path(path).parts
    if parts[0] in {'.github', '.agents', '.gitignore', 'docs'}:
        return True
    if any(DIAGNOSTIC.search(part) for part in parts[:-1]):
        return True
    return Path(path).suffix in {'.cjs', '.py', '.sh'}


def build(source, output, report):
    source, output, report = source.resolve(), output.resolve(), report.resolve()
    if output.exists():
        raise ValueError('output must not exist')
    if output == source or source in output.parents:
        raise ValueError('output must be outside source')
    if report == output or output in report.parents:
        raise ValueError('report must be outside output')
    tracked = subprocess.check_output(['git', 'ls-files', '-z'], cwd=source).decode().split('\0')
    included, omitted = [], []
    for name in sorted(filter(None, tracked)):
        path = source / name
        if excluded(name):
            omitted.append({'path': name, 'bytes': path.stat().st_size})
            continue
        if path.is_symlink() or not path.is_file():
            raise ValueError('unsupported tracked file: ' + name)
        with path.open('rb') as stream:
            digest = hashlib.file_digest(stream, 'sha256').hexdigest()
        included.append({'path': name, 'bytes': path.stat().st_size, 'sha256': digest})
    output.mkdir(parents=True)
    for item in included:
        destination = output / item['path']
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source / item['path'], destination)
        with destination.open('rb') as stream:
            if hashlib.file_digest(stream, 'sha256').hexdigest() != item['sha256']:
                raise ValueError('copy digest mismatch: ' + item['path'])
    summary = {'source_bytes': sum(x['bytes'] for x in included + omitted), 'package_bytes': sum(x['bytes'] for x in included), 'excluded_bytes': sum(x['bytes'] for x in omitted), 'included_count': len(included), 'excluded_count': len(omitted), 'included': included, 'excluded': omitted}
    report.parent.mkdir(parents=True, exist_ok=True)
    report.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({k: v for k, v in summary.items() if k not in {'included', 'excluded'}}))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--report', type=Path, required=True)
    args = parser.parse_args()
    try:
        build(args.source, args.output, args.report)
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        parser.exit(1, str(error) + '\n')
