#######################################################################################
    scoreboard objectives add entity_ctr dummy "Entity Counts"
    scoreboard players add ctr_long_list entity_settings 0    
    scoreboard players reset * entity_ctr

    function dw623/scoreboards/update/mobs/count_level_0
    execute if score ctr_detail_level entity_settings matches 2.. as @e[type=!player] run scoreboard players add "Non-Players" entity_ctr 1
#######################################################################################    
#Players
    execute if score ctr_detail_level entity_settings matches 1.. run scoreboard players operation "Players Joined" entity_ctr = "Player Count" PlayerIDs    
#######################################################################################    
#Mobs
    execute if score ctr_detail_level entity_settings matches 1.. run function dw623/scoreboards/update/mobs/count_monsters
    execute if score ctr_detail_level entity_settings matches 1.. run function dw623/scoreboards/update/mobs/count_mobs  
#######################################################################################
    scoreboard objectives setdisplay list entity_ctr
#End
