"""User-finalized primary nodes must stay byte-identical to the approved release."""
import json
from pathlib import Path
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]


class FinalNodesTest(unittest.TestCase):
    def test_final_files_have_approved_content(self):
        lock = json.loads((ROOT / 'FINAL-NODES.json').read_text())
        files = lock['files']
        present = [item for item in files if (ROOT / item['path']).is_file()]
        flags = dict(line.split(' ', 1)[::-1] for line in
                     subprocess.check_output(['git', 'ls-files', '-v'], cwd=ROOT, text=True).splitlines())
        missing = [item['path'] for item in files if not (ROOT / item['path']).is_file()
                   and flags.get(item['path'], '').upper() != 'S']
        self.assertEqual(missing, [], 'Missing final files')
        indexed = {}
        for record in subprocess.check_output(['git', 'ls-files', '--stage', '-z'], cwd=ROOT).decode().split('\0'):
            if record:
                metadata, name = record.split('\t', 1)
                indexed[name] = metadata.split()[1]
        result = subprocess.run(
            ['git', 'hash-object', '--stdin-paths'], cwd=ROOT,
            input='\n'.join(item['path'] for item in present) + '\n',
            text=True, capture_output=True, check=True,
        )
        hashes = result.stdout.splitlines()
        self.assertEqual(len(hashes), len(present))
        actual = dict(zip((item['path'] for item in present), hashes))
        changed = [item['path'] for item in files
                   if actual.get(item['path'], indexed.get(item['path'])) != item['blob']]
        self.assertEqual(changed, [], 'FINAL NODES ARE LOCKED BY THE USER: ' + ', '.join(changed))


if __name__ == '__main__':
    unittest.main()
