#######################################################################################    
#Sets Game Rules per the Settings in Scoreboard game_settings
#  Zero is false, anything else is true
#######################################################################################
scoreboard players add AllowNPCs game_settings 0 
execute if entity @e[family=npc] unless score AllowNPCs game_settings matches 1 run kill @e[family=npc]
#######################################################################################
scoreboard players add AllowWithers game_settings 0 
execute if entity @e[family=wither] unless score AllowWithers game_settings matches 1 run kill @e[family=wither]
#######################################################################################
scoreboard players add CommandBlockOutput game_settings 0    
execute if score CommandBlockOutput game_settings matches 0 run gamerule commandblockoutput false 
execute unless score CommandBlockOutput game_settings matches 0 run gamerule commandblockoutput true

scoreboard players add CommandBlocksEnabled game_settings 0    
execute if score CommandBlocksEnabled game_settings matches 0 run gamerule commandblocksenabled false 
execute unless score CommandBlocksEnabled game_settings matches 0 run gamerule commandblocksenabled true
#######################################################################################    
execute if score CompassInterval game_settings matches 0 run scoreboard players set CompassInterval game_settings 15
#######################################################################################    
execute if score DoWeatherCycle game_settings matches 0 run gamerule doweathercycle false 
execute unless score DoWeatherCycle game_settings matches 0 run gamerule doweathercycle true
#######################################################################################    
# 0-peaceful, 1-easy, 2-normal, 3-hard
scoreboard players add Difficulty game_settings 0    
execute if score Difficulty game_settings matches ..0 run difficulty peaceful 
execute if score Difficulty game_settings matches 1   run difficulty easy
execute if score Difficulty game_settings matches 2   run difficulty normal
execute if score Difficulty game_settings matches 3.. run difficulty hard
#######################################################################################
#as long as this file is called every minute or less so 30s - 1m, can have this here.     
execute if score DisplayScoreboards game_settings matches 0 unless entity @a[tag=Debug,m=c] run scoreboard objectives setdisplay sidebar
execute if score DisplayScoreboards game_settings matches 0 if entity @a[tag=Debug,m=c] run tell @a[tag=Debug,m=c] §cYou are in Creative Debug mode and sidebars may be on because of you
execute if score DisplayScoreboards game_settings matches 1 run function dw623/scoreboards/display/sidebar/random
#######################################################################################     
execute if score DoInsomnia game_settings matches 0 run gamerule doinsomnia false 
execute unless score DoInsomnia game_settings matches 0 run gamerule doinsomnia true
#######################################################################################
scoreboard players add DoFireTick game_settings 0    
execute if score DoFireTick game_settings matches 0 run gamerule dofiretick false 
execute unless score DoFireTick game_settings matches 0 run gamerule dofiretick true
#######################################################################################
# can be 20...1200 = 1s to 1m in increments of 5 ticks
#scoreboard players add EntityCtrUpdateTicks entity_settings 0
#execute if score EntityCtrUpdateTicks entity_settings matches 0 run scoreboard players set EntityCtrUpdateTicks game_settings 300
#execute if score EntityCtrUpdateTicks entity_settings matches ..19 run scoreboard players set EntityCtrUpdateTicks game_settings 20
#execute if score EntityCtrUpdateTicks entity_settings matches 1201.. run scoreboard players set EntityCtrUpdateTicks game_settings 300
#######################################################################################
execute if score FallDamage game_settings matches 0 run gamerule falldamage false 
execute unless score FallDamage game_settings matches 0 run gamerule falldamage true
#######################################################################################
scoreboard players add FireDamage game_settings 0    
execute if score FireDamage game_settings matches 0 run gamerule firedamage false 
execute unless score FireDamage game_settings matches 0 run gamerule firedamage true
#######################################################################################
execute if score FreezeDamage game_settings matches 0 run gamerule freezedamage false 
execute unless score FreezeDamage game_settings matches 0 run gamerule freezedamage true
#######################################################################################
execute if score KeepInventory game_settings matches 0 run gamerule keepinventory false 
execute unless score KeepInventory game_settings matches 0 run gamerule keepinventory true
#######################################################################################    
scoreboard players add MobGriefing game_settings 0    
execute if score MobGriefing game_settings matches 0 run gamerule mobgriefing false 
execute unless score MobGriefing game_settings matches 0 run gamerule mobgriefing true
#######################################################################################
scoreboard players add SendCommandFeedBack game_settings 0 
execute if score SendCommandFeedBack game_settings matches 0 run gamerule sendcommandfeedBack false 
execute unless score SendCommandFeedBack game_settings matches 0 run gamerule sendcommandfeedBack true
#######################################################################################
execute if score ShowCoordinates game_settings matches 0 run gamerule showcoordinates false 
execute unless score ShowCoordinates game_settings matches 0 run gamerule showcoordinates true
#######################################################################################
scoreboard players add TntExplodes game_settings 0    
execute if score TntExplodes game_settings matches 0 run gamerule tntexplodes false 
execute unless score TntExplodes game_settings matches 0 run gamerule tntexplodes true
#######################################################################################    
#End