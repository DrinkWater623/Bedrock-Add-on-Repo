#######################################################################################        
#Set Scoreboard Player Defaults
#######################################################################################        
#Player Counters
    scoreboard players add @a PlayerIDs 0
    scoreboard players add @a is_op 0
    scoreboard players add @a is_banned 0
    scoreboard players add @a is_builder 0
    scoreboard players add @a is_trusted 0
#######################################################################################        
    scoreboard players add @a active_min 0       
    scoreboard players add @a active_ticks 0       
    scoreboard players add @a afk_ticks 0
    scoreboard players add @a afk_ticks 0
    scoreboard players add @a alive_ticks 0    
    scoreboard players add @a alive_max_ticks 0    
    scoreboard players add @a death_ctr 0
    scoreboard players add @a login_min 0
    scoreboard players add @a login_ticks 0
    scoreboard players add @a noCompass 0
    scoreboard players add @a total_ticks 0    
#######################################################################################        
#Player Tags and IDs
    execute as @a[scores={PlayerIDs=0}] run function dw623/scoreboards/setup/playerid_set
#######################################################################################        
# All the scoreboard xfers to new one
#   function dw623/scoreboards/update/xfer/xfer_control
#######################################################################################        
#Fix Bits
    scoreboard players set @a[scores={is_trusted=..-2}] is_trusted -1
    scoreboard players set @a[scores={is_trusted=2..}]  is_trusted 1

    scoreboard players set @a[scores={is_banned=..-1}]  is_banned 0
    scoreboard players set @a[scores={is_banned=2..}]   is_banned 1    

    scoreboard players set @a[scores={is_op=1..}]  is_trusted 1
    scoreboard players set @a[scores={is_op=1..}]  is_builder 1
    scoreboard players set @a[scores={is_op=1..}]  is_banned 0
    scoreboard players set @a[scores={is_banned=1}] is_trusted -1
#######################################################################################        
    function dw623/players/tags_set
#######################################################################################

#End