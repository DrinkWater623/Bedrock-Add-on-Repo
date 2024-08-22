## All logs are available via there log name
#{
    global_trees
        .map(x => 'execute if block ~ ~ ~ minecraft:' + x.log_name + '_' + x.log_sfx + ' run tellraw @a[r=5] {"rawtext": [{"text":"mcfunction / minecraft:' + x.log_name + '_' + x.log_sfx + '"}]}')
        .join('\n')
}
## End								