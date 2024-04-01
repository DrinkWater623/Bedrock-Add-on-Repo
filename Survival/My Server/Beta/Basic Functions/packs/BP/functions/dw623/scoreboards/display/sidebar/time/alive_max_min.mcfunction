#######################################################################################    
#Display total_min Scoreboard
#######################################################################################
function dw623/scoreboards/update/time/alive_max_min
execute if entity @a[scores={alive_max_min=1..}] run scoreboard objectives setdisplay sidebar alive_max_min
#######################################################################################    
#End