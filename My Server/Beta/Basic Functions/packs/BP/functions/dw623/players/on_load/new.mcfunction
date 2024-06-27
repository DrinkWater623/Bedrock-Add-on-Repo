#######################################################################################
#New Player Joined World - Every Tick can be called if No Player Tag
#######################################################################################
#Where we want it to be - 1st person in, Axe, has to run to it
    #setworldspawn x y z  <-- update here before running if you need to adjust
#######################################################################################
#New Player Actions
    execute as @a[tag=!Player] run  me §6has joined for the first time...  §aWelcome to DW's Survival Plus!
    tag @a[tag=!Player] add Player
#######################################################################################
#End