#No-Nos - Run at 10 ticks
#######################################################################################
#Fix - in case lose tags
   #for needed tags too
    execute as @a[tag=!is_op,scores={is_op=1}] run tag @s add is_op
    execute as @a[tag=is_op ,scores={is_op=0}] run tag @s remove is_op
    execute as @a[tag=!is_trusted,scores={is_trusted=1..}] run tag @s add is_trusted
    execute as @a[tag=is_trusted ,scores={is_trusted=..0}] run tag @s remove is_trusted
#######################################################################################
#Illegal Creative Mode
    scoreboard players add @a is_op 0
    
    execute as @a[m=c,scores={is_op=0}] run say §cUh-Oh, I am in Creative Mode and Should not Be - Alert Admin for me
    tag @a[m=c,scores={is_op=0}] add Illegal_Creative_Mode
    gamemode s @a[m=c,scores={is_op=0}]
    #If Creative is not allowed at all
    execute if score AllowCreativeMode game_settings matches 0 run tell @a[m=c] Creative Mode is not Allowed per settings
    execute if score AllowCreativeMode game_settings matches 0 run playsound beacon.deactivate @a[m=c]
    execute if score AllowCreativeMode game_settings matches 0 run gamemode s @a[m=c]
#######################################################################################
#No UnNamed NPCs - cause this is how hacks come in...
    kill @e[family=npc,name=NPC] 
#Confirm  Any NPCs Allowed
    execute if score AllowNPCs game_settings matches 0 run kill @e[family=npc]
#OP tags NPCs they create by proximity
    execute as @a[scores={is_op=1}] at @s run tag @e[family=npc,r=2] add ValidNPC
#Kill Non Valid NPCs
    kill @e[family=npc,tag=!ValidNPC] 
#######################################################################################
#Illegal Blocks
    clear @a[scores={is_op=0}] deny
    clear @a[scores={is_op=0}] allow
    clear @a[scores={is_op=0}] bedrock
    clear @a[scores={is_op=0}] structure_void
    clear @a[scores={is_op=0}] barrier
    clear @a[scores={is_op=0}] light_block
    ## clear @a[scores={is_op=0}] villager_spawn_egg OKAY for this world
    clear @a[scores={is_op=0}] zombie_villager_spawn_egg

#RealmAdmin and above only
    #51 is NPC Spawn Egg
    clear @a[scores={is_op=0}] spawn_egg 51
    clear @a[scores={is_op=0}] command_block
    clear @a[scores={is_op=0}] chain_command_block
    clear @a[scores={is_op=0}] repeating_command_block
    clear @a[scores={is_op=0}] command_block_minecart
    clear @a[scores={is_op=0}] structure_block
    clear @a[scores={is_op=0}] border_block
    #Monsters
    #clear @a[scores={is_op=0}] wither_spawn_egg
    clear @a[scores={is_op=0}] ghast_spawn_egg
    clear @a[scores={is_op=0}] creeper_spawn_egg
    clear @a[scores={is_op=0}] zombie_spawn_egg
    clear @a[scores={is_op=0}] drowned_spawn_egg
    clear @a[scores={is_op=0}] spider_spawn_egg
    clear @a[scores={is_op=0}] cave_spider_spawn_egg
    clear @a[scores={is_op=0}] stray_spawn_egg
    clear @a[scores={is_op=0}] witch_spawn_egg
    clear @a[scores={is_op=0}] slime_spawn_egg
    clear @a[scores={is_op=0}] magma_cube_spawn_egg
    clear @a[scores={is_op=0}] skeleton_spawn_egg
    clear @a[scores={is_op=0}] blaze_spawn_egg
    clear @a[scores={is_op=0}] hoglin_spawn_egg
    clear @a[scores={is_op=0}] husk_spawn_egg
    clear @a[scores={is_op=0}] enderman_spawn_egg
    clear @a[scores={is_op=0}] vex_spawn_egg
    clear @a[scores={is_op=0}] zombie_pigman_spawn_egg
    #and Him
    ## OKay for this word clear @a[scores={is_op=0}] wandering_trader_spawn_egg
    #######################################################################################
    clear @a[scores={is_trusted=..0}] tnt 
    clear @a[scores={is_trusted=..0}] end_crystal
    execute if score TntExplodes game_settings matches 0 run execute as @a[scores={is_trusted=..0}] at @s run fill ~-8 ~-8 ~-8 ~8 ~8 ~8 coal_ore [] replace tnt
#Exit