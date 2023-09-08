#{
    other_tree_item_loot
        .map(x => 'execute if entity @e[r=64,family=tree_chest] if entity @e[r=8,type=item,name="' + realTitle(x.name) + '"] run tp @e[r=8,type=item,name="' + realTitle(x.name) + '"] @e[c=1,r=64,family=tree_chest]')
        .join('\n')
}

#{
    other_tree_block_loot
        .map(x => 'execute if entity @e[r=64,family=tree_chest] if entity @e[r=8,type=item,name="' + realTitle(x.name) + '"] run tp @e[r=8,type=item,name="' + realTitle(x.name) + '"] @e[c=1,r=64,family=tree_chest]')
        .join('\n')
}

#{
    global_log_list 
        .filter(x => x.log_sfx > '')
        .map(x => 'execute if entity @e[r=64,family=tree_chest] if entity @e[r=8,type=item,name="' + realTitle(x.log_name) + ' '+ realTitle(x.log_sfx) + '"] run tp @e[r=8,type=item,name="' + realTitle(x.log_name) + ' '+ realTitle(x.log_sfx) + '"] @e[c=1,r=64,family=tree_chest]')
        .join('\n')
}

#{
    global_log_list
        .filter(x => x.leaf_sfx > '')
        .map(x => 'execute if entity @e[r=64,family=tree_chest] if entity @e[r=8,type=item,name="' + realTitle(x.log_name) + ' '+ realTitle(x.leaf_sfx) + '"] run tp @e[r=8,type=item,name="' + realTitle(x.log_name) + ' '+ realTitle(x.leaf_sfx) + '"] @e[c=1,r=64,family=tree_chest]')
        .join('\n')
}

#{
    global_log_list
        .filter(x => x.sapling_sfx > '')
        .map(x => 'execute if entity @e[r=64,family=tree_chest] if entity @e[r=8,type=item,name="' + realTitle(x.log_name) + ' '+ realTitle(x.sapling_sfx) + '"] run tp @e[r=8,type=item,name="' + realTitle(x.log_name) + ' '+ realTitle(x.sapling_sfx) + '"] @e[c=1,r=64,family=tree_chest]')
        .join('\n')
}
