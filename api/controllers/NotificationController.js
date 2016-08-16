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
						
						notificationVoted 		= "";
						notificationCommented 	= "";
						notificationSignup		= "";
						notifyVoteArray	   		= [];
						notifyCmntArray			= [];
						
							/*var query = "(SELECT 
									N.userId,N.ditherUserId,N.collage_id as ditherId,N.notificationTypeId,N.createdAt as createdDate,N.image_id,N.tagged_users,N.description,
									U.name,U.profilePic as profile_image,
									FROM
									notificationLog as N LEFT JOIN user as U ON U.id = N.userId 
									WHERE
									N.ditherUserId='"+user_id+"' AND
									(N.notificationTypeId=1 OR N.notificationTypeId=2 OR N.notificationTypeId=3 OR N.notificationTypeId=4)
									OR 
									FIND_IN_SET('"+user_id+"', N.tagged_users))"*/
						
						
						var query = "SELECT N.userId,N.ditherUserId,U.name,U.profilePic as profile_image,N.collage_id as ditherId,N.notificationTypeId,N.createdAt as createdDate,N.image_id,N.tagged_users,N.description from notificationLog as N LEFT JOIN user as U ON U.id = N.userId where N.ditherUserId='"+user_id+"' AND (N.notificationTypeId=1 OR N.notificationTypeId=2 OR N.notificationTypeId=3 OR N.notificationTypeId=4)   OR FIND_IN_SET('"+user_id+"', N.tagged_users)"
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
														console.log("77777777777777777777777777777777777777777777777")
														console.log(ntfnTypeFound)
														var notification	= ntfnTypeFound[0].body;
														item.description 	= item.description - 1;
														console.log(notification)
													    ntfn_body  			= 	util.format(notification,item.name,item.description);
													    item.ntfn_body		=	ntfn_body;
													    item.type			=	ntfnTypeFound[0].type;
													    item.profile_image	=	profilePic_path + item.profile_image;
														if(item.description==0)
													    {
															notificationCommented = item.name + " commented on your Dither";
														}
														else
														{
														 notificationCommented =  ntfn_body;
														 notifyCmntArray	   = [];
														 notifyCmntArray.push({ditherId: item.collage_id, userId: item.ditherUserId,msg:notificationCommented});
														 console.log(notifyCmntArray)
														 
														 //notifyCmntArray.push(ditherId:item.collage_id,userId:ditherUserId)
													    }
														
														callback();						

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
															ntfn_body  			= util.format(notification,item.name,item.description);
															item.ntfn_body		=	ntfn_body;
															item.type			=	ntfnTypeFound[0].type;
															item.profile_image	=	profilePic_path + item.profile_image;
															notificationVoted  	=  ntfn_body;
															notifyVoteArray	    = [];
															notifyVoteArray.push({ditherId: item.collage_id, userId: item.ditherUserId,msg:notificationVoted});
															console.log(notifyVoteArray)
															//notifyVoteArray.push(ditherId:item.collage_id,userId:ditherUserId)
															callback();	
															
															 
																				

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
																	ntfn_body  			= util.format(notification,item.name);
																	item.ntfn_body		=	ntfn_body;
																	item.type			=	ntfnTypeFound[0].type;
																	item.profile_image	=	profilePic_path + item.profile_image;
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
																var ntfn_body  		= util.format(notification,item.description);
																item.type			=	ntfnTypeFound[0].type;
																item.profile_image	=	profilePic_path + item.profile_image;
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
								
										return res.json(200, {status: 1,status_type:"Success", msg: 'success',notification_data:results});
									});
								
							}
							else
								{
									return res.json(200, {status: 2,status_type:"Failure",msg: 'No notification found'});
								}
							}
						});
						
						/*console.log("+++++++++++++++++++++++++")
						console.log(tokenCheck)
						console.log(tokenCheck.tokenDetails.id)
						var user_id	= tokenCheck.tokenDetails.id;
						
						async.series([
						
								function(callback) {    
										  
										  
									async.parallel([
										  
										  function(callback) {
														//---Notification-signup---

														var query	=  "SELECT N.ditherUserId,U.name,U.profilePic,U.phoneNumber,U.email,U.fbId,N.createdAt,N.updatedAt from notificationLog as N LEFT JOIN user as U ON N.ditherUserId = U.id where N.ditherUserId='"+user_id+"'";

														NotificationLog.query(query, function(err, NtfnResult) {
							
																console.log("hhhhhhhhhhhh")
																if(err)
																{
																	console.log(err)
																	callback(true, {status: 2, status_type: 'Failure' ,message: 'Notification Not found'});
																}
																else
																{
																		if(NtfnResult.length!=0)
																		{
																			console.log("Notification Found")
																			console.log(NtfnResult)		
																			var username		= NtfnResult[0].name;
																			var profile_image	= NtfnResult[0].profilePic;
																			var phoneNumber		= NtfnResult[0].phoneNumber;
																			var email			= NtfnResult[0].email;
																			var fbId			= NtfnResult[0].fbId;
																			NotificationType.find({id:4 }).exec(function(err, ntfnTypeFound){
										
																				if(err)
																					{		
																						console.log(err)
																					}	
																				else
																					{
																							console.log(ntfnTypeFound)
																							var notification	= ntfnTypeFound[0].body;
																							console.log(notification)
																							var ntfn_body  		= util.format(notification,username);
																							console.log(ntfn_body)
																					        notificationSignup  =  ntfn_body;
																							callback();							

																					}
										
																				});
                                    
                                    									
																		}
																}
							
														});
												},	
												function(callback) {
													
													//-----------Notification For Tagged In Users----------------------------------
						
													var query = "SELECT N.ditherUserId,N.`tagged_users`,N.`collage_id`,N.description,N.createdAt,N.updatedAt FROM `notificationLog` as N INNER JOIN user as U ON U.id = N.userId where N.`ditherUserId` = '"+user_id+"'";
													console.log(query)
													NotificationLog.query(query, function(err, NtfnTagResult) {
							
													if(err)
													{		
														console.log(err)
														callback(true, {status: 2, status_type: 'Failure' ,message: 'Notification Not found'});
													}
													else
													{

														console.log(NtfnTagResult[0].description)
														
														NotificationType.find({id:1 }).exec(function(err, ntfnTypeFound){
									
																if(err)
																{		
																	console.log(err)
																}	
																else
																{
											
																	console.log(NtfnTagResult[0].description)
																	console.log(ntfnTypeFound)
																	var notification	= ntfnTypeFound[0].body;
																	console.log(notification)
																	var ntfn_body  		= util.format(notification,NtfnTagResult[0].description);
																	console.log(ntfn_body)
																	notificationTagged  =  ntfn_body;
																	callback();						

																}
										
														});
								
								
													}
												});
													
															
											},
											
											function(callback) {
													
													//-----------Notification For UserVotes----------------------------------
													
													var query ="SELECT  N.userId,N.ditherUserId,N.description,N.collage_id,U.name FROM `notificationLog` as N LEFT JOIN user as U ON N.userId = U.id WHERE N.ditherUserId = '"+user_id+"' AND N.id=(SELECT MAX(id) from notificationLog)"
													NotificationLog.query(query, function(err, NtfnVoteResult) {
														
														
														if(err)
														{		
															console.log(err)
															callback(true, {status: 2, status_type: 'Failure' ,message: 'Notification Not found'});
														}
														else
														{
															console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
															console.log(NtfnVoteResult[0].name)
														   
														   
														
														
														
															NotificationType.find({id:2 }).exec(function(err, ntfnTypeFound){
									
																if(err)
																{		
																	console.log(err)
																}	
																else
																{
											
																	console.log(NtfnVoteResult[0].description)
																	console.log(ntfnTypeFound)
																	var notification	= ntfnTypeFound[0].body;
																	console.log(notification)
																	var ntfn_body  		= util.format(notification,NtfnVoteResult[0].name,NtfnVoteResult[0].description-1);
																	console.log(ntfn_body)
												
																	if(NtfnVoteResult[0].description!=1)
																	{
																		notificationVoted  =  ntfn_body;
																	}
																	else
																	{
																		notificationVoted = NtfnVoteResult[0].name +" likes your Dither";
																	}
																	callback();						

																}
										
															});
								
								
														}
														
														

													});
													
													
													
										   },
										    
										   function(callback) {
													
													//-----------Notification For UserComments----------------------------------
													
													var query ="SELECT  N.userId,N.ditherUserId,N.description,N.collage_id,U.name FROM `notificationLog` as N LEFT JOIN user as U ON N.userId = U.id WHERE N.ditherUserId = '"+user_id+"'AND N.id=(SELECT MAX(id) from notificationLog)"
													NotificationLog.query(query, function(err, NtfnCommentResult) {
														
														
														if(err)
														{		
															console.log(err)
															callback(true, {status: 2, status_type: 'Failure' ,message: 'Notification Not found'});
														}
														else
														{
															console.log("6666666666666666666666666666666666666666666666")
															console.log(NtfnCommentResult)
														   
														   
														
														
														
															NotificationType.find({id:3 }).exec(function(err, ntfnTypeFound){
									
																if(err)
																{		
																	console.log(err)
																}	
																else
																{
																	
																	console.log("77777777777777777777777777777777777777777777777")
																	console.log(NtfnCommentResult)
																	console.log(NtfnCommentResult[0].description)
																	console.log(ntfnTypeFound)
																	var notification	= ntfnTypeFound[0].body;
																	console.log(notification)
																	var ntfn_body  		= util.format(notification,NtfnCommentResult[0].name,NtfnCommentResult[0].description-1);
																	console.log(ntfn_body)
												
																	if(NtfnCommentResult[0].description!=1)
																	{
																		notificationCommented =  ntfn_body;
																	}
																	else
																	{
																		notificationCommented = NtfnCommentResult[0].name +" commented on your Dither";
																	}
																	callback();						

																}
										
															});
								
								
														}
														
														

													});
													
													
													
										   }, 
										    
										    
										   
										  ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
													if (err) {
																console.log(err);
																callback(true, {status: 2, status_type: 'Failure' ,message: 'Notification Not Found'});
															}else{
                                                
																  console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
																  callback();
																 }

												});
								
								}
							], function(err) { //This function gets called after the two tasks have called their "task callbacks"
                                            if (err) {
                                                console.log(err);
                                                return res.json(200, {status: 2, status_type: 'Failure' , message: 'Notification Not Found', error_details: err}); //If an error occured, we let express/connect handle it by calling the "next" function
                                            }else{
                                                console.log("Success -----------------------------------------");
                                                return res.json(200, {status: 1, status_type: 'Success' , message: 'Notifications Found',dataSignUp:notificationSignup,dataTag:notificationTagged,dataVote:notificationVoted,dataComment:notificationCommented});
                                            }

                          });	*/
						
						
							
					
					
					
				
			
		},
		


};
