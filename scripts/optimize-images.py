from __future__ import annotations

import re
import sys
from dataclasses import dataclass
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    print("Image optimizer skipped: Pillow is not installed.")
    sys.exit(0)


ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIRS = [
    ROOT / "src" / "content" / "blog",
    ROOT / "src" / "content" / "legal-updates",
]
SUPPORTED_EXTENSIONS = {".png", ".jpg", ".jpeg"}
PUBLIC_IMAGE_PREFIX = "/uploads/"
MAX_SIZE = (1400, 1400)

FRONTMATTER_COVER_PATTERN = re.compile(
    r'^(?P<indent>\s*coverImage:\s*)(?P<quote>["\']?)(?P<path>[^"\r\n]+?)(?P=quote)\s*$',
    re.MULTILINE,
)


@dataclass
class OptimizationResult:
    source: Path
    target: Path
    created: bool
    saved_bytes: int


def to_public_path(path: Path) -> str:
    relative = path.relative_to(ROOT / "public").as_posix()
    return f"/{relative}"


def is_graphic_like(image: Image.Image) -> bool:
    sample = ImageOps.exif_transpose(image.copy())
    if max(sample.size) > 512:
        sample.thumbnail((512, 512), Image.Resampling.LANCZOS)

    if sample.mode not in {"RGB", "RGBA", "L", "P"}:
        sample = sample.convert("RGBA" if "A" in sample.getbands() else "RGB")

    colors = sample.getcolors(maxcolors=512)
    return colors is not None and len(colors) <= 256


def optimize_image(source: Path, target: Path) -> OptimizationResult:
    with Image.open(source) as image:
        transformed = ImageOps.exif_transpose(image)
        if transformed.size != image.size or transformed is image:
            working = transformed.copy()
        else:
            working = transformed

        if working.width > MAX_SIZE[0] or working.height > MAX_SIZE[1]:
            working.thumbnail(MAX_SIZE, Image.Resampling.LANCZOS)

        lossless = False
        if source.suffix.lower() == ".png":
            has_alpha = "A" in working.getbands()
            lossless = has_alpha or is_graphic_like(working)

        if lossless:
            if working.mode not in {"RGBA", "RGB", "L"}:
                working = working.convert("RGBA" if "A" in working.getbands() else "RGB")
        else:
            if working.mode not in {"RGB", "L"}:
                working = working.convert("RGB")

        target.parent.mkdir(parents=True, exist_ok=True)
        save_kwargs = {"format": "WEBP", "method": 6}
        if lossless:
            save_kwargs["lossless"] = True
        else:
            save_kwargs["quality"] = 82

        working.save(target, **save_kwargs)

    source_size = source.stat().st_size
    target_size = target.stat().st_size
    return OptimizationResult(
        source=source,
        target=target,
        created=True,
        saved_bytes=max(source_size - target_size, 0),
    )


def maybe_optimize(source: Path, target: Path) -> OptimizationResult:
    should_generate = not target.exists() or source.stat().st_mtime > target.stat().st_mtime
    if should_generate:
        return optimize_image(source, target)

    return OptimizationResult(
        source=source,
        target=target,
        created=False,
        saved_bytes=max(source.stat().st_size - target.stat().st_size, 0),
    )


def rewrite_cover_image(markdown_path: Path) -> OptimizationResult | None:
    raw = markdown_path.read_text(encoding="utf-8")
    match = FRONTMATTER_COVER_PATTERN.search(raw)
    if not match:
        return None

    cover_path = match.group("path").strip()
    suffix = Path(cover_path).suffix.lower()
    if suffix not in SUPPORTED_EXTENSIONS or not cover_path.startswith(PUBLIC_IMAGE_PREFIX):
        return None

    source = ROOT / "public" / cover_path.lstrip("/")
    if not source.exists():
        print(f"Image optimizer skipped missing source: {cover_path}")
        return None

    target = source.with_suffix(".webp")
    result = maybe_optimize(source, target)
    optimized_cover_path = to_public_path(target)

    if cover_path != optimized_cover_path:
        replacement = f'{match.group("indent")}{match.group("quote")}{optimized_cover_path}{match.group("quote")}'
        updated = FRONTMATTER_COVER_PATTERN.sub(replacement, raw, count=1)
        markdown_path.write_text(updated, encoding="utf-8")

    return result


def main() -> int:
    results: list[OptimizationResult] = []

    for content_dir in CONTENT_DIRS:
        if not content_dir.exists():
            continue

        for markdown_path in sorted(content_dir.glob("*.md")):
            result = rewrite_cover_image(markdown_path)
            if result is not None:
                results.append(result)

    if not results:
        print("Image optimizer found no pending content images.")
        return 0

    total_saved = sum(item.saved_bytes for item in results)
    created_count = sum(1 for item in results if item.created)
    for item in results:
        source_rel = item.source.relative_to(ROOT).as_posix()
        target_rel = item.target.relative_to(ROOT).as_posix()
        action = "generated" if item.created else "reused"
        print(f"{action}: {source_rel} -> {target_rel} ({item.saved_bytes} bytes saved)")

    print(
        f"Image optimizer completed: {len(results)} references checked, "
        f"{created_count} files generated, {total_saved} bytes saved."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
