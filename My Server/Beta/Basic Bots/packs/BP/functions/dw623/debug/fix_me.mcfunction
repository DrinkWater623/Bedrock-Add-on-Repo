tag @s[tag=!Monster_Immunity] add Monster_Immunity
execute as @s[tag=Monster_Immunity] at @s run kill @e[family=monster,r=16]
effect @s[tag=Monster_Immunity] instant_health 10 255 true
effect @s[tag=Monster_Immunity] saturation 10 255 true
gamemode c @s[m=s,scores={is_op=1..}]
tellraw @s[m=c,tag=Monster_Immunity] {"rawtext":[{"text":"§ctag Monster_Immunity & Creative Mode applied to give you break - remove  when ready"}]}

