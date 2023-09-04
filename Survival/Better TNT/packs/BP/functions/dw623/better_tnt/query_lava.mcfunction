execute as @s[family=!activated] at @s if block ~   ~-1 ~   lava run event entity @s ev:explode_from_fuse_short
execute as @s[family=!activated] at @s if block ~   ~1  ~   lava run event entity @s ev:explode_from_fuse_short
execute as @s[family=!activated] at @s if block ~-1  ~  ~   lava run event entity @s ev:explode_from_fire
execute as @s[family=!activated] at @s if block ~1   ~  ~   lava run event entity @s ev:explode_from_fire
execute as @s[family=!activated] at @s if block ~    ~  ~-1 lava run event entity @s ev:explode_from_fire
execute as @s[family=!activated] at @s if block ~    ~  ~1  lava run event entity @s ev:explode_from_fire

# Running
execute as @s[family=!activated] at @s if block ~   ~-1 ~   flowing_lava run event entity @s ev:explode_from_fuse_short
execute as @s[family=!activated] at @s if block ~   ~1  ~   flowing_lava run event entity @s ev:explode_from_fuse_short
execute as @s[family=!activated] at @s if block ~-1  ~  ~   flowing_lava run event entity @s ev:explode_from_fire
execute as @s[family=!activated] at @s if block ~1   ~  ~   flowing_lava run event entity @s ev:explode_from_fire
execute as @s[family=!activated] at @s if block ~    ~  ~-1 flowing_lava run event entity @s ev:explode_from_fire
execute as @s[family=!activated] at @s if block ~    ~  ~1  flowing_lava run event entity @s ev:explode_from_fire