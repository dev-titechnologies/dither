//schedule: '*/5 * * * *'
module.exports.cron = {
    myFirstJob: {
        schedule: '* * * * * *',
        onTick:  function (req, res, next)  {
			
            var today = new Date().toISOString().slice(0, 19).replace('T', ' ');
            //console.log(today)
            Collage.find({expiryDate:today }).exec(function(err, collageDetails){
                if(err){
                   console.log(err)
                }else{
					//console.log(collageDetails)
                    if(collageDetails.length){
                        var userArr = [];
                        var device_Arr = [];
                        collageDetails.forEach(function(factor, index){
                            var values ={
                                notificationTypeId  :   8,
                                userId              :   factor.userId,
                                ditherUserId        :   factor.userId,
                                collage_id          :   factor.id
                            }
                            NotificationLog.create(values).exec(function(err, createdNotificationTags){
                                    if(err){
                                            console.log(err)
                                    }else{
                                            User_token.find({userId: factor.userId}).exec(function (err, getDeviceId){
                                                if(err){
                                                        console.log(err);
                                                }else{
													async.parallel([
                                                      function(callback){
													      //------------PUSH NOTIFICATION-------------------------
													
															var message     =  'Dither Closing Notification';
															var ntfn_body   =  "Your Dither has been Expired";
															getDeviceId.forEach(function(factor, index){
																device_Arr.push(factor.deviceId);
															});
															if(device_Arr.length){
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
																			}else{
																				console.log("Notification sended")
																				return {"msg":"haii"};
																			}
																	});
															}
													},	
													function(callback){
														//------------EMAIL SENDING-------------------------
														
														User.find({id:factor.userId}).exec(function(err, userDetails){
															if(err){
																console.log(err)
															}else{   
																console.log(userDetails)
														        var data = {ditherImage:factor.image,Vote:factor.totalVote,name:userDetails[0].name,email:userDetails[0].email};
														        console.log("===================")
														        console.log(data)
																DitherCronService.emailSend(data, function(err, getEmailResult){
																
																	if(err)
																	{
																		console.log(err)
																	}
																	else
																	{
																	  console.log(getEmailResult)
																	}
																
																
																});
															}
														});  
														
														
													},	
													], function(err){ 
														if(err){
															console.log("Failure......");
															console.log(err);
														}else{
															console.log("Success --------------------");
															
															
														}
                                                    });		
												//-------------------------			
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
