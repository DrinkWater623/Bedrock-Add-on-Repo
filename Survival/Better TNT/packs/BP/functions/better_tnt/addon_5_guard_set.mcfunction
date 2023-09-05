##############################################################
# Reset tag every 20 ticks
tag @e[tag=tnt_guard,family=!villager] remove tnt_guard
##############################################################
# For Protection - Tag everybody
execute as @e[tag=!tnt_guard,family=villager] run tag @s add tnt_guard
execute as @e[tag=!tnt_guard,type=armor_stand,name="TNT Guard"  ] run tag @s add tnt_guard
execute as @e[tag=!tnt_guard,type=armor_stand,name="No TNT"     ] run tag @s add tnt_guard
execute as @e[tag=!tnt_guard,type=armor_stand,name="No TNT Zone"] run tag @s add tnt_guard
execute as @e[tag=!tnt_guard,family=mob,name="TNT Guard"  ] run tag @s add tnt_guard
execute as @e[tag=!tnt_guard,family=mob,name="No TNT"     ] run tag @s add tnt_guard
execute as @e[tag=!tnt_guard,family=mob,name="No TNT Zone"] run tag @s add tnt_guard
