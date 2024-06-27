#######################################################################################
    execute as @e run scoreboard players add "All Entities" entity_ctr 1
    execute as @a[family=player] run scoreboard players add "§6Players (Logged In)" entity_ctr 1
    execute as @e[family=mob] run scoreboard players add "All Mobs" entity_ctr 1
    execute as @e[family=monster]   run scoreboard players add "§cMonsters" entity_ctr 1
    execute as @e[family=mob,family=!monster] run scoreboard players add "§aFriendly Mobs" entity_ctr 1
    execute as @e[family=inanimate] run scoreboard players add "Inanimate Objects" entity_ctr 1
    execute as @e[family=!inanimate,type=item] run scoreboard players add "Floating Items" entity_ctr 1
    execute as @e[family=npc] run scoreboard players add "NPCs" entity_ctr 1
    execute as @e[family=bot] run scoreboard players add "Bots" entity_ctr 1
#######################################################################################
#End