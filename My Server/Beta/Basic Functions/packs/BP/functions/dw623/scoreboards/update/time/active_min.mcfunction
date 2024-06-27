#######################################################################################    
#Convert Ticks to Minutes
#######################################################################################    
    scoreboard objectives remove active_min
    scoreboard objectives add active_min dummy "§6Session Active Timer"
    execute as @a run scoreboard players operation @s active_min = @s active_ticks
    execute as @a run scoreboard players operation @s active_min /= min_1 number
#######################################################################################       
#End