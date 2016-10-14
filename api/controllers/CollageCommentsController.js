 /**
 * CollageCommentsController
 *
 * @description :: Server-side logic for managing collagecomments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs          = require('fs');

module.exports = {

 /* ==================================================================================================================================
               To Comment a Dither
   ==================================================================================================================================== */
        commentDither:  function (req, res) {

                    console.log("+++++++++++++ Comment  Dithers api ++++++++++++++++++++");
                   
                    var tokenCheck                  =     req.options.tokenCheck;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var collageId                   =     req.param("dither_id");
                    var comment                     =     req.param("comment_msg");
                    var device_type                 =     req.get('device_type');
                    var mention_user_id				=     [];
					//var	mention_arr					=     req.param("mentions");

					var profilePic_path_assets 		=     req.options.file_path.profilePic_path_assets;
					var server_baseUrl         		=     req.options.server_baseUrl;
					var server_image_baseUrl   		=     req.options.settingsKeyValue.CDN_IMAGE_URL;
					var profilePic_path        		=     server_baseUrl + req.options.file_path.profilePic_path;
					var	mention_arr					=    ['test_user','anu_r'];
					var profile_image = '';
					console.log("mention array")

					console.log(mention_arr)
                    if(!collageId || !comment){
                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please pass the dither_id and comment_msg'});
                    }else{
                            console.log(req.params.all());
                            var values = {
                                collageId       :       collageId,
                                userId          :       userId,
                                comment         :       comment,
                            };
                            Collage.findOne({id:collageId}).exec(function(err, collageDetails){
                                    if(err){
                                        console.log(err);
                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in finding collage!!', error_details: err});
                                    }else{
                                        if(!collageDetails){
                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage found'});
                                        }else{
                                            CollageComments.create(values).exec(function(err, results){
                                                    if(err){
                                                            console.log(err);
                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Dither Comment Insertion', error_details: err});
                                                    }
                                                    else{
                                                        var roomName  = "socket_dither_"+collageId;
                                                        sails.sockets.broadcast(roomName,{
                                                                                        type            : "update",
                                                                                        id              : collageId,
                                                                                        user_id         : userId,
                                                                                        message         : "Comment Dither - Room Broadcast",
                                                                                        //roomName        : roomName,
                                                                                        //subscribers     : sails.sockets.subscribers(roomName),
                                                                                        //socket          : sails.sockets.rooms()
                                                                                        });
                                                    //-----------Notification log Insertion----------------
                                                        CollageComments.find({collageId:collageId}).exec(function(err, commentDetails){
                                                            if(err){
                                                                console.log(err)
                                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Comments not found!!', error_details: err});
                                                            }else{
																
															async.series([
                                                                        
															function(callback) {
																
																    console.log("Im functon callback()")
																    console.log(mention_arr)
																	if(mention_arr)
																		{
																			console.log("In mention_arr")
																			//var query = "SELECT id FROM user where mention_id=";
																			User.find({mentionId: mention_arr}).exec(function (err, getUserId){
																				if(err)
																				{
																					console.log("mention")
																					callback();
																				}
																				else
																				{
																					console.log("get User Idsssssssss")
																					console.log(getUserId)
																					getUserId.forEach(function(factor, index){
																						
																						mention_user_id.push(factor.id);
																					    
																					console.log("dasdasdasdsadsadsadsad")
																					console.log(mention_user_id)
																					 
                                                                                        
                                                                                    });    
                                                                                    var values ={
                                                                                            notificationTypeId  :   7,
                                                                                            userId              :   userId,
                                                                                            collage_id          :   collageId,
                                                                                            tagged_users        :   mention_user_id
                                                                                            
                                                                                        }
                                                                                       
                                                                                    NotificationLog.create(values).exec(function(err, createdNotificationTags) {
																						   if(err)
																						   {
																							   console.log(err)
																							   callback();
																							   //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in inserting Notification', error_details: err});
																						   }
																						   else
																						   {
																							   console.log(createdNotificationTags)
																							   
																							User_token.find({userId: mention_user_id}).exec(function (err, getDeviceId) {
																							//User_token.find({userId:selectContacts[0].userId }).exec(function (err, getDeviceId){
																							if(err)
																							{
																								  console.log(err);
																								  callback();
																								  //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in findig deviceId', error_details: err});
																							}
																							else
																							{

																								
																								var message     =  'Mention Notification';
																								var ntfn_body   =   tokenCheck.tokenDetails.name +" has Mentioned You In a Dither";
																								//var device_id   =  getDeviceId.deviceId;
																								var mention_deviceId_arr = [];

																								getDeviceId.forEach(function(factor, index){

																									mention_deviceId_arr.push(factor.deviceId);

																								});

																								console.log(results)

																								if(!mention_deviceId_arr.length){
																										callback();
																										//return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Mention Push Notification', error_details: err});
																								}else{
																										//device_id       =  device_id.split(',');sails.log.debug(device_id);
																										var data        =  {message:message,device_id:mention_deviceId_arr,NtfnBody:ntfn_body,NtfnType:7,id:collageId,notification_id:createdNotificationTags.id};
																										var switchKey   =  device_type;
																										
																										NotificationService.NtfnInAPP(data,device_type, function(err, ntfnSend) {
																												if(err)
																												{
																													console.log("Error in Push Notification Sending")
																													console.log(err)
																													callback();
																												}
																												else
																												{
																													console.log("Push notification result")
																													console.log(ntfnSend)
																													console.log("Push Notification sended")
																													callback();
																													
																												}
																										});
																										
																										
																										/*switch(switchKey){
																												case 'ios' :
																															NotificationService.pushNtfnApn(data, function(err, ntfnSend) {
																																if(err)
																																{
																																	console.log("Error in Push Notification Sending")
																																	console.log(err)
																																	callback();
																																}
																																else
																																{
																																	console.log("Push notification result")
																																	console.log(ntfnSend)
																																	console.log("Push Notification sended")
																																	callback();
																																	
																																}
																															});
																												break;

																												case 'android' :
																															NotificationService.pushNtfnGcm(data, function(err, ntfnSend) {
																																if(err)
																																{
																																	console.log("Error in Push Notification Sending")
																																	console.log(err)
																																	callback();
																																}
																																else
																																{
																																	console.log("Push notification result")
																																	console.log(ntfnSend)
																																	console.log("Push Notification sended")
																																	callback();
																																}
																															});
																												break;
																												default:
																															callback();

																												break;
																												


																										}*/
																								}

																							//------------------------------
																							}
																						  });

																							   
																							   
																						   }
																					   }); 
																				}
																			});
																		}
																		else
																		{
																			callback();
																		}
															
															},
															function(callback) {

															   console.log("Notification For Comment");
															   console.log(mention_arr)
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
                                                                                if(err){
                                                                                    console.log(err);
                                                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in inserting collage commented users', error_details: err});
                                                                                }else{
                                                                                    var creator_roomName  = "socket_user_"+collageDetails.userId;
                                                                                    sails.sockets.broadcast(creator_roomName,{
                                                                                                                            type                       :       "notification",
                                                                                                                            id                         :       collageId,
                                                                                                                            user_id                    :       userId,
                                                                                                                            message                    :       "Comment Dither - Room Broadcast - to Creator",
                                                                                                                            //roomName                   :       creator_roomName,
                                                                                                                            //subscribers                :       sails.sockets.subscribers(creator_roomName),
                                                                                                                            //socket                     :       sails.sockets.rooms(),
                                                                                                                            notification_type          :       3,
                                                                                                                            notification_id            :       createdNotificationTags.id
                                                                                                                            });
                                                                                    //-----------------------------End OF NotificationLog---------------------------------

                                                                                   User.findOne({id:collageDetails.userId}).exec(function (err, notifySettings){
                                                                                    if(err)
                                                                                    {
                                                                                        console.log(err)
                                                                                        callback();
                                                                                        //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in retrieving user details ', error_details: err});
                                                                                    }
                                                                                    else{
                                                                                       if(notifySettings.notifyComment==0){
																						   
																						    console.log("comment Option turn off")
																							callback();
                                                                                            /*return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully commented against the dither',
                                                                                                                    comment_id                      :    results.id,
                                                                                                                    comment_msg                     :    results.msg,
                                                                                                                    comment_created_date_time       :    results.createdAt,
                                                                                                            });*/

                                                                                       }
                                                                                       else{


                                                                                            //----------------------------Push Notification For Comment------------------------------------------
                                                                                            var message   = 'Comment Notification';
                                                                                            var ntfn_body =  tokenCheck.tokenDetails.name +" Commented on Your Dither";
                                                                                            //var query   =  "SELECT DISTINCT(deviceId) FROM userToken where userId ='"+collageDetails.userId+"'";
                                                                                            //User_token.query(query, function(err, getDeviceId) {
                                                                                            User_token.find({userId: collageDetails.userId }).exec(function (err, getDeviceId){
                                                                                                if(err){
                                                                                                      console.log(err)
                                                                                                      callback();
                                                                                                      //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Push Notification', error_details: err});
                                                                                                }else{
                                                                                                    if(!getDeviceId.length){
                                                                                                       console.log("device not found")
                                                                                                       callback();
                                                                                                       /*return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully commented against the dither',
                                                                                                                            comment_id                      :    results.id,
                                                                                                                            comment_msg                     :    results.msg,
                                                                                                                            comment_created_date_time       :    results.createdAt,
                                                                                                                    });*/
                                                                                                    }else{
                                                                                                          var deviceId_arr  = [];
                                                                                                           getDeviceId.forEach(function(factor, index){

                                                                                                                        deviceId_arr.push(factor.deviceId);


                                                                                                            });
                                                                                                        if(deviceId_arr.length){
                                                                                                          var data    = {message:message, device_id:deviceId_arr,NtfnBody:ntfn_body,NtfnType:3,id:collageId,notification_id:createdNotificationTags.id};
                                                                                                          console.log(data)
                                                                                                            if(device_type=='ios'){
                                                                                                                    NotificationService.pushNtfnApn(data, function(err, ntfnSend) {
                                                                                                                        if(err){
                                                                                                                            console.log("Error in Push Notification Sending")
                                                                                                                            console.log(err)
                                                                                                                            callback();
                                                                                                                            //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Push Notification', error_details: err});
                                                                                                                        }else{
                                                                                                                            console.log("Push notification result")
                                                                                                                            console.log(ntfnSend)
                                                                                                                            console.log("Push Notification sended")
																															callback();
                                                                                                                             /*return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully commented against the dither',
                                                                                                                                comment_id                      :    results.id,
                                                                                                                                comment_msg                     :    results.msg,
                                                                                                                                comment_created_date_time       :    results.createdAt,
                                                                                                                             });*/

                                                                                                                        }
                                                                                                                    });
                                                                                                            }else if(device_type=='android'){
                                                                                                                    console.log("push notification")
                                                                                                                    NotificationService.pushNtfnGcm(data, function(err, ntfnSend) {
                                                                                                                        if(err)
                                                                                                                        {
                                                                                                                            console.log("Error in Push Notification Sending")
                                                                                                                            console.log(err)
                                                                                                                            callback();
                                                                                                                           // return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Push Notification', error_details: err});
                                                                                                                        }
                                                                                                                        else
                                                                                                                        {
                                                                                                                            console.log("Push notification result")
                                                                                                                            console.log(ntfnSend)
                                                                                                                            console.log("Push Notification sended")
                                                                                                                            callback();
                                                                                                                            /*return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully commented against the dither',
                                                                                                                                comment_id                      :    results.id,
                                                                                                                                comment_msg                     :    results.msg,
                                                                                                                                comment_created_date_time       :    results.createdAt,
                                                                                                                            });*/


                                                                                                                        }
                                                                                                                    });
                                                                                                            }else{
                                                                                                                 callback();     
                                                                                                            }
                                                                                                        }
                                                                                                    }//kkkk
                                                                                                }
                                                                                            });
																						}
																					}
                                                                                 });
                                                                               }
                                                                         });
																	}else{
																		 console.log("same")
																		 
																			callback();
																			
																	}
                                                                },
                                                                function(callback) {
																	
																	User.find({id:userId}).exec(function (err, getUseDetails){
																		if(err)
																		{
																			console.log(err)
																			callback();
																		}
																		else
																		{
																			console.log("Image Resizing")
																			console.log(getUseDetails[0].profilePic)
																			
																			  //------------------------------Generate ThumbnailImage-----------------------------------------------
																			  console.log(getUseDetails[0].profilePic)
																				var imageSrc                    =     profilePic_path_assets + getUseDetails[0].profilePic;
																				
																				fs.exists(imageSrc, function(exists) {
																				 if (exists) {

																						console.log("Image exists");

																						var ext                         =     imageSrc.split('/');
																						ext                             =     ext[ext.length-1].split('.');
																						var imageDst                    =     profilePic_path_assets + ext[0] + "_50x50" + "." +ext[1];
																						console.log(imageSrc)
																						console.log(imageDst)
																						ImgResizeService.isImageExist(imageSrc, imageDst, function(err, imageResizeResults) {
																							
																							if(err)
																							{
																								console.log(err)
																								callback();
																							}
																							else
																							{
																								console.log(imageResizeResults)
																								profile_image = profilePic_path + ext[0] + "_50x50" + "." +ext[1];
																								console.log(profile_image)
																								callback();
																							}
																						});
																					}
																				});		
																			
																		}
																	});
																},

                                                                //=========================================
                                                                ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
                                                                                        if (err) {
                                                                                            
                                                                                            console.log(err);
																							return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured Comment Updation', error_details: err});
                                                                                           
                                                                                        }else{

																								console.log("result")
																								return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully commented against the dither',
                                                                                                                                comment_id                      :    results.id,
                                                                                                                                comment_msg                     :    results.msg,
                                                                                                                                comment_created_date_time       :    results.createdAt,
                                                                                                                                profile_image					:	 profile_image
                                                                                                                        });
                                                                                        }
																});
                                                                
                                                            }
                                                        });

                                                    }
                                            });
                                        }//check collage found or not

                                    }
                            });
                    //}
                    }
        }
};

