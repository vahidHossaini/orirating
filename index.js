var uuid=require("uuid")
class RatingRouting
{
	constructor(disc)
	{
		this.disc=disc
	}
	deleteRate(userid,id,func)
	{  
		return this.disc.run('rating','deleteRate',{userid,id},func);
	}
	setRate(userid,id,rate,type,func)
	{  
		return this.disc.run('rating','setRate',{userid,id,rate,type},func);
	}
}
module.exports = class ratingIndex
{
	constructor(config,dist)
	{
		this.config=config.statics;
		this.context=this.config.context;     
        this.bootstrap=require('./bootstrap.js')
        this.enums=require('./struct.js') 
        this.tempConfig=require('./config.js')

		global.rating=new RatingRouting(dist);
	}
	async sampleFunction(msg,func,self)
	{
		var dt=msg.data;
		var session=msg.session;
		if(!dt.user.userid)
			return func({m:"default001"})
		var data =await global.db.Search(self.context,'user',{},dt);
		return func(null,data);
	}
	
	async getRates(msg,func,self)
	{
		var dt=msg.data;
		var session=msg.session;
		if(!dt.ids.length || dt.ids.length>10)
			return func({m:"default001"})
		var or=[];
		for(var a of id)
			if(a)
				or.push({_id:a});
		if(!or.length)
			return func({m:"default002"});
		var data =await global.db.Search(self.context,'rating_rate',{where:{$or:or}},{$top:10});
		return func(null,data);
	}
	async getRateDetail(msg,func,self)
	{
		var dt=msg.data;
		if(!dt.$top || dt.$top>50)
			dt.$top=10
		delete dt.$count;
		var data =await global.db.Search(self.context,'rating_details',{where:{id:dt.id}},dt);
		return func(null,data);
	}
	async deleteRate(msg,func,self)
	{
		var dt=msg;  
		if(!dt.id || !dt.userid)
			return func({m:"default003"})
		var data =await global.db.SearchOne(self.context,'rating_details',{where:{userid:dt.userid,id:dt.id }});
		if(!data)
			return func({m:"default005"});
		var rt=await global.db.SearchOne(self.context,'rating_rate',{where:{_id:dt.id}})
		if(!rt)
			return func({m:"default005"})
		if(rt.type=="seperate")
		{
			rt.data[""+data.rate]--;
		}
		else
		{
			rt.sum-=data.rate
		}
		await global.db.Save(self.context,'rating_rate',["_id"],rt);
		await global.db.Delete(self.context,'rating_details',["_id"],{_id:data._id});
		return func(null,{});
	}
	async setRate(msg,func,self)
	{
		var dt=msg;  
		if(!dt.id || !dt.userid || (!dt.rate && dt.rate!=0))
			return func({m:"default003"})
		console.log('rate --->',msg)
		var rt=await global.db.SearchOne(self.context,'rating_rate',{where:{_id:dt.id}});
		var exist=true;
		if(!rt)
		{
			exist=false; 
			rt={
				_id:dt.id,
				submitDate:new Date(), 
				type:dt.type
			};
			if(dt.type=="seperate")
			{
				rt.data={};
				rt.data[""+dt.rate]=1
			}
			else
			{
				rt.data={sum:dt.rate,count:0}; 
				
			}
			await global.db.Save(self.context,'rating_rate',["_id"],rt);
			var detail={
				_id:uuid.v4(),
				userid:dt.userid,
				id:dt.id,
				submitDate:new Date(),
				value:dt.rate
			};
			await global.db.Save(self.context,'rating_details',["_id"],detail);
		}
		else
		{
			var data =await global.db.SearchOne(self.context,'rating_details',{where:{userid:dt.userid,id:dt.id }});
			// if(data)
				// return func({m:"default004"}) 
			if(rt.type=="seperate")
			{
				if(!rt.data)					
					rt.data={};
				
				if(data)
				{
					if(rt.data[""+data.value])
						rt.data[""+data.value]--;
					
				}
				
				if(!rt.data[""+dt.rate])
					rt.data[""+dt.rate]=1;
				else
					rt.data[""+dt.rate]++;
			}
			else
			{
				if(!rt.data)
				{
					rt.data={sum:0,count:0} 
				}
				if(data)
				{ 
					rt.data.sum -=data.value;
					rt.data.count--;
				}
				rt.data.sum=dt.rate;
				rt.data.count++;
			}
			
			await global.db.Save(self.context,'rating_rate',["_id"],rt);
			var detail={
				_id:uuid.v4(),
				userid:dt.userid,
				id:dt.id,
				submitDate:new Date(),
				value:dt.rate
			};
			if(data)
			{
				await global.db.Save(self.context,'rating_details',["_id"],{_id:data._id,value:dt.rate});
			}
			else
			{
				await global.db.Save(self.context,'rating_details',["_id"],detail);
			}
		}
		 
		return func(null,rt.data);
	}
}