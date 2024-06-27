#######################################################################################    
#Display  Scoreboard  --  Note these are per session, do not need any-display
#######################################################################################
function dw623/scoreboards/update/time/active_min
execute if entity @a[scores={active_min=1..}] run scoreboard objectives setdisplay sidebar active_min
#######################################################################################    
#End