#######################################################################################    
#Display  Scoreboard  --  Note these are per session, do not need any-display
#######################################################################################
function dw623/scoreboards/update/time/afk_min
execute if entity @a[scores={afk_min=1..}] run scoreboard objectives setdisplay sidebar afk_min
#######################################################################################    
#End