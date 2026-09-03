"""Derive Expo + PWA icons from the KonVita Imperia master."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
MASTER = ROOT / "assets" / "brand" / "konvita-icon-1024.png"
BG = (22, 22, 22)
IMAGES = ROOT / "assets" / "images"
PUBLIC = ROOT / "public"
ICONS = PUBLIC / "icons"
SPLASH = PUBLIC / "splash"

APPLE_SPLASH = [
    ("apple-1320x2868.png", 1320, 2868),  # iPhone 16 Pro Max
    ("apple-1206x2622.png", 1206, 2622),  # iPhone 16 Pro
    ("apple-1290x2796.png", 1290, 2796),  # iPhone 15/16 Plus, 15 Pro Max
    ("apple-1179x2556.png", 1179, 2556),  # iPhone 16 / 15 Pro / 14 Pro
    ("apple-1170x2532.png", 1170, 2532),  # iPhone 15 / 14 / 13
    ("apple-1284x2778.png", 1284, 2778),  # iPhone 14 Plus / 13 Pro Max
    ("apple-750x1334.png", 750, 1334),  # iPhone SE
    ("apple-2048x2732.png", 2048, 2732),  # iPad Pro 12.9
]


def save_png(im: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "PNG", optimize=True)


def resize_square(im: Image.Image, size: int) -> Image.Image:
    return im.resize((size, size), Image.Resampling.LANCZOS)


def padded(im: Image.Image, size: int = 1024, fraction: float = 0.62) -> Image.Image:
    canvas = Image.new("RGB", (size, size), BG)
    inner = int(size * fraction)
    glyph = resize_square(im, inner)
    offset = (size - inner) // 2
    canvas.paste(glyph, (offset, offset))
    return canvas


def rounded(im: Image.Image, radius: int) -> Image.Image:
    mask = Image.new("L", im.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, *im.size), radius=radius, fill=255)
    out = im.convert("RGBA")
    out.putalpha(mask)
    return out


def splash(icon: Image.Image, width: int, height: int) -> Image.Image:
    canvas = Image.new("RGB", (width, height), BG)
    side = int(min(width, height) * 0.32)
    glyph = rounded(resize_square(icon, side), radius=int(side * 0.2237))
    x = (width - side) // 2
    y = (height - side) // 2
    canvas.paste(glyph, (x, y), glyph)
    return canvas


def monochrome(im: Image.Image) -> Image.Image:
    gray = im.convert("L")
    alpha = gray.point(lambda p: 255 if p > 28 else 0)
    out = Image.new("RGBA", im.size, (255, 255, 255, 0))
    out.putalpha(alpha)
    return out


def main() -> None:
    icon = Image.open(MASTER).convert("RGB").resize((1024, 1024), Image.Resampling.LANCZOS)
    maskable = padded(icon)

    save_png(icon, IMAGES / "icon.png")
    save_png(resize_square(icon, 48), IMAGES / "favicon.png")
    save_png(icon, IMAGES / "splash-icon.png")
    save_png(maskable, IMAGES / "android-icon-foreground.png")
    save_png(Image.new("RGB", (1024, 1024), BG), IMAGES / "android-icon-background.png")
    save_png(monochrome(icon), IMAGES / "android-icon-monochrome.png")

    save_png(resize_square(icon, 192), ICONS / "icon-192.png")
    save_png(resize_square(icon, 512), ICONS / "icon-512.png")
    save_png(resize_square(maskable, 192), ICONS / "maskable-192.png")
    save_png(resize_square(maskable, 512), ICONS / "maskable-512.png")
    save_png(resize_square(icon, 180), PUBLIC / "apple-touch-icon.png")
    save_png(resize_square(icon, 32), PUBLIC / "favicon.png")
    icon.resize((32, 32), Image.Resampling.LANCZOS).save(
        PUBLIC / "favicon.ico", format="ICO", sizes=[(32, 32), (16, 16)]
    )

    for name, width, height in APPLE_SPLASH:
        save_png(splash(icon, width, height), SPLASH / name)

    print("wrote icons to", IMAGES)
    print("wrote PWA assets to", PUBLIC)


if __name__ == "__main__":
    main()
