#######################################################################################    
#Convert Ticks to Mintues
#######################################################################################    
    scoreboard objectives remove total_min
    scoreboard objectives add total_min dummy "§gTotal Active Time"
    execute as @a run scoreboard players operation @s total_min = @s total_ticks
    execute as @a run scoreboard players operation @s total_min /= min_1 number
#######################################################################################
#End    