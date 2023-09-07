#{
    other_tree_loot
        .map(x => 'execute if entity @e[r=64,family=tree_chest] if entity @e[r=8,type=item,name="' + realTitle(x.name) + '"] run tp @e[r=8,type=item,name="' + realTitle(x.name) + '"] @e[c=1,r=64,family=tree_chest]')
        .join('\n')
}
#{
    log_list 
        .filter(x => x.log > '')
        .map(x => 'execute if entity @e[r=64,family=tree_chest] if entity @e[r=8,type=item,name="' + realTitle(x.type) + ' '+ realTitle(x.log) + '"] run tp @e[r=8,type=item,name="' + realTitle(x.type) + ' '+ realTitle(x.log) + '"] @e[c=1,r=64,family=tree_chest]')
        .join('\n')
}

#{
    log_list
        .filter(x => x.leaf_sfx > '')
        .map(x => 'execute if entity @e[r=64,family=tree_chest] if entity @e[r=8,type=item,name="' + realTitle(x.type) + ' '+ realTitle(x.leaf_sfx) + '"] run tp @e[r=8,type=item,name="' + realTitle(x.type) + ' '+ realTitle(x.leaf_sfx) + '"] @e[c=1,r=64,family=tree_chest]')
        .join('\n')
}

#{
    log_list
        .filter(x => x.sapling_sfx > '')
        .map(x => 'execute if entity @e[r=64,family=tree_chest] if entity @e[r=8,type=item,name="' + realTitle(x.type) + ' '+ realTitle(x.sapling_sfx) + '"] run tp @e[r=8,type=item,name="' + realTitle(x.type) + ' '+ realTitle(x.sapling_sfx) + '"] @e[c=1,r=64,family=tree_chest]')
        .join('\n')
}

#{
    vine_list
        .map(x => 'execute if entity @e[r=64,family=tree_chest] if entity @e[r=8,type=item,name="' + realTitle(x.name) + '"] run tp @e[r=8,type=item,name="' + realTitle(x.name) + '"] @e[c=1,r=64,family=tree_chest]')
        .join('\n')
}
