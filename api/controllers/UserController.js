/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

//var io = require('sails.io.js')( require('socket.io-client') );
 var fs		 	 = require('fs');
 var request	 = require('request');
 var path 		 = require('path');
module.exports = {

 /* ==================================================================================================================================
               To signup
     ==================================================================================================================================== */
    signup: function (req, res) {
            //console.log(req.param('name'));

            
           //profilePic Upload
				
			   var imgUrl	 	= req.param('url') ;
			   var filename  	= imgUrl.substring(imgUrl.lastIndexOf('/')+1); 
			   var imagename 	= new Date().getTime() +filename;
			  
				
				var download = function(uri, filename, callback)
				{
						request.head(uri, function(err, res, body){
						sails.log('content-type:', res.headers['content-type']);
						sails.log('content-length:', res.headers['content-length']);

						var name = request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
						
						sails.log(name.path)
						
						
					});
				};
				download(imgUrl, 'assets/images/ProfilePics/'+imagename, function()
				{
					sails.log('done');
					
				});
				
			//--end of upload--------
				
			var values = {
                        name        : req.param('name'),
                        email       : req.param('email'),
                        fbId        : req.param('fbId'),
                        phoneNumber : req.param('phoneNumber'),
                        profilePic  : imagename,
                };	
           
           
                
             User.create(values).exec(function(err, results){
                    if(err){
                            console.log(err);
                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in user creation', error_details: err});
                    }
                    else{
                            // Create new access token on login
                            UsertokenService.createToken(results.id, req.param('device_id'), function (err, userTokenDetails) {
                                if (err) {
											
											User_token.query("DELETE from user where id = '"+results.id+"'", function (err, result) {
											if (err) {
														sails.log("deletion error")
													 }
											else
												{
													sails.log("deletion success")
												}
											});
									
											return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in token creation', error_details: err});
                                } else {
                                        //User.publishCreate(result);
                                        //User.subscribe(req.socket,result);
                                        //sails.sockets.broadcast('user', { msg: 'signup set ===========' });
                                        //sails.sockets.emit(req.socket.id,'privateMessage', {msg: 'Hi!'});
                                        sails.sockets.blast('createInSignUp', {msg: 'Hi!'});

                                            // Send Email and Sms  Simultaneously
                                            async.parallel([
                                                        function(callback) {
                                                                    var global_settingsKeyValue = req.options.settingsKeyValue;
                                                                    var email_to        = results.email;
                                                                    var email_subject   = 'Dither - Signup';
                                                                    var email_template  = 'signup';
                                                                    var email_context   = {receiverName: results.name};
                                                                    EmailService.sendEmail(global_settingsKeyValue, email_to,email_subject,email_template,email_context, function(err, sendEmailResults) {
                                                                        if(err)
                                                                        {
                                                                                console.log(err);
                                                                                //return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in Email Send on signup', error_details: sendEmailResults});
                                                                                 callback();
                                                                        }else{
                                                                                //console.log(results);
                                                                                console.log(email_to);
                                                                                console.log(email_subject);
                                                                                console.log(email_template);
                                                                                console.log(email_context);
                                                                                callback();
                                                                                //return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully completed the signup'});
                                                                        }


                                                                    });

                                                        },
                                                        function(callback) {
                                                                    /*SmsService.sendSms(function(err, sendSmsResults) {
                                                                        if(err)
                                                                        {
                                                                                console.log(err);
                                                                                //return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in Sms Send on signup', error_details: sendSmsResults});
                                                                                callback();
                                                                        }else{
                                                                                //return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully completed the signup'});
                                                                                callback();
                                                                        }
                                                                    });*/
                                                                    callback();
                                                        }


                                                   ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
                                                                    if (err) {
                                                                        console.log(err);
                                                                        return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in Sms Send OR i Emai Send on signup', error_details: err}); //If an error occured, we let express/connect handle it by calling the "next" function
                                                                    }else{
                                                                        return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully completed the signup'});
                                                                    }

                                            });

                                }
                            });
                    }
            });
    },

 /* ==================================================================================================================================
               To check for a new User
     ==================================================================================================================================== */
    checkForNewUser:  function (req, res) {

            console.log(req.options.settingKeyValue);
            console.log(req.param('fbId'));
            User.findOne({fbId: req.param('fbId')}).exec(function (err, results){
                    if (err) {
                           sails.log("jguguu"+err);
                           return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in finding fbId', error_details: err});
                    }
                    else{
							sails.log(results)
                            if(typeof(results) == 'undefined'){
                                  return res.json(200, {status: 1, status_type: 'Success' ,  message: "This is a new user", isNewUser: true});
                            }else{
								 
								   //delete existing token 
								    
								     User_token.query("DELETE from userToken where userId = '"+results.id+"'", function (err, result) {
										if (err) {
										}
										else
										{
										    sails.log("deletion success")
								        }
									});
								   
								   // Create new access token on login
								   
									UsertokenService.createToken(results.id, function (err, userTokenDetails) 
									{
										if (err) 
										{
											return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in token creation', error_details: err});
										} 
										else
										{
											
											return res.json(200, {status: 1, status_type: 'Success' ,  message: "This user already have an account in dither", email: results.email, full_name: results.name, fb_uid: results.fbId, isNewUser: false});
										}
                                    });
                                  
                                }
                          //console.log(results);
                    }

            });

    },




    selectUser: function (req, res) {

			sails.log("select User")
            console.log(req.options.tokenCheck);
            console.log("selectUser ---------------------------------");
            console.log(req.options.settingsKeyValue);
            var commonSettings = req.options.settingsKeyValue;
            console.log(commonSettings.EMAIL_HOST);
            //console.log(req.options.settingsKeyValue[0]);
            //console.log(req.options.settingsKeyValue.EMAIL_HOST);

            var query = "Select * from user";
            User.query(query, function(err, results){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log('signup Part');
                        //console.log(result);
                        return res.json(200, {status: 1, message: 'Success'});
                    }

            });
    },
    
   /* ==================================================================================================================================
               To Edit Profile
     ==================================================================================================================================== */ 

	  editProfile:  function (req, res) {
		  
				var edit_type 		= req.param('edit-type');
				var profile_Image   = req.param('file');
				var token			= req.param('token');
				
				
				
				User_token.findOne({token: req.param('token')}).exec(function (err, results){
                   if (err) 
                    {
						sails.log(err)
					}
					else
					{
						sails.log(results)
						if(edit_type==1)
						{
							//Change ProfilePic
						}
						
						
						if(edit_type==2)
						{
								//Remove ProfilePic
								sails.log(results.userId)
								
								var query = "UPDATE user SET profilePic=null where id='"+results.userId+"'";
								User.query(query, function(err, data){
									if(err)
									{
										sails.log(err)
										return res.json(200, {status: 2, message: 'failure'});
									}
									else
									{
										//fs.unlink("/assets/images/ProfilePics/"+profile_Image);
										return res.json(200, {status: 1, message: 'Success'});
									}
							});
					
						}		
					}
				});	
								
				
	  },
	  
	  
	 

};

