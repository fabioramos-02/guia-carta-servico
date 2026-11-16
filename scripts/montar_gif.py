"""Monta o GIF a partir dos quadros PNG que o scripts/gif.mjs tirou do vídeo.

python scripts/montar_gif.py <pasta-de-quadros> <saida.gif> <largura> <ms-por-quadro>
"""
import pathlib
import sys

from PIL import Image

pasta, saida, largura, ms = pathlib.Path(sys.argv[1]), sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
quadros = []
for arq in sorted(pasta.glob("*.png")):
    im = Image.open(arq).convert("RGB")
    im = im.resize((largura, round(im.height * largura / im.width)), Image.LANCZOS)
    quadros.append(im.quantize(colors=128, method=Image.Quantize.MEDIANCUT))
if not quadros:
    sys.exit(f"sem quadros em {pasta}")
# o último quadro fica parado 1,5 s, para dar tempo de ler o resultado antes de recomeçar
duracoes = [ms] * (len(quadros) - 1) + [1500]
quadros[0].save(saida, save_all=True, append_images=quadros[1:], duration=duracoes, loop=0, optimize=True)
print(f"ok  {saida}  {len(quadros)} quadros  {pathlib.Path(saida).stat().st_size // 1024} KB")
