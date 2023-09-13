## Debug
#{
    global_wood_types
        .map(x => 'execute if block ~ ~ ~ minecraft:' + x.wood_name + '_' + x.log_sfx + ' run title @p[tag=debug] title ' + x.wood_name + ' r=7')
        .join('\n')
}
## Start
#{
    global_wood_types
        .map(x => 'execute if block ~ ~ ~ minecraft:' + x.wood_name + '_' + x.log_sfx + ' run summon dw623:tree_minion_' + x.wood_name + '_7 ~ ~ ~')
        .join('\n')
}
## Stripped
#{
    global_wood_types
        .map(x => 'execute if block ~ ~ ~ minecraft:stripped_' + x.wood_name + '_' + x.log_sfx + ' run summon dw623:tree_minion_' + x.wood_name + '_7 ~ ~ ~')
        .join('\n')
}
