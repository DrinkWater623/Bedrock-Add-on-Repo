#######################################################################################    
#Convert Ticks to Minutes
#######################################################################################    
    scoreboard objectives remove login_min
    scoreboard objectives add login_min dummy "§dLogin Timer"
    execute as @a run scoreboard players operation @s login_min = @s login_ticks
    execute as @a run scoreboard players operation @s login_min /= min_1 number
#######################################################################################
#End