#!/usr/bin/env python3
"""Перебудовує index.toml і хеш у pack.toml (замінник `packwiz refresh`). Запуск: python tools/build_index.py"""
import hashlib, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_TOP = {'pack.toml', 'index.toml', 'README.md', '.packwizignore', 'tools', '.github', '.git', 'LICENSE', '.gitattributes'}
PRESERVE = {'config/inventoryprofilesnext/inventoryprofiles.json'}   # ставиться один раз, далі гравець сам налаштовує

def sha256(p):
    h = hashlib.sha256()
    with open(p, 'rb') as f:
        for b in iter(lambda: f.read(1 << 16), b''): h.update(b)
    return h.hexdigest()

def q(s): return '"' + s.replace('\\', '\\\\').replace('"', '\\"') + '"'

files = []
for dp, dns, fns in os.walk(ROOT):
    rel_dir = os.path.relpath(dp, ROOT).replace(os.sep, '/')
    if rel_dir == '.': dns[:] = [d for d in dns if d not in SKIP_TOP]
    for fn in fns:
        rel = fn if rel_dir == '.' else rel_dir + '/' + fn
        if rel_dir == '.' and fn in SKIP_TOP: continue
        files.append(rel)
files.sort()
out = ['hash-format = "sha256"', '']
for rel in files:
    out.append('[[files]]')
    out.append('file = ' + q(rel))
    out.append('hash = ' + q(sha256(os.path.join(ROOT, rel))))
    if rel.startswith('mods/') and rel.endswith('.pw.toml'): out.append('metafile = true')
    if rel in PRESERVE: out.append('preserve = true')
    out.append('')
open(os.path.join(ROOT, 'index.toml'), 'w', encoding='utf-8', newline='\n').write('\n'.join(out))
pk = os.path.join(ROOT, 'pack.toml')
s = open(pk, encoding='utf-8').read()
s = re.sub(r'(\[index\][^\[]*?hash = )"[0-9a-f]*"', r'\g<1>"' + sha256(os.path.join(ROOT, 'index.toml')) + '"', s, flags=re.S)
open(pk, 'w', encoding='utf-8', newline='\n').write(s)
print(f'index.toml: {len(files)} файлів')
