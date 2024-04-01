tell @a[tag=Debug] is_loaded
####################################################################################### 
#Settings and Messages for Players just logging in
#######################################################################################
# Scoreboard Stuff 
   #function dw623/scoreboards/setup/create Not needed to do all this, just need the player one
   function dw623/scoreboards/setup/players_init
####################################################################################### 
#Returning   
   execute as @a[tag=Player,scores={login_ticks=1}] run function dw623/players/on_load/returning
####################################################################################### 
#New Players
   execute as @a[tag=!Player] run function dw623/players/on_load/new
#######################################################################################
#End