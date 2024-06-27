## say I see dead people
##execute if score KeepInventory game_settings matches 0 run execute align xz positioned ~0.5 ~ ~0.5 run summon dw623:death_bot ~ ~ ~ 0 0 ev:is_first_set "Death Container"
scoreboard players add @s death_ctr 1
scoreboard players operation @s alive_max_ticks > @s alive_ticks
scoreboard players set @s alive_ticks 0
scoreboard players set @s alive_min 0
tellraw @a {"rawtext":[{"text":"§gPlayer's Death Count: "},{"score":{"name":"@s","objective":"death_ctr"}}]}
execute if score DisplayScoreboards game_settings matches 1 run function dw623/scoreboards/display/sidebar/ctr/death_ctr
execute if score DisplayScoreboards game_settings matches 0 run function dw623/scoreboards/display/list/ctr/death_ctr