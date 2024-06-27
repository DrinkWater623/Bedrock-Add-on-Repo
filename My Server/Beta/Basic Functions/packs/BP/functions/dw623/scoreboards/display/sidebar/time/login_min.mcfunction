#######################################################################################    
#Display  Scoreboard  --  Note these are per session, do not need any-display
#######################################################################################    
function dw623/scoreboards/update/time/login_min
execute if entity @a[scores={login_min=1..}] run scoreboard objectives setdisplay sidebar login_min
#######################################################################################    
#End