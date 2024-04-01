#######################################################################################    
#Actions to run every 600 ticks = 30 seconds
#######################################################################################
# Leave alone if Owner is on, must be doing something
    execute if score CommandBlockOutput game_settings  matches 1 unless entity @a[scores={is_op=1,PlayerIDs=1}] run scoreboard players set CommandBlockOutput game_settings 0
    execute if score SendCommandFeedBack game_settings matches 1 unless entity @a[scores={is_op=1,PlayerIDs=1}] run scoreboard players set SendCommandFeedBack game_settings 0
#######################################################################################
# this should be with the randon display call... in case it is on that one  
    function dw623/scoreboards/update/time/login_ticks
    function dw623/scoreboards/update/time/active_ticks
######################################################################################
# has the random display call too....
    function  dw623/run/game_settings_enforce
#######################################################################################    
#Mod 1200 = 1 minute
    scoreboard players operation Ticks ModCheck = Ticks number
    scoreboard players operation Ticks ModCheck %= min_1 number
    execute if score Ticks ModCheck matches 0 run  function dw623/ticks/t1200_1m  
#######################################################################################    
#End