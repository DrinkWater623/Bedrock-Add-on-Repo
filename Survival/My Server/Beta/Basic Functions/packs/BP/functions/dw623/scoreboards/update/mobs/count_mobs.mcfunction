#######################################################################################
    #execute as @a[scores={isOP=1..}] run scoreboard players add "OPs Online" entity_ctr 1
    #execute as @a[m=c] run scoreboard players add "Creative Mode" entity_ctr 1
#######################################################################################    
#Mobs
    execute if score ctr_detail_level entity_settings matches 1.. as @e[family=villager] run scoreboard players add "Villagers" entity_ctr 1    

    execute if score ctr_detail_level entity_settings matches 1 as @e[family=mob,family=!inanimate,family=!monster,family=!villager,family=!allay] run scoreboard players add "Animals" entity_ctr 1
    execute if score ctr_detail_level entity_settings matches 2.. as @e[type=bee]    run scoreboard players add "Bees" entity_ctr 1
    execute if score ctr_detail_level entity_settings matches 2.. as @e[type=cow]     run scoreboard players add "Cows" entity_ctr 1
    execute if score ctr_detail_level entity_settings matches 2.. as @e[type=chicken] run scoreboard players add "Chickens" entity_ctr 1
    execute if score ctr_detail_level entity_settings matches 2.. as @e[type=sheep]   run scoreboard players add "Sheep" entity_ctr 1
    execute if score ctr_detail_level entity_settings matches 2.. as @e[type=pig]     run scoreboard players add "Pigs" entity_ctr 1
    execute if score ctr_detail_level entity_settings matches 2.. as @e[type=goat]    run scoreboard players add "Goats" entity_ctr 1

    execute if score ctr_detail_level entity_settings matches 2.. as @e[type=wolf]   run scoreboard players add "Goats" entity_ctr 1
    execute if score ctr_detail_level entity_settings matches 2.. as @e[type=cat]    run scoreboard players add "Goats" entity_ctr 1
    execute if score ctr_detail_level entity_settings matches 2.. as @e[type=parrot] run scoreboard players add "Goats" entity_ctr 1
    
#######################################################################################
#End
