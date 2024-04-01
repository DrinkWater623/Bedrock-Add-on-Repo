# @ 3 min now for stats, but messates start at 5 min - see msg/afk_msgs.mcfunction
scoreboard players set @s afk_ticks 3600
scoreboard players remove @s[m=!c,scores={total_ticks=3601..}] total_ticks 3600
scoreboard players remove @s[m=!c,scores={alive_ticks=3601..}] alive_ticks 3600
# Letting this reverse down while AFK to zero
# scoreboard players remove @s[scores={active_ticks=3601..}] active_ticks 3600
# New Rpt routine outside
# me §cis AFK (5m)
function dw623/scoreboards/display/list/time/afk_min