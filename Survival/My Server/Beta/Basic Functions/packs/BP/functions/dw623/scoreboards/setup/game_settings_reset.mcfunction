#######################################################################################    
#  Defaults for DW623's Survival Plus Realm
#######################################################################################    
#Default Settings for New World - Meant to be run once
#Can be used for reset of some settings
#execute if score "Player Count" player_id matches 1 Say §aDefault Game Settings have been applied to the new world.
#execute unless score "Player Count" player_id matches 1 Say §6Default Game Settings have been re-applied to the world.
#######################################################################################    
scoreboard objectives setdisplay sidebar game_settings
scoreboard objectives setdisplay list game_settings
#######################################################################################    
scoreboard players set AllowNPCs game_settings 0 
scoreboard players set AllowWithers game_settings 0 
scoreboard players set AllowCreativeMode game_settings 1
scoreboard players set AllowMonsterGuards game_settings 1  
#scoreboard players add AllowOnePlayerSleep game_settings 1
#scoreboard players set AllowTeams game_settings 0 
scoreboard players set DoWeatherCycle game_settings 0
scoreboard players add CommandBlockOutput game_settings 0
scoreboard players set CommandBlocksEnabled game_settings 1
scoreboard players set CompassInterval game_settings 15   
#scoreboard players set DefaultActionBar game_settings 1
scoreboard players set Difficulty game_settings 3
# 0-peaceful, 1-easy, 2-normal, 3-hard
scoreboard players set DisplayScoreboards game_settings 1
scoreboard players set DoInsomnia game_settings 1
#######################################################################################
# can be 20...1200 = 1s to 1m in increments of 5 ticks
#scoreboard players set EntityCtrToggle entity_settings 0
#scoreboard players add EntityCtrUpdateTicks entity_settings 0
#execute if score EntityCtrUpdateTicks entity_settings matches 0 run scoreboard players set EntityCtrUpdateTicks game_settings 300
#execute if score EntityCtrUpdateTicks entity_settings matches ..19 run scoreboard players set EntityCtrUpdateTicks game_settings 20
#execute if score EntityCtrUpdateTicks entity_settings matches 1201.. run scoreboard players set EntityCtrUpdateTicks game_settings 300
#######################################################################################
scoreboard players set PVP game_settings 1
scoreboard players set FallDamage game_settings 1
scoreboard players set FireDamage game_settings 0
scoreboard players set FreezeDamage game_settings 1
scoreboard players set KeepInventory game_settings 1
scoreboard players set MobGriefing game_settings 1 
scoreboard players set SendCommandFeedBack game_settings 0 
scoreboard players set ShowCoordinates game_settings 1
scoreboard players set TntExplodes game_settings 1
#######################################################################################    
tell @a[scores={PlayerIDs=1}] §aGame Settings have been updated to the Defaults (scoreboards/setup/settings_default.mcfunction)
tell @a[scores={PlayerIDs=1}] §bYou can change update settings via the Menu (run dialogue menu or create menu stick (wand))
tell @a[scores={PlayerIDs=1}] §cAllowNPCs is defaulted to YES in case this add-on is applied to existing world.  Update to NO if you will not use NPCs - avoids some hacks
tell @a[scores={PlayerIDs=1}] §eTurn on the Random Scoreboards.  It is defaulted to Off, so that you can see the Game Settings
#######################################################################################
#End