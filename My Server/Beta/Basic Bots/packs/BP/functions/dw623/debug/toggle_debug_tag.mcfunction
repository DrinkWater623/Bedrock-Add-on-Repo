scoreboard players reset @s toggle 
scoreboard players set @s[scores={is_op=1..}] toggle 0
scoreboard players add @s[tag=Debug,scores={toggle=0}] toggle 1
tag @s[scores={toggle=0}] add Debug
tag @s[scores={toggle=1}] remove Debug
scoreboard players reset @s toggle 
playsound random.anvil_use @s[tag=Debug]
playsound block.turtle_egg.break @s[tag=!Debug]
tellraw @s[tag=Debug] {"rawtext":[{"text":"§atag Debug applied"}]}
tellraw @s[tag=!Debug] {"rawtext":[{"text":"§ctag Debug removed"}]}