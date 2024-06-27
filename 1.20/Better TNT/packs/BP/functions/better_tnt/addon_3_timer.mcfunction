# This function runs every tick - put timer 0-20 ticks stuff in here
##############################################################
# Reset stuff
scoreboard objectives add bt_status dummy
scoreboard players add timer bt_timer 0
execute if score timer bt_timer matches ..-1 run scoreboard players set timer bt_timer 0
# execute if score timer bt_timer matches 0 run function better_tnt/addon_4_status_set
execute if score timer bt_timer matches 0 unless entity @e[family=dw623_tnt] run scoreboard players reset * bt_status

scoreboard players set n5 bt_timer -5
scoreboard players set n10 bt_timer -10
scoreboard players set n20 bt_timer -20
scoreboard players add timer bt_timer 0
##############################################################
# Every 5 ticks
    scoreboard players operation mod bt_timer = timer bt_timer
    scoreboard players operation mod bt_timer %= n5 bt_timer
    execute if score mod bt_timer matches 0 as @e[family=dw623_tnt,family=in_block,family=!activated] run function better_tnt/query_block_events
##############################################################
# Every 10 ticks
    scoreboard players operation mod bt_timer = timer bt_timer
    scoreboard players operation mod bt_timer %= n10 bt_timer
    execute if score mod bt_timer matches 0 run function better_tnt/addon_4_status_set
    # Only reset those that have been processed before - new ones are done each tick
    scoreboard players add @e[family=dw623_tnt] bt_status 0
    execute if score mod bt_timer matches 0 as @e[family=dw623_tnt,family=!vanilla,scores={bt_status=1..}] run function better_tnt/check_status
##############################################################
# Every 20 ticks or reset
    scoreboard players operation mod bt_timer = timer bt_timer
    scoreboard players operation mod bt_timer %= n20 bt_timer
    execute if score mod bt_timer matches 0 run function better_tnt/addon_5_guard_set
    # Get Active Count
    execute if score mod bt_timer matches 0 run scoreboard players set "Active TNT Count" bt_status 0
    execute if score mod bt_timer matches 0 run execute as @e[family=tnt] run scoreboard players add "Active TNT Count" bt_status 1
##############################################################
# Rest Every tick
##############################################################
scoreboard players add timer bt_timer 1
execute if score timer bt_timer matches 1201.. run scoreboard players set timer bt_timer 0
##############################################################
# End