#######################################################################################    
#Display Scoreboard
#######################################################################################    
function dw623/scoreboards/update/time/alive_min
execute if entity @a[scores={alive_min=1..}] run scoreboard objectives setdisplay list alive_min
#######################################################################################    
#End