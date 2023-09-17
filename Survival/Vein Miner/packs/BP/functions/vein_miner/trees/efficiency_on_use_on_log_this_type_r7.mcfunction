## Debug
tell @p[tag=debug] -x-x-x-x-x-x-x-x-x-x-x-x-x-x-x- function efficiency_on_use_on_log_this_type_r7
#{
    global_wood_types
        .map(x => 'execute if block ~ ~ ~ minecraft:' + x.wood_name + '_' + x.log_sfx + ' run tell @p[tag=debug] Efficiency/' + x.wood_name + ' r=7')
        .join('\n')
}
## Start
#{
    global_wood_types
        .map(x => 'execute if block ~ ~ ~ minecraft:' + x.wood_name + '_' + x.log_sfx + ' run summon dw623:tree_minion_' + x.wood_name + '_7 ~ ~ ~ 0 0 ev:efficiency_activate_log')
        .join('\n')
}
## Stripped
#{
    global_wood_types
        .map(x => 'execute if block ~ ~ ~ minecraft:stripped_' + x.wood_name + '_' + x.log_sfx + ' run summon dw623:tree_minion_' + x.wood_name + '_7 ~ ~ ~ 0 0 ev:efficiency_activate_log')
        .join('\n')
}
## Leaves
## Groups 1 and 2 are being handled in the calling event from the item because of the many iterations of the block states (persistent and update bits)
#{
    global_log3
        .filter(x => x.leaf3_sfx > '')
        .map(x => 'execute if block ~ ~ ~ minecraft:' + x.log3_name + '_' + x.leaf3_sfx + ' run summon dw623:leaf_minion_' + x.log3_name + '_7 ~ ~ ~ 0 0 ev:efficiency_activate_leaf')
        .join('\n')
}
#{
    global_log3
        .filter(x => x.alt_give_leaf3 > '')
        .map(x => 'execute if block ~ ~ ~ minecraft:' + x.alt_give_leaf3 + ' run summon dw623:leaf_minion_' + x.log3_name + '_7 ~ ~ ~ 0 0 ev:efficiency_activate_leaf')
        .join('\n')
}
## End