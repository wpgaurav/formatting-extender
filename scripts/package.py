#!/usr/bin/env python3
"""Create a deterministic, allowlisted WordPress distribution after a fresh build."""
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys
import zipfile

ROOT = Path(__file__).resolve().parent.parent
FILES = ('formatting-extender.php', 'index.php', 'uninstall.php', 'README.txt', 'LICENSE.txt',
         'css/styles.css', 'build/index.js', 'build/index.asset.php', 'build/index.css', 'build/index-rtl.css')


def version_check(root=ROOT, tag=None):
    php = (root / 'formatting-extender.php').read_text()
    readme = (root / 'README.txt').read_text()
    package = json.loads((root / 'package.json').read_text())
    lock = json.loads((root / 'package-lock.json').read_text())
    version = package['version']
    versions = [re.search(r'Version:\s*(\S+)', php)[1],
                re.search(r"FORMATTING_EXTENDER_VERSION',\s*'([^']+)'", php)[1],
                lock['version'], lock['packages']['']['version']]
    if tag is not None:
        versions.append(tag.removeprefix('v'))
    if not re.fullmatch(r'\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?', version):
        raise ValueError('Invalid version')
    if any(v != version for v in versions):
        raise ValueError(f'Version mismatch: {version}, {versions}')
    stable = re.search(r'Stable tag:\s*(\S+)', readme)[1]
    if '-' not in version and stable != version:
        raise ValueError('Stable tag does not match package version')
    if re.search(r'Requires at least:\s*(\S+)', php)[1] != re.search(r'Requires at least:\s*(\S+)', readme)[1]:
        raise ValueError('WordPress requirements differ')
    return version


def validate_files(root):
    for name in FILES:
        path = root / name
        if not path.is_file() or path.stat().st_size == 0:
            raise ValueError(f'Missing or empty required file: {name}')
    for name in ('formatting-extender.php', 'index.php', 'uninstall.php', 'build/index.asset.php'):
        subprocess.run(['php', '-l', str(root / name)], check=True, stdout=subprocess.DEVNULL)
    subprocess.run(['php', '-r', '$a = require $argv[1]; exit(is_array($a) && isset($a["dependencies"], $a["version"]) && is_array($a["dependencies"]) ? 0 : 1);', str(root / 'build/index.asset.php')], check=True)


def package(tag=None):
    version = version_check(tag=tag)
    subprocess.run(['npm', 'run', 'build'], cwd=ROOT, check=True)
    validate_files(ROOT)
    destination = ROOT / 'dist'
    destination.mkdir(exist_ok=True)
    output = destination / f'formatting-extender-{version}.zip'
    with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for name in sorted(FILES):
            # WordPress expects a lowercase readme filename on case-sensitive servers.
            arcname = 'readme.txt' if name == 'README.txt' else name
            info = zipfile.ZipInfo(f'formatting-extender/{arcname}', date_time=(2020, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, (ROOT / name).read_bytes())
    digest = hashlib.sha256(output.read_bytes()).hexdigest()
    output.with_suffix('.zip.sha256').write_text(f'{digest}  {output.name}\n')
    print(f'{output}\nSHA256: {digest}')


if __name__ == '__main__':
    package(sys.argv[1] if len(sys.argv) > 1 else None)
