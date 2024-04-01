#Server Scoreboards for Fake Players or Constant Info
#Called @ Every Welcome Back or Tick Roll-Over
tell @a[tag=DebugMax] setup/create
#######################################################################################    
#Server - General    
    scoreboard objectives add entity_ctr dummy "§5Loaded Entities§r"    
    scoreboard objectives add monsters_temp dummy
    scoreboard objectives add noCompass dummy 
    scoreboard objectives add number dummy
    scoreboard objectives add timer dummy
    scoreboard objectives add toggle dummy         
#######################################################################################        
#World Settings - Admin must initialize to 1    
    scoreboard objectives add game_settings dummy "Game Settings"
    scoreboard objectives add entity_settings dummy "Entity Settings"

    scoreboard players add AllowNPCs game_settings 0
    scoreboard players add AllowCreativeMode game_settings 0
    scoreboard players add TntExplodes game_settings 0
    scoreboard players add DoWeatherCycle game_settings 0
    scoreboard players add MobGriefing game_settings 0
    scoreboard players add DisplayScoreboards game_settings 0
    scoreboard players add CompassInterval game_settings 0   
    
#######################################################################################    
#Players Levels
    scoreboard objectives add PlayerIDs dummy "Player ID #"
    scoreboard objectives add is_op dummy "§aWorld Admin§r" 
    scoreboard objectives add is_builder dummy "§6Creative Mode Allowed§r" 
    scoreboard objectives add is_trusted dummy "§aTrusted Players"
    scoreboard objectives add is_banned dummy "Banned Players"

#######################################################################################        
#Player Timers
    scoreboard objectives add active_min dummy "§6Active Timer"
    scoreboard objectives add active_ticks dummy
    scoreboard objectives add afk_min dummy "§cAFK Timer"
    scoreboard objectives add afk_ticks dummy 
    scoreboard objectives add afk_total_min dummy "§4Total AFK Time"
    scoreboard objectives add afk_total_ticks dummy
    scoreboard objectives add alive_min dummy "§aAlive Timer"
    scoreboard objectives add alive_ticks dummy
    scoreboard objectives add alive_max_min dummy "§2Best Alive Time"
    scoreboard objectives add alive_max_ticks dummy
    scoreboard objectives add login_min dummy "§dLogin Timer"
    scoreboard objectives add login_ticks dummy
    scoreboard objectives add total_min dummy "§gTotal Active Time"
    scoreboard objectives add total_ticks dummy
#######################################################################################        
#Player Counters    
    scoreboard objectives add death_ctr dummy "§cDeath Count"
    scoreboard objectives add kill_ctr dummy "§4Kill Count§r"    
    #scoreboard objectives add monsters_close dummy "§cMonster Count Around Player§r"
    #scoreboard objectives add monsters_close dummy "§gMonsters w/in 16 Blocks§r"
    scoreboard objectives add weapon_mainhand dummy "Weapon in Main Hand"

#######################################################################################        
#Player Settings
    #scoreboard objectives add action_bar dummy "§6Action Bar Setting§r"
    # 0 - None as in no constant one
    # 1 = NSEW
    # 2 = Light Level and NSEW
    # 3 = NSEW and Close Monster Count (once I figure it out)
    # 4 = Light Level and NSEW and Close Monster Count (once I figure it out)    
#######################################################################################    
#Set Defaults
    function dw623/scoreboards/setup/constants_init
    function dw623/scoreboards/setup/settings_init
    function dw623/scoreboards/setup/players_init
    function  dw623/run/game_settings_enforce
#######################################################################################
#End