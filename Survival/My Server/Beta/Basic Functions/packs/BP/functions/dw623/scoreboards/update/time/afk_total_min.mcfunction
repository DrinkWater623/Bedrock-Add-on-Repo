#######################################################################################    
#Convert Ticks to Minutes
#######################################################################################    
    scoreboard objectives remove afk_total_min
    scoreboard objectives add afk_total_min dummy "§4Total AFK Time"   
    execute as @a[scores={afk_total_ticks=1200..}] run scoreboard players operation @s afk_total_min = @s afk_total_ticks
    execute as @a[scores={afk_total_ticks=1200..}] run scoreboard players operation @s afk_total_min /= min_1 number
#######################################################################################       
#End