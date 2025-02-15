/**
 * FbFetchController
 *
 * @description :: Server-side logic for managing fbfetches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	
	/* ===================================================================================================================================
             FB CALLBACK
    ================================================================================================================================== */
    fbcallback: function (req, res){

          console.log("--------------GET FBCALLBACK---------------")
          console.log(req.params.all())
          var request			= require('request');
          var my_token_code		= 5;
          var challenge 		= req.param('hub.challenge');
		  var verify_token 		= req.param('hub.verify_token');
		  var frnds	 	    	= [];
		  var frnds_arr			= [];
		  var fbUserArray 		= [];
		  var deviceId_arr 		= [];
		  var params 			= req.params.all();

		  console.log("rececive dataaaaaaaaaaaaa")
		  console.log(params)
		  var data			= JSON.stringify(params);
		  console.log(data)
		  console.log(data.length)

		  if(data.length==undefined || data.length=={}){
			            
			  return res.json(200, {status: 2, status_type: 'Failure',message:'no data found'});
			   //return res.send(challenge);
		  }else{ 
		     console.log("dataaaaaaaaaaa")
			 
			 console.log(data)
			 var fbData 	 	= JSON.parse(data);
			 if(fbData.entry){ 
			  
			  var change_arr 	= [];
			  change_arr	 	=	fbData.entry[0].changed_fields;
			  var fbId		 	=	fbData.entry[0].id;
			  var frndsArr 		= [];
			  var push_arr 		= [];
			  var userId ;
			  var username;
			  var accessToken;
			  console.log(fbId)
			  if((change_arr.indexOf('friends')>=0) && (fbData.object=='user')){
				  console.log("trueee")
				  User.findOne({fbId:fbId}).exec(function (err, result){
					if(err){
						console.log(error)
						callback();
					}
					else{
						console.log("----------------Fetching User Details-----------------")
						if(result){
							console.log(result)
							userId   = result.id;
							username = result.name;
							accessToken = result.accessToken;
						}
						console.log("access Token------------")
						console.log(accessToken)
						console.log('https://graph.facebook.com/v2.8/me/friends?access_token='+accessToken+'&debug=all&format=json&method=get&pretty=0&suppress_http_code=1')
						async.series([
						  function(callback) {
								  console.log("===========================1=====FB data store=====================")
								  console.log(data)
									values = {
												  data:data
											 }
									TempFbData.create(values).exec(function(err, results){
											if(err){
												console.log(err)
												callback();
											}
											else{
												console.log("data inserted")
												console.log(results)
												callback();
											}
									});
							},	

							function(callback) {
							  console.log("===========================2===get frnds Listtttttt=======================")
							  request.get({
									url: 'https://graph.facebook.com/v2.8/me/friends?access_token='+accessToken+'&debug=all&format=json&method=get&pretty=0&suppress_http_code=1'
								  }, function(error, response, body) {
									if (error) {
										console.log(error)
										//return res.json(200, {status: 2, status_type: 'Failure'});
										callback();
									}
									else {
										//sails.log.info(response);
										console.log("-----------Response-----------------")
										frnds			=	JSON.parse(response.body);
										frnds_arr		=	frnds.data;
										console.log("frnds list")
										console.log(frnds_arr)
										if(frnds_arr){
											frnds_arr.forEach(function(factor, index){
													
												frndsArr.push(factor.id)

											});
										}
										var query = "SELECT  ditherUserName,fbId FROM fbFriends where userId='"+userId+"'";
										console.log(query)
										FbFriends.query(query, function(err, resultData){
										//FbFriends.find({userId:4}).exec(function (err, resultData){
											if(err){
												console.log(error)
												callback();
											}
											else{
												//console.log(resultData)
												var res_arr = [];
												if(resultData.length){
												
													resultData.forEach(function(factor, index){
											
														res_arr.push(factor.fbId)
															
													});
												 }
												 console.log(res_arr.length)
												 console.log(frndsArr.length)
												 
												 if(res_arr.length && frndsArr.length){
													 
													 if(frndsArr.length > res_arr.length){ // add a friend
														 
														 frndsArr.forEach(function(factor, index){
															  console.log("add a frienddddddddd")
															if(res_arr.indexOf(factor)<0){
																console.log(factor)
																push_arr.push(factor)
															}
														  });
														  callback();
													 } //unfriend
													 else if(frndsArr.length < res_arr.length){
														 res_arr.forEach(function(factor, index){
															  console.log("----Unfriendddddddddddd---")
															if(frndsArr.indexOf(factor)<0){
																console.log(factor)
																push_arr.push(factor)
															}
														  });
														  callback();
													 }
													else{
														 callback();
													 }
												 }
												 else
												 {
												
													callback();
												 }
											}
											
										});
											
									}
								});	
							},
							function (callback){
								console.log("========================3------===device arr===================")
							 if(push_arr.length){	
								User_token.find({userId: userId}).exec(function (err, getDeviceId){
									if(err){
										  console.log(err);
										 // callback();
									}else{
										
										if(getDeviceId){
											getDeviceId.forEach(function(factor, index){
												deviceId_arr.push(factor.deviceId);
											});
											callback();
										}else{
											callback();
										}	
								    }
								});
							  }else{
								  callback();
							  }	
								
							},
							function(callback) {
								
								//-----------push------------------------
								console.log("===========================4==Push Notification===================")
								console.log("--------Push Notification Array--------")
								console.log(push_arr)
								var userId_arr = [];
								
								if(push_arr.length){
									
									User.find({fbId: push_arr}).exec(function (err, getUserId){
										
										if(err){
											callback();
										}else{
											
											getUserId.forEach(function(factor, index){
												fbUserArray.push("("+factor.id+",'"+result.name+"','"+result.fbId+"', now(), now())");
												if(factor.notifyContact){
													userId_arr.push({
                                                                id   : factor.id,
                                                                name   : factor.name,
                                                                fbId   : factor.fbId
													});
												}
											});
											
											if(userId_arr){
												console.log("useriddddddddddddd")
												userId_arr.forEach(function(factor, index){
													console.log(factor)
														var values ={
															notificationTypeId  :   5,
															userId              :   factor.id,
															ditherUserId        :   userId
														}
														console.log("valuessssssssssss")
														console.log(values)
														NotificationLog.create(values).exec(function(err, createdNotification){
															if(err){
																console.log(err);
																//callback();
															}else{
																
																var message     =  'FBsignup Notification';
																var ntfn_body   =   "Your facebook friend "+factor.name+" is now on Dither";
																if(!deviceId_arr.length){
																	console.log("deviceeee array empty")
																	//callback();
																}else{
																	console.log("----------Device Array---------------")
																	console.log(deviceId_arr)
																	var data        =  {
																							message         :   message,
																							device_id       :   deviceId_arr,
																							NtfnBody        :   ntfn_body,
																							NtfnType:5,id   :   userId,
																							notification_id :   createdNotification.id,
																							old_id          :   '',
																							name            :   factor.name
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
																			 }
																	 });
																  }
																		
															  }
														});
												});	
											 callback();	
											}
											else{
												callback();
											}
										
										}
										
									});
									
								}else{
									callback();
								}
								
							},
							], function(err) { //This function gets called after the two tasks have called their "task callbacks"
									if(err){
										console.log("Lasttttttttttttttttttttt   ERROR");
										console.log(err);
										return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured ', error_details: err});
									}else{
										console.log("Lasttttttttttttttttttttt");
										console.log(fbUserArray.length)
										if(fbUserArray.length!=0){
											var query =  "INSERT INTO TempFbFriends"+
														 " (userId,fbName,fbId, createdAt, updatedAt)"+
														 " VALUES"+fbUserArray;
											TempFbFriends.query(query,function(err, createdFbFriends){
												if(err){
													console.log(err)
													return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured '});
												}else{
													console.log(createdFbFriends)
													return res.json(200, {status: 1, status_type: 'success'});
												}
											});
										}else{
											
											return res.json(200, {status: 1, status_type: 'success'});
										}	
											
									}
							});
						}
					});		
					
			  }else{
				  console.log("false")
				  return res.json(200, {status: 2, status_type: 'Failure'});
			  }
			  
			  
			}else{
				return res.json(200, {status: 2, status_type: 'Failure',message:'no data found'});
			}			 
		  }
		 
    },
    /* ===================================================================================================================================
             FB CALLBACK
    ================================================================================================================================== */
   /* fbcallback: function (req, res){

          console.log("--------------GET FBCALLBACK---------------")
          console.log(req.params.all())
          console.log(req.body)
          console.log(req.headers)
          console.log(req.hub_challenge)
          var my_token_code	= 5;
          var challenge 	= req.param('hub.challenge');
		  var verify_token 	= req.param('hub.verify_token');
		  var data 			= req.params.all();
		  console.log(data)
		  if(data){
			   console.log(data)
			   values = {
							data:JSON.stringify(data)
						}
				TempFbData.create(values).exec(function(err, results){
						if(err){
							console.log(err)
							return res.json(200, {status: 2, status_type: 'Failure'});
						}
						else{
							console.log("data inserted")
							console.log(results)
						    if (verify_token == my_token_code) {

								 return res.send(challenge);
						    }
						    else{
								
								  return res.json(200, {status: 2, status_type: 'Failure'});
								}
						}
				});
		  }
		  else{
			  return res.json(200, {status: 2, status_type: 'Failure',message:'no data found'});
		  }

    },*/

	
};

