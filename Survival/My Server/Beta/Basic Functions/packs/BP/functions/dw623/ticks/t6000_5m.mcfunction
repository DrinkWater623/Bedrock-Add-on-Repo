#######################################################################################    
#Actions to run every 6000 ticks = 5 min
#######################################################################################    
execute if score CommandBlockOutput game_settings matches 1  run tell  @a[scores={is_op=1}] Reminder CommandBlockOutput is on - remember to turn off - can use the Remote
execute if score SendCommandFeedBack game_settings matches 1 run tell  @a[scores={is_op=1}] Reminder SendCommandFeedBack is on - remember to turn off - can use the Remotes
#######################################################################################    
#Hunger Help
    effect @a[m=s] saturation 1 1 true
#######################################################################################    
#Mod 24000/mc_day
    #scoreboard players operation Ticks ModCheck = Ticks number
    #scoreboard players operation Ticks ModCheck %= mc_day number
    #execute if score Ticks ModCheck matches 0 run  function dw623/ticks/mc_day
#######################################################################################    
#End