scoreboard players reset @s toggle 
scoreboard players set @s[scores={is_op=1..}] toggle 0
scoreboard players add @s[tag=Undead_Immunity,scores={toggle=0}] toggle 1
tag @s[scores={toggle=0}] add Undead_Immunity
tag @s[scores={toggle=1}] remove Undead_Immunity
scoreboard players reset @s toggle 
playsound random.anvil_use @s[tag=Undead_Immunity]
playsound block.turtle_egg.break @s[tag=!Undead_Immunity]
tellraw @s[tag=Undead_Immunity] {"rawtext":[{"text":"§atag Undead_Immunity applied"}]}
tellraw @s[tag=!Undead_Immunity] {"rawtext":[{"text":"§ctag Undead_Immunity removed"}]}