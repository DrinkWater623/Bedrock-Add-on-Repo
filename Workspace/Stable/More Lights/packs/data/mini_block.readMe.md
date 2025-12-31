practical rule:
Up/Down faces: move on X/Z
North/South faces: move on Y/X
East/West faces: move on Y/Z

Here’s the idea that stays sane:

Pick your sizes (in pixels), turn them into scales:

scaleX = sizeXPx / 16
scaleY = sizeYPx / 16
scaleZ = sizeZPx / 16

Compute per-axis “flush” distances:

flushX = 0.5 - scaleX/2 - eps
flushY = 0.5 - scaleY/2 - eps
flushZ = 0.5 - scaleZ/2 - eps

For your 3×3 grid offsets, use the same “distance from center to outer cell center” per axis:

stepX = flushX
stepY = flushY
stepZ = flushZ

For each ptr 0..8:

u = 1 - mod(ptr, 3) // gives +1, 0, -1 across columns
v = floor(ptr/3) - 1 // gives -1, 0, +1 across rows

Then plane offsets are u*stepSomething and v*stepSomething.

Example:
For a 4×2×4 puck light

Use:

scaleX = 4/16 = 0.25
scaleY = 2/16 = 0.125
scaleZ = 4/16 = 0.25

And your flush values become:

flushX = flushZ = 0.5 - 0.125 - eps = 0.375 - eps (6px/16)
flushY = 0.5 - 0.0625 - eps = 0.4375 - eps (7px/16)