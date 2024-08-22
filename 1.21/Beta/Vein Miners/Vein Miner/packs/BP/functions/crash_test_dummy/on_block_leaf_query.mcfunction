
#{
    global_trees
        .filter(x => x.leaf_group == 1)
        .map(x => 'execute if block ~ ~-1 ~ minecraft:' + x.log_name + '_' + x.leaf_sfx + ' run tellraw @a[r=5] {"rawtext": [{"text":"mcfunction / minecraft:' + x.log_name + '_' + x.leaf_sfx + '"}]}')
        .join('\n')
}
## The old oddball
#{
    global_trees
        .filter(x => x.leaf_group == 4)
        .map(x => 'execute if block ~ ~-1 ~ minecraft:' + x.alt_give_leaf + ' run tellraw @a[r=5] {"rawtext": [{"text":"mcfunction / minecraft:' + x.alt_give_leaf + '"}]}')
        .join('\n')
}
## End								