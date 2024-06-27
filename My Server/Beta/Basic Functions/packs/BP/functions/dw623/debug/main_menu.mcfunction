#I put this back in the entity
scoreboard players add @s is_op 0
scoreboard players reset @s toggle
scoreboard players add @s toggle 0
scoreboard players add @s[m=c] toggle 1
gamemode s @s[m=c]
dialogue open @e[c=1,family=god_bot] @s[scores={is_op=1..}] menu_admin
dialogue open @e[c=1,family=god_bot] @s[scores={is_op=0,is_trusted=1..}] menu_player_trusted
dialogue open @e[c=1,family=god_bot] @s[scores={is_op=0,is_trusted=..0}] menu_player
gamemode c @s[scores={toggle=1}]