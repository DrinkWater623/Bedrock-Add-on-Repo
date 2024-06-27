#######################################################################################    
#List AFK Scoreboard
#######################################################################################
function dw623/scoreboards/update/time/afk_min
execute if entity @a[scores={afk_min=1..}] run scoreboard objectives setdisplay list afk_min
#######################################################################################
#End