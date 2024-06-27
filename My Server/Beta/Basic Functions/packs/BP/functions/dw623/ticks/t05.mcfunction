#######################################################################################
#5 Ticks
#######################################################################################
    function dw623/protection/illegal
#######################################################################################
    #execute as @e[c=1,type=item] run function dw623/scoreboards/update/droppeditems
    #execute if entity @a[m=s] if entity @e[type=item] run function dw623/scoreboards/update/item_count/control

    #execute if entity @a[m=s,scores={weapon_mainhand=1..}] run 
    #execute if entity @e[type=item,tag=!newDroppedItem] run function dw623/scoreboards/update/item_count/new_control
    
#######################################################################################
#Now all the rest that is a multiple of 5 seconds
#######################################################################################    
#Mod 15 ticks 3/4 second
    #scoreboard players operation Ticks ModCheck = Ticks number
    #scoreboard players operation Ticks ModCheck %= n15 number
    #execute if score Ticks ModCheck matches 0 run  function dw623/ticks/t15
#######################################################################################    
#Mod 20 ticks - 1 second
    scoreboard players operation Ticks ModCheck = Ticks number
    scoreboard players operation Ticks ModCheck %= n20 number
    execute if score Ticks ModCheck matches 0 run  function dw623/ticks/t20_s1
#######################################################################################    
#Rest in inverval if highest divisor
#######################################################################################    
#End