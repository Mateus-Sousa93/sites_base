"""Prepara as fotos de midia-bruta/ para src/assets/images/.

Redimensiona, recomprime e gera o par de antes e depois: o "antes" é uma
simulação feita a partir da própria foto do "depois" (os dentes recebem um tom
amarelado), para a cortina comparar exatamente o mesmo enquadramento.

Uso: python scripts/imagens.py
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "midia-bruta"
OUT = ROOT / "src" / "assets" / "images"

# saída: (arquivo de origem, largura máxima)
PHOTOS = {
    "hero-consulta": ("hero-consulta.jpg", 2400),
    "hero-sorriso": ("hero-sorriso.jpg", 1600),
    "trat-lentes": ("trat-lentes.jpg", 1600),
    "trat-implantes": ("equipe-atendimento.jpg", 1600),
    "trat-alinhadores": ("trat-alinhadores.jpg", 1600),
    "trat-clareamento": ("sorriso-1.jpg", 1600),
    "trat-checkup": ("espaco-tecnologia.jpg", 1600),
    "sorriso-1": ("sorriso-2.jpg", 1400),
    "sorriso-2": ("sorriso-3.jpg", 1200),
    "sorriso-3": ("sorriso-4.jpg", 1200),
    "sorriso-4": ("sorriso-5.jpg", 1400),
    "espaco-recepcao": ("espaco-recepcao.jpg", 2000),
    "espaco-lounge": ("espaco-lounge.jpg", 2000),
    "espaco-consultorio": ("espaco-consultorio.jpg", 2000),
    "espaco-espera": ("espaco-espera.jpg", 2000),
    "depoimentos-sorriso": ("depoimentos-sorriso.jpg", 1800),
}

# Par da cortina: recorte (fração da foto) e caixa dos dentes dentro da foto.
CASE_SOURCE = "trat-clareamento.jpg"
CASE_CROP = (0.28, 0.26, 0.90, 0.82)
TEETH_BOX = (0.40, 0.44, 0.78, 0.66)


def save(image: Image.Image, name: str, max_width: int) -> None:
    image = image.convert("RGB")
    if image.width > max_width:
        image = image.resize((max_width, round(image.height * max_width / image.width)), Image.LANCZOS)
    path = OUT / f"{name}.jpg"
    image.save(path, quality=82, optimize=True, progressive=True)
    print(f"{name}.jpg  {image.width}x{image.height}  {path.stat().st_size // 1024} KB")


def yellowed(image: Image.Image) -> Image.Image:
    """Devolve a foto com os dentes amarelados e um pouco mais opacos."""
    rgb = np.asarray(image.convert("RGB")).astype(np.float32) / 255.0
    hsv = np.asarray(image.convert("HSV")).astype(np.float32) / 255.0
    saturation, value = hsv[..., 1], hsv[..., 2]
    height, width = value.shape

    # Dentes: claros e pouco saturados, só dentro da caixa da boca.
    mask = np.clip((value - 0.40) / 0.10, 0, 1) * np.clip((0.42 - saturation) / 0.10, 0, 1)
    box = np.zeros_like(mask)
    x0, y0, x1, y1 = TEETH_BOX
    box[int(y0 * height) : int(y1 * height), int(x0 * width) : int(x1 * width)] = 1.0
    mask *= box
    mask_image = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=width / 500))
    mask = (np.asarray(mask_image).astype(np.float32) / 255.0)[..., None]

    tint = np.array([0.97, 0.88, 0.67], dtype=np.float32)
    stained = rgb * tint * 0.92
    out = rgb * (1 - mask * 0.9) + stained * (mask * 0.9)
    return Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8))


def crop(image: Image.Image, box: tuple[float, float, float, float]) -> Image.Image:
    x0, y0, x1, y1 = box
    return image.crop((int(x0 * image.width), int(y0 * image.height), int(x1 * image.width), int(y1 * image.height)))


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (source, max_width) in PHOTOS.items():
        save(Image.open(SRC / source), name, max_width)

    after = Image.open(SRC / CASE_SOURCE).convert("RGB")
    save(crop(after, CASE_CROP), "caso-depois", 1600)
    save(crop(yellowed(after), CASE_CROP), "caso-antes", 1600)


if __name__ == "__main__":
    main()
