#######################################################################################        
#Wither Default Settings
    function dw623/wither_control/scoreboard_init  
    scoreboard players set WitherLifeLength wither_settings 30
    scoreboard players set Kill_Players wither_settings 0
    scoreboard players set Kill_Mobs wither_settings 0
    scoreboard players set Kill_Monsters wither_settings 0
#######################################################################################
#if Any Alive change Settings
    execute if entity @e[family=dw623_wither] run function dw623/wither_control/set_tags_to_scoreboard
#End