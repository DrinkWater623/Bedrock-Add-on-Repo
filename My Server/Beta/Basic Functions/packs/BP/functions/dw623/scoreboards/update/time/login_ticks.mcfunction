#######################################################################################    
#Adjust/Reset login_ticks Scoreboard
#######################################################################################
    scoreboard objectives remove xferLoginTicks    
    scoreboard objectives add xferLoginTicks dummy
    execute as @a run scoreboard players operation @s xferLoginTicks = @s login_ticks
#######################################################################################
    scoreboard players reset * login_ticks
    execute as @a run scoreboard players operation @s login_ticks = @s xferLoginTicks
    scoreboard objectives remove xferLoginTicks
#######################################################################################  
    function dw623/scoreboards/update/time/login_min      
#######################################################################################  
#End