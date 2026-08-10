from pathlib import Path
from PIL import Image

root = Path(r"c:\Users\AbdulrahmanBabikerFa\source\repos\Tayseer\src\Tayseer.Web\public\images")
targets = [
    "hero-mbuke-main.jpg",
    "hero-managed-main.jpg",
    "hero-ai-side.jpg",
    "hero-banking-side.jpg",
    "hero-fahim-main.jpg",
    "hero-software-side.jpg",
]
for name in targets:
    path = root / name
    if not path.exists():
        print("missing", name)
        continue
    before = path.stat().st_size
    img = Image.open(path).convert("RGB")
    max_edge = 1600
    w, h = img.size
    scale = min(1.0, max_edge / max(w, h))
    if scale < 1.0:
        img = img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
    img.save(path, format="JPEG", quality=72, optimize=True, progressive=True)
    after = path.stat().st_size
    print(f"{name}: {before//1024}KB -> {after//1024}KB ({img.size[0]}x{img.size[1]})")
