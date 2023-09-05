# Where is the dispenser
##############################################################
# Priority is normal usage with space a few blocks in front of the dispenser
execute as @s at @s run execute if block ~    ~0.5  ~     dispenser if block ~     ~-1.5 ~     air run tag @s add dispenser_y_n
execute as @s at @s run execute if block ~    ~-0.5 ~     dispenser if block ~     ~1.5  ~     air run tag @s add dispenser_y_p
execute as @s at @s run execute if block ~    ~     ~0.5  dispenser if block ~     ~     ~-1.5 air run tag @s add dispenser_z
execute as @s at @s run execute if block ~    ~     ~-0.5 dispenser if block ~     ~     ~1.5  air run tag @s add dispenser_z
execute as @s at @s run execute if block ~0.5  ~    ~     dispenser if block ~-1.5 ~     ~     air run tag @s add dispenser_x
execute as @s at @s run execute if block ~-0.5 ~    ~     dispenser if block ~1.5  ~     ~     air run tag @s add dispenser_x
execute as @s[tag=dispenser_y_n] run tag @s add dispenser_found
execute as @s[tag=dispenser_y_p] run tag @s add dispenser_found
execute as @s[tag=dispenser_z]   run tag @s add dispenser_found
execute as @s[tag=dispenser_x]   run tag @s add dispenser_found
##############################################################
# Regardless of air block, put test Y last
execute as @s[tag=!dispenser_found] at @s run execute if block ~    ~     ~0.5  dispenser run tag @s add dispenser_z
execute as @s[tag=!dispenser_found] at @s run execute if block ~    ~     ~-0.5 dispenser run tag @s add dispenser_z
execute as @s[tag=!dispenser_found] at @s run execute if block ~0.5  ~    ~     dispenser run tag @s add dispenser_x
execute as @s[tag=!dispenser_found] at @s run execute if block ~-0.5 ~    ~     dispenser run tag @s add dispenser_x
execute as @s[tag=!dispenser_found] at @s run execute if block ~    ~0.5  ~     dispenser run tag @s add dispenser_y_n
execute as @s[tag=!dispenser_found] at @s run execute if block ~    ~-0.5 ~     dispenser run tag @s add dispenser_y_p
execute as @s[tag=!dispenser_found,tag=dispenser_y_n] run tag @s add dispenser_found
execute as @s[tag=!dispenser_found,tag=dispenser_y_p] run tag @s add dispenser_found
execute as @s[tag=!dispenser_found,tag=dispenser_z] run tag @s add dispenser_found
execute as @s[tag=!dispenser_found,tag=dispenser_x] run tag @s add dispenser_found
##############################################################
execute as @s[tag=dispenser_found] run function better_tnt/summon_3
##############################################################
# End