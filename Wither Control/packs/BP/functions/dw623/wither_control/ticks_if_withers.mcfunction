#######################################################################################
#Ran by ticks.json
#######################################################################################
#This Addon Scoreboards 
    function dw623/wither_control/scoreboard_init    
#######################################################################################
# Protection form un-authorized.  Because more power to BANG
    execute if score AllowWithers game_settings matches 0 run tag @e[family=dw623_wither] add despawn
    #execute if score AllowWithers game_settings matches 0 run event entity @e[family=dw623_wither] minecraft:despawn
#######################################################################################
    scoreboard players add Ticks wither_ticks 1
    scoreboard objectives setdisplay sidebar wither_settings
#######################################################################################
#If Withers - run function each second - that is what the timer is for, not ticks 
    scoreboard players operation TicksModCheck wither_ticks = Ticks wither_ticks
    scoreboard players operation TicksModCheck wither_ticks %= n20 wither_ticks
    execute if score TicksModCheck wither_ticks matches 0 as @e[family=dw623_wither] run function dw623/wither_control/wither_timer
    execute unless entity @e[family=dw623_wither] run scoreboard players reset Ticks wither_ticks
#######################################################################################    
#End