#######################################################################################
#Give the Player their info   
#######################################################################################
tellraw @s {"rawtext":[{"text":"\n§bYour Stats: §aPlayer ID: "},{"score":{"name":"@s","objective":"PlayerIDs"}}]}
#######################################################################################
tellraw @s[scores={is_op=1..}] {"rawtext":[{"text":"§bPlayer Level: §aAdmin"}]}
tellraw @s[scores={is_op=0,is_trusted=1}] {"rawtext":[{"text":"§bPlayer Level: §gTrusted"}]}
tellraw @s[scores={is_op=0,is_trusted=0,is_banned=0}] {"rawtext":[{"text":"§bPlayer Level: §eRegular"}]}
tellraw @s[scores={is_op=0,is_trusted=0,is_banned=1}] {"rawtext":[{"text":"§bPlayer Level: §cBanned"}]}
#######################################################################################
function dw623/scoreboards/update/time/total_min
tellraw @s[scores={total_min=1..}] {"rawtext":[{"text":"Active Minutes (T): "},{"score":{"name":"@s","objective":"total_min"}}]}
#######################################################################################
scoreboard players add @s death_ctr 0
scoreboard players add @s kill_ctr 0
tellraw @s {"rawtext":[{"text":"§cDeaths: "},{"score":{"name":"@s","objective":"death_ctr"}}]}
tellraw @s {"rawtext":[{"text":"§4Kills: "},{"score":{"name":"@s","objective":"kill_ctr"}}]}
#Add Kills
#######################################################################################
function dw623/scoreboards/update/time/alive_min
tellraw @s {"rawtext":[{"text":"§eSurvival Minutes: "},{"score":{"name":"@s","objective":"alive_min"}}]}
function dw623/scoreboards/update/time/alive_max_min
tellraw @s {"rawtext":[{"text":"§aSurvival Minutes (Max): "},{"score":{"name":"@s","objective":"alive_max_min"}}]}
#######################################################################################
tellraw @s[m=c] {"rawtext":[{"text":"§bCreative Mode: §aON "}]}
tellraw @s[m=s,scores={is_op=1}] {"rawtext":[{"text":"§bCreative Mode: §cOFF"}]}
tellraw @s[tag=Monster_Immunity] {"rawtext":[{"text":"§6Monster Immunity: §aON "}]}
tellraw @s[tag=Debug] {"rawtext":[{"text":"§cDebug: §aON "}]}
tellraw @s[tag=DebugMax] {"rawtext":[{"text":"§4DebugMax: §aON "}]}
#######################################################################################
#End