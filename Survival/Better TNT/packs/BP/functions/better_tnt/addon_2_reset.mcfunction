#Should only be ran once at First Load.... can run manually for a reset
##############################################################
scoreboard players reset * better_tnt
scoreboard players set game_tntexplodes     better_tnt 1
scoreboard players set better_tntexplodes   better_tnt 1
scoreboard players set tnt_test       better_tnt 1
scoreboard players set tnt_dud        better_tnt 1
scoreboard players set tnt_lite       better_tnt 1
scoreboard players set tnt_super      better_tnt 1
scoreboard players set tnt_bomb       better_tnt 1
scoreboard players set tnt_nuke       better_tnt 0
scoreboard players set tnt_armageddon better_tnt 0
scoreboard players set initialized    better_tnt 1

# This will grab the minecraft settings for tntexplodes and update scoreboard
summon dw623:tntexplodes_get ~ 300 ~ 0 0 ev:tntexplodes

