#Called every second - ticks=20
    tag @a[m=!c,tag=in_creative] remove in_creative 
    tag @a[m=!s,tag=in_survival] remove in_survival 
    tag @a[m=!a,tag=in_adventure] remove in_adventure 

    tag @a[m=c,tag=!in_creative] add in_creative 
    tag @a[m=s,tag=!in_survival] add in_survival 
    tag @a[m=a,tag=!in_adventure] add in_adventure 
    
    tag @a[scores={afk_ticks=1..},tag=!is_afk] add is_afk
    tag @a[scores={afk_ticks=0},tag=is_afk] remove is_afk

    execute as @a[tag=!is_op,scores={is_op=1}] run tag @s add is_op
    execute as @a[tag=is_op ,scores={is_op=0}] run tag @s remove is_op
    tag @a[tag=Illegal_Creative_Mode,scores={is_op=1}] remove Illegal_Creative_Mode
    
    execute as @a[tag=!is_trusted,scores={is_trusted=1..}] run tag @s add is_trusted
    execute as @a[tag=is_trusted ,scores={is_trusted=..0}] run tag @s remove is_trusted
