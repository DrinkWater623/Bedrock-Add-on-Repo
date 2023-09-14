## Debug
#{
    global_wood_types
        .map(x => 'execute if block ~ ~ ~ minecraft:' + x.wood_name + '_' + x.log_sfx + ' run title @p[tag=debug] title Any Tree r=15 ~ ~ ~ 0 0 ev:silk_touch_activate')
        .join('\n')
}
## Start
#{
    global_wood_types
        .map(x => 'execute if block ~ ~ ~ minecraft:' + x.wood_name + '_' + x.log_sfx + ' run summon dw623:tree_minion_15 ~ ~ ~ 0 0 ev:silk_touch_activate')
        .join('\n')
}
## Stripped
#{
    global_wood_types
        .map(x => 'execute if block ~ ~ ~ minecraft:stripped_' + x.wood_name + '_' + x.log_sfx + ' run summon dw623:tree_minion_15 ~ ~ ~ 0 0 ev:silk_touch_activate')
        .join('\n')
}
