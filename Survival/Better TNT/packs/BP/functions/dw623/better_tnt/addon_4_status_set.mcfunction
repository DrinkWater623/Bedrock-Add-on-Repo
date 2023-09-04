#say status set
##############################################################
scoreboard players set tnt_test        bt_status 4 

scoreboard players set tnt_dud         bt_status 0  
scoreboard players set tnt_lite        bt_status 0  
scoreboard players set tnt_super       bt_status 0  
scoreboard players set tnt_bomb        bt_status 0  
scoreboard players set tnt_nuke        bt_status 0  
scoreboard players set tnt_armageddon  bt_status 0  

scoreboard players operation tnt_dud         bt_status += game_tntexplodes better_tnt  
scoreboard players operation tnt_lite        bt_status += game_tntexplodes better_tnt  
scoreboard players operation tnt_super       bt_status += game_tntexplodes better_tnt  
scoreboard players operation tnt_bomb        bt_status += game_tntexplodes better_tnt  
scoreboard players operation tnt_nuke        bt_status += game_tntexplodes better_tnt  
scoreboard players operation tnt_armageddon  bt_status += game_tntexplodes better_tnt  

scoreboard players operation tnt_dud         bt_status += better_tntexplodes better_tnt  
scoreboard players operation tnt_lite        bt_status += better_tntexplodes better_tnt  
scoreboard players operation tnt_super       bt_status += better_tntexplodes better_tnt  
scoreboard players operation tnt_bomb        bt_status += better_tntexplodes better_tnt  
scoreboard players operation tnt_nuke        bt_status += better_tntexplodes better_tnt  
scoreboard players operation tnt_armageddon  bt_status += better_tntexplodes better_tnt  

scoreboard players operation tnt_dud         bt_status += tnt_dud        better_tnt  
scoreboard players operation tnt_lite        bt_status += tnt_lite       better_tnt  
scoreboard players operation tnt_super       bt_status += tnt_super      better_tnt  
scoreboard players operation tnt_bomb        bt_status += tnt_bomb       better_tnt  
scoreboard players operation tnt_nuke        bt_status += tnt_nuke       better_tnt  
scoreboard players operation tnt_armageddon  bt_status += tnt_armageddon better_tnt  