

module.exports = {

		/* =================================================================================================================================
				Notification Log Insertion
		================================================================================================================================== */
		nTFnAction: function (data,callback) {
			    console.log("NotificationLog Service")
				console.log(data)
			
				var values ={
								notificationTypeId  :   7,
								userId              :   Ntfndata.loginUserId,
								collage_id          :   Ntfndata.collage_id,
								tagged_users        :   Ntfndata.tagged_users
							}
				NotificationLog.create(values).exec(function(err, createdNotificationTags) {
					   if(err)
					   {
						   console.log(err)
						   callback();
					   }
					   else
					   {
							console.log(createdNotificationTags)
							User_token.find({userId: Ntfndata.tagged_users}).exec(function (err, getDeviceId) {
							if(err)
							{
								  console.log(err);
								  callback();
							}
							else
							{
								var message     =  'Mention Notification';
								var ntfn_body   =   Ntfndata.loginName +" has Mentioned You In a Dither";
								var mention_deviceId_arr = [];

								getDeviceId.forEach(function(factor, index){
									mention_deviceId_arr.push(factor.deviceId);
								});
								if(!mention_deviceId_arr.length){
										callback();
								}else
								{
								 User.findOne({id:Ntfndata.collageUserId}).exec(function (err, notifySettings)
								 {
									if(err)
									{
										console.log(err)
										callback();
									}
									else{
										   if(notifySettings.notifyMention==0){
												callback();
										   }
										   else
										   {
												var data          =  {message:message,device_id:mention_deviceId_arr,NtfnBody:ntfn_body,NtfnType:7,id:Ntfndata.collage_id,notification_id:createdNotificationTags.id};
												var device_type   =  Ntfndata.device_type;
												NotificationService.NtfnInAPP(data,device_type, function(err, ntfnSend) {
														if(err)
														{
															console.log("Error in Push Notification Sending")
															console.log(err)
															callback();
														}
														else
														{
															console.log("Push Notification sended")
															callback();
														}
												});
											}
										}
									});	
								}
							}
						});

					  }
				}); 
		},
};				
				
