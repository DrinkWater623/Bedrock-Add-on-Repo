scoreboard players reset @s toggle
scoreboard players set @s[scores={is_op=1..}] toggle 0
scoreboard players add @s[m=c,scores={toggle=0}] toggle 1
gamemode c @s[m=s,scores={toggle=0}]
gamemode s @s[m=c,scores={toggle=1}]
scoreboard players reset @s toggle 
playsound beacon.activate @s[m=c]
playsound beacon.deactivate @s[m=s]
tellraw @s[m=c] {"rawtext":[{"text":"§aYou are in Creative Mode"}]}
tellraw @s[m=s] {"rawtext":[{"text":"§cYou are in Survival Mode"}]}