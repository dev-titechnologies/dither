module.exports = {
	
	
	getFbContacts: function(fbUser,data,callback){
			console.log("fetchingggggggggggg Fbbbbbbbbbbbbbbbbbbbbbbb----------1------------")
		    console.log(fbUser)
		    var contactArr 		= 	 [];
		    var notifyArr 		= 	 [];
			var deviceId_arr    =    [];
			var newFrnds		=	 [];
		    fbUser.forEach(function(factor, index){
				
				contactArr.push(factor.fb_userid)
			});
		    
		    var details={
							userId		:	data.userId,
							fbId		:   data.fbId,
							userName	:	data.userName,
						
						}
			
			console.log("-------------------------Service -----GET FB FRIENDS------2----------")
			
			console.log(data)
			console.log(contactArr)
			 
			//if(fbUser){
				console.log("-----------------FIRST----------------------")
				contactArr.forEach(function(factor, index){
					console.log(factor)
					var query	=	"SELECT * FROM fbFriends where fbId = '"+factor+"'  and userId = '"+data.userId+"'";
					console.log(query)
					FbFriends.query("SELECT * FROM fbFriends where fbId = '"+factor+"'  and userId = '"+data.userId+"'", function(err,FBContacts){
					//FbFriends.find({fbId : factor}).exec(function (err, FBContacts){
						 console.log("-----------------3----------------------")
						 console.log(FBContacts)
						if(err){
							console.log(err)
							
						}
						else{
							
						 console.log("-----------------4----------------------")	
						 if(FBContacts.length){
								console.log("yessss")
								/*FBContacts.forEach(function(factor, index){
									console.log(data.userId)
									console.log("tttttttttttttt")
									console.log(factor.userId)
									if(factor.userId==data.userId){
										console.log("-----------------test----------------------")
										newFrnds.push(factor.userId)
									}
									
								});*/
							 
							 
							}
							else{
							 newFrnds.push(factor)
							 console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb")	
							 console.log(newFrnds)
							 
							 User.findOne({fbId : factor}).exec(function (err, userContacts){
							   if(err){
								   
								   console.log(err)
							   }
							   else{	
					  
								console.log("-----------------5----------------------")
								console.log(userContacts)
								var values ={
									notificationTypeId  :   5,
									userId              :   data.userId,
									ditherUserId        :   userContacts.id
								}
							   console.log("valuessssssssssss")
							   console.log(values)
							   NotificationLog.create(values).exec(function(err, createdNotification){
								if(err){
									console.log(err);
									//callback();
								}else{
								
									User_token.find({userId: userContacts.id}).exec(function (err, getDeviceId){
											if(err){
												  console.log(err);
												  callback();
											}else{
												console.log("-----------------6----------------------")
												var message     =  'FBsignup Notification';
												var ntfn_body   =   "Your FB contact "+details.userName+" is now on Dither";
												getDeviceId.forEach(function(factor, index){
													deviceId_arr.push(factor.deviceId);
												});
												if(!deviceId_arr.length){
													console.log("deviceeee")
														//callback();
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
															//callback(); 
														}else{
															console.log("Push notification result")
															console.log(ntfnSend)
															console.log("Push Notification sended")
															//callback();
														}
													});
												}
											//------------------------------
											}
										});//getDeviceId
									
									}
								});
								//}
							  }
								
							 });	
							}

						}
						
					});  
				 
							
				 });		
				console.log(newFrnds)
				callback();
	}
	

};
