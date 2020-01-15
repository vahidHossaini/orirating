module.exports = class paymentConfig
{
    constructor(config)
    { 
         
    }
    getPackages()
    {
       return []
    }
    getMessage()
	{
		return{
			default001:"rate length not valid", 
			default002:"not valid ids", 
			default003:"not valid data", 
			default004:"your rate submited", 
			default005:"your rate not submited", 
		}
	}
    getVersionedPackages()
    { 
      return []
    }
    getDefaultConfig()
    {
      return {
		context:"default",  
		 
      }
    }
}