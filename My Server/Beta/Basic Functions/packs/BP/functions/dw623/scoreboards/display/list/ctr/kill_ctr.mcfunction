scoreboard objectives remove anyList
scoreboard objectives add anyList dummy "§6Kill Count"
execute as @a run scoreboard players operation @s anyList = @s kill_ctr
scoreboard players add @s anyList 0
scoreboard objectives setdisplay list anyList