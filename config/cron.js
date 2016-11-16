
 //schedule: '*/5 * * * *'
module.exports.cron = {
  closeDither: {
     schedule: '*/1 * * * *',
    notifyClosing: function () {
      console.log('You will see this every minute');
      var today = new Date().toISOString();
      console.log(today)
	   Collage.find({expiryDate:today }).exec(function(err, collageDetails){
		   if(err)
		   {
			   console.log(err)
			   return err;
			   //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Error Finding dither'});
		   }
		   else
		   {
			  console.log(collageDetails) 
			  if(collageDetails.length){
			   var userArr = [];
			   var device_Arr = [];
			   collageDetails.forEach(function(factor, index){
				
				   var values ={
						notificationTypeId  :   8,
						userId				:   factor.userId,
						ditherUserId		:   factor.userId,
						collage_id          :   factor.id   
					}
				
					  NotificationLog.create(values).exec(function(err, createdNotificationTags) {
							   if(err){
								   console.log(err)
								   return err;
								   //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Error in NotificationLog Insertion'});
							   }else{
								        console.log("Log inserted")
										console.log(createdNotificationTags)
										User_token.find({userId: factor.userId}).exec(function (err, getDeviceId) {
										//User_token.find({userId:selectContacts[0].userId }).exec(function (err, getDeviceId){
											if(err){
												  console.log(err);
												  return err;
												  //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Error in token Finding'});
												 // callback();
											}else{
												var message     =  'Dither Closing Notification';
												var ntfn_body   =  "Your Dither has been Expired";
												console.log("device Id array")
												console.log(getDeviceId)
												getDeviceId.forEach(function(factor, index){
													device_Arr.push(factor.deviceId);
												});
												if(!device_Arr.length){
														console.log("no device")
												}else{
														var data        =  {
																		message             :   message,
																		device_id           :   device_Arr,
																		NtfnBody            :   ntfn_body,
																		NtfnType            :   8,
																		id                  :   factor.id,
																		notification_id     :   createdNotificationTags.id
																		};
														NotificationService.NotificationPush(data, function(err, ntfnSend){
																if(err){
																	console.log("Error in Push Notification Sending")
																	console.log(err)
																	return err;
																	//callback();
																	//return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Error in Push'});
																}else{
																	//callback();
																	console.log("Notification sended")
																	return ntfnSend;
																	//return res.json(200, {status: 1, status_type: 'Success' ,message: 'Psh Success'});
																}
														});
												}
											}
										});

								}
						   });
				  }); 
			  }
		 }
			 
		});   
      
    }
  },
  
};
