# Like doing   x=abs(x-1) so 0-->1  and 1-->0
scoreboard players remove @s noCompass 1
scoreboard players set @s[scores={noCompass=..-1}] noCompass 1
scoreboard players set @s[scores={noCompass=2..}] noCompass 1
titleraw @s[scores={noCompass=0}]  actionbar {"rawtext":[{"text":"§6§lYour Actionbar-Commpass has been turned §aON"}]}
titleraw @s[scores={noCompass=1}]  actionbar {"rawtext":[{"text":"§6§lYour Actionbar-Commpass has been turned §cOFF"}]}