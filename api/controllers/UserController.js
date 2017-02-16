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
        console.log("signup---------------- api")
        var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
        var token_expiry_hour           =     req.options.settingsKeyValue.TOKEN_EXPIRY_HOUR;
        var profilePic_path             =     req.options.file_path.profilePic_path;
        var profilePic_path_assets      =     req.options.file_path.profilePic_path_assets;

        var device_Id                   =     req.get('device_id');
        var device_IMEI                 =     req.get('device_imei');
        var device_Type                 =     req.get('device_type');
		var accessToken					=     req.get('accessToken');
		
        var fbUser                      =     req.param('fb_array');
        var phoneNumber                 =     req.param('mobile_number');
        var fbId                        =     req.param('fb_uid');
        var emailId                     =     req.param('email_id');
        var userName                    =     req.param('username');
        var mentionId                   =     req.param('mention_id');
        var imgUrl                      =     req.param('profilepic');
        var OTPCode                     =     req.param('otp');
		
        var sendStatus                  =     false;

        console.log(req.params.all());
        console.log("device_Id ====================");
        console.log(device_Id);
        console.log("device_IMEI ====================");
        console.log(device_IMEI);
        console.log("deviceType ====================");
        console.log(device_Type);

        //if(!phoneNumber || !fbId || !device_Id || !emailId || !userName || !mentionId || !device_IMEI || !device_Type || typeof(imgUrl) == "undefined"){
                //return res.json(200, {status: 2, status_type: 'Failure' , message: 'Please pass fb_uid, device_id, profilepic, mobile_number, email_id, username, otp, mention_id, device_imei and device_type'}); //If an error occured, we let express/connect handle it by calling the "next" function
        //}
        if(!device_Id){
            return res.json(200, {status: 2, status_type: 'Failure' , message: 'Please pass device_id'});
        }else if(!device_IMEI){
            return res.json(200, {status: 2, status_type: 'Failure' , message: 'Please pass device_imei'});
        }else if(!device_Type){
            return res.json(200, {status: 2, status_type: 'Failure' , message: 'Please pass device_type'});
        }else if(typeof(fbUser) == "undefined"){
            return res.json(200, {status: 2, status_type: 'Failure' , message: 'Please pass fb_array'});
        }else if(!phoneNumber){
            return res.json(200, {status: 2, status_type: 'Failure' , message: 'Please pass mobile_number'});
        }else if(!fbId){
            return res.json(200, {status: 2, status_type: 'Failure' , message: 'Please pass fb_uid'});
        }else if(!emailId){
            return res.json(200, {status: 2, status_type: 'Failure' , message: 'Please pass email_id'});
        }else if(!userName){
            return res.json(200, {status: 2, status_type: 'Failure' , message: 'Please pass username'});
        }else if(!mentionId){
            return res.json(200, {status: 2, status_type: 'Failure' , message: 'Please pass mention_id'});
        }else if(typeof(imgUrl) == "undefined"){
            return res.json(200, {status: 2, status_type: 'Failure' , message: 'Please pass profilepic'});
        }else if(!OTPCode){
            return res.json(200, {status: 2, status_type: 'Failure' , message: 'Please pass otp'});
        }else{
            if(imgUrl){
                var filename            =    "image.png";
                var imagename           =    new Date().getTime() + filename;
            }
            var values              =    {
                                            name        : userName,
                                            email       : emailId,
                                            fbId        : fbId,
                                            mentionId   : mentionId,
                                            phoneNumber : phoneNumber,
                                            profilePic  : imagename,
                                            //accessToken	: accessToken
                                         };
            var deviceId_arr        =    [];
            var contact_arr         =    [];
            var newFrnds            =    [];
            User.findOne({fbId  :  fbId}).exec(function (err, resultData){
                if(err){
                        console.log(err)
                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Error Occured in finding userDetails'});
                }else{
                    if(resultData){
                             return res.json(200, {status: 2, status_type: 'Failure' ,message: 'This is an existing User'});
                    }else{
                        User.create(values).exec(function(err, results){
                            if(err){
                                    console.log(err);
                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in user creation', error_details: err});
                            }else{
                                // Create new access token on login
                                UsertokenService.createToken(results.id, device_Id,device_IMEI,device_Type,token_expiry_hour, function (err, userTokenDetails) {
                                    if(err){
                                            sails.log(userTokenDetails)
                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in token creation',error_details: err});
                                    }else{
                                        console.log("Before async parallel in Sign up ===============================================");
                                        async.parallel([
                                            function(callback){
                                                if(imgUrl){
                                                    console.log("parallel 1")
                                                    console.log("+++++++++++++++++++Image Downloadingggggggggggggg+++++++++++++++++++++++++++++++++")
                                                    var download = function(uri, filename, callback){
                                                        request.head(uri, function(err, res, body){
                                                            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                                                        });
                                                    };
                                                    download(imgUrl,'assets/images/profilePics/'+imagename, function(){
                                                        var imageSrc                    =     profilePic_path_assets + imagename;
                                                        var ext                         =     imageSrc.split('/');
                                                        ext                             =     ext[ext.length-1].split('.');
                                                        var imgWidth,
                                                            imgHeight,
                                                            imageDst;

                                                        async.series([
                                                            function(callback) {
                                                                imgWidth                    =    200;
                                                                imgHeight                   =    200;
                                                                imageDst                    =     profilePic_path_assets + ext[0] + "_"+imgWidth+"x"+imgHeight+"." +ext[1];
                                                                ImgResizeService.imageResizeWH(imgWidth, imgHeight, imageSrc, imageDst, function(err, imageResizeResults) {
                                                                    if(err){
                                                                            console.log(err);
                                                                            console.log("Error in image resize 200 in collagedetails!!!!");
                                                                            callback();
                                                                    }else{
                                                                            callback();
                                                                    }
                                                                });
                                                            },
                                                            function(callback) {
                                                                imgWidth                    =    70;
                                                                imgHeight                   =    70;
                                                                imageDst                    =     profilePic_path_assets + ext[0] + "_"+imgWidth+"x"+imgHeight+"." +ext[1];
                                                                ImgResizeService.imageResizeWH(imgWidth, imgHeight, imageSrc, imageDst, function(err, imageResizeResults) {
                                                                    if(err){
                                                                            console.log(err);
                                                                            console.log("Error in image resize 70 collageDetails !!!!");
                                                                            callback();
                                                                    }else{
                                                                            callback();
                                                                    }
                                                                });
                                                            },
                                                        ],function(err){
                                                            if(err){
                                                                console.log(err);
                                                                callback();
                                                            }else{
                                                                console.log("Loop success");
                                                                //collage-Details images
                                                                callback();
                                                            }
                                                        });
                                                    });
                                                }else{
                                                    callback();
                                                }
                                            },

                                            function(callback){
                                                console.log("parallel 2")
                                                console.log("async parallel in Mailpart ===============================================");
                                                var global_settingsKeyValue     =   req.options.settingsKeyValue;
                                                var email_to                    =   results.email;
                                                var email_subject               =   'Welcome to Dither';
                                                var email_template              =   'signup';
                                                var email_context               = {
                                                                                    receiverName    :   results.name,
                                                                                    email_img_url   :   global_settingsKeyValue.CDN_IMAGE_URL + 'images/email/'
                                                                                };
                                                EmailService.sendEmail(global_settingsKeyValue, email_to,email_subject,email_template,email_context, function(err, sendEmailResults) {
                                                    if(err){
                                                        console.log(err);
                                                        console.log("async parallel in Mailpart Error");
                                                        callback();
                                                    }else{
                                                        callback();
                                                    }
                                                });
                                            },
                                            function(callback){
                                                console.log("parallel 3")
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
                                            },

                                            function(callback){
                                                //-----------------INvitation table ---Tag editing----------------------
                                                console.log("parallel 4")
                                                console.log(phoneNumber)
                                                Invitation.find({phoneNumber : phoneNumber}).exec(function (err, selectContacts){
                                                    if(err){
                                                        console.log(err);
                                                        callback();
                                                    }else{
                                                        if(selectContacts.length == 0){
                                                                callback();
                                                        }else{
                                                            var invited_collage_Array     = [];
                                                            selectContacts.forEach(function(factor, index){

                                                                invited_collage_Array.push("("+factor.collageId+",'"+results.id+"', now(), now())");
                                                            });
                                                            Invitation.destroy({phoneNumber: phoneNumber}).exec(function (err, deleteInvitation) {
                                                                if(err){
                                                                    console.log(err);
                                                                    callback();
                                                                }else{
                                                                    //Insert to tags table
                                                                    var query = "INSERT INTO tags"+
                                                                                " (collageId, userId, createdAt, updatedAt)"+
                                                                                " VALUES"+invited_collage_Array;
                                                                    Tags.query(query, function(err, insertTagsResult){
                                                                        if(err){
                                                                            console.log(err);
                                                                            callback();
                                                                        }else{
                                                                            callback();
                                                                        }
                                                                    });
                                                                }
                                                            });

                                                        }
                                                    }
                                                });
                                            },

                                            function(callback){
                                                console.log("---------------fbb-----------------------------")
                                                console.log(sendStatus)
                                                if(!fbUser.length){
                                                    console.log("nofb user")
                                                    callback();
                                                }else{
                                                    sendStatus          =   true;
                                                    var contactArr      =    [];
                                                    var fbUserArray     =    [];
                                                    fbUser.forEach(function(factor, index){
                                                         contactArr.push(factor.fb_userid)
                                                         //fbUserArray.push("("+factor.fb_userid+",'"+factor.fb_userid+"', now(), now())");
                                                    });
                                                    /*var query =  "INSERT INTO tempFbfriends"+
                                                                 " (userId, fbId, createdAt, updatedAt)"+
                                                                 " VALUES"+fbUserArray;*/
                                                    var data    =   {
                                                                        userId      :   results.id,
                                                                        fbId        :   results.fbId,
                                                                        userName    :   results.name,

                                                                    };
                                                    console.log( "User Service data")
                                                    console.log(data)
                                                    User.find({fbId: contactArr}).exec(function (err, getUserId){
                                                        if(err){
                                                            console.log(err)
                                                            callback();
                                                        }else{
                                                            var notifyArr       =    [];
                                                            var fbUserArray     =   [];
                                                            getUserId.forEach(function(factor, index){
                                                                notifyArr.push(factor.id);
                                                                fbUserArray.push("("+results.id+",'"+factor.name+"','"+factor.fbId+"', now(), now())");
                                                                //fbUserArray.push("("+factor.id+","+results.id+",'"+factor.name+"', '"+factor.fbId+"', now(), now())");
                                                            });
                                                            /*var query =  "INSERT INTO tempFbfriends"+
                                                                 " (userId, fbId, createdAt, updatedAt)"+
                                                                 " VALUES"+fbUserArray;

                                                            TempFbFriends.query(query,function(err, createdFbFriends){
                                                                if(err){
                                                                    callback();
                                                                 }
                                                                 else{
                                                                        console.log(createdFbFriends);
                                                                  }
                                                            });*/
                                                            if(notifyArr.length){
                                                                var values ={
                                                                    notificationTypeId  :   5,
                                                                    userId              :   data.userId,
                                                                    tagged_users        :   notifyArr
                                                                }
                                                                console.log("valuessssssssssss")
                                                                console.log(values)
                                                                NotificationLog.create(values).exec(function(err, createdNotification){
                                                                    if(err){
                                                                        console.log(err);
                                                                        //callback();
                                                                    }else{
                                                                        User_token.find({userId: notifyArr}).exec(function (err, getDeviceId){
                                                                            if(err){
                                                                                  console.log(err);
                                                                                  callback();
                                                                            }else{
                                                                                console.log("-----------------6----------------------")
                                                                                var message     =  'FBsignup Notification';
                                                                                var ntfn_body   =   "Your facebook friend "+results.name+" is now on Dither";
                                                                                getDeviceId.forEach(function(factor, index){
                                                                                    deviceId_arr.push(factor.deviceId);
                                                                                });
                                                                                if(!deviceId_arr.length){
                                                                                    console.log("deviceeee")
                                                                                    callback();
                                                                                }else{
                                                                                    console.log("NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN")
                                                                                    var data        =  {
                                                                                                            message         :   message,
                                                                                                            device_id       :   deviceId_arr,
                                                                                                            NtfnBody        :   ntfn_body,
                                                                                                            NtfnType:5,id   :   results.id,
                                                                                                            notification_id :   createdNotification.id,
                                                                                                            old_id          :   '',
                                                                                                            name            :   results.name
                                                                                                        };
                                                                                    NotificationService.NotificationPush(data, function(err, ntfnSend){
                                                                                        if(err){
                                                                                            console.log("Error in Push Notification Sending")
                                                                                            console.log(err)
                                                                                            callback();
                                                                                        }else{
                                                                                            console.log("Push notification result")
                                                                                            console.log(ntfnSend)
                                                                                            console.log("Push Notification sended")
                                                                                            /*var query = "INSERT INTO fbFriends"+
                                                                                                        " (userId,ditherUserId,ditherUserName, fbId, createdAt, updatedAt)"+
                                                                                                        " VALUES"+fbUserArray;*/
                                                                                            var query =  "INSERT INTO TempFbFriends"+
                                                                                                         " (userId,fbName,fbId, createdAt, updatedAt)"+
                                                                                                         " VALUES"+fbUserArray;
                                                                                            TempFbFriends.query(query,function(err, createdFbFriends){
                                                                                                if(err){
                                                                                                    console.log(err)
                                                                                                    callback();
                                                                                                }else{
                                                                                                    console.log(createdFbFriends)
                                                                                                    callback();
                                                                                                    sendStatus  =   true;
                                                                                                }
                                                                                            });
                                                                                            //callback();
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
                                                }
                                            },

                                            function (callback){
                                                console.log("parallel 5")
                                                console.log(sendStatus)
                                                //var number            = req.param('mobile_number');
                                                var phoneContactsArray    = [];
                                                var query   =   "SELECT userId FROM addressBook where ditherUserPhoneNumber='"+phoneNumber+"' group by userId";
                                                AddressBook.query(query, function(err,UserContacts){
                                                    if(err){
                                                        callback();
                                                    }else{
                                                        if(!UserContacts.length){
                                                            callback();
                                                        }else{
                                                            var tagNotifyArray = [];
                                                            UserContacts.forEach(function(factor, index){
                                                                tagNotifyArray.push(factor.userId);
                                                                User.findOne({id:factor.userId}).exec(function (err, notifySettings){
                                                                    if(notifySettings){
                                                                        if(notifySettings.notifyContact==1){
                                                                            contact_arr.push(factor.userId);
                                                                        }
                                                                    }
                                                                });
                                                            });
                                                            if(sendStatus==false){
                                                                var values ={
                                                                        notificationTypeId  :   4,
                                                                        userId              :   results.id,
                                                                        tagged_users        :   tagNotifyArray
                                                                    }
                                                                console.log(values)
                                                                NotificationLog.create(values).exec(function(err, createdNotification){
                                                                    if(err){
                                                                        console.log(err);
                                                                        callback();
                                                                    }else{
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


                                                                        });
                                                                        User_token.find({userId: contact_arr}).exec(function (err, getDeviceId){
                                                                            if(err){
                                                                                  console.log(err);
                                                                                  callback();
                                                                            }else{
                                                                                var message     =  'signup Notification';
                                                                                var ntfn_body   =   "Your contact "+results.name +" is now on Dither";
                                                                                getDeviceId.forEach(function(factor, index){
                                                                                    deviceId_arr.push(factor.deviceId);
                                                                                });
                                                                                if(!deviceId_arr.length){
                                                                                        callback();
                                                                                }else{
                                                                                    var data        =  {
                                                                                                        message             :   message,
                                                                                                        device_id           :   device_Id_arr,
                                                                                                        NtfnBody            :   ntfn_body,
                                                                                                        NtfnType            :   4,
                                                                                                        id                  :   results.id,
                                                                                                        notification_id     :   createdNotification.id,
                                                                                                        old_id              :   '',
                                                                                                        number              :   results.phoneNumber
                                                                                                    };
                                                                                    NotificationService.NotificationPush(data, function(err, ntfnSend){
                                                                                        if(err){
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
                                                            }else{
                                                                callback();
                                                            }

                                                        }
                                                    }
                                                });
                                            },

                                            function (callback){
                                                console.log("parallel 7 == Default dither creation");
                                                var default_collage                     =       JSON.parse(req.options.settingsKeyValue.DEFAULT_DITHER);
                                                User.findOne({type: 1}).exec(function (err, getSuperUser){
                                                    if(err){
                                                            console.log(err);
                                                            callback();
                                                    }else{
                                                        var today;
                                                        var count = 0;
                                                        var count_Array = [];
                                                        default_collage.forEach(function(factor_1, index_1){
                                                            count ++;
                                                            count_Array.push(count);
                                                            var expiryDate      =       new Date(new Date().setFullYear(2200));
                                                            var imgTitle,
                                                                collageImage;
                                                            var filteredArray_1 = factor_1.filter(
                                                               function (obj) {
                                                                    return obj.position == 0;
                                                            });
                                                            filteredArray_1.forEach(function(factor, index){
                                                                collageImage    =  factor.image;
                                                            });
                                                            console.log("filteredArray-----------");
                                                            console.log(filteredArray_1);
                                                            switch(index_1){
                                                                case 0 :
                                                                        today            = new Date(new Date().setSeconds(11)).toISOString();
                                                                break;
                                                                case 1 :
                                                                        today            = new Date(new Date().setSeconds(12)).toISOString();
                                                                break;
                                                                case 2 :
                                                                        today            = new Date(new Date().setSeconds(13)).toISOString();
                                                                break;
                                                                case 3 :
                                                                        today            = new Date(new Date().setSeconds(14)).toISOString();
                                                                break;
                                                            }
                                                            var values_1 = {
                                                                    imgTitle        : "Share your opinion",
                                                                    image           : collageImage,
                                                                    location        : '39,Albemarle Gate,Cheltenham,Cheltenham',
                                                                    //latitude        : '',
                                                                    //longitude       : '',
                                                                    userId          : getSuperUser.id,
                                                                    expiryDate      : expiryDate,
                                                                    createdAt       : today,
                                                            };
                                                            Collage.create(values_1).exec(function(err, createCollage){
                                                                if(err){
                                                                    console.log(err);
                                                                    callback();
                                                                    //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage creation', error_details: err});
                                                                }else{
                                                                    console.log("++++++++++++++++++++++++inserted"+index_1);
                                                                    var filteredArray_2 = factor_1.filter(
                                                                        function (obj) {
                                                                        return obj.position != 0;
                                                                    });
                                                                    console.log(filteredArray_2);
                                                                    var switchKey           =    filteredArray_2.length;
                                                                    //var values_2_Array      =    [];
                                                                    filteredArray_2.forEach(function(factor, index){
                                                                            factor.collageId   =   createCollage.id;
                                                                    });
                                                                    var values_2  =  filteredArray_2;
                                                                    if(!createCollage){
                                                                            //callback();
                                                                    }else{
                                                                        CollageDetails.create(values_2).exec(function(err, createdCollageDetails){
                                                                            if(err){
                                                                                console.log(err);
                                                                                callback();
                                                                                //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage Detail creation', error_details: err});
                                                                            }else{
                                                                                //callback();
                                                                                var values = {
                                                                                    collageId   : createCollage.id,
                                                                                    userId      : results.id,
                                                                                }
                                                                                Tags.create(values).exec(function(err, createdCollageTags){
                                                                                    if(err){
                                                                                        console.log(err);
                                                                                        callback();
                                                                                    }else{
                                                                                            console.log("Tagged User insertion");
                                                                                    }
                                                                                });
                                                                            }
                                                                        });
                                                                    }
                                                                }
                                                            });
                                                        });
                                                        if(parseInt(count_Array.length) === parseInt(default_collage.length)){
                                                                callback();
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
                                                    console.log("signup Success --------------------");
                                                    if(results.mentionId==''){
                                                        results.mentionId = results.id;
                                                    }
                                                    return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully completed the signup',
                                                                          token         :   userTokenDetails.token.token,
                                                                          user_id       :   results.id,
                                                                          mobile_number :   results.phoneNumber,
                                                                          mention_id    :   results.mentionId
                                                                    });
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
        var deviceId                    =     req.get('device_id');
        var accessToken					=     req.get('accessToken');
        var mobile_no                   =     req.param('mobile_number');
        var fbId                        =     req.param('fb_uid');
        //console.log(req.headers)
        console.log(req.get("device_id"));
        console.log(req.get("token"));
        console.log(device_IMEI)
        console.log(device_Type)
        console.log(deviceId)
        console.log(mobile_no)
        console.log(fbId)
        console.log(accessToken)
        if( (!deviceId && !fbId && !mobile_no) || (deviceId && !fbId && !mobile_no) || (!deviceId && fbId && mobile_no) || (!deviceId && fbId && !mobile_no) || (!deviceId && !fbId && mobile_no)  ){
                    return res.json(200, {status: 2, status_type: 'Failure' , message: 'please pass (fb_uid & device_id) OR (mobile_number & device_id)'});
                     //If an error occured, we let express/connect handle it by calling the "next" function
        }else{
                var query       = "SELECT * from user where fbId = '"+fbId+"' OR phoneNumber = '"+mobile_no+"'";
                console.log(query)
                User.query(query, function(err, results) {
                //User.findOne({fbId: req.param('fb_uid')}).exec(function (err, results){
                        if (err) {
                               sails.log("jguguu"+err);
                               return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in finding fbId', error_details: err});
                        }else{
                                console.log("--------------resultssssssssssssssssssssss------------------")
                                console.log(results)
                                if(!results.length){
                                      return res.json(200, {status: 1, status_type: 'Success' ,  message: "This is a new user", isNewUser: true});
                                }else{

                                      if(results.status=='inactive')
                                      {
                                          return res.json(200, {status: 2, status_type: 'Success' ,  message: 'Your account seems to be suspended! If you believe this is in error, please contact jake@dither.com', isNewUser: false});
                                      }
                                      else
                                      {
                                          if(!device_IMEI || !device_Type ){
                                              return res.json(200, {status: 2, status_type: 'failure' ,  message: "Please pass device IMEI and deviceType"});
                                          }
                                          else{
                                            //delete existing token
                                                var query   =   "DELETE FROM userToken where device_IMEI='"+device_IMEI+"'";
                                                User_token.query(query, function(err, result) {
                                                    if(err){
                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in token creation', error_details: err});
                                                    }else{
                                                        UsertokenService.createToken(results[0].id,deviceId,device_IMEI,device_Type,token_expiry_hour, function (err, userTokenDetails){
                                                            if (err){
                                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in token creation', error_details: err});
                                                            }
                                                            else{
																 if(!accessToken ){
																		//return res.json(200, {status: 2, status_type: 'failure' ,  message: "Please pass accessToken"});
																	 
																		var notifyArray = [];
																		notifyArray.push({comment:results[0].notifyComment,contact:results[0].notifyContact,vote:results[0].notifyVote,opinion:results[0].notifyOpinion,mention:results[0].notifyMention});
																		var profile_image       =    profilePic_path + results[0].profilePic;
																		return res.json(200, {status: 1, status_type: 'Success' ,  message: "This user already have an account in dither",
																							  email             :   results[0].email,
																							  full_name         :   results[0].name,
																							  fb_uid            :   results[0].fbId,
																							  isNewUser         :   false,
																							  profile_image     :   profile_image,
																							  token             :   userTokenDetails.token.token,
																							  user_id           :   results[0].id,
																							  mobile_number     :   results[0].phoneNumber,
																							  notification      :   notifyArray
																						});
																 }
															     else{
																	var data     = {accessToken:accessToken};
																	var criteria = {id: results[0].id};
																	User.update(criteria,data).exec(function(err, data){
																	  if(err){
																		  return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in access token updation', error_details: err});
																	  }else{
																		  
																	  
																			var notifyArray = [];
																			notifyArray.push({comment:results[0].notifyComment,contact:results[0].notifyContact,vote:results[0].notifyVote,opinion:results[0].notifyOpinion,mention:results[0].notifyMention});
																			var profile_image       =    profilePic_path + results[0].profilePic;
																			return res.json(200, {status: 1, status_type: 'Success' ,  message: "This user already have an account in dither",
																								  email             :   results[0].email,
																								  full_name         :   results[0].name,
																								  fb_uid            :   results[0].fbId,
																								  isNewUser         :   false,
																								  profile_image     :   profile_image,
																								  token             :   userTokenDetails.token.token,
																								  user_id           :   results[0].id,
																								  mobile_number     :   results[0].phoneNumber,
																								  notification      :   notifyArray
																							});
																							
																		}
																	 
																    });					
																							
																}						
                                                            }
                                                        });

                                                    }
                                                });
                                            }
                                   }
                                }

                        }

                });
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
        if(!device_IMEI && !deviceId && !userToken){

              console.log("error")
               return res.json(200, {status: 2,  status_type: 'Failure' , message: 'Please provide the token,device_id,device_imei'});
        }else{


                 var query = "DELETE FROM userToken WHERE device_IMEI='"+device_IMEI+"'";
                User_token.query(query, function(err, result) {
                    if(err) {
                        console.log(err)
                         return res.json(200, {status: 2,  status_type: 'Failure' , message: 'some error occured', error_details: result});
                    } else {
                        req.session.userToken   =   "";
                        return res.json(200, {status: 1,  status_type: 'Success' , message: 'Successfully LogOut'});
                    }
                });

        }

    },



   /* ==================================================================================================================================
               To Edit Profile
     ==================================================================================================================================== */

      editProfile:  function (req, res) {


                var tokenCheck                  =     req.options.tokenCheck;
                var userId                      =     tokenCheck.tokenDetails.userId;
                var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                var server_baseUrl              =     req.options.server_baseUrl;
                var imageUploadDirectoryPath    =     '../../assets/images/profilePics';
                var profilePic_path_assets      =     req.options.file_path.profilePic_path_assets;
                var edit_type                   =     req.param('edit_type');
                //var fileName                    =     req.file('profile_image');


                var switchKey = edit_type;
                switch(switchKey){
                        case '1' :
                                    //-------------Change only ProfilePic------------------------------------
                                    console.log("Type 1-change Profile PIc")
                                    var imageName ;
                                    req.file('profile_image').upload({dirname: '../../assets/images/profilePics',maxBytes: 100 * 1000 * 1000},function (err, profileUploadResults) {
                                        if (err){
                                            console.log(err)
                                            return res.json(200, {status: 2,status_type: 'Failure', message: 'Updateion failure'});
                                        }else{
                                            if(!profileUploadResults.length){
                                                 return res.json(200, {status: 2,status_type: 'Failure', message: 'Image Not Found'});
                                            }else{
                                                    console.log("profileImages   ------->>> Uploaded");
                                                    imageName = profileUploadResults[0].fd.split('/');
                                                    imageName = imageName[imageName.length-1];
                                                    var data     = {profilePic:imageName};
                                                    var criteria = {id: userId};
                                                    User.update(criteria,data).exec(function(err, data){
                                                        if(err){
                                                            sails.log(err)
                                                            return res.json(200, {status: 2, status_type: 'Failure',message: 'Profile Image updation Failure'});
                                                        }else{
                                                            //var profileImage = server_baseUrl + "images/profilePics/"+imageName;
                                                            var profileImage        =   profilePic_path + imageName;
                                                            // ------------------------------Generate ThumbnailImage-----------------------------------------------
                                                                /*var imageSrc                    =     profilePic_path_assets + imageName;

                                                                fs.exists(imageSrc, function(exists) {
                                                                if (exists) {

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
                                                                                    console.log(imageResizeResults)
                                                                                    //profileImage  =   profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                                                                    return res.json(200, {status: 1, status_type: 'Success',message: 'Updation Success', profile_image : profileImage});


                                                                            }
                                                                        });

                                                                }else{
                                                                        console.log("Image not exists");
                                                                        return res.json(200, {status: 1, status_type: 'Success',message: 'Profile image not exist', });

                                                                    }
                                                                  });*/
                                                                var imageSrc                    =     profilePic_path_assets + imageName;
                                                                var ext                         =     imageSrc.split('/');
                                                                ext                             =     ext[ext.length-1].split('.');
                                                                var imgWidth,
                                                                    imgHeight,
                                                                    imageDst;

                                                                async.series([
                                                                        function(callback) {
                                                                                    imgWidth                    =    200;
                                                                                    imgHeight                   =    200;
                                                                                    imageDst                    =     profilePic_path_assets + ext[0] + "_"+imgWidth+"x"+imgHeight+"." +ext[1];
                                                                                    ImgResizeService.imageResizeWH(imgWidth, imgHeight, imageSrc, imageDst, function(err, imageResizeResults) {
                                                                                            if(err){
                                                                                                    console.log(err);
                                                                                                    console.log("Error in image resize 200 in collagedetails!!!!");
                                                                                                    callback();
                                                                                            }else{
                                                                                                    callback();
                                                                                            }
                                                                                    });

                                                                        },
                                                                        function(callback) {
                                                                                    imgWidth                    =    70;
                                                                                    imgHeight                   =    70;
                                                                                    imageDst                    =     profilePic_path_assets + ext[0] + "_"+imgWidth+"x"+imgHeight+"." +ext[1];
                                                                                    ImgResizeService.imageResizeWH(imgWidth, imgHeight, imageSrc, imageDst, function(err, imageResizeResults) {
                                                                                            if(err){
                                                                                                    console.log(err);
                                                                                                    console.log("Error in image resize 70 collageDetails !!!!");
                                                                                                    callback();
                                                                                            }else{
                                                                                                    callback();
                                                                                            }
                                                                                    });

                                                                        },
                                                                ],function(err){
                                                                            if(err){
                                                                                console.log(err);
                                                                                return res.json(200, {status: 1, status_type: 'Failure',message: 'Some error occured in edit profile pic', profile_image : profileImage});
                                                                            }else{
                                                                                console.log("Loop success");
                                                                                //collage-Details images
                                                                                //callback();
                                                                                return res.json(200, {status: 1, status_type: 'Success',message: 'Updation Success', profile_image : profileImage});

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
                                    console.log("Type 2-Remove ProfilePic")
                                    User.findOne({id:userId}).exec(function (err, resultData){
                                        if(err){
                                            console.log(err)
                                            return res.json(200, {status: 2, status_type: 'Failure',message:'error occured in profilePic selection in delete profile'});
                                        }else{
                                               console.log(resultData);
                                                if(!resultData){
                                                        return res.json(200, {status: 2, status_type: 'Failure',message: 'User Not Found'});
                                                }else{
                                                         console.log(resultData);
                                                        if(resultData.profilePic != null || resultData.profilePic != ''){
                                                                    console.log("Entered unlink if ----->>>>");
                                                                    var profileImage    =   profilePic_unlink_path + resultData.profilePic;
                                                                   // fs.unlink(profileImage);
                                                        }
                                                        console.log("below unlink if");
                                                        var data     = {profilePic: ""};
                                                        var criteria = {id: userId};
                                                        User.update(criteria,data).exec(function(err, datas) {
                                                            if(err){
                                                                sails.log(err)
                                                                return res.json(200, {status: 2, status_type: 'Failure', message: 'profile image deletion failure'});
                                                            }else{
                                                                console.log("Success update");
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

