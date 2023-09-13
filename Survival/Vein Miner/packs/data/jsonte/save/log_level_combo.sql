DROP TABLE #output
drop table #template

Declare @Data varchar(max)=
'		{"lid":1	,"canopy_size":7	,"wood_name":"acacia"	,"log_sfx":"log"	,"sapling_sfx":"Sapling"	,"leaf_sfx":"leaves"	,"give_leaf":0	,"leaf_id":null	,"leaf2_id":0		,"alt_give_leaf":null},		
		{"lid":2	,"canopy_size":3	,"wood_name":"birch"	,"log_sfx":"log"	,"sapling_sfx":"Sapling"	,"leaf_sfx":"leaves"	,"give_leaf":0	,"leaf_id":2	,"leaf2_id":null	,"alt_give_leaf":null},
		{"lid":3	,"canopy_size":7	,"wood_name":"cherry"	,"log_sfx":"log"	,"sapling_sfx":"Sapling"	,"leaf_sfx":"leaves"	,"give_leaf":1	,"leaf_id":null	,"leaf2_id":null	,"alt_give_leaf":null},
		{"lid":4	,"canopy_size":4	,"wood_name":"dark_oak"	,"log_sfx":"log"	,"sapling_sfx":"Sapling"	,"leaf_sfx":"leaves"	,"give_leaf":0	,"leaf_id":null	,"leaf2_id":1		,"alt_give_leaf":null},
		{"lid":5	,"canopy_size":7	,"wood_name":"jungle"	,"log_sfx":"log"	,"sapling_sfx":"Sapling"	,"leaf_sfx":"leaves"	,"give_leaf":0	,"leaf_id":3	,"leaf2_id":null	,"alt_give_leaf":null},
		{"lid":6	,"canopy_size":7	,"wood_name":"mangrove"	,"log_sfx":"log"	,"sapling_sfx":"propagule"	,"leaf_sfx":"leaves"	,"give_leaf":1	,"leaf_id":null	,"leaf2_id":null	,"alt_give_leaf":null},
		{"lid":7	,"canopy_size":5	,"wood_name":"oak"		,"log_sfx":"log"	,"sapling_sfx":"Sapling"	,"leaf_sfx":"leaves"	,"give_leaf":0	,"leaf_id":0	,"leaf2_id":null	,"alt_give_leaf":null},
		{"lid":8	,"canopy_size":4	,"wood_name":"spruce"	,"log_sfx":"log"	,"sapling_sfx":"Sapling"	,"leaf_sfx":"leaves"	,"give_leaf":0	,"leaf_id":1	,"leaf2_id":null	,"alt_give_leaf":null},
		{"lid":9	,"canopy_size":8	,"wood_name":"crimson"	,"log_sfx":"stem"	,"sapling_sfx":null			,"leaf_sfx": null		,"give_leaf":0	,"leaf_id":null	,"leaf2_id":null	,"alt_give_leaf":"nether_wart_block"},
		{"lid":10	,"canopy_size":8	,"wood_name":"warped"	,"log_sfx":"stem"	,"sapling_sfx":null			,"leaf_sfx":"wart_block","give_leaf":1	,"leaf_id":null	,"leaf2_id":null	,"alt_give_leaf":null}
'
set @Data=replace(@Data,char(9),'<tab>')
create table #template(data varchar(500))
exec sp_fill_table '#template',@Data
delete from #template where len(data)=0
--select * from #template
while (select count(*) from #template where data like '%<tab>') >0
	update #template set data=left(data,len(data)-4) where data like '%<tab>'

update #template set data=replace(data,'<tab>',char(9))
update #template set data=data+',' where data not like '%,'

select top 0 * into #output from #template

declare @int int
set @int=8
while @int>=0 begin
	insert into #output select * from #template
	update #output set data=replace(data,'{','{"radius_ptr":'+convert(varchar,@int)+',') where data not like '%radius_ptr%'
	set @int=@int-1
end

select 'Error' as ErrMsg,* from #output where data not like '%},'
select * from #output order by data