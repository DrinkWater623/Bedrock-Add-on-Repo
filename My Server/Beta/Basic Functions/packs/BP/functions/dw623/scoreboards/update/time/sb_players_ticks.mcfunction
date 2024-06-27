# Runs each eack tick
#######################################################################################    
    scoreboard players add @a login_ticks 1
    #leave this outside in caller
    #execute if entity @a[scores={login_ticks=1}] run function dw623/players/on_load/is_loaded
#######################################################################################    
# AFK Notes:
#   AFK does not kick in until 3 minutes is reached, 
#   so a player has time to be gone for a few min.
# 
#   3 min = 3600 ticks.  This is subtracted from active and total when 3m starts
#######################################################################################    
# Add for AFK Players
    scoreboard players add @a afk_ticks 0
    scoreboard players add @a[scores={afk_ticks=1..}] afk_ticks 1
    scoreboard players add @a[scores={afk_ticks=1..}] afk_total_ticks 1
    execute if entity @a[scores={afk_ticks=6000..}] run function dw623/msg/afk_msgs
#######################################################################################    
# Add for Non-AFK Players
    #if afk for 15 min or longer, then lose active
    scoreboard players add @a[scores={afk_ticks=0},m=!c] active_ticks 1
    scoreboard players add @a[scores={afk_ticks=0},m=!c] total_ticks 1 
    scoreboard players add @a[scores={afk_ticks=0},m=!c] alive_ticks 1 
    execute as @a[scores={afk_ticks=0},m=!c] run scoreboard players operation @s alive_max_ticks > @s alive_ticks

    #Reverse for inactive
    scoreboard players remove @a[m=!c,scores={afk_ticks=1..,active_ticks=1..}] active_ticks 1
    scoreboard players set @a[scores={active_ticks=..-1}] active_ticks 0
#######################################################################################
# End