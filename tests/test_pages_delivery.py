import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]

class PackageTests(unittest.TestCase):
    def test_package_preserves_runtime_downloads_and_excludes_diagnostics(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary) / 'source'
            root.mkdir()
            files = {
                'index.html': b'<img src="assets/source/photo.png"><a href="blocks/downloads/all.zip">ZIP</a>',
                'assets/source/photo.png': b'original-image',
                'assets/dynamic-not-mentioned.webp': b'dynamic-image',
                'blocks/downloads/all.zip': b'download',
                'blocks/01-header/paste.html': b'portable-code',
                'blocks/01-header/README.md': b'public-guide',
                'CURRENT-PAGES.json': b'[]',
                '_nuxt/chunk.js': b'code',
                'verification/report.json': b'internal',
                'page/kit-audit-2026-11-04/report.json': b'internal',
                'scripts/capture.cjs': b'internal',
                'docs/pages-package.md': b'internal',
            }
            for name, data in files.items():
                f = root / name
                f.parent.mkdir(parents=True, exist_ok=True)
                f.write_bytes(data)
            subprocess.run(['git', 'init', '-q', str(root)], check=True)
            subprocess.run(['git', '-C', str(root), 'add', '.'], check=True)
            output = Path(temporary) / 'site'
            report = Path(temporary) / 'report.json'
            result = subprocess.run([sys.executable, str(ROOT / 'scripts/build-pages-package.py'), '--source', str(root), '--output', str(output), '--report', str(report)], capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            actual = {str(p.relative_to(output)) for p in output.rglob('*') if p.is_file()}
            expected = set(files) - {'verification/report.json', 'page/kit-audit-2026-11-04/report.json', 'scripts/capture.cjs', 'docs/pages-package.md'}
            self.assertEqual(actual, expected)
            for name in actual:
                self.assertEqual((output / name).read_bytes(), files[name])
            self.assertEqual(json.loads(report.read_text())['excluded_count'], 4)

    def test_package_refuses_existing_output_instead_of_deleting_contents(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            result = subprocess.run([sys.executable, str(ROOT / 'scripts/build-pages-package.py'), '--source', str(ROOT), '--output', str(root), '--report', str(root / 'report.json')], capture_output=True, text=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('output must not exist', result.stderr.lower())

class RetentionTests(unittest.TestCase):
    def module(self):
        path = ROOT / 'scripts/retain-pages-artifacts.py'
        self.assertTrue(path.exists(), 'Artifact retention policy has not been implemented')
        spec = importlib.util.spec_from_file_location('retention', path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        return module

    def test_keeps_current_previous_success_and_every_active_run(self):
        rows = [{'id': i, 'name': 'github-pages', 'created_at': f'2026-11-05T12:0{i}:00Z', 'workflow_run': {'id': i}} for i in range(1, 7)]
        rows.append({'id': 7, 'name': 'unrelated-artifact', 'created_at': '2026-11-05T12:07:00Z', 'workflow_run': {'id': 7}})
        statuses = {1: {'status': 'completed', 'conclusion': 'success'}, 2: {'status': 'completed', 'conclusion': 'failure'}, 3: {'status': 'completed', 'conclusion': 'success'}, 4: {'status': 'queued', 'conclusion': None}, 5: {'status': 'completed', 'conclusion': 'success'}, 6: {'status': 'in_progress', 'conclusion': None}, 7: {'status': 'completed', 'conclusion': 'success'}}
        self.assertEqual(self.module().choose_deletions(rows, statuses, current_run=6), [1, 2, 3])

    def test_without_current_artifact_keeps_two_previous_successes(self):
        rows = [{'id': i, 'name': 'github-pages', 'created_at': str(i), 'workflow_run': {'id': i}} for i in [1, 2, 3]]
        statuses = {i: {'status': 'completed', 'conclusion': 'success'} for i in [1, 2, 3]}
        self.assertEqual(self.module().choose_deletions(rows, statuses, current_run=99), [1])

if __name__ == '__main__':
    unittest.main()
