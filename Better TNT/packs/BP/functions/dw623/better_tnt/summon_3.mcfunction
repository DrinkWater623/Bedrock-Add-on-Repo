# Summon with offset per where the dispenser is - then tighten that window
tag @s[type=item] add bt_processed
##############################################################
# Dispenser Above Item
execute as @s[type=item,tag=dispenser_y_n,name="§aTest TNT"]       at @s run summon dw623:tnt_test_entity       ^ ^-0.25 ^ 0 0 ev:via_dispenser
execute as @s[type=item,tag=dispenser_y_n,name="TNT Dud§r"]        at @s run summon dw623:tnt_dud_entity        ^ ^-0.25 ^ 0 0 ev:via_dispenser
execute as @s[type=item,tag=dispenser_y_n,name="TNT Lite§r"]       at @s run summon dw623:tnt_lite_entity       ^ ^-0.25 ^ 0 0 ev:via_dispenser 
execute as @s[type=item,tag=dispenser_y_n,name="Super TNT§r"]      at @s run summon dw623:tnt_super_entity      ^ ^-0.25 ^ 0 0 ev:via_dispenser 
execute as @s[type=item,tag=dispenser_y_n,name="TNT Bomb§r"]       at @s run summon dw623:tnt_bomb_entity       ^ ^-0.25 ^ 0 0 ev:via_dispenser 
execute as @s[type=item,tag=dispenser_y_n,name="TNT Nuke§r"]       at @s run summon dw623:tnt_nuke_entity       ^ ^-0.25 ^ 0 0 ev:via_dispenser 
execute as @s[type=item,tag=dispenser_y_n,name="TNT Armageddon§r"] at @s run summon dw623:tnt_armageddon_entity ^ ^-0.25 ^ 0 0 ev:via_dispenser 
##############################################################
# Dispenser Below Item (but why... LOL)
execute as @s[type=item,tag=dispenser_y_p,name="§aTest TNT"]       at @s run summon dw623:tnt_test_entity       ^ ^0.5 ^ 0 0 ev:via_dispenser
execute as @s[type=item,tag=dispenser_y_p,name="TNT Dud§r"]        at @s run summon dw623:tnt_dud_entity        ^ ^0.5 ^ 0 0 ev:via_dispenser
execute as @s[type=item,tag=dispenser_y_p,name="TNT Lite§r"]       at @s run summon dw623:tnt_lite_entity       ^ ^0.5 ^ 0 0 ev:via_dispenser 
execute as @s[type=item,tag=dispenser_y_p,name="Super TNT§r"]      at @s run summon dw623:tnt_super_entity      ^ ^0.5 ^ 0 0 ev:via_dispenser 
execute as @s[type=item,tag=dispenser_y_p,name="TNT Bomb§r"]       at @s run summon dw623:tnt_bomb_entity       ^ ^0.5 ^ 0 0 ev:via_dispenser 
execute as @s[type=item,tag=dispenser_y_p,name="TNT Nuke§r"]       at @s run summon dw623:tnt_nuke_entity       ^ ^0.5 ^ 0 0 ev:via_dispenser 
execute as @s[type=item,tag=dispenser_y_p,name="TNT Armageddon§r"] at @s run summon dw623:tnt_armageddon_entity ^ ^0.5 ^ 0 0 ev:via_dispenser 
##############################################################
# Dispenser West/East
execute as @s[type=item,tag=dispenser_x,name="§aTest TNT"]       at @s run summon dw623:tnt_test_entity       ^ ^0.25 ^ 0 0 ev:via_dispenser
execute as @s[type=item,tag=dispenser_x,name="TNT Dud§r"]        at @s run summon dw623:tnt_dud_entity        ^ ^0.25 ^ 0 0 ev:via_dispenser
execute as @s[type=item,tag=dispenser_x,name="TNT Lite§r"]       at @s run summon dw623:tnt_lite_entity       ^ ^0.25 ^ 0 0 ev:via_dispenser 
execute as @s[type=item,tag=dispenser_x,name="Super TNT§r"]      at @s run summon dw623:tnt_super_entity      ^ ^0.25 ^ 0 0 ev:via_dispenser 
execute as @s[type=item,tag=dispenser_x,name="TNT Bomb§r"]       at @s run summon dw623:tnt_bomb_entity       ^ ^0.25 ^ 0 0 ev:via_dispenser 
execute as @s[type=item,tag=dispenser_x,name="TNT Nuke§r"]       at @s run summon dw623:tnt_nuke_entity       ^ ^0.25 ^ 0 0 ev:via_dispenser 
execute as @s[type=item,tag=dispenser_x,name="TNT Armageddon§r"] at @s run summon dw623:tnt_armageddon_entity ^ ^0.25 ^ 0 0 ev:via_dispenser 
##############################################################
# Dispenser North/South
execute as @s[type=item,tag=dispenser_z,name="§aTest TNT"]       at @s run summon dw623:tnt_test_entity       ^ ^0.25 ^ 0 0 ev:via_dispenser
execute as @s[type=item,tag=dispenser_z,name="TNT Dud§r"]        at @s run summon dw623:tnt_dud_entity        ^ ^0.25 ^ 0 0 ev:via_dispenser
execute as @s[type=item,tag=dispenser_z,name="TNT Lite§r"]       at @s run summon dw623:tnt_lite_entity       ^ ^0.25 ^ 0 0 ev:via_dispenser 
execute as @s[type=item,tag=dispenser_z,name="Super TNT§r"]      at @s run summon dw623:tnt_super_entity      ^ ^0.25 ^ 0 0 ev:via_dispenser 
execute as @s[type=item,tag=dispenser_z,name="TNT Bomb§r"]       at @s run summon dw623:tnt_bomb_entity       ^ ^0.25 ^ 0 0 ev:via_dispenser 
execute as @s[type=item,tag=dispenser_z,name="TNT Nuke§r"]       at @s run summon dw623:tnt_nuke_entity       ^ ^0.25 ^ 0 0 ev:via_dispenser 
execute as @s[type=item,tag=dispenser_z,name="TNT Armageddon§r"] at @s run summon dw623:tnt_armageddon_entity ^ ^0.25 ^ 0 0 ev:via_dispenser 
##############################################################
# tag friend
execute as @s[type=item,tag=dispenser_z,name="§aTest TNT"]       at @s run tag @e[c=1,family="§aTest TNT"]       add dispenser
execute as @s[type=item,tag=dispenser_z,name="TNT Dud§r"]        at @s run tag @e[c=1,family="TNT Dud§r"]        add dispenser
execute as @s[type=item,tag=dispenser_z,name="TNT Lite§r"]       at @s run tag @e[c=1,family="TNT Lite§r"]       add dispenser 
execute as @s[type=item,tag=dispenser_z,name="Super TNT§r"]      at @s run tag @e[c=1,family="Super TNT§r"]      add dispenser 
execute as @s[type=item,tag=dispenser_z,name="TNT Bomb§r"]       at @s run tag @e[c=1,family="TNT Bomb§r"]       add dispenser 
execute as @s[type=item,tag=dispenser_z,name="TNT Nuke§r"]       at @s run tag @e[c=1,family="TNT Nuke§r"]       add dispenser 
execute as @s[type=item,tag=dispenser_z,name="TNT Armageddon§r"] at @s run tag @e[c=1,family="TNT Armageddon§r"] add dispenser 
##############################################################
# Despawn Item (tp then kill so no smoke... unless smoke is good particle effect)
tp @s ~ 300 ~
kill @s
##############################################################
# End