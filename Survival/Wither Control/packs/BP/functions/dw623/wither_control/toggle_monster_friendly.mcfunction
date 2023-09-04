#if one, then all
execute if entity @e[family=dw623_wither,tag=monster_friendly] run tag @e[family=dw623_wither] add monster_friendly

#make sure score reflects the current truth
scoreboard players reset Kill_Monsters wither_settings
execute if entity @e[family=dw623_wither,tag=monster_friendly]  run scoreboard players set Kill_Monsters wither_settings 0
execute if entity @e[family=dw623_wither,tag=!monster_friendly] run scoreboard players set Kill_Monsters wither_settings 1

#now reverse via tags
execute if score Kill_Monsters wither_settings matches 1 run tag @e[family=dw623_wither] add monster_friendly
execute if score Kill_Monsters wither_settings matches 0 run tag @e[family=dw623_wither] remove monster_friendly

#make sure score reflects the new truth of tags
execute if entity @e[family=dw623_wither,tag=monster_friendly]  run  scoreboard players set Kill_Monsters wither_settings 0
execute if entity @e[family=dw623_wither,tag=!monster_friendly] run scoreboard players set Kill_Monsters wither_settings 1

#Proof
execute if score Kill_Monsters wither_settings matches 1 run execute as @e[c=1,family=dw623_wither] run me says §cMonsters to Torture !!!
execute if score Kill_Monsters wither_settings matches 0 run execute as @e[c=1,family=dw623_wither] run me says §aI see Monster Playmates... I go play now
scoreboard objectives setdisplay sidebar wither_settings