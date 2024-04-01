#2 mins
execute as @e[type=armor_stand,name=!"Armor Stand"] at @s run kill @e[r=64,type=item,name="Rotten Flesh"]
execute as @e[type=armor_stand,name=!"Armor Stand"] at @s run kill @e[r=64,type=item,name="Bone"]
execute as @e[type=armor_stand,name=!"Armor Stand"] at @s run kill @e[r=64,type=item,name="Gunpowder"]
execute as @e[type=armor_stand,name=!"Armor Stand"] at @s run kill @e[r=64,type=item,name="Arrow"]
execute as @e[type=armor_stand,name=!"Armor Stand"] at @s run kill @e[r=64,type=item,name="Spider Eye"]
execute as @e[type=armor_stand,name=!"Armor Stand"] at @s run kill @e[r=64,type=item,name="Prismarine Crystals"]
execute as @e[type=armor_stand,name=!"Armor Stand"] at @s run kill @e[r=64,type=item,name="Prismarine Shard"]
execute as @e[type=armor_stand,name=!"Armor Stand"] at @s run kill @e[r=64,type=item,name="Nautilus Shell"]
execute as @e[type=armor_stand,name=!"Armor Stand"] at @s run kill @e[r=64,type=item,name="String"]
#execute as @e[type=armor_stand,name=!"Armor Stand"] at @s run kill @e[r=64,type=item,name=""]


kill @e[type=item,tag=floating3,name="Egg"]
kill @e[type=item,tag=floating3,name="Gravel"]
kill @e[type=item,tag=floating3,name="Netherrack"]
execute as @a in Nether run kill @e[type=item,tag=floating3,name="Netherrack"]
#kill @e[type=item,tag=floating3,name="Egg"]
#kill @e[type=item,tag=floating3,name="Egg"]

#Tagging system runs every 5 min so that final tag for 15 min is done
tag @e[type=item,tag=floating2,tag=!floating3] add floating3
tag @e[type=item,tag=floating1,tag=!floating2] add floating2
tag @e[type=item,tag=!floating1] add floating1

execute as @a in Nether run tag @e[type=item,tag=floating2,tag=!floating3] add floating3
execute as @a in Nether run tag @e[type=item,tag=floating1,tag=!floating2] add floating2
execute as @a in Nether run tag @e[type=item,tag=!floating1] add floating1