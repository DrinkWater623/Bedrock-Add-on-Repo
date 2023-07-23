execute as @s[family=!activated] at @s if block ~   ~-1 ~   fire run tell @a[tag=Debug_Better_TNT,r=10] on fire bottom
execute as @s[family=!activated] at @s if block ~   ~1  ~   fire run tell @a[tag=Debug_Better_TNT,r=10] on fire top
execute as @s[family=!activated] at @s if block ~-1  ~  ~   fire run tell @a[tag=Debug_Better_TNT,r=10] on fire X
execute as @s[family=!activated] at @s if block ~1   ~  ~   fire run tell @a[tag=Debug_Better_TNT,r=10] on fire X
execute as @s[family=!activated] at @s if block ~    ~  ~-1 fire run tell @a[tag=Debug_Better_TNT,r=10] on fire Z
execute as @s[family=!activated] at @s if block ~    ~  ~1  fire run tell @a[tag=Debug_Better_TNT,r=10] on fire Z
execute as @s[family=!activated] at @s if block ~   ~-1 ~   fire run event entity @s ev:explode_from_fuse_short
execute as @s[family=!activated] at @s if block ~   ~1  ~   fire run event entity @s ev:explode_from_fuse_short
execute as @s[family=!activated] at @s if block ~-1  ~  ~   fire run event entity @s ev:explode_from_fire
execute as @s[family=!activated] at @s if block ~1   ~  ~   fire run event entity @s ev:explode_from_fire
execute as @s[family=!activated] at @s if block ~    ~  ~-1 fire run event entity @s ev:explode_from_fire
execute as @s[family=!activated] at @s if block ~    ~  ~1  fire run event entity @s ev:explode_from_fire