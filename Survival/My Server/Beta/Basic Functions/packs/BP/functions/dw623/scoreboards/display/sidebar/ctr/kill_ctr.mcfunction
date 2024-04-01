#######################################################################################
#Set
    execute if entity @a[scores={kill_ctr=1..}] run scoreboard objectives remove anyDisplay
    execute if entity @a[scores={kill_ctr=1..}] run scoreboard objectives add anyDisplay dummy "§cKill Count"  
    execute if entity @a[scores={kill_ctr=1..}] run scoreboard players add @a kill_ctr 0
    execute if entity @a[scores={kill_ctr=1..}] run execute as @a run scoreboard players operation @s anyDisplay = @s kill_ctr
    execute if entity @a[scores={kill_ctr=1..}] run scoreboard players add @a anyDisplay 0
#######################################################################################    
#Show
    execute if entity @a[scores={kill_ctr=1..}] run function dw623/scoreboards/display/sidebar/anydisplay
#######################################################################################    
#End    