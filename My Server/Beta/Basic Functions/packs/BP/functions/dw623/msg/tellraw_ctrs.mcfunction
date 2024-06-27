#######################################################################################
tellraw @s {"rawtext":[{"text":"§9Player ID: "},{"score":{"name":"@s","objective":"PlayerIDs"}}]}
tellraw @s {"rawtext":[{"text":"---------- Counters ----------"}]}
#######################################################################################
#######################################################################################
scoreboard players add @s death_ctr 0
scoreboard players add @s kill_ctr 0
tellraw @s {"rawtext":[{"text":"§cDeaths: "},{"score":{"name":"@s","objective":"death_ctr"}}]}
tellraw @s {"rawtext":[{"text":"§4Kills: "},{"score":{"name":"@s","objective":"kill_ctr"}}]}
#######################################################################################
#End