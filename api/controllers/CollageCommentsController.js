 /**
 * CollageCommentsController
 *
 * @description :: Server-side logic for managing collagecomments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs          = require('fs');

module.exports = {

 /* ==================================================================================================================================
               To Comment a Dither
   ==================================================================================================================================== */
        commentDither:  function (req, res) {

                    console.log("+++++++++++++ Comment  Dithers api ++++++++++++++++++++");

                    var tokenCheck                  =     req.options.tokenCheck;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var collageId                   =     req.param("dither_id");
                    var comment                     =     req.param("comment_msg");
                    var mention_user_id             =     [];
                    var mention_arr                 =     req.param("mentions");

                    var profilePic_path_assets      =     req.options.file_path.profilePic_path_assets;
                    var server_baseUrl              =     req.options.server_baseUrl;
                    var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                    var profilePic_path             =     server_baseUrl + req.options.file_path.profilePic_path;
                    //var   mention_arr                 =    ['test_user','anu_r'];
                    var profile_image               =     '';
                    if(!collageId || !comment){
                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please pass the dither_id and comment_msg'});
                    }else{
                            //console.log(req.params.all());
                            var values = {
                                collageId       :       collageId,
                                userId          :       userId,
                                comment         :       comment,
                            };
                            Collage.findOne({id:collageId}).exec(function(err, collageDetails){
                                    if(err){
                                        console.log(err);
                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in finding collage!!', error_details: err});
                                    }else{
                                        if(!collageDetails){
                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage found'});
                                        }else{
                                            CollageComments.create(values).exec(function(err, results){
                                                    if(err){
                                                            console.log(err);
                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Dither Comment Insertion', error_details: err});
                                                    }else{
                                                        var roomName  = "socket_dither_"+collageId;
                                                        sails.sockets.broadcast(roomName,{
                                                                                        type            : "update",
                                                                                        id              : collageId,
                                                                                        user_id         : userId,
                                                                                        message         : "Comment Dither - Room Broadcast",
                                                                                        //roomName        : roomName,
                                                                                        //subscribers     : sails.sockets.subscribers(roomName),
                                                                                        //socket          : sails.sockets.rooms()
                                                                                        });
                                                        //-----------Notification log Insertion----------------
                                                        CollageComments.find({collageId:collageId}).exec(function(err, commentDetails){
                                                            if(err){
                                                                console.log(err)
                                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Comments not found!!', error_details: err});
                                                            }else{

                                                                async.series([

                                                                function(callback) {
                                                                        if(mention_arr){
                                                                                //var query = "SELECT id FROM user where mention_id=";
                                                                                User.find({mentionId: mention_arr}).exec(function (err, getUserId){
                                                                                    if(err){
                                                                                        console.log("mention")
                                                                                        callback();
                                                                                    }else{
                                                                                        var mentionPushArr = [];
                                                                                        getUserId.forEach(function(factor, index){
                                                                                            mention_user_id.push(factor.id);
                                                                                            User.findOne({id:factor.id}).exec(function (err, notifySettings){
                                                                                                if(err){
                                                                                                   console.log(err)
                                                                                                }else{
                                                                                                    if(notifySettings){
                                                                                                        if(notifySettings.notifyMention){
                                                                                                                mentionPushArr.push(factor.id);
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            });
                                                                                        });
                                                                                        var values ={
                                                                                                notificationTypeId  :   7,
                                                                                                userId              :   userId,
                                                                                                collage_id          :   collageId,
                                                                                                tagged_users        :   mention_user_id
                                                                                            }
                                                                                        NotificationLog.create(values).exec(function(err, createdNotificationTags) {
                                                                                               if(err){
                                                                                                   console.log(err)
                                                                                                   callback();
                                                                                               }else{
                                                                                                        User_token.find({userId: mentionPushArr}).exec(function (err, getDeviceId) {
                                                                                                        //User_token.find({userId:selectContacts[0].userId }).exec(function (err, getDeviceId){
                                                                                                            if(err){
                                                                                                                  console.log(err);
                                                                                                                  callback();
                                                                                                            }else{
                                                                                                                var message     =  'Mention Notification';
                                                                                                                var ntfn_body   =   tokenCheck.tokenDetails.name +" has Mentioned You In a Dither";
                                                                                                                var mention_deviceId_arr = [];
                                                                                                                getDeviceId.forEach(function(factor, index){
                                                                                                                    mention_deviceId_arr.push(factor.deviceId);
                                                                                                                });
                                                                                                                if(!mention_deviceId_arr.length){
                                                                                                                        callback();
                                                                                                                }else{
                                                                                                                        var data        =  {
                                                                                                                                        message             :   message,
                                                                                                                                        device_id           :   mention_deviceId_arr,
                                                                                                                                        NtfnBody            :   ntfn_body,
                                                                                                                                        NtfnType            :   7,
                                                                                                                                        id                  :   collageId,
                                                                                                                                        notification_id     :   createdNotificationTags.id
                                                                                                                                        };
                                                                                                                        NotificationService.NotificationPush(data, function(err, ntfnSend){
                                                                                                                                if(err){
                                                                                                                                    console.log("Error in Push Notification Sending")
                                                                                                                                    console.log(err)
                                                                                                                                    callback();
                                                                                                                                }else{
                                                                                                                                    callback();
                                                                                                                                }
                                                                                                                        });
                                                                                                                }
                                                                                                            }
                                                                                                        });

                                                                                                }
                                                                                           });
                                                                                    }
                                                                                });
                                                                        }else{
                                                                            callback();
                                                                        }
                                                                },
                                                                function(callback) {
                                                                            var query = "DELETE FROM notificationLog where collage_id = '"+collageId+"' and notificationTypeId = 3";
                                                                            NotificationLog.query(query, function(err, deleteCommentNtfn){
                                                                                if(err){
                                                                                    console.log(err)
                                                                                    callback();
                                                                                }else{
																					console.log("delete comment NotificationId")
																					console.log(deleteCommentNtfn)
                                                                                    callback();
                                                                                }
                                                                            });

                                                                },
                                                                function(callback) {
                                                                    var query = "SELECT DISTINCT(`userId`) FROM `collageComments` WHERE `collageId`='"+collageId+"'";
                                                                    CollageComments.query(query, function(err, CountComments){
                                                                        if(err){
                                                                            console.log("err in count comments ")
                                                                            callback();
                                                                        }else{
                                                                            if(userId   !=  collageDetails.userId){
                                                                                    var values ={
                                                                                                    notificationTypeId  :   3,
                                                                                                    userId              :   userId,
                                                                                                    ditherUserId        :   collageDetails.userId,
                                                                                                    collage_id          :   collageId,
                                                                                                    description         :   CountComments.length
                                                                                                }
                                                                                    NotificationLog.create(values).exec(function(err, createdNotificationTags) {
                                                                                            if(err){
                                                                                                console.log(err);
                                                                                                callback();
                                                                                                //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in inserting collage commented users', error_details: err});
                                                                                            }else{
                                                                                                var creator_roomName  = "socket_user_"+collageDetails.userId;
                                                                                                sails.sockets.broadcast(creator_roomName,{
                                                                                                                                        type                       :       "notification",
                                                                                                                                        id                         :       collageId,
                                                                                                                                        user_id                    :       userId,
                                                                                                                                        message                    :       "Comment Dither - Room Broadcast - to Creator",
                                                                                                                                        //roomName                   :       creator_roomName,
                                                                                                                                        //subscribers                :       sails.sockets.subscribers(creator_roomName),
                                                                                                                                        //socket                     :       sails.sockets.rooms(),
                                                                                                                                        notification_type          :       3,
                                                                                                                                        notification_id            :       createdNotificationTags.id
                                                                                                                                        });
                                                                                                //-----------------------------End OF NotificationLog---------------------------------
                                                                                                User.findOne({id:collageDetails.userId}).exec(function (err, notifySettings){
                                                                                                    if(err){
                                                                                                        console.log(err)
                                                                                                        callback();
                                                                                                    }else{
                                                                                                        if(notifySettings.notifyComment==0){
                                                                                                            callback();
                                                                                                        }else{
                                                                                                            //----------------------------Push Notification For Comment------------------------------------------
                                                                                                            var message   = 'Comment Notification';
                                                                                                            var ntfn_body =  tokenCheck.tokenDetails.name +" Commented on Your Dither";
                                                                                                            User_token.find({userId: collageDetails.userId }).exec(function (err, getDeviceId){
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
                                                                                                                            if(deviceId_arr.length){
                                                                                                                                var data    = {
                                                                                                                                            message         :   message,
                                                                                                                                            device_id       :   deviceId_arr,
                                                                                                                                            NtfnBody        :   ntfn_body,
                                                                                                                                            NtfnType        :   3,
                                                                                                                                            id              :   collageId,
                                                                                                                                            notification_id :   createdNotificationTags.id
                                                                                                                                            };
                                                                                                                                NotificationService.NotificationPush(data, function(err, ntfnSend){
                                                                                                                                    if(err){
                                                                                                                                            console.log("Error in Push Notification Sending")
                                                                                                                                            console.log(err)
                                                                                                                                            callback();

                                                                                                                                    }else{
                                                                                                                                            callback();
                                                                                                                                    }
                                                                                                                                });
                                                                                                                            }
                                                                                                                    }
                                                                                                                }
                                                                                                            });
                                                                                                        }
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                    });
                                                                            }else{
                                                                                        callback();
                                                                            }
                                                                        }
                                                                    });
                                                                },
                                                                function(callback) {
                                                                    User.findOne({id:userId}).exec(function (err, getUseDetails){
                                                                        if(err){
                                                                            console.log(err)
                                                                            callback();
                                                                        }else{
                                                                            if(!getUseDetails){
                                                                                    if(getUseDetails.profilePic == null || getUseDetails.profilePic == ""){
                                                                                            profile_image                   =     "";
                                                                                    }else{
                                                                                            var imageSrc                    =     getUseDetails.profilePic;
                                                                                            var ext                         =     imageSrc.split('.');
                                                                                            profile_image                   =     profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                                                                    }

                                                                                    callback();
                                                                            }else{
                                                                                    callback();
                                                                            }
                                                                        }
                                                                    });
                                                                },
                                                                //=========================================
                                                                ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
                                                                                        if(err){
                                                                                            console.log(err);
                                                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured Comment Updation', error_details: err});
                                                                                        }else{
                                                                                                return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully commented against the dither',
                                                                                                                                comment_id                      :    results.id,
                                                                                                                                comment_msg                     :    results.msg,
                                                                                                                                comment_created_date_time       :    results.createdAt,
                                                                                                                                profile_image                   :    profile_image
                                                                                                                        });
                                                                                        }
                                                                });

                                                            }
                                                        });
                                                    }
                                            });
                                        }//check collage found or not

                                    }
                            });
                    //}
                    }
        }
};

