#######################################################################################
#Next Player ID - run at @s
#######################################################################################
#Because this was implemented afterwards
#function dw623/debug/playerid
#######################################################################################
scoreboard players add @s PlayerIDs 0
execute as @s[scores={PlayerIDs=0}] run scoreboard players add "Player Count" PlayerIDs 1
scoreboard players operation @s[scores={PlayerIDs=0}] PlayerIDs = "Player Count" PlayerIDs
#######################################################################################
#End