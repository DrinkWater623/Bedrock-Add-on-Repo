## Log Group 1
execute if block ~ ~-1 ~ minecraft:log  run tellraw @a[r=5] {"rawtext": [{"text":"mcfunction / minecraft:log"}]}
#{
    global_log1
        .map(x => 'execute if block ~ ~-1 ~  minecraft:log ["old_log_type" = "' + x.log1_name + '"] run tellraw @a[r=5] {"rawtext": [{"text":"mcfunction / minecraft:log old_log_type=' + x.log1_name + '"}]}')
        .join('\n')
}
## Log Group 2
execute if block ~ ~-1 ~ minecraft:log2 run tellraw @a[r=5] {"rawtext": [{"text":"mcfunction / minecraft:log2"}]}
#{
    global_log2
        .map(x => 'execute if block ~ ~-1 ~  minecraft:log2 ["new_log_type" = "' + x.log2_name + '"] run tellraw @a[r=5] {"rawtext": [{"text":"mcfunction / minecraft:log2 new_log_type=' + x.log2_name + '"}]}')
        .join('\n')
}
## All logs are available via there log name
#{
    global_trees
        .map(x => 'execute if block ~ ~-1 ~ minecraft:' + x.log_name + '_' + x.log_sfx + ' run tellraw @a[r=5] {"rawtext": [{"text":"mcfunction / minecraft:' + x.log_name + '_' + x.log_sfx + '"}]}')
        .join('\n')
}
## End								