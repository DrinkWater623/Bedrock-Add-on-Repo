## Debug
tell @p[tag=debug] -x-x-x-x-x-x-x-x-x-x-x-x-x-x-x- function efficiency_on_use_on_log_any_r7

## Start
execute if block ~ ~ ~ minecraft:log  run summon dw623:tree_minion_3 ~ ~ ~ 0 0 ev:efficiency_activate_log
execute if block ~ ~ ~ minecraft:log2 run summon dw623:tree_minion_3 ~ ~ ~ 0 0 ev:efficiency_activate_log
#{
    global_log3
        .map(x => 'execute if block ~ ~ ~ minecraft:' + x.log3_name + '_' + x.log3_sfx + ' run summon dw623:tree_minion_3 ~ ~ ~ 0 0 ev:efficiency_activate_log')
        .join('\n')
}
## Stripped
#{
    global_wood_types
        .map(x => 'execute if block ~ ~ ~ minecraft:stripped_' + x.wood_name + '_' + x.log_sfx + ' run summon dw623:tree_minion_3 ~ ~ ~ 0 0 ev:efficiency_activate_log')
        .join('\n')
}
## Leaves
execute if block ~ ~ ~ minecraft:leaves  run summon dw623:leaf_minion_3 ~ ~ ~ 0 0 ev:efficiency_activate_leaf
execute if block ~ ~ ~ minecraft:leaves2 run summon dw623:leaf_minion_3 ~ ~ ~ 0 0 ev:efficiency_activate_leaf
#{
    global_log3
        .filter(x => x.leaf3_sfx > '')
        .map(x => 'execute if block ~ ~ ~ minecraft:' + x.log3_name + '_' + x.leaf3_sfx + ' run summon dw623:leaf_minion_3 ~ ~ ~ 0 0 ev:efficiency_activate_leaf')
        .join('\n')
}
#{
    global_log3
        .filter(x => x.alt_give_leaf3 > '')
        .map(x => 'execute if block ~ ~ ~ minecraft:' + x.alt_give_leaf3 + ' run summon dw623:leaf_minion_3 ~ ~ ~ 0 0 ev:efficiency_activate_leaf')
        .join('\n')
}
## End