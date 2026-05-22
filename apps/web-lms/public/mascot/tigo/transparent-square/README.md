# Tigo Transparent Square Assets

This folder contains non-destructive derivatives of every legacy PNG now archived under `public/mascot/tigo/archive`.

What changed:

- Background removed from border-connected white or chroma-key areas using a conservative mask.
- Internal mascot whites and cream highlights are preserved.
- Edge-adjacent residue and tiny sprite-frame bleed fragments are removed.
- Output saved as PNG with alpha transparency.
- Each output centered on a square canvas.
- Original relative folders are preserved.
- Original source files outside this folder were not overwritten and are kept in `../archive`.

Counts:

- 320 processed PNG files.
- 216 animation frame files.
- 56 individual pose files.
- 5 landing files.
- 7 pose sheet files.
- 36 sprite sheet files.

Review:

- Open `index.html` to browse the cleaned assets.
- Use `manifest.json` for the generated file list and dimensions.
- Open `../animation-preview.html` to review the original 6-frame animation set.

Current app reference:

- `/mascot/tigo/transparent-square/landing/tigo-portal-builder.png`
