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
 //var client 	 = require('twilio')('AC834e9d9c31bd1e8a5965f7f25f2b1250', '29f2e106b68b5aa5b7f2c2e9dcf935e5'); //API_KEY and TOCKEN from TWILIO


module.exports = {

 /* ==================================================================================================================================
               To signup
     ==================================================================================================================================== */
    signup: function (req, res) {
            //console.log(req.param('name'));



           //profilePic Upload
			
               var imgUrl       = req.param('profilepic');
               var filename     =  "image.png";
               var imagename    = new Date().getTime() + filename;
               

            var download = function(uri, filename, callback)
                {
                        request.head(uri, function(err, res, body){
                        
                        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);



                    });
                };
                download(imgUrl, 'assets/images/ProfilePics/'+imagename, function()
                {
                    sails.log('done');

                });

            //--end of upload--------

			var OTPCode	 = req.param('otp');
            var deviceId = req.get('device_id');
            var values = {

                        name        : req.param('username'),
                        email       : req.param('email_id'),
                        fbId        : req.param('fb_uid'),
                        phoneNumber : req.param('mobile_number'),
                        profilePic  : imagename,
                };
			
			
			//--------OTP CHECKING----------------------
		/*if(OTPCode)	
		{	
			//sails.log("OTP match success")
			Sms.query("SELECT OTPCode FROM smsDetails WHERE mobile_no = '"+req.param('mobile_number')+"' AND Id = (SELECT MAX(Id) FROM smsDetails) ", function (err, details) {
				
				
				sails.log("OTP match success")
				sails.log(details[0].OTPCode)
				
				if(details[0].OTPCode==OTPCode)
				{
					//save signup details
					sails.log("OTP match success")
					/*Sms.query("UPDATE smsDetails SET ditherId	 = '"+result.insertId+"',smsVerified=1 where mobile_no = '"+req.param('mobile_number')+"' ", function (err, data) {						
					});
					
					
				}
				else
				{
				
				   //mobile verification failed	
					
				}
				
				
				
			});
			
		} */
			

             User.create(values).exec(function(err, results){
                    if(err){
                            console.log(err);
                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in user creation', error_details: err});
                    }
                    else{
                            // Create new access token on login
                            UsertokenService.createToken(results.id, deviceId, function (err, userTokenDetails) {
                                if (err) {

											sails.log(userTokenDetails)
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
                                                                    var smsAccountSid     = req.options.settingsKeyValue.SMS_ACCOUNT_SID;
                                                                    var smsAuthToken      = req.options.settingsKeyValue.SMS_AUTH_TOKEN;
                                                                    var smsFrom           = req.options.settingsKeyValue.SMS_FROM;
                                                                    console.log(req.options.settingsKeyValue);

                                                                    /*SmsService.sendSms(smsAccountSid, smsAuthToken, smsFrom, function(err, sendSmsResults) {
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
                                                                        return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully completed the signup',token:userTokenDetails.token.token});
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
            
            var deviceId	= req.get('device_id');
            console.log(deviceId)
            User.findOne({fbId: req.param('fb_uid')}).exec(function (err, results){
                    if (err) {
                           sails.log("jguguu"+err);
                           return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in finding fbId', error_details: err});
                    }
                    else{
                            sails.log(results)
                            if(typeof(results) == 'undefined')
                            {
                                  return res.json(200, {status: 1, status_type: 'Success' ,  message: "This is a new user", isNewUser: true});
                            }
                            else
                            {

								
								User_token.query("SELECT * FROM userToken WHERE userId = '"+results.id+"'", function (err, result) {
										if (err) {
										}
										else
										{
											console.log(result)
											//delete existing token 
								    
											User_token.query("DELETE from userToken where deviceId = '"+deviceId+"'", function (err, result) {
												if (err) {
														}
												else
												{
													sails.log("deletion success")
													console.log(result.deviceId)
													 //Create new access token on login
								   
													UsertokenService.createToken(results.id,deviceId, function (err, userTokenDetails) 
													{
														if (err) 
														{
															return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in token creation', error_details: err});
														} 
														else
														{
															console.log(userTokenDetails.token)
															var protocol 	= req.connection.encrypted?'https':'http';
															var url 	    = protocol + '://' + req.headers.host + '/';
															var profile_image 	=  url+"/images/ProfilePics/"+results.profilePic;
															sails.log(profile_image)
															return res.json(200, {status: 1, status_type: 'Success' ,  message: "This user already have an account in dither", email: results.email, full_name: results.name, fb_uid: results.fbId, isNewUser: false,profile_image:profile_image,token:userTokenDetails.token.token});
														}
													});
													
												 }
											});
											
								        }
									});
					
                                  

                                }
                          //console.log(results);

                    }

            });

    },

 /* ==================================================================================================================================
               To Logout user
     ==================================================================================================================================== */
// Logout action.
    logout: function(req, res){
        var userToken = req.get('token');
        if(userToken){
                TokenService.deleteToken(req.body.token, function(err, result) {
                    if(err) {
                         return res.json(200, {status: 2,  status_type: 'Failure' , message: 'some error occured', error_details: result});
                    } else {

                        return res.json(200, {status: 1,  status_type: 'Success' , message: 'success'});
                    }
                });
        }else{
                return res.json(200, {status: 2,  status_type: 'Failure' , message: 'Please provide the token'});
        }

    },


    selectUser: function (req, res) {

            var commonSettings = req.options.settingsKeyValue;
            //console.log(commonSettings.EMAIL_HOST);
            //console.log(req.options.settingsKeyValue[0]);
            //console.log(req.options.settingsKeyValue.EMAIL_HOST);

            var query = "Select * from user";
            User.query(query, function(err, results){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log('Select USer');
                        var d = new Date();
                        var n = d.getTime();
                        console.log(new Date().getTime());
                         console.log(parseInt(new Date().getTime()));
                        //console.log(result);
                        return res.json(200, {status: 1, message: 'Success'});
                    }

            });
    },

   /* ==================================================================================================================================
               To Edit Profile
     ==================================================================================================================================== */

      editProfile:  function (req, res) {

                var fs = require('file-system');
                sails.log(req.param('token'))
                var edit_type                   = req.param('edit-type');
                var fileName                    = req.param('file');
                var token                       = req.get('token');
                var imageUploadDirectoryPath    = '../../assets/images/ProfilePics';

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

                                var imageName = req.file('file')._files[0].stream.filename;
                                if(req.file('file'))
                                {
                                    req.file('file').upload({dirname: '../../assets/images/ProfilePics', maxBytes: 10000000},function (err, profileUploadResults) {
                                        if (err)
                                        {
                                            console.log(err)
                                            return res.json(200, {status: 2,status_type: 'Failure', message: 'Updateion failure'});

                                        }
                                        else
                                        {
                                           console.log(fileName+"profileImages   ------->>> Uploaded");
                                           console.log(profileUploadResults[0].fd);
                                           imageName = profileUploadResults[0].fd.split('/');
                                           imageName = imageName[imageName.length-1];
                                           console.log(imageName)
                                           //imageName = profileUploadResults
                                           var query = "UPDATE user SET profilePic='"+ imageName +"' where id='"+results.userId+"'";
                                            User.query(query, function(err, data){
                                                if(err)
                                                {
                                                    sails.log(err)
                                                }
                                                else
                                                {

                                                    return res.json(200, {status: 1, status_type: 'Success',message: 'Updation Success'});
                                                }


                                                });

                                        }
                                    });
                                }

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
                                        fs.unlink("assets/images/ProfilePics/"+profile_Image);
                                        return res.json(200, {status: 1, message: 'Success'});
                                    }
                                });

                         }
                    }
                });


      },

      			
		   //-----end of SMS-------------------
			
		 /*  var values = {

							OTPCode:4251
								
						};	
           
           	*/
            
		  
	  
     
	  
	 


};

