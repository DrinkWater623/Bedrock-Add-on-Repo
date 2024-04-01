#######################################################################################    
#Monsters not on Level 0
    #execute if score ctr_detail_level entity_settings matches 1.. as @e[family=arthropod,family=monster]   run scoreboard players add "Arthropods" entity_ctr 1
    execute if score ctr_detail_level entity_settings matches 1   as @e[family=spider]    run scoreboard players add "Spiders"    entity_ctr 1
    
    execute if score ctr_detail_level entity_settings matches 1.. as @e[family=creeper]   run scoreboard players add "Creepers"   entity_ctr 1
    execute if score ctr_detail_level entity_settings matches 1.. as @e[family=enderman]  run scoreboard players add "Endermen"   entity_ctr 1

    execute if score ctr_detail_level entity_settings matches 1.. as @e[family=illager]   run scoreboard players add "Illagers"   entity_ctr 1
    
    execute if score ctr_detail_level entity_settings matches 1   as @e[family=undead]    run scoreboard players add "Un-Dead"    entity_ctr 1
    execute if score ctr_detail_level entity_settings matches 2.. as @e[family=husk]      run scoreboard players add "Husk"    entity_ctr 1
    execute if score ctr_detail_level entity_settings matches 2.. as @e[family=skeleton]  run scoreboard players add "Skeletons"  entity_ctr 1
    execute if score ctr_detail_level entity_settings matches 2.. as @e[family=zombie]    run scoreboard players add "Zombies"    entity_ctr 1
    execute if score ctr_detail_level entity_settings matches 2.. as @e[family=zombie_villager]    run scoreboard players add "Zombies"    entity_ctr 1
    
    #Nikki add more , like the nether guys and the infested guys 
#######################################################################################
#End
