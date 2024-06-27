#######################################################################################
#Ran by ticks.json
#Function Calls based on Number of Ticks
#######################################################################################
#Setup basic scoreboards in case no players    
    scoreboard objectives add number dummy     
    scoreboard objectives add ModCheck dummy 
#######################################################################################    
#Trying to see if world is empty
    scoreboard players set player_ctr number 0
    execute as @a run scoreboard players add player_ctr number 1    
    execute if score player_ctr number matches 0 run function dw623/players/none
#######################################################################################    
#Each tick - use @p so that if no one on - does not run
    execute if score player_ctr number matches 1.. run function dw623/ticks/t01 
#######################################################################################    
#   Rest moved into the highst multiple they can do , so less questions
#   
#   Divisible by 5
#   Divisible by 20
#   Divisible by 100
#
#######################################################################################    
#End