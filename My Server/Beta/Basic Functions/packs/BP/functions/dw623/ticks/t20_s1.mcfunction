#######################################################################################
#Every 20 ticks = 1 second
#######################################################################################    
    function dw623/players/tags_set
#######################################################################################
    execute if score Difficulty game_settings matches 1.. run function dw623/protection/monsters
#######################################################################################
#Rest that is a multiple of 20 seconds
#######################################################################################    
#Mod 100 ticks - 5 second
    scoreboard players operation Ticks ModCheck = Ticks number
    scoreboard players operation Ticks ModCheck %= n100 number
    execute if score Ticks ModCheck matches 0 run  function dw623/ticks/t100_s5
#######################################################################################
#End