tellraw @s {"rawtext":[{"text":"§9Player ID: "},{"score":{"name":"@s","objective":"PlayerIDs"}}]}
#######################################################################################
tellraw @s {"rawtext":[{"text":"---------- Timers ----------"}]}
#######################################################################################
function dw623/scoreboards/update/time/afk_min
tellraw @s[scores={afk_min=1..}] {"rawtext":[{"text":"§cAFK Minutes This Session: "},{"score":{"name":"@s","objective":"afk_min"}}]}
function dw623/scoreboards/update/time/afk_total_min
tellraw @s[scores={afk_total_min=1..}] {"rawtext":[{"text":"§cAFK Minutes (T): "},{"score":{"name":"@s","objective":"afk_total_min"}}]}
#######################################################################################
function dw623/scoreboards/update/time/login_min
tellraw @s[scores={login_min=1..}] {"rawtext":[{"text":"§3Minutes Logged In (Session): "},{"score":{"name":"@s","objective":"login_min"}}]}
#######################################################################################
function dw623/scoreboards/update/time/active_min
tellraw @s[scores={active_min=1..}] {"rawtext":[{"text":"§dActive Minutes (Session): "},{"score":{"name":"@s","objective":"active_min"}}]}
function dw623/scoreboards/update/time/total_min
tellraw @s[scores={total_min=1..}] {"rawtext":[{"text":"Active Minutes (T): "},{"score":{"name":"@s","objective":"total_min"}}]}
#######################################################################################
function dw623/scoreboards/update/time/alive_min
tellraw @s {"rawtext":[{"text":"§eCurrent Survival Minutes: "},{"score":{"name":"@s","objective":"alive_min"}}]}
function dw623/scoreboards/update/time/alive_max_min
tellraw @s {"rawtext":[{"text":"§eMax Survival Record: "},{"score":{"name":"@s","objective":"alive_max_min"}}]}
#######################################################################################
#End