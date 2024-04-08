#
kill @e[family=wither,family=!dw623_wither]
#######################################################################################
##execute as @e[type=creeper] at @s[tag=creeperNoise] run execute as @a[r=8] run playsound random.fuse @s
#######################################################################################
#Protection Around a Base or something from Withers or Ghasts or Explodey Things
execute as @e[type=armor_stand,name="Home"] at @s run kill @e[family=monster,r=32]
execute as @e[type=armor_stand,name="Home"] at @s run kill @e[type=wither,r=64]
execute as @e[type=armor_stand,name="Home"] at @s run kill @e[type=creeper,r=64]
execute as @e[type=armor_stand,name="Home"] at @s run kill @e[type=ender_crystal,r=64]

execute as @e[type=armor_stand,name="Bomb Guard"] at @s run kill @e[type=wither,r=64]
execute as @e[type=armor_stand,name="Bomb Guard"] at @s run kill @e[type=ghast,r=64]
execute as @e[type=armor_stand,name="Bomb Guard"] at @s run kill @e[type=creeper,r=64]
execute as @e[type=armor_stand,name="Bomb Guard"] at @s run kill @e[type=ender_crystal,r=64]
#have to figure out TntExplodes

execute as @e[name="Monster Guard"] at @s run kill @e[family=monster,r=64]
execute as @e[name="Wither Loving Monster Guard"] at @s run kill @e[family=monster,type=!wither,r=64]

execute as @e[type=armor_stand,name="Village Guard"] at @s run kill @e[family=monster,r=32]
execute as @e[type=armor_stand,name="Village Guard"] at @s run kill @e[type=ender_crystal,r=64]
#Extend if actual villagers/players
execute as @e[type=armor_stand,name="Village Guard"] at @s run execute as @a[r=128] at @s run kill @e[family=monster,r=8]
execute as @e[type=armor_stand,name="Village Guard"] at @s run execute as @a[r=128] at @s run kill @e[name="Ender Crystal",r=8]
execute as @e[type=armor_stand,name="Village Guard"] at @s run execute as @e[family=villager,r=128] at @s run kill @e[family=monster,r=16]
execute as @e[type=armor_stand,name="Village Guard"] at @s run execute as @e[family=villager,r=128] at @s run kill @e[name="Ender Crystal",r=16]
#######################################################################################
#For Villagers
##"minecraft:stop_exploding"
execute as @e[family=villager] at @s run kill @e[family=creeper,r=16]
execute as @e[family=villager] at @s run kill @e[family=skeleton,r=32]
execute as @e[family=villager] at @s run kill @e[family=illager,r=16]
#######################################################################################
#Obsidian Portal
##execute as @e[family=monster] at @s if block ~ ~-1 ~ obsidian 0 kill @s
#######################################################################################
#Exit