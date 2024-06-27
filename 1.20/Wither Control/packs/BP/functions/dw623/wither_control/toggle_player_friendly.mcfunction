#if one, then all
execute if entity @e[family=dw623_wither,tag=player_friendly] run tag @e[family=dw623_wither] add player_friendly

#make sure score reflects the current truth
scoreboard players reset Kill_Players wither_settings
execute if entity @e[family=dw623_wither,tag=!player_friendly] run scoreboard players set Kill_Players wither_settings 1
execute if entity @e[family=dw623_wither,tag=player_friendly]  run scoreboard players set Kill_Players wither_settings 0

#now reverse via tags
execute if score Kill_Players wither_settings matches 1 run tag @e[family=dw623_wither] add player_friendly
execute if score Kill_Players wither_settings matches 0 run tag @e[family=dw623_wither] remove player_friendly

#make sure score reflects the new truth of tags
execute if entity @e[family=dw623_wither,tag=!player_friendly] run scoreboard players set Kill_Players wither_settings 1
execute if entity @e[family=dw623_wither,tag=player_friendly]  run  scoreboard players set Kill_Players wither_settings 0

#Proof
execute if score Kill_Players wither_settings matches 1 run execute as @e[c=1,family=dw623_wither] run me says §cRUN & Hide!!!
execute if score Kill_Players wither_settings matches 0 run execute as @e[c=1,family=dw623_wither] run me says §aHug ??? 
scoreboard objectives setdisplay sidebar wither_settings