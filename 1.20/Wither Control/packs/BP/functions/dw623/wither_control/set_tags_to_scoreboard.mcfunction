gamerule sendcommandfeedback false
#tell @p[tag=Debug,tag=is_op] Setting Wither Tags
#######################################################################################
#if Any Alive change Settings
    execute if score Kill_Players wither_settings matches 0 run tag @e[family=dw623_wither]    add player_friendly 
    execute if score Kill_Players wither_settings matches 1 run tag @e[family=dw623_wither] remove player_friendly 

    execute if score Kill_Mobs wither_settings matches 0 run tag @e[family=dw623_wither]    add mob_friendly 
    execute if score Kill_Mobs wither_settings matches 1 run tag @e[family=dw623_wither] remove mob_friendly 

    execute if score Kill_Monsters wither_settings matches 0 run tag @e[family=dw623_wither]    add monster_friendly 
    execute if score Kill_Monsters wither_settings matches 1 run tag @e[family=dw623_wither] remove monster_friendly 

    #gamerule sendcommandfeedback true
    #tag @e[family=dw623_wither] list
#End