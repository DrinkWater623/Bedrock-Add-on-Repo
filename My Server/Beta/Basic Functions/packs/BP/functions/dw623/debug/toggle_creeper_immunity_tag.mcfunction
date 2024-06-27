scoreboard players reset @s toggle 
scoreboard players set @s[scores={is_op=1..}] toggle 0
scoreboard players add @s[tag=Creeper_Immunity,scores={toggle=0}] toggle 1
tag @s[scores={toggle=0}] add Creeper_Immunity
tag @s[scores={toggle=1}] remove Creeper_Immunity
scoreboard players reset @s toggle 
playsound random.anvil_use @s[tag=Creeper_Immunity]
playsound block.turtle_egg.break @s[tag=!Creeper_Immunity]
tellraw @s[tag=Creeper_Immunity] {"rawtext":[{"text":"§atag Creeper_Immunity applied"}]}
tellraw @s[tag=!Creeper_Immunity] {"rawtext":[{"text":"§ctag Creeper_Immunity removed"}]}