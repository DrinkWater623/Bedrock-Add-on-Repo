 me §ais no longer AFK
scoreboard players reset @s afk_ticks
execute unless entity @a[scores={afk_ticks=1..}] run scoreboard objectives setdisplay list 
execute if entity @a[scores={afk_ticks=1..}] run function dw623/scoreboards/display/list/time/afk_min