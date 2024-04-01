#######################################################################################    
#Convert Ticks to Minutes
#######################################################################################    
    scoreboard objectives remove alive_max_min
    scoreboard objectives add alive_max_min dummy "§2Best Alive Time"
    execute as @a run scoreboard players operation @s alive_max_min = @s alive_max_ticks
    execute as @a run scoreboard players operation @s alive_max_min /= min_1 number
#######################################################################################        
#End