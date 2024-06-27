    scoreboard players operation toggle toggle = DisplayScoreboards game_settings
    execute if score toggle toggle matches ..0 run scoreboard players set DisplayScoreboards game_settings 1
    execute if score toggle toggle matches 1.. run scoreboard players set DisplayScoreboards game_settings 0
    function  dw623/run/game_settings_enforce
#Msg
    execute if score DisplayScoreboards game_settings matches 0 run tellraw @a {"rawtext": [{"text":"§6Random Sidebars have been turned §cOFF§r.\nYou can use the Bot Menu to turn it back §aON"}]}
    execute if score DisplayScoreboards game_settings matches 1 run tellraw @a {"rawtext": [{"text":"§6Random Sidebars have been turned §aON§r.\nYou can use the Bot Menu to turn it back §cOFF"}]}
