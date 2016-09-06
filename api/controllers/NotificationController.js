/**
 * Notification Controller
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var util = require('util');

module.exports = {
	
	  /* ==================================================================================================================================
                Edit Notification Settings
	   ==================================================================================================================================== */
	
	      notificationSettings: function(req, res) {
			  
                    console.log("Notification Settingssssssssssss")
					var notifyOpinion	=	req.param('opinion');
					var notifyVote		=	req.param('vote');
					var notifyComment	=	req.param('comment');
					var notifyContact	=	req.param('contact');
					var token			= 	req.get('token');
					console.log(token)
					console.log(req.param('opinion'))
					console.log(req.param('vote'))
					console.log(req.param('comment'))
					console.log(req.param('contact'))
					
					if(token!=undefined)
					{
						User_token.findOne({token: token}).exec(function (err, results){
							if (err) {
										sails.log("jguguu"+err);
										return res.json(200, {status: 2, status_type: 'Failure' ,msg: 'Some error occured in finding userId', error_details: err});
									}
									else{
										
											sails.log(results.userId)
										
											var data     = {notifyOpinion:notifyOpinion, notifyVote:notifyVote,notifyComment:notifyComment,notifyContact:notifyContact};
											var criteria = {id: results.userId};
																					
											User.update(criteria, data).exec(function(err, updatedUser) {
												if(err) 
												{
													console.log(err)
													return res.json(200, {status: 2, status_type: 'Failure' ,msg: 'Some error occured in Updation', error_details: err});
												}
												else
												{
													console.log(updatedUser[0])
													return res.json(200, {status: 1, status_type: 'Success' ,msg: 'Settings updated Successfully',opinion:updatedUser[0].notifyOpinion,vote:updatedUser[0].notifyVote,comment:updatedUser[0].notifyComment,contact:updatedUser[0].notifyContact});
													
												}
										    });
										
										
									}
						});	
					}		
					else
					{
						console.log("token required")
						return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Token Missing in Request'});
					}
					
			  
			  
		  },

	 /* ==================================================================================================================================
                Notification API
	   ==================================================================================================================================== */

		
		notification: function(req, res) {
			
			
						console.log("Notification API")
						console.log(req.options.file_path.profilePic_path)
						var tokenCheck          =     req.options.tokenCheck;
						var user_id				= 	  tokenCheck.tokenDetails.id;
						var server_baseUrl  	=     req.options.server_baseUrl;
						var profilePic_path	    =     server_baseUrl + req.options.file_path.profilePic_path;
						var collageImg_path     =     server_baseUrl + req.options.file_path.collageImg_path;
						var device_id 			= 	  tokenCheck.tokenDetails.deviceId;
						var device_type			=	  req.get('device_type');
						
						notificationVoted 		= 	  "";
						notificationCommented 	= 	  "";
						notificationSignup		= 	  "";
						notifyVoteArray	   		= 	  [];
						notifyCmntArray			= 	  [];
						
						var query 	= 	" SELECT"+ 
										" N.userId,N.ditherUserId,N.collage_id as ditherId,N.notificationTypeId,N.createdAt as createdDate,N.image_id,N.tagged_users,N.description,"+
										" U.name,U.profilePic as profile_image,"+
										" C.image as dither_image"+
										" FROM  notificationLog as N LEFT JOIN user as U ON U.id = N.userId"+
										" LEFT JOIN collage as C ON C.id = N.collage_id"+
										" WHERE"+
										" N.ditherUserId="+user_id+
										" AND(N.notificationTypeId=1 OR N.notificationTypeId=2 OR N.notificationTypeId=3 OR N.notificationTypeId=4)"+
										" OR "+
										" FIND_IN_SET("+user_id+", N.tagged_users)";
										
					  //---------------test pagination-------------------------------
					  
					/*  var query 	= 	" SELECT"+ 
										" N.userId,N.ditherUserId,N.collage_id as ditherId,N.notificationTypeId,N.createdAt as createdDate,N.image_id,N.tagged_users,N.description,"+
										" U.name,U.profilePic as profile_image,"+
										" C.image as dither_image"+
										" FROM  notificationLog as N LEFT JOIN user as U ON U.id = N.userId"+
										" LEFT JOIN collage as C ON C.id = N.collage_id"+
										" WHERE"+
										" N.ditherUserId="+user_id+
										" AND(N.notificationTypeId=1 OR N.notificationTypeId=2 OR N.notificationTypeId=3 OR N.notificationTypeId=4)"+
										" OR "+
										" FIND_IN_SET("+user_id+", N.tagged_users)"*/
					//--------------------------------------------------------------------
						
											
						console.log(query)
						NotificationLog.query(query, function(err,results) {
							
							if(err)
							{
								console.log(err)
							}
							else
							{
								console.log(results.length)
								
								if(typeof results != 'undefined' && results.length!=0)
								{
								    
									async.forEach(results, function (item, callback){ 
									if(item.notificationTypeId==1 || item.notificationTypeId==2 || item.notificationTypeId==3 || item.notificationTypeId==4)	
										{
										  //----------Comment Notification---------------------------
										  
										  if(item.notificationTypeId==3) 
										  {
											  
											//  console.log(item.description)
											  NotificationType.find({id:3 }).exec(function(err, ntfnTypeFound){
									
													if(err)
													{		
														console.log(err)
														callback(true,ntfnTypeFound );
													}	
													else
													{
														
															console.log(item)
															notificationCommented = "No notification Found for comments";
															var notification	= ntfnTypeFound[0].body;
															item.description 	= item.description - 1;
															console.log(notification)
															ntfn_body  			= 	util.format(notification,item.description);
															item.ntfn_body		=	ntfn_body;
															item.type			=	ntfnTypeFound[0].type;
															item.profile_image	=	profilePic_path + item.profile_image;
															item.dither_image	=	collageImg_path + item.dither_image;
															if(item.description<=0)
															{ 
																console.log("commenteddd")
																notificationCommented = " commented on your Dither";
																item.ntfn_body		  =	notificationCommented;
																callback();
															}
															else
															{
																	 console.log("77777777777777777777777777777777777777777777777")
																	 notificationCommented =  ntfn_body;
																	 notifyCmntArray	   = [];
																	 notifyCmntArray.push({ditherId: item.collage_id, userId: item.ditherUserId,msg:notificationCommented});
																	 console.log(notifyCmntArray)
																	 console.log("PUSHH NOtiFiCationnnnnnnnnnnnnn")
																	 callback();
															}
													}
							
												});
										  }
										  else if(item.notificationTypeId==2)
										      {
												  
												  console.log("vote?????????")
												  NotificationType.find({id:2 }).exec(function(err, ntfnTypeFound){
									
														if(err)
														{		
															console.log(err)
															callback(true,ntfnTypeFound );
														}	
														else
														{
									
															console.log(item.description)
															
															console.log(ntfnTypeFound)
															var notification	= ntfnTypeFound[0].body;
															console.log(notification)
															item.description	= item.description - 1;
															ntfn_body  			= util.format(notification,item.description);
															item.ntfn_body		=	ntfn_body;
															item.type			=	ntfnTypeFound[0].type;
															item.profile_image	=	profilePic_path + item.profile_image;
															item.dither_image	=	collageImg_path + item.dither_image;
															if(item.description<=0)
															{
															  notificationVoted = " voted on your Dither";
															  item.ntfn_body	= notificationVoted; 
															  callback();
															}
															else
															{
																
																notificationVoted  	=  ntfn_body;
																notifyVoteArray	    = [];
																notifyVoteArray.push({ditherId: item.collage_id, userId: item.ditherUserId,msg:notificationVoted});
																console.log(notifyVoteArray)
																callback();
														    }
														}
										
													});
												  
												  
											  }
											  else if(item.notificationTypeId==4)
											  {
												  console.log("signuppp")
												  NotificationType.find({id:4 }).exec(function(err, ntfnTypeFound){
										
														if(err)
															{		
																console.log(err)
																callback(true,ntfnTypeFound );
															}	
														else
															{
																	console.log(ntfnTypeFound)
																	var notification	= ntfnTypeFound[0].body;
																	console.log(notification)
																	ntfn_body  			= util.format(notification);
																	item.ntfn_body		=	ntfn_body;
																	item.type			=	ntfnTypeFound[0].type;
																	item.profile_image	=	profilePic_path + item.profile_image;
																	item.dither_image	=	collageImg_path + item.dither_image;
																	console.log(ntfn_body)
																	notificationSignup  =  ntfn_body;
																	callback();
																

															}
															
													});
												  
												  
											  }
											  else if(item.notificationTypeId==1)
											  {
												
												 NotificationType.find({id:1 }).exec(function(err, ntfnTypeFound){
									
															if(err)
															{		
																console.log(err)
															}	
															else
															{
										
																console.log(item.description)
																console.log(ntfnTypeFound)
																var notification	= ntfnTypeFound[0].body;
																console.log(notification)
																var ntfn_body  		= util.format(notification,item.name);
																item.type			=	ntfnTypeFound[0].type;
																item.ntfn_body		=	ntfn_body;
																item.profile_image	=	profilePic_path + item.profile_image;
																item.dither_image	=	collageImg_path + item.dither_image;
																console.log(item.profile_image)
																console.log(ntfn_body)
																notificationTagged  =  ntfn_body;
																callback();						

															}
										
													});
												 
									
												}
											  
											  
										}	
										else
										{
											callback();
										}
										
									}, function(err) {
								
								       console.log("resulttt dataaa")
								       console.log(results)
										return res.json(200, {status: 1,status_type:"Success", msg: 'success',notification_data:results});
									});
								
							}
							else
								{
									return res.json(200, {status: 2,status_type:"Failure",msg: 'No notification found'});
								}
							}
						});
						
						
			
		},
		


};
