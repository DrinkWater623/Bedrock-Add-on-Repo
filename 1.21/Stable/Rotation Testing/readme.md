## Rotation Angle Testing Blocks
--- 
Why?  Cause 3D angles confuse me.  So rather than play hit and miss to get them right,
why not just rotate the block, then see what the xyz degrees are and get the numbers I need...

Stable, with scripts, no toggles needed.  This is for testing, so you should be in creative mode to get the
blocks from the items menu.

To use: place the block on a surface and interact with it to have it rotate one turn, while holding the block. 
If you are holding a stick, it will skip 16 rotations.  It will automatically loop to the beginning  

There are 64 (4x4x4) 90 degree rotation combinations.  Chat will tell you the angles of each rotation as you
turn the block.  If you interact with the block while holding anything else besides the same block or a stick, 
it will tell you what the current rotation is.  This way you can save the information and come back to it later.

I am sharing this personal tool for the 3D challenged like me and for the learning purposes it provides
as listed below:

* Action Bar Compass, system run every 15 ticks

* Custom Component for Blocks on the player interaction and on player place (for validation of states).

* minecraft:full_block geo vs Block Bench 16x16x16 per face geo
  basically, no difference that I can see.  You wil need to examine the code to see which is which

* Block Bench box uv geo
  In this one, you will note, that the uv spot the 'up' is taken from, is upside down compared to standard 
  per face uv and the minecraft provided full-block geo.

* Tile (y=2) geo
  This is my favorite one to test.  Both sides are so that writing is book style, going the same way.  
  If you work with tiles, you can see how the "floor" tile (per the geo) behaves when rotated. 

* a Block using "other" named material instances besides the standard up/down/north/south/east/west.  
  It is the one with 2 tones of slab blocks.  You can see how the geo work with the component.
---
### All code written and assets created by DrinkWater623/DW623 aka Pink Salt 623 aka Nikki DW (BAO)

You are welcomed to dissect and alter for your personal testing.  I did personally create the non-vanilla 
block textures, but you are welcome to use them for non-commercial purposes.  Remember Karma is watching you...

The font for the up/down and letters is called Jokerman.  I re-created the pixel art block, pixel by pixel
from images I googled, but damn, getting the colors correct was a fun challenged.  
Overall a very satisfying project.

If you use regolith and the jsonte filter, you can find the template version, with the data on my github.