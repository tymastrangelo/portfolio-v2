#!/usr/bin/env python3
"""Author the Ewok Hop player sprites as hand-placed pixel art.

The reference art the game shipped with sits on a 36x50 grid, which is a finer
grid than the rest of the game's graphics (platform details are 2-4px blocks),
so the character read as being from a different game than the world around it.
These are drawn on a 20x27 grid and blitted at 2x instead, which puts one art
pixel at two logical pixels and lines the character up with everything else.

Every variant shares one layout so the in-game animation rig can slice them all
the same way:

    rows  0..14   head band       (x 0..16)
    rows 15..20   torso band      (x 0..19, holds the arm, the grip and the hips)
    rows 21..26   legs band       (x 0..16, split into two legs at x=9)
    cols 17..19   accessory column, drawn rigidly so a staff never kinks

Run:  python3 tools/make_ewoks.py
"""

from PIL import Image
import os

W, H = 20, 27
BODY_X, BODY_Y = 1, 1     # body sits inset by one, leaving room for the outline

# --- shared body ------------------------------------------------------------
# 16 characters per row. Column 0 and the last column of the sprite stay clear
# so the auto-outline below has somewhere to go.
BODY = [
    "..fff......fff..",   # 0  ear tips
    "..fff......fff..",   # 1
    ".HHfHHHHHHHHfHH.",   # 2  hood closes around the ears
    ".HHHHHHHHHHHHHH.",   # 3
    "HHHHHHHHHHHHHHHH",   # 4  widest point of the hood
    "HHHFFFFFFFFFFHHH",   # 5  face opens up
    "HHFFFFFFFFFFFFHH",   # 6
    "HHFEEFFFFFFEEFHH",   # 7  eyes
    "HHFEEFFFFFFEEFHH",   # 8
    "HHFFFFFNNFFFFFHH",   # 9  muzzle
    "HHFFFFFFFFFFFFHH",   # 10
    "HHHFFFMMMMFFFHHH",   # 11 mouth
    ".HHHHHHHHHHHHHH.",   # 12
    "..HHHHHHHHHHHH..",   # 13 hood narrows onto the shoulders
    ".ffHHHHHHHHHHff.",   # 14 shoulders     ) torso band
    ".ffHHHHHHHHHHfff",   # 15 arm reaches the grip
    ".fffHHHHHHHHffff",   # 16 the hood falls to a point over the chest
    ".ffffHHHHHHffff.",   # 17
    ".fffffHHHHfffff.",   # 18
    ".ffffffffffffff.",   # 19 hips: solid, so the legs always attach to body
    "..ffff....ffff..",   # 20 legs           ) legs band
    "..ffff....ffff..",   # 21
    "..ffff....ffff..",   # 22
    ".ddddd....ddddd.",   # 23 feet
    ".ddddd....ddddd.",   # 24
]

# --- accessories (3 columns wide, x17..x19) ---------------------------------
def spear():
    col = ["..."] * H
    col[2] = ".T."; col[3] = ".TT"; col[4] = ".TT"; col[5] = ".T."
    for r in range(6, H - 1):
        col[r] = ".S."
    return col

def staff_feather():
    col = ["..."] * H
    col[4] = ".S."; col[5] = "BS."; col[6] = "BS."; col[7] = "BS."
    for r in range(8, H - 1):
        col[r] = ".S."
    return col

def staff_pouch():
    col = ["..."] * H
    for r in range(3, H - 1):
        col[r] = ".S."
    col[8] = "BSB"; col[9] = "BSB"; col[10] = ".B."
    return col

def none_():
    return ["..."] * H

# --- per-variant head/torso overrides ---------------------------------------
HORNS = {                                   # Teebo: bone horns out past the hood
    0: "B.fff......fff.B",
    1: "B.fff......fff.B",
    2: "BHHfHHHHHHHHfHHB",
}
CREST = {                                   # Logray: a bone crest across the brow
    0: "..fff.BBB..fff..",
    1: "..fff.BBB..fff..",
    2: ".HHfHHHBHHHHfHH.",
}
ARMS_OUT = {                                # Paploo: no staff, both arms out
    15: "fffHHHHHHHHHHfff",
    16: "fffHHHHHHHHHHfff",
}

