module.exports = {
	
	
	getFbContacts: function(fbUser,data,callback){
			console.log("fetchingggggggggggg Fbbbbbbbbbbbbbbbbbbbbbbb")
		    console.log(fbUser)
		    var details={
							userId		:	data.userId,
							fbId		:   data.fbId,
							userName	:	data.userName,
						
						}
		    
			console.log("-------------------------Service -----GET FB FRIENDS----------------")
			
			console.log(data)
			 var notifyArr 		= 	 [];
			 var deviceId_arr   =    [];
			 var newFrnds		=	 [];
			//if(fbUser){
				console.log("-----------------FIRST----------------------")
				fbUser.forEach(function(factor, index){
					console.log(factor.fbId)
					 FbFriends.find({fbId : factor.fbId}).exec(function (err, FBContacts){
						 console.log("-----------------3----------------------")
						 console.log(FBContacts)
						if(err){
							console.log(err)
							//callback();
						}
						else{
							
						if(FBContacts.length){
							 console.log("yessss")
							 //console.log(factor.userId)
															 
						}
						else
						{
						/*var query	=	"SELECT id from notificationLog where notificationTypeId=4 and userId='"+details.userId+"' and ditherUserId = '"+factor.userId+"'";
						console.log(query)
						NotificationLog.query(query, function(err,getNtfns){
							if(err)
							{
								console.log(err)
							}
							else{
								
							 if(!getNtfns){*/
								console.log("-----------------4----------------------")
								console.log(data)
								var values ={
									notificationTypeId  :   5,
									userId              :   data.userId,
									ditherUserId        :   factor.userId
								}
							   console.log("valuessssssssssss")
							   console.log(values)
							   NotificationLog.create(values).exec(function(err, createdNotification){
								if(err){
									console.log(err);
									callback();
								}else{
								
									User_token.find({userId: factor.userId}).exec(function (err, getDeviceId){
											if(err){
												  console.log(err);
												  callback();
											}else{
												console.log("dddddddddddddddddddddddddddddddddddd")
												console.log(getDeviceId)
												var message     =  'FBsignup Notification';
												var ntfn_body   =   "Your FB contact  is now on Dither";
												getDeviceId.forEach(function(factor, index){
													deviceId_arr.push(factor.deviceId);
												});
												if(!deviceId_arr.length){
														callback();
												}else{
													console.log("NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN")
													var data        =  {message:message,device_id:deviceId_arr,NtfnBody:ntfn_body,NtfnType:5,id:details.userId,notification_id:createdNotification.id,old_id:''};
													NotificationService.NotificationPush(data, function(err, ntfnSend){
														if(err){
															console.log("Error in Push Notification Sending")
															console.log(err)
															callback(); 
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
							  // }
								
							 //});	
							}

						}
						
					});  
							
				 });		
				console.log(newFrnds)
				callback();
	}
	

};
