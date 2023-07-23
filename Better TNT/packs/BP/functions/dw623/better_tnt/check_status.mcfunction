##############################################################
scoreboard players set @s bt_status 1
#execute as @s[family=dw623_tnt] run tellraw @a[tag=Debug_Better_TNT] {"rawtext":[{"text":"§6Status: "},{"score":{"name":"@s","objective":"bt_status"}}]}

execute as @s[family=tnt_test      ] run scoreboard players operation @s bt_status += tnt_test       bt_status 
execute as @s[family=tnt_dud       ] run scoreboard players operation @s bt_status += tnt_dud        bt_status 
execute as @s[family=tnt_lite      ] run scoreboard players operation @s bt_status += tnt_lite       bt_status 
execute as @s[family=tnt_super     ] run scoreboard players operation @s bt_status += tnt_super      bt_status 
execute as @s[family=tnt_bomb      ] run scoreboard players operation @s bt_status += tnt_bomb       bt_status 
execute as @s[family=tnt_nuke      ] run scoreboard players operation @s bt_status += tnt_nuke       bt_status 
execute as @s[family=tnt_armageddon] run scoreboard players operation @s bt_status += tnt_armageddon bt_status 
#execute as @s[family=dw623_tnt] run tellraw @a[tag=Debug_Better_TNT] {"rawtext":[{"text":"§6Status: "},{"score":{"name":"@s","objective":"bt_status"}}]}

execute as @s[family=tnt_test      ] at @s unless entity @e[r=32,tag=tnt_guard]  run scoreboard players add @s bt_status 1 
execute as @s[family=tnt_dud       ] at @s unless entity @e[r=32,tag=tnt_guard]  run scoreboard players add @s bt_status 1 
execute as @s[family=tnt_lite      ] at @s unless entity @e[r=32,tag=tnt_guard]  run scoreboard players add @s bt_status 1 
execute as @s[family=tnt_super     ] at @s unless entity @e[r=32,tag=tnt_guard]  run scoreboard players add @s bt_status 1 
execute as @s[family=tnt_bomb      ] at @s unless entity @e[r=32,tag=tnt_guard]  run scoreboard players add @s bt_status 1 
execute as @s[family=tnt_nuke      ] at @s unless entity @e[r=64,tag=tnt_guard]  run scoreboard players add @s bt_status 1 
execute as @s[family=tnt_armageddon] at @s unless entity @e[r=128,tag=tnt_guard] run scoreboard players add @s bt_status 1 
##############################################################
# Despawn ALL invalid entities
#execute as @s[family=dw623_tnt,family=!new,scores={bt_status=..4}] run tellraw @a[tag=Debug_Better_TNT] {"rawtext":[{"text":"§6Reset Status: "},{"score":{"name":"@s","objective":"bt_status"}},{"text":" @ "},{"score":{"name":"timer","objective":"bt_status"}}]}
#execute as @s[family=dw623_tnt,scores={bt_status=..4}] run tellraw @a[tag=Debug_Better_TNT] {"rawtext":[{"text":"§6My bt_status=!5.., bye - timer: "},{"score":{"name":"timer","objective":"bt_status"}}]}
tag @s[family=dw623_tnt,scores={bt_status=..4}] add invalid_status
##############################################################
# End