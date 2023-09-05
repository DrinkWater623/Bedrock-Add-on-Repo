# Ran by ticks.json 
##############################################################
function better_tnt/addon_1_setup
# reset is called by setup if initialized=0
##############################################################
function better_tnt/addon_3_timer
##############################################################
# For Floating Items - before permissions - so perms can kill it if needed
execute as @e[type=item,tag=!bt_processed] run function better_tnt/summon_1
##############################################################
# Rest should be every tick
function better_tnt/tnt_permissions
##############################################################
# End