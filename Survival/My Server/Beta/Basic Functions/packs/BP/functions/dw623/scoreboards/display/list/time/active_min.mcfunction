#######################################################################################    
#Display Scoreboard
#######################################################################################    
function dw623/scoreboards/update/time/active_min
execute if entity @a[scores={active_min=1..}] run scoreboard objectives setdisplay list active_min
#######################################################################################    
#End