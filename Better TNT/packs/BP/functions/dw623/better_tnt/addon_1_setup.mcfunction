# Should run every tick
##############################################################
scoreboard objectives add better_tnt_admin dummy "Better TNT Admin"
scoreboard objectives add better_tnt dummy "Better TNT Settings"
scoreboard objectives add bt_timer dummy
scoreboard objectives add bt_status dummy
scoreboard players add @e[family=dw623_tnt] bt_timer 0
##############################################################
scoreboard players add @a better_tnt_admin 0
#set to anything besides 0/1 for it to ignore updating
scoreboard players set @a[m=c,scores={better_tnt_admin=0}] better_tnt_admin 1
##############################################################
scoreboard players add timer bt_timer 0
scoreboard players add initialized        better_tnt 0
scoreboard players add game_tntexplodes   better_tnt 0
scoreboard players add better_tntexplodes better_tnt 0
scoreboard players add tnt_test           better_tnt 0
scoreboard players add tnt_dud            better_tnt 0
scoreboard players add tnt_lite           better_tnt 0
scoreboard players add tnt_super          better_tnt 0
scoreboard players add tnt_bomb           better_tnt 0
scoreboard players add tnt_nuke           better_tnt 0
scoreboard players add tnt_armageddon     better_tnt 0
##############################################################
# Initialize for world if 1st time
execute if score initialized better_tnt matches 0 run function dw623/better_tnt/addon_2_reset
scoreboard players set initialized better_tnt 623
##############################################################
# Update tntexplodes from owner game_settings if any
execute if score tntexplodes  game_settings matches 0 run scoreboard players set better_tntexplodes better_tnt 0
execute if score TntExplodes  game_settings matches 0 run scoreboard players set better_tntexplodes better_tnt 0
execute if score tntExplodes  game_settings matches 0 run scoreboard players set better_tntexplodes better_tnt 0
execute if score TNTExplodes  game_settings matches 0 run scoreboard players set better_tntexplodes better_tnt 0
execute if score tnt_explodes game_settings matches 0 run scoreboard players set better_tntexplodes better_tnt 0
execute if score Tnt_Explodes game_settings matches 0 run scoreboard players set better_tntexplodes better_tnt 0
execute if score TNT_Explodes game_settings matches 0 run scoreboard players set better_tntexplodes better_tnt 0
execute if score TNTexplodes  game_settings matches 0 run scoreboard players set better_tntexplodes better_tnt 0
##############################################################
execute if score timer bt_timer matches  0 run function dw623/better_tnt/addon_4_status_set
#Always Allowed - No Damage
scoreboard players set tnt_test better_tnt 1
scoreboard players set tnt_test bt_status 3

