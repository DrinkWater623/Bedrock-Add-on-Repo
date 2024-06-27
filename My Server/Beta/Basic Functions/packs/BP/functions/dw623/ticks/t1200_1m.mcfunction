#######################################################################################    
#Actions to run every 1200 ticks = 1 minute
tell @a[tag=DebugTime] t1200_1m
#######################################################################################    
# xp orb cleanup
    execute as @e[type=xp_orb] at @s run tp @s @p[m=s,r=32]
#######################################################################################    
#Mod 6000 = 5 minute
    scoreboard players operation Ticks ModCheck = Ticks number
    scoreboard players operation Ticks ModCheck %= min_5 number
    execute if score Ticks ModCheck matches 0 run  function dw623/ticks/t6000_5m
#######################################################################################    
#End