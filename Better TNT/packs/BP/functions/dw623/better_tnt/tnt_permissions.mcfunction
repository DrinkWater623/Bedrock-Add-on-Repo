# Debug
##############################################################
# For Protection
execute as @e[tag=tnt_guard] at @s run function dw623/better_tnt/check_guard
##############################################################
# Apply status to new entities - old ones get updated every 10 ticks in timer
scoreboard players add @e[family=dw623_tnt] bt_status 0
execute as @e[family=dw623_tnt,scores={bt_status=0}] run tellraw @a[tag=Debug_Better_TNT] {"rawtext":[{"text":"1st time status: "},{"score":{"name":"timer","objective":"bt_status"}}]}
execute as @e[family=dw623_tnt,family=!vanilla,scores={bt_status=0}] run function dw623/better_tnt/check_status
##############################################################
# Dispenser Drops - check if from a dispenser
#execute as @e[family=dw623_tnt,family=dispenser,tag=!x_dispenser] run function dw623/better_tnt/check_dispenser
##############################################################
tag @e[family=dw623_tnt,tag=!x_permissions] add x_permissions
##############################################################
# End