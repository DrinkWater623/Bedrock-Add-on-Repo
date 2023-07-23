scoreboard objectives add toggle dummy
scoreboard players reset @s toggle
scoreboard players add @s toggle 0
scoreboard players add @s[m=c] toggle 1
gamemode s @s[m=c]
dialogue open @e[c=1,family=bot] @s wither_settings
gamemode c @s[scores={toggle=1}]