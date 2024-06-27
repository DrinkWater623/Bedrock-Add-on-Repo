#######################################################################################    
#Adjust/Reset afk_ticks Scoreboard
#######################################################################################
    scoreboard objectives remove xferAfkTicks    
    scoreboard objectives add xferAfkTicks dummy
    execute as @a run scoreboard players operation @s xferAfkTicks = @s afk_ticks
#######################################################################################
    scoreboard players reset * afk_ticks
    execute as @a run scoreboard players operation @s afk_ticks = @s xferAfkTicks
    scoreboard objectives remove xferAfkTicks
#######################################################################################  
    function dw623/scoreboards/update/time/afk_min      
#######################################################################################  
#End