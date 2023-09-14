## Debug
#{
    global_wood_types
        .map(x => 'execute if block ~ ~ ~ minecraft:' + x.wood_name + '_' + x.log_sfx + ' run title @p[tag=debug] title This ' + x.wood_name + ' Trunk')
        .join('\n')
}
## Start
#{
    global_wood_types
        .map(x => 'execute if block ~ ~ ~ minecraft:' + x.wood_name + '_' + x.log_sfx + ' run summon dw623:tree_minion_' + x.wood_name + '_0 ~ ~ ~ 0 0 ev:silk_touch_activate')
        .join('\n')
}
## Stipped
#{
    global_wood_types
        .map(x => 'execute if block ~ ~ ~ minecraft:stripped_' + x.wood_name + '_' + x.log_sfx + ' run summon dw623:tree_minion_' + x.wood_name + '_0 ~ ~ ~ 0 0 ev:silk_touch_activate')
        .join('\n')
}
