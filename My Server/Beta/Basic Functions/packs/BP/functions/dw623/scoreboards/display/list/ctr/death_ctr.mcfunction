scoreboard objectives remove anyList
scoreboard objectives add anyList dummy "§cDeath Count"
execute as @a run scoreboard players operation @s anyList = @s death_ctr
scoreboard players add @s anyList 0
scoreboard objectives setdisplay list anyList