#######################################################################################
#Every Tick
#######################################################################################    
    scoreboard players add Ticks number 1
#######################################################################################    
#Reset Time if over....???
    scoreboard players operation Ticks ModCheck = Ticks number
    scoreboard players operation Ticks ModCheck %= Ticks_Max number
    execute if score Ticks ModCheck matches 0 run scoreboard players set Ticks number 1
#######################################################################################    
#New Tick=1
    #This will catch 1st time world is loaded and every tick reset
    execute if score Ticks number matches 1 run function dw623/scoreboards/setup/create
#######################################################################################    
    #execute as @e run scoreboard players add entity_ctr number 1 
#######################################################################################    
# Cause I need it on when I need it on    
    execute if score SendCommandFeedBack game_settings matches 1 run gamerule sendcommandfeedBack true
#######################################################################################    
# All the tick scoreboards for the players
    function dw623/scoreboards/update/time/sb_players_ticks
    # If just logged on    
    execute if entity @a[scores={login_ticks=1}] run function dw623/players/on_load/is_loaded
#######################################################################################    
# Mod 5 ticks 1/4 second
    scoreboard players operation Ticks ModCheck = Ticks number
    scoreboard players operation Ticks ModCheck %= n5 number
    execute if score Ticks ModCheck matches 0 run  function dw623/ticks/t05
#######################################################################################    
# Custom
    scoreboard players operation Ticks ModCheck = Ticks number
    scoreboard players operation Ticks ModCheck %= CompassInterval game_settings
    execute if score Ticks ModCheck matches 0 as @a[scores={noCompass=0},tag=!is_afk] run function dw623/compass/display
    execute if score Ticks ModCheck matches 0 as @a[scores={noCompass=0},tag=is_afk]  run function dw623/compass/display_afk    
    #execute if score Ticks ModCheck matches 0 as @a[scores={noCompass=1,afk_min=1..},tag=is_afk] run titleraw @s title {"rawtext":[{"text":"§cAFK: "},{"score":{"name":"@s","objective":"afk_min"}},{"text":"m"}]}
#######################################################################################    
#   Rest moved into the highst multiple they can do , so less questions
#   
#   Divisible by 5
#   Divisible by 20
#   Divisible by 100
#
#######################################################################################    
#End