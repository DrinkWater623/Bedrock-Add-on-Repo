#######################################################################################    
# Actions to run every 300 ticks = 15 seconds
#######################################################################################    
# Mod 600 = 1/2 minute
    scoreboard players operation Ticks ModCheck = Ticks number
    scoreboard players operation Ticks ModCheck %= n600 number
    execute if score Ticks ModCheck matches 0 run  function dw623/ticks/t600_30s
#######################################################################################    
