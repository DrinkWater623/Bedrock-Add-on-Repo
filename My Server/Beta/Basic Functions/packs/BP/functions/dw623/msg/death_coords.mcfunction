#Displays Coords where Died
#Called as @s
tellraw @s {"rawtext":[{"text":"§gYou died at the Coordinates on the next line"}]}
gamerule sendcommandfeedback true
execute as @s at @s run tp ~ ~ ~