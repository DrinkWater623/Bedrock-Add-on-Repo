## Leaves Group 1
execute if block ~ ~ ~ minecraft:leaves  run tellraw @a[r=5] {"rawtext": [{"text":"mcfunction / minecraft:leaves"}]}
#{
    global_log1
        .map(x => 'execute if block ~ ~ ~  minecraft:leaves ["old_leaf_type" = "' + x.log1_name + '"] run tellraw @a[r=5] {"rawtext": [{"text":"mcfunction / minecraft:leaves old_leaf_type=' + x.log1_name + '"}]}')
        .join('\n')
}
## Leaves Group 2
execute if block ~ ~ ~ minecraft:leaves2 run tellraw @a[r=5] {"rawtext": [{"text":"mcfunction / minecraft:leaves2"}]}
#{
    global_log2
        .map(x => 'execute if block ~ ~ ~  minecraft:leaves2 ["new_leaf_type" = "' + x.log2_name + '"] run tellraw @a[r=5] {"rawtext": [{"text":"mcfunction / minecraft:leaves2 new_leaf_type=' + x.log2_name + '"}]}')
        .join('\n')
}
## Leaves Group 3 - Those not in leaves or leaves2 - the newer blocks are flattened
#{
    global_log3
        .filter(x => x.leaf3_sfx > '')
        .map(x => 'execute if block ~ ~ ~ minecraft:' + x.log3_name + '_' + x.leaf3_sfx + ' run tellraw @a[r=5] {"rawtext": [{"text":"mcfunction / minecraft:' + x.log3_name + '_' + x.leaf3_sfx + '"}]}')
        .join('\n')
}
## The old oddball
#{
    global_log3
        .filter(x => x.alt_give_leaf3 > '')
        .map(x => 'execute if block ~ ~ ~ minecraft:' + x.alt_give_leaf3 + ' run tellraw @a[r=5] {"rawtext": [{"text":"mcfunction / minecraft:' + x.alt_give_leaf3 + '"}]}')
        .join('\n')
}
## End								