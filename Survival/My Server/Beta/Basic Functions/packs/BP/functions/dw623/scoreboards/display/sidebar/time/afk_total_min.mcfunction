#######################################################################################    
#Display total_min Scoreboard
#This is not called on random, but by choice, so no display if no one is AFK
#######################################################################################
function dw623/scoreboards/update/time/afk_total_min
execute if entity @a[scores={afk_total_min=1..}] run scoreboard objectives setdisplay sidebar afk_total_min
#######################################################################################    
#End