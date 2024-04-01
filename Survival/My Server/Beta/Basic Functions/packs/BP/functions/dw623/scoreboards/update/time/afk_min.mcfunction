#######################################################################################    
#Convert Ticks to Minutes
#######################################################################################
    scoreboard objectives remove afk_min
    scoreboard objectives add afk_min dummy "§cSession AFK Timer"   
    execute as @a[scores={afk_ticks=1200..}] run scoreboard players operation @s afk_min = @s afk_ticks
    execute as @a[scores={afk_min=1..}] run scoreboard players operation @s afk_min /= min_1 number
#######################################################################################       
#End