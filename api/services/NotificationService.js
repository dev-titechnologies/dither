
var PusherService  = require('sails-service-pusher');

module.exports = {


    /*=================================================================================================================================
            PUSH Notification Service
    ================================================================================================================================== */



    //-----------IOS---------------------------------

    pushNtfnApn: function(data,device_id, callback){
        console.log("Push Notification Apn")
        //console.log(device_id)
        var details  =  {
                        "message"             :   data.NtfnBody,
                        "type"                :   data.NtfnType,
                        "id"                  :   data.id,
                        "notification_id"     :   data.notification_id
                    };
        //console.log(details);
        ios = PusherService('ios', {
            device          :   [], // Array of string with device tokens
            provider        :   {
                                cert                    : 'assets/push_Ntfn_certificates/apns-pro-cert.pem', // The filename of the connection certificate to load from disk
                                key                     : 'assets/push_Ntfn_certificates/apns-pro-key.pem', // The filename of the connection key to load from disk
                                ca                      : [], // An array of trusted certificates
                                pfx                     : '', // File path for private key, certificate and CA certs in PFX or PKCS12 format
                                passphrase              : '123456789', // The passphrase for the connection key
                                production              : true, // Specifies which environment to connect to: Production (if true) or Sandbox
                                voip                    : false, // Enable when you are using a VoIP certificate to enable paylods up to 4096 bytes
                                port                    : 2195, // Gateway port
                                rejectUnauthorized      : true, // Reject Unauthorized property to be passed through to tls.connect()
                                cacheLength             : 1000, // Number of notifications to cache for error purposes
                                autoAdjustCache         : true, // Whether the cache should grow in response to messages being lost after errors
                                maxConnections          : 1, // The maximum number of connections to create for sending messages
                                connectTimeout          : 10000, // The duration of time the module should wait, in milliseconds
                                connectionTimeout       : 3600000, // The duration the socket should stay alive with no activity in milliseconds
                                connectionRetryLimit    : 10, // The maximum number of connection failures that will be tolerated before apn will "terminate"
                                buffersNotifications    : true, // Whether to buffer notifications and resend them after failure
                                fastMode                : false // Whether to aggresively empty the notification buffer while connected
            },
            notification    :   {
                                title       : 'Dither', // Indicates notification title
                                body        : data.NtfnBody, // Indicates notification body text
                                icon        : '', // Indicates notification icon
                                sound       : 'aurora.aiff', // Indicates sound to be played
                                badge       : '', // Indicates the badge on client app home icon
                                payload     : details,// Custom data to send within Push Notification*/
            }
        });

        //console.log(ios)
        ios
          .send([device_id], {
          });
          //.then(console.log.bind(console))
          //.catch(console.error.bind(console));
          callback();


    },

    //-----------ANDROID---------------------------------

    pushNtfnGcm: function(data,device_id, callback){
        console.log("Push Notification GCM")
        //console.log(data)
        //console.log(device_id)
        //console.log("counttttttttttttttttttt"+data.device_id.length)
        var ntfnArr         =   [];
        ntfnArr             =   data.device_id;
        var details         =   {
                                "message"             :       data.NtfnBody,
                                "type"                :       data.NtfnType,
                                "id"                  :       data.id,
                                "notification_id"     :       data.notification_id,
                                "old_id"              :       data.old_id,
                                "name"                :       data.name,
                                "number"              :       data.number
                            };
        android = PusherService('android', {
                device          :   [], // Array of string with device tokens
                provider        : {
                                    apiKey      : 'AIzaSyAtRgo9lBqb-bMhyxqfNnNILthdyRNkiLg', // Your Google Server API Key
                                    maxSockets  : 0, // Max number of sockets to have open at one time
                                    proxy       : '' // This is [just like passing a proxy on to request](https://github.com/request/request#proxies)
                                },
                notification    : {
                                    title   : 'Android Test Push', // Indicates notification title
                                    body    : data.NtfnBody, // Indicates notification body text
                                    icon    : '', // Indicates notification icon
                                    sound   : 'pulses.wav', // Indicates sound to be played
                                    badge   : '', // Indicates the badge on client app home icon
                                    payload : {}// Custom data to send within Push Notification
                                },
        });
        //console.log(android)
        //console.log("device arrayyyyyyyyyyyyyyyyy")
        //console.log(ntfnArr)
        //console.log(device_id)
        android
            .send([device_id], {
                    body: details
                });
           // .then(console.log.bind(console))
           // .catch(console.error.bind(console));
             callback();
    },



//console.error.bind(console)

//===============================================END OF PUSH==========================================================================================

  /*=============================================================================================================================================
                                        SERVICE FOR PUSH NOTIFICATION
    ==============================================================================================================================================*/


    NotificationPush: function(data,callback){
        console.log("**************device_Dataaaaaaaaaaaaaaaaaa******************")
        console.log(data)
        var arr = data.device_id;
        //console.log("/////////----Device array----//////////")
        //console.log(arr)
        if(arr){
            arr.forEach(function(factor, index){
                User_token.findOne({deviceId:factor }).exec(function (err, getDeviceType){
                    if(err){
                        console.log("error")
                    }else{
                        //console.log("device token---------------------")
                        //console.log(factor)
                        //console.log(getDeviceType)
                        if(factor!=0){
                                var deviceId    =  factor;
                                var switchKey   =  getDeviceType.device_Type;
                                //console.log(switchKey)
                                //console.log("factorrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
                                //console.log(deviceId)
                                switch(switchKey){
                                        case 'ios' :
                                                    NotificationService.pushNtfnApn(data,deviceId, function(err, ntfnSend) {
                                                        if(err){
                                                            console.log("Error in Push Notification Sending")
                                                            console.log(err)
                                                            //callback();
                                                        }else{
                                                            //console.log("Push notification result i nIOS")
                                                            //console.log(ntfnSend)
                                                            //console.log("push notification sended")
                                                            //callback();

                                                        }
                                                    });
                                        break;

                                        case 'android' :
                                                    NotificationService.pushNtfnGcm(data,deviceId, function(err, ntfnSend) {
                                                        if(err){
                                                            console.log("Error in Push Notification Sending")
                                                            console.log(err)
                                                            //callback();
                                                        }else{
                                                            //console.log("Push notification result IN Android")
                                                            //console.log(ntfnSend)
                                                            //console.log("Push Notification sended")
                                                            //callback();
                                                        }
                                                    });
                                        break;
                                        default:
                                                    console.log("default")
                                                    //callback();

                                        break;
                                }
                        }
                    }
                });
            },callback());

        }else{
            callback();
        }
    },


 /*=============================================================================================================================================
     collage Notification Log Insertion
    ==============================================================================================================================================*/

    collageNotificationLogCreation: function(params,callback){

            var query = "SELECT id FROM notificationLog where collage_id = '"+params.collageId+"' and notificationTypeId = " + params.notificationTypeId;
            NotificationLog.query(query, function(err, notificationFound){
                if(err){
                    console.log(err)
                    //callback();
                    callback(true, {status: 2, status_type: "Failure", message: 'Some error occured in select notification log', error_details: err});
                }else{
                    // old_id      = selCommentNtfn[0].id;
                    var creatorId;
                    var old_id     = "";
                    if(notificationFound.length){
                            console.log(notificationFound[0].id)
                            old_id   =  notificationFound[0].id;
                    }
                    var query = "DELETE FROM notificationLog where collage_id = '"+params.collageId+"' and notificationTypeId = " + params.notificationTypeId;
                    NotificationLog.query(query, function(err, deleteNotification){
                        if(err){
                           console.log(err)
                           //callback();
                           callback(true, {status: 2, status_type: "Failure", message: 'Some error occured in delete notification log', error_details: err});
                        }else{
                            var likedImageId    =  0;
                            var description     =  0;
                            switch(params.notificationTypeId){

                                case 2 :
                                        description   =  parseInt(params.totalVote) + 1;
                                        likedImageId  =  likedImageId;
                                        creatorId     =  params.collageCreatorId;
                                break;

                                case 3 :
                                        description   =  params.description;
                                        creatorId     =  params.collageCreatorId;
                                break;

                                case 9 :
                                        creatorId     =  params.commentCreatorId;
                                        description   =  parseInt(params.totalLikeCount) + 1;
                                break;
                            }
                            console.log("creatorId ++++++++++");
                            console.log(creatorId);
                            var values ={
                                    notificationTypeId  :   params.notificationTypeId,
                                    userId              :   params.userId,
                                    ditherUserId        :   creatorId,
                                    collage_id          :   params.collageId,
                                    image_id            :   likedImageId,
                                    description         :   description,
                            }
                            NotificationLog.create(values).exec(function(err, createdNotificationTags){
                                if(err){
                                    console.log(err);
                                    //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in inserting collage tagged users', error_details: err});
                                    callback(true, {status: 2, status_type: "Failure", message: 'Some error occured in create notification log', error_details: err});
                                }else{

                                        switch(params.notificationTypeId){
                                            case 2 :
                                                    var creator_roomName  = "socket_user_"+creatorId;
                                                    sails.sockets.broadcast(creator_roomName,{
                                                                    type                       :       "notification",
                                                                    id                         :       params.collageId,
                                                                    user_id                    :       params.userId,
                                                                    message                    :       "Like Dither - Room Broadcast - to Creator",
                                                                    //roomName                   :       creator_roomName,
                                                                    //subscribers                :       sails.sockets.subscribers(creator_roomName),
                                                                    //socket                     :       sails.sockets.rooms(),
                                                                    notification_type          :       params.notificationTypeId,
                                                                    notification_id            :       createdNotificationTags.id
                                                                    });
                                            break;
                                            case 3 :

                                                    var creator_roomName  = "socket_user_"+creatorId;
                                                    sails.sockets.broadcast(creator_roomName,{
                                                                    type                       :       "notification",
                                                                    id                         :       params.collageId,
                                                                    user_id                    :       params.userId,
                                                                    message                    :       "Comment Dither - Room Broadcast - to Creator",
                                                                    //roomName                   :       creator_roomName,
                                                                    //subscribers                :       sails.sockets.subscribers(creator_roomName),
                                                                    //socket                     :       sails.sockets.rooms(),
                                                                    notification_type          :       params.notificationTypeId,
                                                                    notification_id            :       createdNotificationTags.id
                                                                });

                                            break

                                            case 9 :
                                                    var creator_roomName  = "socket_user_"+creatorId;
                                                    sails.sockets.broadcast(creator_roomName,{
                                                                    type                       :       "notification",
                                                                    id                         :       params.collageId,
                                                                    user_id                    :       params.userId,
                                                                    message                    :       "Like comment - Room Broadcast - to Creator",
                                                                    //roomName                   :       creator_roomName,
                                                                    //subscribers                :       sails.sockets.subscribers(creator_roomName),
                                                                    //socket                     :       sails.sockets.rooms(),
                                                                    notification_type          :       params.notificationTypeId,
                                                                    notification_id            :       createdNotificationTags.id
                                                                    });
                                            break;
                                        }

                                        params.notification_id     =   createdNotificationTags.id;
                                        User.findOne({id : creatorId}).exec(function (err, notifySettings){
                                            if(err){
                                                console.log(err);
                                                //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in retrieving user details ', error_details: err});
                                                callback(true, {status: 2, status_type: "Failure", message: 'Some error occured in finding users notification settings', error_details: err});
                                            }else{
                                                console.log("notifySettings ++++++++++++++===");
                                                console.log(notifySettings);
                                                if(!notifySettings){
                                                        /*return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully voted the Comment',
                                                                            total_like_count       :  updatedVoteCount[0].vote,
                                                                          });*/
                                                        callback(false, {status: 1, status_type: "Success", message: 'Some error occured in finding users notification settings', notifySettings : ""});
                                                }else{
                                                    console.log("params.notificationSettingsType =======================");
                                                    console.log(params.notificationSettingsType);
                                                    switch(params.notificationSettingsType){
                                                        case "notifyCommentLike":
                                                                    console.log("Inside <<<=======>>> notifyCommentLike");
                                                                    if(notifySettings.notifyCommentLike == 1){
                                                                            pushNotificationFunction(params);
                                                                    }else{
                                                                            callback(false, {status: 1, status_type: "Success", message: 'notifyCommentLike is 0'});
                                                                    }
                                                        break;
                                                        case "notifyComment":
                                                                    console.log("Inside <<<=======>>> notifyCommentLike");
                                                                    if(notifySettings.notifyComment == 1){
                                                                            pushNotificationFunction(params);
                                                                    }else{
                                                                            callback(false, {status: 1, status_type: "Success", message: 'notifyCommentLike is 0'});
                                                                    }

                                                        break;
                                                        case "notifyVote":
                                                                    console.log("Inside <<<=======>>> notifyVote");
                                                                    if(notifySettings.notifyVote == 1){
                                                                            pushNotificationFunction(params);
                                                                    }else{
                                                                            callback(false, {status: 1, status_type: "Success", message: 'notifyCommentLike is 0'});
                                                                    }
                                                        break;
                                                    }
                                             // +++++++++++++++++++++++++
                                                        function pushNotificationFunction(params){
                                                                console.log("pushNotificationFunction ======>>>>>>>>>>>>>>>");
                                                                User_token.find({userId: creatorId }).exec(function (err, getDeviceId){
                                                                    if(err){
                                                                          console.log(err);
                                                                          //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in findig deviceId', error_details: err});
                                                                          callback(true, {status: 2, status_type: "Failure", message: 'Some error occured in getting loggedusers device id'});
                                                                    }else{
                                                                        //console.log("Get-------------Device--------------ID")
                                                                        //console.log(getDeviceId)
                                                                        //var message     =  'Vote Notification';
                                                                        //var ntfn_body   =  tokenCheck.tokenDetails.name +" Voted on Your Dither";
                                                                       // var device_id   =  getDeviceId.deviceId;
                                                                        var deviceId_arr    = [];
                                                                        getDeviceId.forEach(function(factor, index){
                                                                                    deviceId_arr.push(factor.deviceId);
                                                                        });
                                                                        console.log("++++++++++++++++++++ deviceId_arr ++++++++++++++++");
                                                                        console.log(deviceId_arr);
                                                                        if(!deviceId_arr.length){
                                                                                /*return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully voted the Image',
                                                                                                                total_like_count       :  updatedVoteCount[0].vote,
                                                                                                    });*/
                                                                                callback(false, {status: 1, status_type: "Success", message: 'No deviceId found found to push'});
                                                                        }else{
                                                                                var data        =  {
                                                                                                    message             :   params.message,
                                                                                                    device_id           :   deviceId_arr,
                                                                                                    NtfnBody            :   params.ntfn_body,
                                                                                                    NtfnType            :   params.notificationTypeId,
                                                                                                    id                  :   params.collageId,
                                                                                                    notification_id     :   params.notification_id,
                                                                                                    old_id              :   old_id
                                                                                                };
                                                                                console.log("Before push");
                                                                                console.log(data);
                                                                                NotificationService.NotificationPush(data, function(err, ntfnSend){
                                                                                    if(err){
                                                                                        console.log(err)
                                                                                        //callback();
                                                                                        callback(true, {status: 2, status_type: "Failure", message: 'Error in push notification'});
                                                                                    }else{
                                                                                        //callback();
                                                                                        callback(false, {status: 1, status_type: "Success", message: 'Success in push notification'});
                                                                                    }
                                                                                });
                                                                        }
                                                                    }
                                                                });
                                                        }
                                                // ++++++++++++++++++++++
                                                 //callback(false, {status: 1, status_type: "Success", message: 'Successfully created notification log', error_details: err});
                                                }
                                            }
                                        });
                                }
                            });
                        }
                    });
                }
            });
    },

    /*=============================================================================================================================================
     comment Notification Log Insertion
    ==============================================================================================================================================*/

    /*commentNotification: function(data,callback){
        //var data  =   params;
        console.log("-------inside Notification-----------")
        console.log(data)
         var values ={
                    notificationTypeId  :   data.notificationTypeId,
                    userId              :   data.userId,
                    ditherUserId        :   data.ditherUserId,
                    collage_id          :   data.collage_id,
                    description         :   data.description
                }
                //console.log(values)
        NotificationLog.create(values).exec(function(err, createdNotificationTags) {
                if(err){
                    console.log(err);
                    callback();
                    //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in inserting collage commented users', error_details: err});
                }else{
                    var creator_roomName  = "socket_user_"+data.ditherUserId;
                    sails.sockets.broadcast(creator_roomName,{
                                                            type                       :       "notification",
                                                            id                         :        data.collage_id,
                                                            user_id                    :        data.userId,
                                                            message                    :       "Comment Dither - Room Broadcast - to Creator",
                                                            //roomName                   :       creator_roomName,
                                                            //subscribers                :       sails.sockets.subscribers(creator_roomName),
                                                            //socket                     :       sails.sockets.rooms(),
                                                            notification_type          :       3,
                                                            notification_id            :       createdNotificationTags.id
                                                            });
                    //-----------------------------End OF NotificationLog---------------------------------
                    User.findOne({id:data.ditherUserId}).exec(function (err, notifySettings){
                        if(err){
                            console.log(err)
                            callback();
                        }else{
                          if(notifySettings){
                            if(notifySettings.notifyComment==0){
                                callback();
                            }else{
                                //----------------------------Push Notification For Comment------------------------------------------
                                //console.log(data)
                                var message   = 'Comment Notification';
                                var ntfn_body =  data.name +" Commented on Your Dither";
                                User_token.find({userId: data.ditherUserId }).exec(function (err, getDeviceId){
                                    if(err){
                                          console.log(err)
                                          callback();
                                    }else{
                                        if(!getDeviceId.length){
                                           //console.log("device not found")
                                           callback();
                                        }else{
                                                var deviceId_arr  = [];
                                                getDeviceId.forEach(function(factor, index){

                                                            deviceId_arr.push(factor.deviceId);


                                                });
                                                console.log(data)
                                                if(deviceId_arr.length){
                                                    var params    = {
                                                                message         :   message,
                                                                device_id       :   deviceId_arr,
                                                                NtfnBody        :   ntfn_body,
                                                                NtfnType        :   3,
                                                                id              :   data.collage_id,
                                                                notification_id :   createdNotificationTags.id,
                                                                old_id          :   data.old_id
                                                                };
                                                    NotificationService.NotificationPush(params, function(err, ntfnSend){
                                                        if(err){
                                                                console.log("Error in Push Notification Sending")
                                                                console.log(err)
                                                                callback();

                                                        }else{
                                                            console.log(ntfnSend)
                                                                callback();
                                                        }
                                                    });
                                                }
                                        }
                                    }
                                });
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


    },*/


    /*=============================================================================================================================================
     Mention comment Notification Log Insertion
    ==============================================================================================================================================*/

    commentMentionNotification: function(data,callback){




        console.log("-----------------Mention---------Notification--------------------")
        var values ={
                notificationTypeId  :   7,
                userId              :  data.userId,
                collage_id          :  data.collage_id,
                tagged_users        :  data.tagged_users
            }
        NotificationLog.create(values).exec(function(err, createdNotificationTags) {
               if(err){
                   console.log(err)
                   callback();
               }else{
                        User_token.find({userId: data.mentionPushArr}).exec(function (err, getDeviceId) {
                        //User_token.find({userId:selectContacts[0].userId }).exec(function (err, getDeviceId){
                            if(err){
                                  console.log(err);
                                  callback();
                            }else{
                                var message     =  'Mention Notification';
                                var ntfn_body   =   data.name +" has Mentioned You In a Dither";
                                var mention_deviceId_arr = [];
                                getDeviceId.forEach(function(factor, index){
                                    mention_deviceId_arr.push(factor.deviceId);
                                });
                                if(!mention_deviceId_arr.length){
                                        callback();
                                }else{
                                        var params        =  {
                                                        message             :   message,
                                                        device_id           :   mention_deviceId_arr,
                                                        NtfnBody            :   ntfn_body,
                                                        NtfnType            :   7,
                                                        id                  :   data.collage_id,
                                                        notification_id     :   createdNotificationTags.id,
                                                        //old_id              :   old_id
                                                        };
                                        console.log("paramsssssssssssssssss")
                                        console.log(params)
                                        NotificationService.NotificationPush(params, function(err, ntfnSend){
                                                if(err){
                                                    console.log("Error in Push Notification Sending")
                                                    console.log(err)
                                                    callback();
                                                }else{
                                                    console.log("notification senddddddddddd")
                                                    console.log(ntfnSend)
                                                    callback();
                                                }
                                        });
                                }
                            }
                        });

                }
           });

    },


};







