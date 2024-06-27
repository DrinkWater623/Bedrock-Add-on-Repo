#######################################################################################    
#Adjust/Reset active_ticks Scoreboard
#######################################################################################
    scoreboard objectives add xferActTicks dummy
    execute as @a run scoreboard players operation @s xferActTicks = @s active_ticks
#######################################################################################
    scoreboard players reset * active_ticks
    execute as @a run scoreboard players operation @s active_ticks = @s xferActTicks
    scoreboard objectives remove xferActTicks
#######################################################################################  
    function dw623/scoreboards/update/time/active_min      
#######################################################################################  
#End