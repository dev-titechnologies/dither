 /**
 * CollageCommentsController
 *
 * @description :: Server-side logic for managing collagecomments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

 /* ==================================================================================================================================
               To Comment a Dither
   ==================================================================================================================================== */
        commentDither:  function (req, res) {

                    console.log("Comment  Dithers ===== api");
                    console.log(req.param("dither_id"));
                    //console.log(req.param("user_id"));
                    console.log(req.param("comment_msg"));
                    var tokenCheck                  =     req.options.tokenCheck;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var collageId                   =     req.param("dither_id");
                    var comment                     =     req.param("comment_msg");
					var device_type					=	  req.get('device_type');
					
                    if(!collageId || !comment){
                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please pass the dither_id and comment_msg'});
                    }else{
                            var values = {
                                collageId       :       collageId,
                                userId          :       userId,
                                comment         :       comment,
                            };
                            Collage.findOne({id:collageId}).exec(function(err, collageDetails){
                                    if(err)
                                    {
                                        console.log(err);
                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in finding collage!!', error_details: err});
                                    }
                                    else
                                    {
                                        if(!collageDetails){
                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage found'});
                                        }else{
                                            CollageComments.create(values).exec(function(err, results){
                                                    if(err){
                                                            console.log(err);
                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Dither Comment Insertion', error_details: err});
                                                    }
                                                    else{
                                                    //-----------Notification log Insertion----------------
                                                    console.log("88888888888888888888888888888")
                                                        CollageComments.find({collageId:collageId}).exec(function(err, commentDetails){
                                                           if(err)
                                                           {
                                                                console.log(err)
                                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Comments not found!!', error_details: err});
                                                           }
                                                           else
                                                           {
                                                                if(userId   !=  collageDetails.userId)
                                                                {
                                                                        console.log("inserted comments  Different User Comment");
                                                                        console.log("own comment not included")
                                                                        var values ={
                                                                                        notificationTypeId  :   3,
                                                                                        userId              :   userId,
                                                                                        ditherUserId        :   collageDetails.userId,
                                                                                        collage_id          :   collageId,
                                                                                        description         :   commentDetails.length
                                                                                    }
                                                                        NotificationLog.create(values).exec(function(err, createdNotificationTags) {
                                                                                if(err)
                                                                                {
                                                                                    console.log(err);
                                                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in inserting collage commented users', error_details: err});
                                                                                }
                                                                                else
                                                                                {
                                                                                    console.log(createdNotificationTags);
                                                                                    //-----------------------------End OF NotificationLog---------------------------------
                                                                                    console.log("inserted comments");
                                                                                    console.log(results);
                                                                                    
                                                                                    //----------------------------Push Notification For Comment------------------------------------------
																						var message   = 'Comment Notification';
																						var ntfn_body =  tokenCheck.tokenDetails.name +" Commented on Your Dither";
																						
																						
																						 User_token.findOne({userId: collageDetails.userId }).exec(function (err, getDeviceId){
																						  if(err)
																						  {
																							  console.log(err)
																							  return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Push Notification', error_details: err});
																						  }	
																						  else
																						  {	
																							  
																						   var device_id	= getDeviceId.deviceId;
																						   if(device_id)
																						   {
																							  console.log(getDeviceId.deviceId)	  
																							  
																							  var data 	  = {message:message, device_id:device_id,NtfnBody:ntfn_body};
																							  console.log(data)
																							  if(device_type=='ios')
																								{
																									  
																										NotificationService.pushNtfnApn(data, function(err, ntfnSend) {
																											if(err)
																											{
																												console.log("Error in Push Notification Sending")
																												console.log(err)
																												return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Push Notification', error_details: err});
																											}
																											else
																											{
																												console.log("Push notification result")
																												console.log(ntfnSend)
																												console.log("Push Notification sended")
																												
																												 return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully commented against the dither',
																													comment_id                      :    results.id,
																													comment_msg                     :    results.msg,
																													comment_created_date_time       :    results.createdAt,
																												 });
																													
																											}
																										});
																								 }
																								 else if(device_type=='android')
																								  {
																												console.log("push notification")
																												NotificationService.pushNtfnGcm(data, function(err, ntfnSend) {
																													if(err)
																													{
																														console.log("Error in Push Notification Sending")
																														console.log(err)
																														return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Push Notification', error_details: err});
																													}
																													else
																													{
																														console.log("Push notification result")
																														console.log(ntfnSend)
																														console.log("Push Notification sended")	
																														return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully commented against the dither',
																															comment_id                      :    results.id,
																															comment_msg                     :    results.msg,
																															comment_created_date_time       :    results.createdAt,
																														});
																														
																															
																													}
																												});  
																								  }	
																								  else
																								  {
																											return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully commented against the dither',
																													comment_id                      :    results.id,
																													comment_msg                     :    results.msg,
																													comment_created_date_time       :    results.createdAt,
																											});
																								  }
																								 }
																								} 
																							});  
																						//}  
                                                                                   
                                                                                }
                                                                        });


                                                                }else{
                                                                        console.log("inserted comments  Same User Comment");
                                                                        console.log(results);
                                                                        return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully commented against the dither',
                                                                                                    comment_id                      :    results.id,
                                                                                                    comment_msg                     :    results.msg,
                                                                                                    comment_created_date_time       :    results.createdAt,
                                                                                            });
                                                                }
                                                            }
                                                        });

                                                    }
                                            });
                                        }//check collage found or not

                                    }
                            });
                    }
        }
};

