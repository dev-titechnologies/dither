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
				console.log(req.get('token'))
				UsertokenService.checkToken(req.get('token'), function(err, tokenCheck) {
			
					if(err) 
					{	
						return res.json(200, {status: 2, msg: 'some error occured', error_details: tokenCheck});
					}
					else
					{ 
						
						console.log("+++++++++++++++++++++++++")
						console.log(tokenCheck.tokenDetails.id)
						var user_id	= tokenCheck.tokenDetails.id;
						
						//---Notification-signup---

						var query	=  "SELECT N.ditherUserId,U.name,U.profilePic,U.phoneNumber,U.email,U.fbId from notificationLog as N LEFT JOIN user as U ON N.ditherUserId = U.id where N.ditherUserId='"+user_id+"'";


						NotificationLog.query(query, function(err, NtfnResult) {
							
							console.log("hhhhhhhhhhhh")
							if(err)
							{
								console.log(err)
								return res.json(200, {status:2, status_type: 'Failure',msg:"Notification Not found"});
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
										console.log("00000000000000000000000000000000000000000")
										if(err)
										{		
											console.log(err)
										}	
										else
										{
											console.log(ntfnTypeFound)
											var notification	= ntfnTypeFound[0].body;
											console.log(notification)
											var ntfn_body  = util.format(notification,username);
											console.log(ntfn_body)
										    return res.json(200, {status:1, status_type: 'Success',msg:"Notifications found",data:{name:username,profile_image:profile_image,phoneNumber:phoneNumber,email:email,fbId:fbId}});							

										}
										
									});
                                    
                                    									
								}
							}
							
						});
						
						//-----------Notification For Tagged In Users----------------------------------
						
						/*var query	=  "SELECT `tagged_users` FROM `notificationLog` where `ditherUserId` = 7 OR ditherUserId in (SELECT `tagged_users` from `notificationLog`)";
						NotificationLog.query(query, function(err, NtfnTagResult) {
							
							if(err)
							{
								return res.json(200, {status:2, status_type: 'Failure',msg:"Notification Not found"});
							}
							else
							{
								console.log(NtfnTagResult)
								return res.json(200, {status:1, status_type: 'success',msg:"Notification found"});
							}
						});*/
						
					
					}
					
				});	
			
		},
		


};
