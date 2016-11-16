

module.exports.cron = {
  myFirstJob: {
    schedule: '* * * * * *',
    onTick: function () {
      console.log('You will see this every second');
      var today = new Date().toISOString();
      console.log(today)
      var query	= "SELECT * FROM collage where expiryDate='"+today+"'";
       Collage.query(query, function (err, details) {
		   if(err)
		   {
			   console.log(err)
		   }
		   else
		   {
			   console.log(details)
		   }
	   });
      
    }
  },
  
};
