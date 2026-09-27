import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

spec = importlib.util.spec_from_file_location('package', Path(__file__).parents[1] / 'scripts/package.py')
package = importlib.util.module_from_spec(spec)
spec.loader.exec_module(package)


class PackageTest(unittest.TestCase):
    def test_version_mismatch_fails(self):
        with self.assertRaises(ValueError):
            package.version_check(tag='v0.0.0')

    def test_missing_asset_fails(self):
        with tempfile.TemporaryDirectory() as directory:
            with self.assertRaisesRegex(ValueError, 'Missing or empty'):
                package.validate_files(Path(directory))

    def test_archive_is_exact_and_includes_license(self):
        version = package.version_check()
        with zipfile.ZipFile(package.ROOT / 'dist' / f'formatting-extender-{version}.zip') as archive:
            expected = {f'formatting-extender/{"readme.txt" if p == "README.txt" else p}' for p in package.FILES}
            self.assertEqual(set(archive.namelist()), expected)
            for file in package.FILES:
                arc = 'readme.txt' if file == 'README.txt' else file
                self.assertEqual(archive.read('formatting-extender/' + arc), (package.ROOT / file).read_bytes())


if __name__ == '__main__':
    unittest.main()
