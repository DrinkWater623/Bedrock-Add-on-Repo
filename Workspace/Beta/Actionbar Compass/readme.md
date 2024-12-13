## Action Bar Compass
--- 
**Why?**...  Cause I'm Directionally Challenged and cannot seem to memorize `z=north/south` and `x=east/west` or visa versa and which is positive or negative.... and why should I, when I can just have it on the conveniently always on the screen above my hotbar!

This pack is a personal must have for any world I create.

There are 2 versions.
* **Stable** - no chat command toggles to turn on and off.  This is an always on system.  Can be adjusted to consider tags `xyzTag` and `noCompassActionBar` with an item toggle.  Player has neither tag until you add it, manually or with in item you add to the stable addon.  Beta has built in chat cmd to handle it.

* **Beta** - with chat command toggles to turn on and off.  It will let you know when you re-join the world what your toggle status is.  Also added a command to show xyz coords on action bar too.

Direction on action bar includes degrees between the main 4 of N/S/E/W.  So you get north-east, south-west, etc...

### Learning under da hood

* Script API 
    * System run every 15 ticks
    * Chat Commands
    * Code to get direction name for cardinal-8 way

* Colored Coordinates (see lang file in rp)

---
### All code written DrinkWater623/DW623 aka Pink Salt 623 aka Nikki DW (BAO)

You are welcomed to dissect and alter for your personal use.  It is not rocket science.

If you use [Regolith](https://bedrock-oss.github.io/regolith/guide/what-is-regolith/), you can find the template version on my github with different profiles to test stable and beta in dev or preview along with a few of the filters I've created to make my life like cake.

[Action Bar Compass Github Folder](https://github.com/DrinkWater623/Bedrock-Add-on-Repo/tree/main/1.21/Beta/Actionbar%20Compass)