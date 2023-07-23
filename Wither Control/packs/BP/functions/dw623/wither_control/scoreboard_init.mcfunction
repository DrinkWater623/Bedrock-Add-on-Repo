
    scoreboard objectives add game_settings dummy "Game Settings"
    scoreboard players add AllowWithers game_settings 0
#######################################################################################        
    # scoreboard objectives add wither_timer dummy "Wither Timer"    
    scoreboard objectives add wither_ticks dummy
    scoreboard players set n20 wither_ticks 20
    scoreboard players set min_15 wither_ticks 18000
#######################################################################################        
#Wither Default Settings
    scoreboard objectives add wither_settings dummy "Wither Settings"
    scoreboard players add WitherLifeLength wither_settings 0
    scoreboard players add Kill_Players wither_settings 0
    scoreboard players add Kill_Mobs wither_settings 0
    scoreboard players add Kill_Monsters wither_settings 0
#######################################################################################
    execute if score Ticks wither_ticks >= min_15 wither_ticks run scoreboard players set Ticks wither_ticks 0
#######################################################################################

#End