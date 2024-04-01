tp @e[r=10,type=item,name=shulker_box] @s
#{
    global_tool_list
        .filter(x => x.priority == 0)
        .map(x => 'tp @e[r=10,type=item,name=' + x.tool_name + '] @s')
        .join('\n')
}