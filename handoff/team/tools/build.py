#!/usr/bin/env python3
"""Export Team into separate HTML/CSS/JS/assets folders, changing resource paths only."""
import argparse
import hashlib
import json
import posixpath
import re
import subprocess
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urlunsplit

PACKAGE = Path(__file__).resolve().parents[1]
SOURCE_URL = 'https://daniilterekh-prog.github.io/barn-estate-homepage-clone/team/'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--source', type=Path, default=PACKAGE.parents[1] / "pages/team")
args = parser.parse_args()
source = args.source.resolve()
repo = Path(subprocess.check_output(['git', '-C', str(source), 'rev-parse', '--show-toplevel'], text=True).strip())
commit = subprocess.check_output(['git', '-C', str(repo), 'rev-parse', 'HEAD'], text=True).strip()
prefix = source.relative_to(repo).as_posix() + '/'
names = subprocess.check_output(['git', '-C', str(repo), 'ls-tree', '-r', '--name-only', 'HEAD', prefix], text=True).splitlines()
names = [n[len(prefix):] for n in names if n[len(prefix):] in ('index.html', 'team.css', 'team.js') or n[len(prefix):].startswith(('assets/', 'css/', 'favorites-header/', 'home-form/', 'data/'))]

def destination(name):
    if name == 'index.html': return 'html/index.html'
    if name == 'team.css': return 'css/team.css'
    if name == 'team.js': return 'js/team.js'
    if name.startswith('css/'): return 'css/shell/' + name[4:]
    if name.startswith('assets/'): return 'assets/team/' + name[7:]
    if name.startswith('data/'): return 'data/' + name[5:]
    for old, section in [('favorites-header/', 'header'), ('home-form/', 'form')]:
        if name.startswith(old):
            tail = name[len(old):]
            if tail.startswith('assets/'): return f'assets/{section}/' + tail[7:]
            if tail.endswith('.css'): return f'css/{section}/' + tail
            if tail.endswith('.js'): return f'js/{section}/' + tail
    raise ValueError(name)

mapping = {n: destination(n) for n in names}
refs = []

def rebase(value, owner):
    if not value or value.startswith(('#', 'data:', 'tel:', 'mailto:', 'javascript:')): return value
    parts = urlsplit(value)
    if parts.scheme or parts.netloc:
        if value.startswith('https://daniilterekh-prog.github.io/fonts/'):
            target = 'favorites-header/assets/' + posixpath.basename(parts.path)
        else: return value
    else:
        target = posixpath.normpath(posixpath.join(posixpath.dirname(owner), parts.path))
    if target not in mapping:
        if owner.endswith('.html') and target.startswith('../'):
            return urljoin(SOURCE_URL, value)
        raise ValueError(f'Unresolved resource: {owner}: {value}')
    relative = posixpath.relpath(mapping[target], posixpath.dirname(mapping[owner]))
    refs.append({'from': mapping[owner], 'to': mapping[target]})
    return urlunsplit(('', '', relative, parts.query, parts.fragment))

def html_urls(text, owner):
    def attr(match):
        value = match.group(3)
        # The existing production favicon is replaced by the included agency SVG.
        if value == 'https://barn-estate.ru/favicon.ico':
            value = './favorites-header/assets/c57d9b3c8de986fa0d618d09.svg'
        return match.group(1) + match.group(2) + rebase(value, owner) + match.group(2)
    return re.sub(r'(\b(?:src|href)=)([\"\'])(.*?)\2', attr, text)

def rewrite_json(value, owner):
    if isinstance(value, str): return html_urls(value, owner) if '<' in value else value
    if isinstance(value, list): return [rewrite_json(v, owner) for v in value]
    if isinstance(value, dict): return {k: rewrite_json(v, owner) for k, v in value.items()}
    return value

def rewrite(text, owner):
    if owner.endswith('.html'):
        def data(match):
            content = json.dumps(rewrite_json(json.loads(match.group(2)), owner), ensure_ascii=False, separators=(',', ':'))
            return match.group(1) + content + match.group(3)
        text = re.sub(r'(<script\b[^>]*type="application/json"[^>]*>)(.*?)(</script>)', data, text, flags=re.S)
        return html_urls(text, owner)
    if owner.endswith('.css'):
        return re.sub(r'url\(\s*([\"\']?)([^\)\"\']+?)\1\s*\)', lambda m: 'url("' + rebase(m.group(2), owner) + '")', text)
    if owner.endswith('.js'):
        return re.sub(r'new URL\(([\"\'])(assets/[^\"\']+)\1,document.currentScript.src\)', lambda m: "new URL('" + rebase(m.group(2), owner) + "',document.currentScript.src)", text)
    return text

records = []
for name, target in mapping.items():
    raw = subprocess.check_output(['git', '-C', str(repo), 'show', f'HEAD:{prefix}{name}'])
    result = rewrite(raw.decode(), name).encode() if name.endswith(('.html', '.css', '.js')) else raw
    output = PACKAGE / target
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(result)
    records.append({'source': prefix + name, 'file': target, 'sourceSha256': hashlib.sha256(raw).hexdigest(), 'sha256': hashlib.sha256(result).hexdigest(), 'bytes': len(result)})

html = (PACKAGE / 'html/index.html').read_text()
body = re.search(r'<body[^>]*>(.*)</body>', html, re.S).group(1)
head_end = body.index('<main>')
main_end = body.index('</main>')
main = body[head_end + 6:main_end]
question = main.index('<section class="team-question ')
fragments = {'01-header.html': body[body.index('<div class="team-header-wrap'):head_end], '02-team-directory.html': main[:question], '03-expert-question.html': main[question:], '04-footer.html': body[main_end + 7:]}
for name, content in fragments.items():
    (PACKAGE / 'html' / name).write_text('<!-- Integration fragment; load the same CSS/JS and data as index.html. -->\n' + content.strip() + '\n')
for item in refs:
    assert (PACKAGE / item['to']).is_file(), item
(PACKAGE / 'SOURCE.json').write_text(json.dumps({'date': '2026-11-10', 'repository': 'daniilterekh-prog/barnes-sites', 'commit': commit, 'source': prefix, 'preview': SOURCE_URL, 'transform': 'Resource paths only; remote font URLs use the already included matching fonts. Page links point to the public site. No UI or behavior changes.', 'files': records, 'resolvedReferences': refs}, ensure_ascii=False, indent=2) + '\n')
print(f'Exported {len(records)} runtime files and 4 HTML fragments; {len(refs)} local references resolved.')
