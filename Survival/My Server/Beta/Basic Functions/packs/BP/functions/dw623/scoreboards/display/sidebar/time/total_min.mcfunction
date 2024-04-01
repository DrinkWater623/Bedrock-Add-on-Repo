#######################################################################################    
#Display total_min Scoreboard
#######################################################################################
function dw623/scoreboards/update/time/total_min
execute if entity @a[scores={total_min=1..}] run scoreboard objectives setdisplay sidebar total_min
#######################################################################################
#End