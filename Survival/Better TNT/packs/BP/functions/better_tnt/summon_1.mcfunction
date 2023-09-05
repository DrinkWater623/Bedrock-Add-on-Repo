# Is the TNT allowed to explode in the current location xyz?
##############################################################
tag @s[type=item] add bt_processed
execute if score tnt_test        bt_status matches 3 unless entity @e[tag=tnt_guard,r=16]  as @s[type=item,name="§aTest TNT"]       run function better_tnt/summon_2
execute if score tnt_dud         bt_status matches 3 unless entity @e[tag=tnt_guard,r=16]  as @s[type=item,name="TNT Dud§r"]        run function better_tnt/summon_2
execute if score tnt_lite        bt_status matches 3 unless entity @e[tag=tnt_guard,r=32]  as @s[type=item,name="TNT Lite§r"]       run function better_tnt/summon_2 
execute if score tnt_super       bt_status matches 3 unless entity @e[tag=tnt_guard,r=32]  as @s[type=item,name="Super TNT§r"]      run function better_tnt/summon_2 
execute if score tnt_bomb        bt_status matches 3 unless entity @e[tag=tnt_guard,r=64]  as @s[type=item,name="TNT Bomb§r"]       run function better_tnt/summon_2 
execute if score tnt_nuke        bt_status matches 3 unless entity @e[tag=tnt_guard,r=64]  as @s[type=item,name="TNT Nuke§r"]       run function better_tnt/summon_2 
execute if score tnt_armageddon  bt_status matches 3 unless entity @e[tag=tnt_guard,r=128] as @s[type=item,name="TNT Armageddon§r"] run function better_tnt/summon_2 
##############################################################
# End