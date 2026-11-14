"""Add a version (short fingerprint of the file) to the stylesheet and script links in every page,
so browsers load the new file straight after a change instead of a cached copy.
Run after editing anything in docs/assets: python3 tools/version.py"""
import hashlib, re
from pathlib import Path
docs = Path(__file__).resolve().parent.parent / "docs"
files = ["assets/style.css", "assets/main.js", "assets/fonts.css", "assets/guard.js"]
ver = {f: hashlib.sha256((docs / f).read_bytes()).hexdigest()[:10] for f in files}
for page in docs.rglob("*.html"):
    s = page.read_text(encoding="utf-8"); o = s
    for f, v in ver.items():
        s = re.sub(r'((?:\.\./|/)?' + re.escape(f) + r')(\?v=[0-9a-f]+)?"', lambda m: m.group(1) + "?v=" + v + '"', s)
    if s != o:
        page.write_text(s, encoding="utf-8"); print("updated", page.relative_to(docs))
