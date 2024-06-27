#######################################################################################    
#When a Player Logs in again
#######################################################################################    
#Need to reset after logging in
    execute as @a[tag=Player,scores={login_ticks=1}] run scoreboard players reset @s afk_ticks
    execute as @a[tag=Player,scores={login_ticks=1}] run scoreboard players set @s active_ticks 1

    execute as @a[tag=Player,scores={login_ticks=1}]  run me §6Welcome Back...!!!
    #scoreboard players random Welcome number 1 6
    #execute as @a[tag=Player,scores={login_ticks=1}] if score Welcome number matches 1 run me §6is back...
    #execute as @a[tag=Player,scores={login_ticks=1}] if score Welcome number matches 2 run me §6is ready for more...
    #execute as @a[tag=Player,scores={login_ticks=1}] if score Welcome number matches 3 run me §6is just in time...
    #execute as @a[tag=Player,scores={login_ticks=1,is_op=0,is_trusted=0}] run me is back...§6Welcome Back Water Drinker!
    #execute as @a[tag=Player,scores={login_ticks=1,is_op=0,is_trusted=1}] run me §6Welcome Back Trusted Water Drinker!
    #execute as @a[tag=Player,scores={login_ticks=1,is_op=1..}] run me §6Welcome Back Water Drinker Admin!
#######################################################################################    
    execute if score DisplayScoreboards game_settings matches 1 if entity @a[scores={login_ticks=1200..}] run function dw623/scoreboards/display/sidebar/time/login_min
#######################################################################################    
    function dw623/msg/whoami
#######################################################################################    
#End