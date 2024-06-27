##############################################################
# For Protection
##############################################################
execute as @s at @s run execute if entity @e[family=dw623_tnt,r=32] run tell @a[tag=Debug_Better_TNT] §6Killing all family=dw623_tnt,r=32 around me
execute as @s at @s run tag @e[family=dw623_tnt,r=32] add by_guard

execute as @s at @s run execute if entity @e[family=tnt_nuke,r=64] run tell @a[tag=Debug_Better_TNT] §6Killing all family=tnt_nuke,r=64 around me
execute as @s at @s run tag @e[family=tnt_nuke,r=64] add by_guard

execute as @s at @s run execute if entity @e[family=tnt_armageddon,r=128] run tell @a[tag=Debug_Better_TNT] §6Killing all family=tnt_armageddon,r=128 around me
execute as @s at @s run tag @e[family=tnt_armageddon,r=128] add by_guard

execute as @s at @s run execute if entity @e[family=tnt,r=64] run tell @a[tag=Debug_Better_TNT] §6Killing all family=tnt around me
execute as @s at @s run kill @e[family=tnt,r=64]
##############################################################
# End