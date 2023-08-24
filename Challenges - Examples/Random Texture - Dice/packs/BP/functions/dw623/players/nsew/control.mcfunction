#NSEW Actionbar Display and Set AFK
#Runs on the 15t Line
#######################################################################################
#Scoreboard Setup
    scoreboard objectives add FacingRy dummy
    scoreboard objectives add Temp dummy
    scoreboard players reset * Temp 
    scoreboard players set Timer FacingRy 15
    scoreboard players add Ticks FacingRy 1
#######################################################################################
#Test for Time
    scoreboard players operation Ticks Temp = Ticks FacingRy
    scoreboard players operation Ticks Temp %= Timer FacingRy
    scoreboard players operation @a Temp = Ticks Temp
#######################################################################################
    execute @p[scores={Temp=0}] ~ ~ ~ scoreboard players set Ticks FacingRy 0
#Get
    execute @p[scores={Temp=0}] ~ ~ ~ function dw623/players/nsew/facing_ry_set
#Display
    execute @p[scores={Temp=0}] ~ ~ ~ function dw623/players/nsew/actionbar_display
#######################################################################################
#End