#######################################################################################    
#Display  Scoreboard
#######################################################################################    
function dw623/scoreboards/update/time/login_min
execute if entity @a[scores={login_min=1..}] run scoreboard objectives setdisplay list login_min
#######################################################################################    
#End