## Logs
#{
    global_wood_types 
        .filter(x => x.log_sfx > '')
        .map(x => 'tp @e[r=16,type=item,name="' + realTitle(x.wood_name) + ' ' + realTitle(x.log_sfx) +'"] @s')
        .join('\n')
}
## Stripped Logs
#{
    global_wood_types 
        .filter(x => x.log_sfx > '')
        .map(x => 'tp @e[r=16,type=item,name="Stripped ' + realTitle(x.wood_name) + ' ' + realTitle(x.log_sfx) +'"] @s')
        .join('\n')
}
## Leaves
#{
    global_wood_types
        .filter(x => x.leaf_sfx > '')
        .map(x => 'tp @e[r=16,type=item,name="' + realTitle(x.wood_name) + ' '+ realTitle(x.leaf_sfx) + '"] @s')
        .join('\n')
}
## Sapllings
#{
    global_wood_types
        .filter(x => x.sapling_sfx > '')
        .map(x => 'tp @e[r=16,type=item,name="' + realTitle(x.wood_name) + ' '+ realTitle(x.sapling_sfx) + '"] @s')
        .join('\n')
}
## Item Loot
#{
    other_tree_item_loot
        .map(x => 'tp @e[r=16,type=item,name="' + realTitle(x.item_name) + '"] @s')
        .join('\n')
}
## Block Loot
#{
    other_tree_block_loot
        .map(x => 'tp @e[r=16,type=item,name="' + realTitle(x.block_name) + '"] @s')
        .join('\n')
}
## End