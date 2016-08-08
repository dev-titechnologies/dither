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

		//---Notification-tagged---

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
						if(tokenCheck.tokenDetails.notifyOpinion==true)
						{
							
							var query="SELECT"
							
							return res.json(200, {status: 1, msg: 'Success',error_details: tokenCheck});
						}
						else
						{
							return res.json(200, {status: 1, msg: 'No need to send notification',error_details: tokenCheck});
						}
					}
					
					
				 //-----------Notification For Tagged In Users----------------------------------
				 
					
				 
				 
				 	
					
				});	
			
		},



};
