#Call this as @s for each Wither
#just added to get rid of error of it not being added in mcfunctions.  this is added in dialogue and it does not know
tag @e[type=item,family=inanimate,name=is_banned] add KillMeNow

scoreboard players add @s wither_settings 1
execute if score @s wither_settings >= WitherLifeLength wither_settings run tag @s add KillMeNow
scoreboard players reset @s[tag=KillMeNow] wither_settings
execute as @s[tag=KillMeNow] run me §4is dying per the timer
kill  @s[tag=KillMeNow]
#execute if entity @e[family=dw623_wither] run scoreboard objectives setdisplay sidebar wither_settings