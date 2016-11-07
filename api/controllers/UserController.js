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
                var token_expiry_hour           =     req.options.settingsKeyValue.TOKEN_EXPIRY_HOUR;
                var profilePic_path             =     req.options.file_path.profilePic_path;
                var profilePic_path_assets      =     req.options.file_path.profilePic_path_assets;
                console.log("signup---------------- api")
                console.log(req.body);
                console.log(req.get('device_id'));
                var imgUrl                      =     req.param('profilepic');
                var OTPCode                     =     req.param('otp');
                var deviceId                    =     req.get('device_id');
                var device_IMEI                 =     req.get('device_imei');
                var device_Type                 =     req.get('device_type');

                if(!req.param('mobile_number') || !imgUrl || !req.param('fb_uid') || !req.get('device_id') || !req.param('email_id') || !req.param('username') || !req.param('otp') || !req.param('mention_id') || !req.get('device_imei')){
                        return res.json(200, {status: 2, status_type: 'Failure' , message: 'Please pass fb_uid and device_id and profilepic and mobile_number and email_id and username and otp and mention_id and device_imei'}); //If an error occured, we let express/connect handle it by calling the "next" function
                }else{
                        var filename            =    "image.png";
                        var imagename           =    new Date().getTime() + filename;
                        console.log(imgUrl);
                        console.log("mention idddddddddddd")
                        console.log(req.param('mention_id'))
                        var values              =    {
                                                        name        : req.param('username'),
                                                        email       : req.param('email_id'),
                                                        fbId        : req.param('fb_uid'),
                                                        mentionId   : req.param('mention_id'),
                                                        phoneNumber : req.param('mobile_number'),
                                                        profilePic  : imagename,
                                                     };
                        var deviceId_arr        =    [];
                        var contact_arr         =    [];
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
                                if(err){
                                        console.log(err)
                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Error Occured in finding userDetails'});
                                }else{
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
                                                        UsertokenService.createToken(results.id, deviceId,device_IMEI,device_Type,token_expiry_hour, function (err, userTokenDetails) {
                                                            if(err){
                                                                        sails.log(userTokenDetails)
                                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in token creation',error_details: err});
                                                            }else{
                                                                    console.log("Before async parallel in Sign up ===============================================");
                                                                   //async.series([

                                                                    //function(callback) {
                                                                        // Send Email and Sms  Simultaneously
                                                                        async.parallel([
                                                                            function(callback){
                                                                                    console.log("+++++++++++++++++++Image Downloadingggggggggggggg+++++++++++++++++++++++++++++++++")
                                                                                    var download = function(uri, filename, callback){
                                                                                        request.head(uri, function(err, res, body){
                                                                                            console.log("image resizingggggggggggggggggggggggggg")
                                                                                            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                                                                                        });
                                                                                    };
                                                                                    download(imgUrl,'assets/images/profilePics/'+imagename, function(){
                                                                                            sails.log('done');
                                                                                            var imageSrc                    =     profilePic_path_assets + imagename;
                                                                                            var ext                         =     imageSrc.split('/');
                                                                                            ext                             =     ext[ext.length-1].split('.');
                                                                                            var imageDst                    =     profilePic_path_assets + ext[0] + "_50x50" + "." +ext[1];
                                                                                            console.log(imageSrc);
                                                                                            console.log(imageDst);
                                                                                            ImgResizeService.imageResize(imageSrc, imageDst, function(err, imageResizeResults){
                                                                                                    if(err){
                                                                                                            console.log(err);
                                                                                                            console.log("Error in image resize !!!!");
                                                                                                    }else{
                                                                                                            console.log(imageResizeResults);
                                                                                                             callback();
                                                                                                    }
                                                                                            });
                                                                                    });
                                                                            },
                                                                            function(callback){
                                                                                    console.log("parallel 1")
                                                                                    console.log("async parallel in Mailpart ===============================================");
                                                                                    var global_settingsKeyValue = req.options.settingsKeyValue;
                                                                                    var email_to        = results.email;
                                                                                    var email_subject   = 'Welcome to Dither';
                                                                                    var email_template  = 'signup';
                                                                                    var email_context   = {receiverName: results.name};
                                                                                    EmailService.sendEmail(global_settingsKeyValue, email_to,email_subject,email_template,email_context, function(err, sendEmailResults) {
                                                                                        if(err){
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
                                                                            function(callback){
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
                                                                            
                                                                            function(callback){
                                                                                    //Notification Log insertion
                                                                                    console.log("parallel 3")
                                                                                    console.log(req.param('mobile_number'))
                                                                                    var mobile_number  = req.param('mobile_number');
                                                                                   
                                                                                    Invitation.find({phoneNumber : mobile_number}).exec(function (err, selectContacts){
                                                                                                if(err){
                                                                                                    console.log(err);
                                                                                                    callback();
                                                                                                }else{
                                                                                                    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
                                                                                                    //console.log(selectContacts[0].userId)
                                                                                                    if(selectContacts.length == 0){
                                                                                                            callback();
                                                                                                    }else{
                                                                                                       
                                                                                                        var invited_collage_Array     = [];
                                                                                                        selectContacts.forEach(function(factor, index){
                                                                                                            
                                                                                                            //invited_collage_Array.push(collageId : factor.collageId, userId: results.id);
                                                                                                            invited_collage_Array.push("("+factor.collageId+",'"+results.id+"', now(), now())");
                                                                                                        });
                                                                                                       
                                                                                                                Invitation.destroy({phoneNumber: req.param('mobile_number')}).exec(function (err, deleteInvitation) {
                                                                                                                    if(err){
                                                                                                                            console.log(err);
                                                                                                                            callback();
                                                                                                                    }else{
																															//Tags.create({phoneNumber: req.param('mobile_number')}).exec(function (err, deleteInvitation){
																															var query = "INSERT INTO tags"+
																																		" (collageId, userId, createdAt, updatedAt)"+
																																		" VALUES"+invited_collage_Array;
																															console.log("|||||||||||||||||||||||||||||||||||||||||||| Tag insert query ||||||||||||||||||||||||||||||||||||||||");
																															console.log(invited_collage_Array);
																															console.log(query);
																															console.log("|||||||||||||||||||||||||||||||||||||||||||| Tag insert query ||||||||||||||||||||||||||||||||||||||||");
																															Tags.query(query, function(err, insertTagsResult){
																																if(err){
																																	console.log(err);
																																	callback();
																																}else{
																																		
																																		console.log(insertTagsResult)
																																		callback();
																																}
																															});  //Insert to tags table
                                                                                                                    }
                                                                                                                });
                                                                                                            //}
                                                                                                        //});
                                                                                                    }
                                                                                                }
                                                                                                console.log("#########################################")
                                                                                    });
                                                                            },
                                                                            function (callback)
                                                                            {
																				console.log("parallel 4")
																				var number  		  = req.param('mobile_number');
																				var phoneContactsArray    = [];
                                                                                AddressBook.find({ditherUserPhoneNumber : number}).exec(function (err, UserContacts){   
																					  if(err) 
																					  {
																						  callback();
																					  } 
																					  else
																					  {
																						  console.log(UserContacts)
																						  if(!UserContacts.length)
																						  {
																								callback();
																						  }
																						  else
																						  {
																							  
																							  UserContacts.forEach(function(factor, index){
																									
																									 phoneContactsArray.push({notificationTypeId:4,userId:results.id, ditherUserId:factor.userId});
																									 User.findOne({id:factor.userId}).exec(function (err, notifySettings){
                                                                                                                if(notifySettings.notifyContact==1){
                                                                                                                    //phoneContactsArray.push({notificationTypeId:4,userId:results.id, ditherUserId:factor.userId});
                                                                                                                    contact_arr.push(factor.userId);
                                                                                                                    console.log(factor.userId)
                                                                                                                }
                                                                                                            });
                                                                                               });
                                                                                                console.log("hhhhhhhhhhhhhhhhhhhhhhh")
                                                                                               console.log(contact_arr)
                                                                                               var values ={
																										notificationTypeId  :   4,
																										userId              :   results.id,
																										tagged_users        :   contact_arr
																										//description         :   tagNotifyArray.length
																									}	
																									console.log(values)
                                                                                               NotificationLog.create(values).exec(function(err, createdNotification){
																									if(err){
																										console.log(err);
																										callback();
																										//return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in inserting Notification', error_details: err});
																									}else{
																								            console.log(createdNotification);
																											var contactNtfyPush = [];
																											//-------Socket brodcast------------------------------
																											contact_arr.forEach(function(factor, index){
																												var roomName  = "socket_user_"+factor;
																												sails.sockets.broadcast(roomName,{
																																				type                : "notification",
																																				user_id             : factor,
																																				message             : "Signup Dither - Room Broadcast",
																																				roomName            : roomName,
																																				subscribers         : sails.sockets.subscribers(roomName),
																																				socket              : sails.sockets.rooms(),
																																				notification_type   : 4,
																																				notification_id     : createdNotification.id
																																	});
																											
																										
																											console.log("----------PUSH Notification------------------------------------");
																										  });
																										 
																												console.log("???????---Result----?????????")	
																											  console.log(contactNtfyPush)	
																												User_token.find({userId: contact_arr}).exec(function (err, getDeviceId){
																												//User_token.find({userId:selectContacts[0].userId }).exec(function (err, getDeviceId){
																													if(err){
																														  console.log(err);
																														  callback();
																														  //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in findig deviceId', error_details: err});
																													}else{
																														var message     =  'signup Notification';
																														var ntfn_body   =   results.name +" Joined on Dither";
																														//var device_id   =  getDeviceId.deviceId;
																														getDeviceId.forEach(function(factor, index){
																															deviceId_arr.push(factor.deviceId);
																														});
																														console.log(results)
																														if(!deviceId_arr.length){
																																callback();
																														}else{
																															//device_id       =  device_id.split(',');sails.log.debug(device_id);
																															var data        =  {message:message,device_id:deviceId_arr,NtfnBody:ntfn_body,NtfnType:4,id:results.id,notification_id:createdNotification.id};
																															NotificationService.NtfnInAPP(data, function(err, ntfnSend){
																																if(err){
																																	console.log("Error in Push Notification Sending")
																																	console.log(err)
																																	callback();
																																}else{
																																	console.log("Push notification result")
																																	console.log(ntfnSend)
																																	console.log("Push Notification sended")
																																	callback();
																																}
																															});
																														}
																													//------------------------------
																													}
																												});//getDeviceId

																											
																										
																									 }
                                                                                                });    
                                                                                               
                                                                                               
																						  }
																					  }
																				 });
																				
																			},
                                                                        ], function(err){ //This function gets called after the two tasks have called their "task callbacks"
                                                                                        if(err){
                                                                                            console.log("async parallel in Sms Part Failure --------------------");
                                                                                            console.log(err);
                                                                                            return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in Sms Send OR i Emai Send on signup', error_details: err}); //If an error occured, we let express/connect handle it by calling the "next" function
                                                                                        }else{
                                                                                            // res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully Resized the image'});
                                                                                            console.log("async parallel in Sms Part Success --------------------");
                                                                                            if(results.mentionId==''){
                                                                                                results.mentionId = results.id;
                                                                                            }
                                                                                            return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully completed the signup',
                                                                                                                  token         :   userTokenDetails.token.token,
                                                                                                                  user_id       :   results.id,
                                                                                                                  mobile_number :   results.phoneNumber,
                                                                                                                  mention_id    :   results.mentionId
                                                                                                            });
                                                                                                //------------------------------------------------------------------------------------------------------
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
               To check for a new User - login
     ==================================================================================================================================== */
    checkForNewUser:  function (req, res) {

        var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
        var token_expiry_hour           =     req.options.settingsKeyValue.TOKEN_EXPIRY_HOUR;
        var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
        var device_IMEI                 =     req.get('device_imei');
        var device_Type                 =     req.get('device_type');
        if(req.param('fb_uid') || req.get('device_id'))
            {

                console.log(req.options.settingKeyValue);
                console.log(req.param('fbId'));

                var deviceId    = req.get('device_id');
                console.log(deviceId)
                User.findOne({fbId: req.param('fb_uid')}).exec(function (err, results){
                        if (err) {
                               sails.log("jguguu"+err);
                               return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in finding fbId', error_details: err});
                        }else{
                                sails.log(results)
                                if(typeof(results) == 'undefined'){

                                      return res.json(200, {status: 1, status_type: 'Success' ,  message: "This is a new user", isNewUser: true});
                                }else{

                                        //delete existing token
                                        var query   =   "DELETE FROM userToken where device_IMEI='"+device_IMEI+"'";
                                        User_token.query(query, function(err, result) {
                                       // User_token.destroy({userId: results.id,deviceId:deviceId}).exec(function (err, result) {
                                            if(err){
                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in token creation', error_details: err});
                                            }else{
                                                UsertokenService.createToken(results.id,deviceId,device_IMEI,device_Type,token_expiry_hour, function (err, userTokenDetails){
                                                    if (err){
                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in token creation', error_details: err});
                                                    }
                                                    else{
                                                        var notifyArray = [];
                                                        notifyArray.push({comment:results.notifyComment,contact:results.notifyContact,vote:results.notifyVote,opinion:results.notifyOpinion,mention:results.notifyMention});
                                                        var profile_image       =   profilePic_path + results.profilePic;
                                                        return res.json(200, {status: 1, status_type: 'Success' ,  message: "This user already have an account in dither",
                                                                              email             :   results.email,
                                                                              full_name         :   results.name,
                                                                              fb_uid            :   results.fbId,
                                                                              isNewUser         :   false,
                                                                              profile_image     :   profile_image,
                                                                              token             :   userTokenDetails.token.token,
                                                                              user_id           :   results.id,
                                                                              mobile_number     :   results.phoneNumber,
                                                                              notification      :   notifyArray
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
        var userToken       = req.get('token');
        var deviceId        = req.get('device_id');
        var device_IMEI     = req.get('device_imei');
        console.log("-----------------IMEI____________???")
        console.log(device_IMEI)
        console.log(req.get('token'))
        console.log(req.get('device_id'))
        if(!device_IMEI && !deviceId && !userToken){

              console.log("error")
               return res.json(200, {status: 2,  status_type: 'Failure' , message: 'Please provide the token,device_id,device_imei'});
        }else{


                 var query = "DELETE FROM userToken WHERE device_IMEI='"+device_IMEI+"'";
                console.log(query)
                User_token.query(query, function(err, result) {
                    if(err) {
                        console.log(err)
                         return res.json(200, {status: 2,  status_type: 'Failure' , message: 'some error occured', error_details: result});
                    } else {
                        console.log("logout")
                        console.log(result)
                        return res.json(200, {status: 1,  status_type: 'Success' , message: 'Successfully LogOut'});
                    }
                });

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
                var profilePic_path_assets      =     req.options.file_path.profilePic_path_assets;
                var edit_type                   =     req.param('edit_type');
                var fileName                    =     req.file('profile_image');

                console.log(req.file('profile_image'))

                var switchKey = edit_type;
                switch(switchKey){
                        case '1' :
                                    //-------------Change only ProfilePic------------------------------------
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

                                                            // ------------------------------Generate ThumbnailImage-----------------------------------------------
                                                                var imageSrc                    =     profilePic_path_assets + imageName;

                                                                fs.exists(imageSrc, function(exists) {
                                                                if (exists) {

                                                                console.log("Image exists");



                                                                        var ext                         =     imageSrc.split('/');
                                                                        ext                             =     ext[ext.length-1].split('.');
                                                                        var imageDst                    =     profilePic_path_assets + ext[0] + "_50x50" + "." +ext[1];
                                                                        console.log(imageSrc)
                                                                        console.log(imageDst)
                                                                        ImgResizeService.imageResize(imageSrc, imageDst, function(err, imageResizeResults) {
                                                                            if(err)
                                                                            {
                                                                                    console.log(err);
                                                                                    return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in image resize', error_details: err});

                                                                            }else{
                                                                                    console.log(imageResizeResults);
                                                                                    // res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully Resized the image'});
                                                                                    return res.json(200, {status: 1, status_type: 'Success',message: 'Updation Success', profile_image : profileImage});


                                                                            }
                                                                        });

                                                                }else{
                                                                        console.log("Image not exists");
                                                                        return res.json(200, {status: 1, status_type: 'Success',message: 'Profile image not exist', });

                                                                    }
                                                                    });


                                                            //------------------------------------------------------------------------------------------------------


                                                        }


                                                    });

                                             }

                                        }
                                    });

                        break;

                        case '2' :
                                    //----------------------------Remove only ProfilePic-----------------------------------------------
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

