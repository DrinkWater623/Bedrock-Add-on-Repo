#{
    other_tree_item_loot
        .map(x => 'tp @e[r=16,type=item,name="' + realTitle(x.name) + '"] @s')
        .join('\n')
}

#{
    other_tree_block_loot
        .map(x => 'tp @e[r=16,type=item,name="' + realTitle(x.name) + '"] @s')
        .join('\n')
}

#{
    global_log_list 
        .filter(x => x.log_sfx > '')
        .map(x => 'tp @e[r=16,type=item,name="' + realTitle(x.log_name) + ' ' + realTitle(x.log_sfx) +'"] @s')
        .join('\n')
}

#{
    global_log_list
        .filter(x => x.leaf_sfx > '')
        .map(x => 'tp @e[r=16,type=item,name="' + realTitle(x.log_name) + ' '+ realTitle(x.leaf_sfx) + '"] @s')
        .join('\n')
}

#{
    global_log_list
        .filter(x => x.sapling_sfx > '')
        .map(x => 'tp @e[r=16,type=item,name="' + realTitle(x.log_name) + ' '+ realTitle(x.sapling_sfx) + '"] @s')
        .join('\n')
}
