declare @data varchar(max),@data2 varchar(max)
set @data=''
set @data=replace(@data,char(9),'')
set @data=replace(@data,char(32),'')
set @data=replace(@data,'{','')
set @data=replace(@data,'},','')
set @data=replace(@data,'}','')

DROP TABLE #base
DROP TABLE #Data1
DROP TABLE #Data2
DROP TABLE #output
create table #base (RID int identity(1,1),json varchar(max))--block varchar(50),id varchar(10),type varchar(50),nada varchar(100))
exec sp_fill_table '#Base',@data
delete from #base where json=''
delete from #base where json like '/%'
select '#Base' as TB,* from #base
------------------------------------------
select identity(int,1,1) as OID,0 as Done,RID+0 as RID,json into #Data1 from #base
order by case when json like '%minecraft%' then 1 else 2 end,RID

--Additional Info
Select * into #Data2 from #Data1
update #Data1 set json=replace(json,'":','1":')
update #Data2 set json=replace(json,'":','2":')
select * from #Data1 order by oid
--select * from #Data2 order by oid
--return

--===============================================================================================================
Declare @ptr1 smallint,@ptr2 smallint
Declare @line1 varchar(500),@line2 varchar(500)
create table #output (uid int identity(1,1),json varchar(max))

	while (select count(*) from #Data1 where done=0)>0 begin
		select top 1 @ptr1=oid,@Line1=json from #Data1 where done=0 order by oid
		update #Data1 set done=1 where oid=@ptr1

		update #Data2 set done=0
		Update #Data1 set done=1 where oid<=@Ptr1
		while (select count(*) from #Data2 where done=0)>0 begin
			select top 1 @ptr2=oid,@Line2=json from #Data2 where done=0 order by oid
			update #Data2 set done=1 where oid=@ptr2

			if @ptr1<@ptr2 begin
				insert	into #output 
				select '{"is_vanilla":'+case when @line1 like '%minecraft%' and @line2 like '%minecraft%' then '1' else '0' end+',"uid1":'+convert(varchar,@ptr1)+','+@line1+',"uid2":'+convert(varchar,@ptr2)+','+@line2+'},'
			end
		end

	end
select @ptr1=max(uid) from #output
update #output set json=replace(json,'},','}') where uid=@ptr1
select '#Output' as [Data Type],* from #output order by uid
return