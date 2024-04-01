#Show anyDisplay Scoreboard
    scoreboard players set "§8xoxoxoxoxoxoxoxox" anyDisplay 0
    execute if entity @a[scores={anyDisplay=!0}] run scoreboard objectives setdisplay sidebar anyDisplay
