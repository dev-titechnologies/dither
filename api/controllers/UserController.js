/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

//var io = require('sails.io.js')( require('socket.io-client') );
 var fs          = require('fs');
 var request     = require('request');
 var path        = require('path');


module.exports = {

 /* ==================================================================================================================================
               To signup
     ==================================================================================================================================== */
    signup: function (req, res) {
            //console.log(req.param('name'));
            
				console.log("signuppppppppppppp")
				console.log(req.body);
				console.log(req.get('device_id'));

				//profilePic Upload

               var imgUrl       = req.param('profilepic');
              
               var filename     =  "image.png";
               var imagename    = new Date().getTime() + filename;
                console.log(imgUrl)
       


            var download = function(uri, filename, callback)
                {
                        request.head(uri, function(err, res, body){

                        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);

                    });
                };
                download(imgUrl, 'assets/images/profilePics/'+imagename, function()
                {
                    sails.log('done');

                });

            //--end of upload--------

            var OTPCode  = req.param('otp');
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
					Sms.query("UPDATE smsDetails SET ditherId	 = '"+result.insertId+"',smsVerified=1 where mobile_no = '"+req.param('mobile_number')+"' ", function (err, data) {						
					});
					
					
				}
				else
				{
				
				   //mobile verification failed	
					
				}
				
				
				
			});
			
		} */
		if(req.param('fb_uid')|| req.get('device_id'))
		 {
		  User.find({fbId:req.param('fb_uid')}).exec(function (err, resultData){
			  

			if(resultData.length>0)
			{
			return res.json(200, {status: 2, status_type: 'Failure' ,message: 'This is an existing User', error_details: err});

			}
		  else
		  {

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
										console.log("Before async parallel in Sign up ===============================================");
                                            // Send Email and Sms  Simultaneously
                                            async.parallel([
                                                        function(callback) {
															        console.log("async parallel in Mailpart ===============================================");
                                                                    var global_settingsKeyValue = req.options.settingsKeyValue;
                                                                    var email_to        = results.email;
                                                                    var email_subject   = 'Welcome to Dither';
                                                                    var email_template  = 'signup';
                                                                    var email_context   = {receiverName: results.name};
                                                                    EmailService.sendEmail(global_settingsKeyValue, email_to,email_subject,email_template,email_context, function(err, sendEmailResults) {
                                                                        if(err)
                                                                        {
                                                                                console.log(err);
                                                                                console.log("async parallel in Mailpart Error");
                                                                                //return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in Email Send on signup', error_details: sendEmailResults});
                                                                                 callback();
                                                                        }else{
                                                                                //console.log(results);
                                                                                console.log(email_to);
                                                                                console.log(email_subject);
                                                                                console.log(email_template);
                                                                                console.log(email_context);
                                                                                console.log("async parallel in Mailpart Success");
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
                                                                    console.log("async parallel in Sms Part");
                                                                    callback();
                                                        }


                                                   ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
                                                                    if (err) {
																		console.log("async parallel in Sms Part Failure --------------------");
                                                                        console.log(err);
                                                                        return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in Sms Send OR i Emai Send on signup', error_details: err}); //If an error occured, we let express/connect handle it by calling the "next" function
                                                                    }else{
																		console.log("async parallel in Sms Part Success --------------------");
                                                                        return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully completed the signup',token:userTokenDetails.token.token,userId:results.id});
                                                                    }

                                            });
                                        }
                                    });          
		                        }
	                     });
	                    }
					}); 
        }
        else
        {
			console.log("no parammmmmm")
			return res.json(200, {status: 2, status_type: 'Failure' , message: 'Please pass fb_uid and device_id'}); //If an error occured, we let express/connect handle it by calling the "next" function

		}
    },

 /* ==================================================================================================================================
               To check for a new User
     ==================================================================================================================================== */
    checkForNewUser:  function (req, res) {

		if(req.param('fb_uid')|| req.get('device_id'))
		 {

            console.log(req.options.settingKeyValue);
            console.log(req.param('fbId'));

            var deviceId    = req.get('device_id');
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
                                                            var protocol    = req.connection.encrypted?'https':'http';
                                                            var url         = protocol + '://' + req.headers.host + '/';
                                                            var profile_image   =  url+"images/profilePics/"+results.profilePic;
                                                            sails.log(profile_image)
                                                            return res.json(200, {status: 1, status_type: 'Success' ,  message: "This user already have an account in dither", email: results.email, full_name: results.name, fb_uid: results.fbId, isNewUser: false,profile_image:profile_image,token:userTokenDetails.token.token,userId:results.id});
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
		}
		else
        {
			console.log("no parammmmmm")
			return res.json(200, {status: 2, status_type: 'Failure' , message: 'Parameter missing'}); //If an error occured, we let express/connect handle it by calling the "next" function

		}

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
                sails.log(req.get('token'))
                var edit_type                   = req.param('edit_type');
                var fileName                    = req.file('profile_image');
                var token                       = req.get('token');
                console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
                console.log(req.file('profile_image'))
                var server_baseUrl              =     req.options.server_baseUrl;
                var imageUploadDirectoryPath    = '../../assets/images/profilePics';

                User_token.findOne({token: req.get('token')}).exec(function (err, results){
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

                                var imageName = req.file('profile_image')._files[0].stream.filename;
                                if(req.file('profile_image'))
                                {
                                    req.file('profile_image').upload({dirname: '../../assets/images/profilePics'},function (err, profileUploadResults) {
                                        if (err)
                                        {
                                            console.log(err)
                                            return res.json(200, {status: 2,status_type: 'Failure', message: 'Updateion failure'});

                                        }
                                        else
                                        {
                                           console.log("profileImages   ------->>> Uploaded");
                                          console.log(profileUploadResults)
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
													var profileImage = server_baseUrl + "images/profilePics/"+imageName;

                                                    return res.json(200, {status: 1, status_type: 'Success',message: 'Updation Success',profile_image:profileImage});
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
								User.query("SELECT profilePic from user where id='"+results.userId+"'", function(err, data){
                                   
                                var query = "UPDATE user SET profilePic=null where id='"+results.userId+"'";
                                User.query(query, function(err, datas){
                                    if(err)
                                    {
                                        sails.log(err)
                                        return res.json(200, {status: 2, message: 'failure'});
                                    }
                                    else
                                    {
										console.log(data)
										var profileImage = server_baseUrl + "images/profilePics/"+data[0].profilePic;
										console.log(profileImage)
                                        fs.unlink("assets/images/profilePics/"+data[0].profilePic);
                                        return res.json(200, {status: 1, message: 'Success'});
                                    }
                                });
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

