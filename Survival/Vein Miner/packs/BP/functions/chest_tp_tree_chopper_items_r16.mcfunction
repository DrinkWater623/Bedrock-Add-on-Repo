#{
    other_tree_loot
        .map(x => 'tp @e[r=16,type=item,name="' + realTitle(x.name) + '"] @s')
        .join('\n')
}

#{
    log_list 
        .filter(x => x.log > '')
        .map(x => 'tp @e[r=16,type=item,name="' + realTitle(x.type) + ' ' + realTitle(x.log) +'"] @s')
        .join('\n')
}

#{
    log_list
        .filter(x => x.leaf_sfx > '')
        .map(x => 'tp @e[r=16,type=item,name="' + realTitle(x.type) + ' '+ realTitle(x.leaf_sfx) + '"] @s')
        .join('\n')
}

#{
    log_list
        .filter(x => x.sapling_sfx > '')
        .map(x => 'tp @e[r=16,type=item,name="' + realTitle(x.type) + ' '+ realTitle(x.sapling_sfx) + '"] @s')
        .join('\n')
}

#{
    vine_list
        .map(x => 'tp @e[r=16,type=item,name="' + realTitle(x.name) + '"] @s')
        .join('\n')
}