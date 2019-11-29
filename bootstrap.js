module.exports = class paymentBootstrap{
  constructor(config)
  {
    this.funcs=[  
      {
          name:'getRates',
          title:'get rates of contetns' ,
          inputs:[
			{
				name:'ids',
				type:'string',
				nullable:false,
				array:true
			}
          ]
      },  
	  {
          name:'getRateDetail',
          title:'get detaile of rate' ,
          inputs:[
			{
				name:'id',
				type:'string',
				nullable:false, 
			}
          ]
      }, 
	  
	  {
          name:'setRate',
          title1:'set rates' , 
      }, 
	  {
          name:'deleteRate',
          title1:'get detaile of rate' , 
      }, 
	  
	  
	  
	   
    ]
    this.auth=[ 
        ]
  }
}