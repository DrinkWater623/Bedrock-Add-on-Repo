#######################################################################################    
#Convert Ticks to Minutes
#######################################################################################    
    scoreboard objectives remove alive_min
    scoreboard objectives add alive_min dummy "§aAlive Timer"
    execute as @a run scoreboard players operation @s alive_min = @s alive_ticks
    execute as @a run scoreboard players operation @s alive_min /= min_1 number
#######################################################################################       
#End
