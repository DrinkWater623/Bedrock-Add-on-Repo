#######################################################################################    
#Sidebar Display changes at 1200 ticks as well as list
#tell @a[tag=Debug] sidebar/random 
#######################################################################################    
#Get Random Number
    scoreboard players random Display number 1 7
#######################################################################################    
    execute if score Display number matches 1 if entity @a[scores={total_ticks=1200..}]     run function dw623/scoreboards/display/sidebar/time/total_min
    execute if score Display number matches 1 unless entity @a[scores={total_ticks=1200..}] run scoreboard players set Display number 0

    execute if score Display number matches 2 if entity @a[scores={login_ticks=1200..}]     run function dw623/scoreboards/display/sidebar/time/login_min
    execute if score Display number matches 2 unless entity @a[scores={login_ticks=1200..}] run scoreboard players set Display number 0

    execute if score Display number matches 3 if entity @a[scores={active_ticks=1200..}]    run function dw623/scoreboards/display/sidebar/time/active_min
    execute if score Display number matches 3 unless entity @a[scores={active_ticks=1200..}] run scoreboard players set Display number 0

    execute if score Display number matches 4 if entity @a[scores={alive_ticks=1200..}]    run function dw623/scoreboards/display/sidebar/time/alive_min
    execute if score Display number matches 4 unless entity @a[scores={alive_ticks=1200..}] run scoreboard players set Display number 0

    execute if score Display number matches 5 if entity @a[scores={alive_max_ticks=1200..}] run function dw623/scoreboards/display/sidebar/time/alive_max
    execute if score Display number matches 5 unless entity @a[scores={alive_max_ticks=1200..}] run scoreboard players set Display number 0

    execute if score Display number matches 6 if entity @a[scores={death_ctr=1..}]          run function dw623/scoreboards/display/sidebar/ctr/death_ctr
    execute if score Display number matches 6 unless entity @a[scores={death_ctr=1..}] run scoreboard players set Display number 0
    #Add Kill ctr
    execute if score Display number matches 7 if entity @a[scores={kill_ctr=1..}]          run function dw623/scoreboards/display/sidebar/ctr/kill_ctr
    execute if score Display number matches 7 unless entity @a[scores={kill_ctr=1..}] run scoreboard players set Display number 0

    #Did not qualify
    execute if score Display number matches 0 run function dw623/scoreboards/display/sidebar/time/total_min

#######################################################################################    
#AFK Trumps on List 3+
    execute if entity @a[scores={afk_ticks=1200..}] run function dw623/scoreboards/display/list/time/afk_min   
#End