VARIANTS = [
    dict(name="wicket", label="WICKET", over={}, acc=spear(),
         pal=dict(F="#b8a189", f="#8e7965", d="#5b4837", o="#33261c",
                  H="#7e3b30", h="#54241d", E="#140e12", N="#241a16",
                  M="#241a16", B="#e2d6ba", S="#6d4a2e", T="#bdb4a4")),

    dict(name="teebo", label="TEEBO", over={**HORNS}, acc=staff_feather(),
         pal=dict(F="#c2bcae", f="#948d80", d="#5e594e", o="#2e2b25",
                  H="#5a554b", h="#37342d", E="#121212", N="#26241f",
                  M="#26241f", B="#e6dcc2", S="#7a6244", T="#c8c0b0")),

    dict(name="paploo", label="PAPLOO", over={**ARMS_OUT}, acc=none_(),
         pal=dict(F="#ae9375", f="#866c53", d="#55432f", o="#2f2318",
                  H="#9a6338", h="#653e24", E="#140e12", N="#241a16",
                  M="#241a16", B="#e2d6ba", S="#6d4a2e", T="#bdb4a4")),

    dict(name="logray", label="LOGRAY", over={**CREST}, acc=staff_pouch(),
         pal=dict(F="#c8b697", f="#9a8b70", d="#6a5c48", o="#3a3024",
                  H="#c9b58f", h="#94805d", E="#140e12", N="#2b231a",
                  M="#2b231a", B="#efe6cc", S="#7d6a4a", T="#cfc6b2")),
]


def hexa(h):
    h = h.lstrip("#")
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), 255)


def build(v):
    pal = v["pal"]
    rows = [v["over"].get(i, BODY[i]) for i in range(len(BODY))]
    grid = [[None] * W for _ in range(H)]

    for y, line in enumerate(rows):
        assert len(line) == 16, f'{v["name"]} body row {y}: {len(line)} cols'
        for x, ch in enumerate(line):
            if ch != ".":
                grid[y + BODY_Y][x + BODY_X] = ch
    for y, line in enumerate(v["acc"]):
        assert len(line) == 3, f'{v["name"]} acc row {y}: {len(line)} cols'
        for x, ch in enumerate(line):
            if ch != ".":
                grid[y][x + 17] = ch

    solid = [[grid[y][x] is not None for x in range(W)] for y in range(H)]

    # Interior shading: fur that sits on the sprite's right or bottom edge drops
    # a tone. This is what stops the character reading as a flat cutout.
    shaded = [row[:] for row in grid]
    for y in range(H):
        for x in range(W):
            ch = grid[y][x]
            darker = {"F": "f", "f": "d", "H": "h"}.get(ch)
            if not darker:
                continue
            right = x + 1 >= W or not solid[y][x + 1]
            below = y + 1 >= H or not solid[y + 1][x]
            if right or below:
                shaded[y][x] = darker

    # 1px outline around the whole silhouette, in a dark tone from the palette
    # rather than pure black, so it stays warm.
    for y in range(H):
        for x in range(W):
            if solid[y][x]:
                continue
            if any(0 <= y + dy < H and 0 <= x + dx < W and solid[y + dy][x + dx]
                   for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                shaded[y][x] = "o"

    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    px = img.load()
    for y in range(H):
        for x in range(W):
            ch = shaded[y][x]
            if ch:
                px[x, y] = hexa(pal[ch])
    return img


def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    outdir = os.path.join(root, "assets")
    sheet = Image.new("RGBA", (W * len(VARIANTS), H), (0, 0, 0, 0))
    for i, v in enumerate(VARIANTS):
        sheet.paste(build(v), (i * W, 0))
    # One strip the game loads as a single request, variants side by side.
    sheet.save(os.path.join(outdir, "ewoks.png"))
    print(f"wrote assets/ewoks.png — {len(VARIANTS)} variants, {W}x{H} each")

    prev = sheet.resize((sheet.width * 12, sheet.height * 12), Image.Resampling.NEAREST)
    bg = Image.new("RGBA", prev.size, (30, 37, 62, 255))
    bg.alpha_composite(prev)
    bg.save("/tmp/ewok-preview.png")


if __name__ == "__main__":
    main()
