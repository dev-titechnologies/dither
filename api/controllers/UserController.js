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

 var profilePic_unlink_path         =      "assets/images/profilePics/";
module.exports = {

 /* ==================================================================================================================================
               To signup
     ==================================================================================================================================== */
    signup: function (req, res) {
				 var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
				 var profilePic_path             =     req.options.file_path.profilePic_path;
                console.log("signup---------------- api")
                console.log(req.body);
                console.log(req.get('device_id'));
                var imgUrl       = req.param('profilepic');
                if(!req.param('mobile_number') || !imgUrl || !req.param('fb_uid') || !req.get('device_id') || !req.param('fb_uid') || !req.param('email_id') || !req.param('username') || !req.param('otp')){
                        return res.json(200, {status: 2, status_type: 'Failure' , message: 'Please pass fb_uid and device_id and profilepic and mobile_number and fb_uid and email_id and username and otp'}); //If an error occured, we let express/connect handle it by calling the "next" function
                }else{
                        var filename     =  "image.png";
                        var imagename    = new Date().getTime() + filename;
                        var thumbImage;   
                        console.log(imgUrl);
                        //Download STARTS--------
                        var download = function(uri, filename, callback){
                                request.head(uri, function(err, res, body){
                                    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                                });
                                //---------------------------generating Thumbnail image-----------------------------------
                        
                        };
                        download(imgUrl, 'assets/images/profilePics/'+imagename, function()
                        {
                            sails.log('done');
                        
                        });
                        
                        
                        //Download ENDS--------
                        var OTPCode  = req.param('otp');
                        var deviceId = req.get('device_id');
                        var values = {

                                    name        : req.param('username'),
                                    email       : req.param('email_id'),
                                    fbId        : req.param('fb_uid'),
                                    phoneNumber : req.param('mobile_number'),
                                    profilePic  : imagename,
                                    thumbImage	: thumbImage,
                        };
                        //--------OTP CHECKING----------------------
                       /* if(OTPCode)
                        {
                            var query = "SELECT OTPCode FROM smsDetails WHERE mobile_no = '"+req.param('mobile_number')+"' AND Id = (SELECT MAX(Id) FROM smsDetails where mobile_no = '"+req.param('mobile_number')+"')"
                            Sms.query(query, function (err, details) {

                             if(err)
                             {
                                 return res.json(200, {status: 2, status_type: 'Failure' ,message: 'OTP Not Found'});
                             }
                             else
                             {

                                    if(details[0].OTPCode==OTPCode)
                                    {
                                       //save signup details
                                        sails.log("OTP match success")
                                        var data     = {smsVerified:true};
                                        var criteria = {OTPCode:details[0].OTPCode};
                                        Sms.update(criteria,data).exec(function(err, updatedRecords) {

                                            if(err)
                                            {
                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'SMS verification Updation Failed'});
                                            }
                                            else
                                            {
                                                return res.json(200, {status: 1, status_type: 'Success' ,message: 'SMS verification updation Success'});
                                            }

                                        });


                                    }
                                    else
                                    {

                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'SMS verification updation Failed,OTP Mismatch'});

                                    }

                             }

                            });

                        }*/


                     

                        User.findOne({fbId:req.param('fb_uid')}).exec(function (err, resultData){
                                if(err)
                                {
                                     return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Error Occured in finding userDetails'});
                                }
                                else
                                {
									/*------------------------------Generate ThumbnailImage-----------------------------------------------
									console.log('/assets/images/profilePics/'+imagename)
									require('lwip').open(imagename, function(err, image) {
										if(err)
										  {
											  console.log(err)
											  console.log("Errorrrrrrrrrrrrrrrrrrr")
											  //return res.json(200, {status: 2,status_type: 'Failure', message: 'Image Not Found'});
										  }
										  else
										  {
											// lanczos
											thumbImage    = 'thumb' + imagename;
											
											image.resize(50, 50, function(err, rzdImg) {
												rzdImg.writeFile(thumbImage, function(err) {
													if(err)
													  {
														  console.log("Error")
														  
													  }
													  else
													  {
														  console.log(rzdImg)
														  console.log("success")
													  }
													});
											});
										  }	
										});
									
									//------------------------------------------------End of thumbnail--------------------------------*/
									
									
									
                                    console.log("fbid checkinggggggggggg")
                                    console.log(resultData);
                                    if(resultData){
                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'This is an existing User'});
                                    }else{
                                        User.create(values).exec(function(err, results){
                                                if(err){
                                                        console.log(err);
                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in user creation', error_details: err});
                                                }else{
                                                        // Create new access token on login
                                                        UsertokenService.createToken(results.id, deviceId, function (err, userTokenDetails) {
                                                            if (err) {
                                                                        sails.log(userTokenDetails)
                                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in token creation',error_details: err});
                                                            }else {
                                                                    //User.publishCreate(result);
                                                                    //User.subscribe(req.socket,result);
                                                                    //sails.sockets.broadcast('user', { msg: 'signup set ===========' });
                                                                    //sails.sockets.emit(req.socket.id,'privateMessage', {msg: 'Hi!'});
                                                                    //sails.sockets.blast('createInSignUp', {msg: 'Hi!'});
                                                                   // sails.sockets.join(socket, "Room-1");
                                                                    //sails.sockets.join(socket, "Room-2");
                                                                    console.log("Before async parallel in Sign up ===============================================");
                                                                        // Send Email and Sms  Simultaneously
                                                                        async.parallel([
                                                                                    function(callback) {
                                                                                                console.log("parallel 1")
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
                                                                                                console.log("parallel 2")
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
                                                                                    },
                                                                                    function(callback) {
                                                                                                //Notification Log insertion
                                                                                                console.log("parallel 3")
                                                                                                Invitation.find({phoneNumber:req.param('mobile_number')}).exec(function (err, selectContacts){
                                                                                                        if(err)
                                                                                                        {
                                                                                                            console.log(err);
                                                                                                            callback();
                                                                                                        }
                                                                                                        else
                                                                                                        {
                                                                                                            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
                                                                                                            //console.log(selectContacts[0].userId)
                                                                                                            if(selectContacts.length == 0)
                                                                                                            {
                                                                                                                    callback();
                                                                                                            }else{

                                                                                                                var data     = {
                                                                                                                                userId              :       results.id,
                                                                                                                                ditherUserId        :       selectContacts[0].userId,
                                                                                                                                fbId                :       req.param('fb_uid'),
                                                                                                                                };
                                                                                                                var criteria = {phoneNumber: req.param('mobile_number')};
                                                                                                                Invitation.update(criteria,data).exec(function(err, updatedRecords) {
                                                                                                                    if(err){
                                                                                                                                console.log(err);
                                                                                                                                callback();
                                                                                                                    }else{
                                                                                                                        //Notification Log Insertion
                                                                                                                        var values ={
                                                                                                                                        notificationTypeId  : 4,
                                                                                                                                        userId              : results.id,
                                                                                                                                        ditherUserId        : selectContacts[0].userId,
                                                                                                                                    }
                                                                                                                         NotificationLog.create(values).exec(function(err, createdNotification) {
                                                                                                                            if(err)
                                                                                                                            {
                                                                                                                                console.log(err);
                                                                                                                                callback();
                                                                                                                                //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in inserting Notification', error_details: err});
                                                                                                                            }
                                                                                                                            else
                                                                                                                            {
                                                                                                                                console.log(createdNotification);
                                                                                                                                callback();
                                                                                                                            }
                                                                                                                        });
                                                                                                                    }
                                                                                                                });
                                                                                                            }
                                                                                                        }
                                                                                                        console.log("#########################################")
                                                                                                });

                                                                                    },
                                                                        ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
                                                                                        if (err) {
                                                                                            console.log("async parallel in Sms Part Failure --------------------");
                                                                                            console.log(err);
                                                                                            return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in Sms Send OR i Emai Send on signup', error_details: err}); //If an error occured, we let express/connect handle it by calling the "next" function
                                                                                        }else{
                                                                                            console.log("async parallel in Sms Part Success --------------------");
                                                                                            return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully completed the signup',token:userTokenDetails.token.token,user_id:results.id});
                                                                                        }

                                                                        });
                                                            }
                                                        });
                                                }


                                        });
                                    }
                                }
                        });
                }
    },

 /* ==================================================================================================================================
               To check for a new User
     ==================================================================================================================================== */
    checkForNewUser:  function (req, res) {

        var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
        var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
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
                                   /* User_token.find({userId:results.id}).exec(function(err, result){
                                   // User_token.query("SELECT * FROM userToken WHERE userId = '"+results.id+"'", function (err, result) {
                                            if (err) {
                                                console.log(err)
                                            }
                                            else
                                            {
                                                console.log(result)
                                                //delete existing token
                                               /* User_token.destroy({userId: results.id}).exec(function (err, result) {

                                                    if (err) {
                                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in token creation', error_details: err});
                                                            }
                                                    else
                                                    {*/
                                                        UsertokenService.createToken(results.id,deviceId, function (err, userTokenDetails)
                                                        {
                                                            if (err)
                                                            {
                                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in token creation', error_details: err});
                                                            }
                                                            else
                                                            {
                                                                var test = results.name;
                                                                console.log("test ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                                                                console.log(test);
                                                                console.log("test ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

                                                                sails.sockets.blast('createIncheck', {status : "success", name_of_user: test});
                                                                sails.sockets.blast('message', {status : "success", name_of_user: test});
                                                                
                                                                var notifyArray = [];
                                                                notifyArray.push({comment:results.notifyComment,contact:results.notifyContact,vote:results.notifyVote,opinion:results.notifyOpinion});
                                                                var profile_image       =   profilePic_path + results.profilePic;
                                                                return res.json(200, {status: 1, status_type: 'Success' ,  message: "This user already have an account in dither",
                                                                                      email             :   results.email,
                                                                                      full_name         :   results.name,
                                                                                      fb_uid            :   results.fbId,
                                                                                      isNewUser         :   false,
                                                                                      profile_image     :   profile_image,
                                                                                      token             :   userTokenDetails.token.token,
                                                                                      user_id           :   results.id,
                                                                                      notification		:	notifyArray
                                                                                });
                                                            }
                                                        });

                                                   //  }
                                              // });

                                           // }
                                       // });
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
        var deviceId  = req.get('device_id');
        if(userToken){
                UsertokenService.deleteToken(userToken,deviceId, function(err, result) {
                    if(err) {
                         return res.json(200, {status: 2,  status_type: 'Failure' , message: 'some error occured', error_details: result});
                    } else {

                        return res.json(200, {status: 1,  status_type: 'Success' , message: 'LogOut success'});
                    }
                });
        }else{
                return res.json(200, {status: 2,  status_type: 'Failure' , message: 'Please provide the token'});
        }

    },



   /* ==================================================================================================================================
               To Edit Profile
     ==================================================================================================================================== */

      editProfile:  function (req, res) {

                sails.log(req.get('token'))

				//var fs                        =     require('file-system');
                var tokenCheck                  =     req.options.tokenCheck;
                var userId                      =     tokenCheck.tokenDetails.userId;
                var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                var server_baseUrl              =     req.options.server_baseUrl;
                var imageUploadDirectoryPath    =     '../../assets/images/profilePics';

                var edit_type                   =     req.param('edit_type');
                var fileName                    =     req.file('profile_image');

                console.log(req.file('profile_image'))

                var switchKey = edit_type;
                switch(switchKey){
                        case '1' :
                                    //-------------Change ProfilePic------------------------------------
                                    console.log("type 1")
                                    var imageName ;
                                    req.file('profile_image').upload({dirname: '../../assets/images/profilePics',maxBytes: 100 * 1000 * 1000},function (err, profileUploadResults) {
                                        if (err)
                                        {
                                            console.log(err)
                                            return res.json(200, {status: 2,status_type: 'Failure', message: 'Updateion failure'});

                                        }
                                        else
                                        {

                                             if(profileUploadResults.length==0)
                                             {
                                                 return res.json(200, {status: 2,status_type: 'Failure', message: 'Image Not Found'});

                                             }
                                             else
                                             {

                                                    console.log("profileImages   ------->>> Uploaded");
                                                    //console.log(profileUploadResults)
                                                    imageName = profileUploadResults[0].fd.split('/');
                                                    imageName = imageName[imageName.length-1];
                                                    //console.log(imageName)
                                                    var data     = {profilePic:imageName};
                                                    var criteria = {id: userId};
                                                    User.update(criteria,data).exec(function(err, data) {
                                                        if(err)
                                                        {
                                                            sails.log(err)
                                                            return res.json(200, {status: 2, status_type: 'Failure',message: 'Profile Image updation Failure'});
                                                        }
                                                        else
                                                        {
                                                            //var profileImage = server_baseUrl + "images/profilePics/"+imageName;
                                                            var profileImage        =   profilePic_path + imageName;
                                                            return res.json(200, {status: 1, status_type: 'Success',message: 'Updation Success', profile_image : profileImage});
                                                        }


                                                    });

                                             }

                                        }
                                    });

                        break;

                        case '2' :
                                    //----------------------------Remove ProfilePic-----------------------------------------------
                                    console.log("type 2")
                                    User.findOne({id:userId}).exec(function (err, resultData){
                                        if(err)
                                        {
                                            console.log(err)
                                            return res.json(200, {status: 2, status_type: 'Failure',message:'error occured in profilePic selection in delete profile'});
                                        }
                                        else
                                        {
                                                if(!resultData)
                                                {

                                                        return res.json(200, {status: 2, status_type: 'Failure',message: 'User Not Found'});

                                                }
                                                else
                                                {

                                                        var data     = {profilePic: " "};
                                                        var criteria = {id: userId};
                                                        User.update(criteria,data).exec(function(err, datas) {
                                                            if(err)
                                                            {
                                                                sails.log(err)
                                                                return res.json(200, {status: 2, status_type: 'Failure', message: 'profile image deletion failure'});
                                                            }
                                                            else
                                                            {
                                                                console.log(datas)
                                                                var profileImage    =   profilePic_path + resultData.profilePic;
                                                                console.log(profileImage)
                                                                fs.unlink(profilePic_unlink_path + resultData.profilePic);
                                                                return res.json(200, {status: 1, status_type: 'Success', message: 'profile image deletion Success'});
                                                            }
                                                        });
                                                }
                                        }
                                    });
                        break;
                }

      },




};

