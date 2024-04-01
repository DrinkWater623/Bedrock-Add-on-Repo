scoreboard players reset @s toggle 
scoreboard players set @s[scores={is_op=1..}] toggle 0
scoreboard players add @s[tag=Monster_Immunity,scores={toggle=0}] toggle 1
tag @s[scores={toggle=0}] add Monster_Immunity
tag @s[scores={toggle=1}] remove Monster_Immunity
scoreboard players reset @s toggle 
playsound random.anvil_use @s[tag=Monster_Immunity]
playsound block.turtle_egg.break @s[tag=!Monster_Immunity]
tellraw @s[tag=Monster_Immunity] {"rawtext":[{"text":"§atag Monster_Immunity applied"}]}
tellraw @s[tag=!Monster_Immunity] {"rawtext":[{"text":"§ctag Monster_Immunity removed"}]}