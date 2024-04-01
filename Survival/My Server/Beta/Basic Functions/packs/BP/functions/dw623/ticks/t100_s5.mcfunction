#######################################################################################
#Every 100 ticks = 5 second
#######################################################################################
    function dw623/scoreboards/update/time/afk_min
    titleraw @a[scores={noCompass=1,afk_min=1..},tag=is_afk] title {"rawtext":[{"text":"§cAFK: "},{"score":{"name":"*","objective":"afk_min"}},{"text":"m"}]}
#######################################################################################    
# Mod 300 = 15 seconds
    scoreboard players operation Ticks ModCheck = Ticks number
    scoreboard players operation Ticks ModCheck %= n300 number
    execute if score Ticks ModCheck matches 0 run  function dw623/ticks/t300_15s
#######################################################################################
#End