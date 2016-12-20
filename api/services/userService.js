module.exports = {
	
	
	getFbContacts: function(fbUser,data,callback){
			console.log("fetchingggggggggggg Fbbbbbbbbbbbbbbbbbbbbbbb----------1------------")
		    console.log(fbUser)
		    var contactArr 		= 	 [];
		    var notifyArr 		= 	 [];
			var deviceId_arr    =    [];
			var newFrnds		=	 [];
			var details			=	{		
										userId		:	data.userId,
										fbId		:   data.fbId,
										userName	:	data.userName,
									
									}
									
			/*fbUser.forEach(function(factor, index){
								
					contactArr.push(factor.fb_userid)
			});*/
			//console.log(contactArr)		
							
			async.series([
               
			    function(callback) {
						console.log("----------------------SERIES 2-----------------------------")
					    console.log(contactArr)
					    if(contactArr) {
							//async.forEach(contactArr, function (factor, callback){
							
							fbUser.forEach(function(factor, index){
								console.log("ffffffffffffffffffff")
								var query	= "SELECT * FROM fbFriends where fbId = '"+factor.fb_userid+"'  and userId = '"+data.userId+"'";
								console.log(query)
								FbFriends.query(query, function(err,FBContacts){
									 console.log(factor.fb_userid)
									 console.log(FBContacts)
									if(err){
										console.log(err)
									}
									else{
										  console.log("-----------FB-------------------------")
											if(FBContacts.length){
												console.log("yessss")
											}
											else{
													console.log("frnds haiii")
													 newFrnds.push(factor.fb_userid)
													 //callback();
												}
										}
								});
							});	
							callback();
							
					   }else{
						   
						  callback(); 
					   }		
				},
				function(callback) {
					
						console.log("----------------------SERIES 3-----------------------------")
						console.log(newFrnds)
						if(!newFrnds.length){
							callback();
						}
						else{
								
								 newFrnds.forEach(function(factor, index){
										 User.findOne({fbId : factor}).exec(function (err, userContacts){
										   if(err){
											   
											   console.log(err)
										   }
										   else{
												console.log("user-------------contacts--------------")
												notifyArr.push(userContacts.id)
												
												console.log(notifyArr)
												
											  }
										  });
								   });		
								  callback();
							}
						
				},
						
				function(callback) {
					
						console.log("----------------------SERIES 4-----------------------------")
						console.log(notifyArr)
						if(notifyArr){
							var values ={
								notificationTypeId  :   5,
								userId              :   data.userId,
								tagged_users        :   notifyArr
							}
						   console.log("valuessssssssssss")
						   console.log(values)
						   NotificationLog.create(values).exec(function(err, createdNotification){
							if(err){
								console.log(err);
								//callback();
							}else{
							
								User_token.find({userId: notifyArr}).exec(function (err, getDeviceId){
										if(err){
											  console.log(err);
											  callback();
										}else{
											console.log("-----------------6----------------------")
											var message     =  'FBsignup Notification';
											var ntfn_body   =   "Your facebook friend "+details.userName+" is now on Dither";
											getDeviceId.forEach(function(factor, index){
												deviceId_arr.push(factor.deviceId);
											});
											if(!deviceId_arr.length){
												console.log("deviceeee")
													callback();
											}else{
												console.log("NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN")
												var data        =  {
																		message			:	message,
																		device_id		:	deviceId_arr,
																		NtfnBody		:	ntfn_body,
																		NtfnType:5,id	:	details.userId,
																		notification_id	:	createdNotification.id,
																		old_id			:	'',
																		name			:	details.userName
																	};
												NotificationService.NotificationPush(data, function(err, ntfnSend){
													if(err){
														console.log("Error in Push Notification Sending")
														console.log(err)
														callback(); 
													}else{
														console.log("Push notification result")
														console.log(ntfnSend)
														console.log("Push Notification sended")
														callback();
													}
												});
											}
										//------------------------------
										}
									});//getDeviceId
								
								}
							});
						}
						else
						{
							callback();
						}
					
					
					
				},
					
				], function(err) { //This function gets called after the two tasks have called their "task callbacks"
						if (err) {
							console.log(err);
							callback();
						}else{
							callback();
						}
                    });	
							
				
	}
	

};
