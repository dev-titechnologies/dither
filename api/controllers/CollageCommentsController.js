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
                    var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                    //var   mention_arr             =    [];
                    var commentImage_path           =     server_image_baseUrl + req.options.file_path.commentImage_path;
                    var comment_images              =     req.param("comment_img_arr");
                    var old_id                      =     '';
                    var profile_image               =     '';
                    var comment_img_arr             =     [];
                    var commentImage_Array          =     [];
                    var tagged_users                =     [];
                    //var comment_images                =     [ 'http://localhost:5000/images/comment/b35c0a6d-613f-47a2-bdf5-556e286e5e94.jpg' ,'http://localhost:5000/images/comment/be8a37d3-013f-489f-9e22-87289ec353b4.jpg' ];
                    console.log("comment Image-------------------")
                    console.log(comment_images)
                    console.log("comment image")
                    console.log(req.params.all());

                    /*var status;
                    if(!comment_images){
                        if(!collageId || !comment){
                            status  =   false
                        }else{
                            status  =   true;
                        }
                    }else{
                        if(!collageId){
                            status  =   false
                        }else{
                            status  =   true;
                        }
                    }*/

                    if(!collageId || typeof(comment) == 'undefined' || !comment_images || (!comment_images.length && !comment)){
                                //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please pass the dither_id , comment_msg and comment_images'});
                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'commenting failed !'});
                    }else{

                        var values = {
                            collageId       :       collageId,
                            userId          :       userId,
                            comment         :       comment
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
                                                if(comment_images.length){
                                                    //console.log(comment_images)
                                                    comment_images.forEach(function(factor, index){
                                                        if(factor){
                                                           comment_imageName       =   factor.split('/');
                                                           comment_imageName       =   comment_imageName[comment_imageName.length-1];
                                                           comment_img_arr.push("("+results.id+",'"+comment_imageName+"', now(), now())");
                                                        }
                                                    });
                                                    if(comment_img_arr.length){
                                                          var query = "INSERT INTO commentImages"+
                                                                                " (commentId,image, createdAt, updatedAt)"+
                                                                                " VALUES"+comment_img_arr;
                                                                    //console.log(query)
                                                         CommentImages.query(query,function(err, createdImages){
                                                            if(err){
                                                                    console.log(err);
                                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Dither Comment Image Insertion', error_details: err});
                                                            }else{
                                                                console.log(createdImages)
                                                            }
                                                         });

                                                    }
                                                }
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
                                                            console.log("COMMENT SERIES ----------NEW COMMENT FOR ALL-------- ");
                                                            var mentionPushArr = [];
                                                             if(mention_arr){

                                                                        User.find({mentionId: mention_arr}).exec(function (err, getUserId){
                                                                            if(err){
                                                                                console.log("mention")
                                                                                callback();
                                                                            }else{

                                                                                getUserId.forEach(function(factor, index){

                                                                                    mentionPushArr.push(factor.id)

                                                                                });
                                                                             }
                                                                         });
                                                              }
                                                             Tags.find({collageId:collageId}).exec(function(err, taggedUsers){

                                                                  if(err){
                                                                      console.log(err)
                                                                      callback();
                                                                  }
                                                                  else{
                                                                      console.log("Tagged User")
                                                                      console.log(taggedUsers)

                                                                       if(taggedUsers){
                                                                           console.log("1")
                                                                           console.log(mentionPushArr)
                                                                              taggedUsers.forEach(function(factor, index){
                                                                                  if(userId!=factor.userId){
                                                                                   if(mentionPushArr.length){
                                                                                         for(var i=0;i<mentionPushArr.length;i++){

                                                                                             if(factor.userId!=mentionPushArr[i]){
                                                                                                 console.log(factor.userId)
                                                                                                 tagged_users.push(factor.userId)
                                                                                             }
                                                                                         }
                                                                                    }
                                                                                    else{
                                                                                        tagged_users.push(factor.userId)
                                                                                    }
                                                                                  }
                                                                              });
                                                                         }
                                                                        if(tagged_users.length){
                                                                            console.log("2")

                                                                            console.log(tagged_users)



                                                                        User_token.find({userId: tagged_users}).exec(function (err, getDeviceId) {
                                                                                //User_token.find({userId:selectContacts[0].userId }).exec(function (err, getDeviceId){
                                                                                    if(err){
                                                                                          console.log(err);
                                                                                          callback();
                                                                                    }else{
                                                                                        var message     =  'New Comment Notification';
                                                                                        var ntfn_body   =   "New Comment";
                                                                                        var cmnt_deviceId_arr = [];
                                                                                        getDeviceId.forEach(function(factor, index){
                                                                                            cmnt_deviceId_arr.push(factor.deviceId);
                                                                                        });
                                                                                        if(!cmnt_deviceId_arr.length){
                                                                                                callback();
                                                                                        }else{
                                                                                                var data        =  {
                                                                                                                message             :   message,
                                                                                                                device_id           :   cmnt_deviceId_arr,
                                                                                                                NtfnBody            :   ntfn_body,
                                                                                                                NtfnType            :   3,
                                                                                                                id                  :   collageId,
                                                                                                                notification_id     :   0,
                                                                                                                old_id              :   0
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
                                                                         else{
                                                                             callback();
                                                                         }


                                                                    }

                                                            });


                                                        },
                                                        function(callback) {
                                                                console.log("COMMENT SERIES ------------------ 1");
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

                                                                                /*var data = {
                                                                                                notificationTypeId  :   7,
                                                                                                userId              :   userId,
                                                                                                collage_id          :   collageId,
                                                                                                tagged_users        :   mention_user_id,
                                                                                                name                :   tokenCheck.tokenDetails.name,
                                                                                                mentionPushArr      :   mentionPushArr

                                                                                            }
                                                                                NotificationService.commentMentionNotification(data, function(err, ntfnMention){
                                                                                    if(err){
                                                                                            console.log("Error in Push Notification Sending")
                                                                                            console.log(err)
                                                                                            callback();

                                                                                    }else{
                                                                                            console.log(ntfnMention)
                                                                                            callback();
                                                                                    }
                                                                                });*/



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
                                                                                                                                notification_id     :   createdNotificationTags.id,
                                                                                                                                old_id              :   old_id
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
                                                            console.log("COMMENT SERIES ------------------ 3");
                                                            var query = "SELECT DISTINCT(`userId`) FROM `collageComments` WHERE `collageId`='"+collageId+"'";
                                                            CollageComments.query(query, function(err, CountComments){
                                                                if(err){
                                                                    console.log("err in count comments ")
                                                                    callback();
                                                                }else{

                                                                    if(userId   !=  collageDetails.userId){

                                                                            var data        =   {
                                                                                                    collageId                   :    collageId,
                                                                                                    notificationTypeId          :    3,
                                                                                                    userId                      :    userId,
                                                                                                    collageCreatorId            :    collageDetails.userId,
                                                                                                    notificationSettingsType    :    "notifyComment",
                                                                                                    message                     :    "dither Comment notification",
                                                                                                    ntfn_body                   :    tokenCheck.tokenDetails.name + " Commented on Your Dither",
                                                                                                    description                 :    CountComments.length
                                                                                                };

                                                                            NotificationService.collageNotificationLogCreation(data, function(err, createdNotification){
                                                                                if(err){
                                                                                    console.log(err);
                                                                                    callback();
                                                                                }else{

                                                                                        callback();
                                                                                }
                                                                            });


                                                                    }else{
                                                                                callback();
                                                                    }
                                                                }
                                                            });
                                                        },

                                                        function(callback) {
                                                            console.log("COMMENT SERIES ------------------ 5");
                                                            User.findOne({id:userId}).exec(function (err, getUseDetails){
                                                                if(err){
                                                                    console.log(err)
                                                                    callback();
                                                                }else{
                                                                    if(!getUseDetails){
                                                                            callback();
                                                                    }else{
                                                                        if(getUseDetails.profilePic == null || getUseDetails.profilePic == ""){
                                                                                profile_image                   =     "";
                                                                        }else{
                                                                                var imageSrc                    =     getUseDetails.profilePic;
                                                                                var ext                         =     imageSrc.split('.');
                                                                                profile_image                   =     profilePic_path + ext[0] + "_70x70" + "." +ext[1];
                                                                        }

                                                                        callback();
                                                                    }
                                                                }
                                                            });
                                                        },
                                                        function(callback) {
                                                            console.log("COMMENT SERIES ------------------ 6");
                                                            if(comment_images.length){
                                                                    CommentImages.find({commentId:results.id}).exec(function (err, commentImgResults){
                                                                        if(err){
                                                                            console.log("commentImgResults   error");
                                                                            console.log(err)
                                                                            callback();
                                                                        }else{
                                                                            if(!commentImgResults.length){
                                                                                    console.log("commentImgResults   No length");
                                                                                    callback();
                                                                            }else{
                                                                                console.log("commentImgResults   YES length");
                                                                                commentImgResults.forEach(function(factor, index){
                                                                                        console.log(factor);
                                                                                        if(factor.image == "" || factor.image == null){

                                                                                        }else{
                                                                                            commentImage_Array.push(commentImage_path + factor.image);
                                                                                        }
                                                                                });
                                                                                callback();
                                                                            }
                                                                           // callback();
                                                                        }
                                                                    });
                                                                    console.log(commentImage_Array);
                                                            }else{
                                                                    callback();
                                                            }
                                                        },
                                                        //=========================================
                                                        ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
                                                                                if(err){
                                                                                    console.log("Lasttttttttttttttttttttt   ERROR");
                                                                                    console.log(err);
                                                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured Comment Updation', error_details: err});
                                                                                }else{
                                                                                    console.log("Lasttttttttttttttttttttt");
                                                                                        return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully commented against the dither',
                                                                                                                        comment_id                      :    results.id,
                                                                                                                        comment_msg                     :    results.comment,
                                                                                                                        comment_created_date_time       :    results.createdAt,
                                                                                                                        profile_image                   :    profile_image,
                                                                                                                        comment_img                     :    commentImage_Array
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
        },
 /* ==================================================================================================================================
               To upload comment Image
   ==================================================================================================================================== */
        uploadCommentImage:  function (req, res) {
                    console.log("+++++++++++++ Upload CommentImage api ++++++++++++++++++++");

                    var server_baseUrl              =     req.options.server_baseUrl;
                    var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                    var commentImage_path           =     server_image_baseUrl + req.options.file_path.commentImage_path;
                    var commentUploadDirectoryPath  =     '../../assets/images/comment';
                    console.log(req.options.file_path.commentImage_path)
                    console.log(commentImage_path)
                    req.file('comment_image').upload({dirname: commentUploadDirectoryPath, maxBytes: 100 * 1000 * 1000, adapter: require('skipper-disk')},function (err, files) {
                            if(err){
                                console.log(err);
                                return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in uploading CommentImage', error_details: err});
                            }else{
                                    if(!files.length){
                                        console.log("----------No files found-------  ");
                                        return res.json(200, {status: 2, status_type: 'Failure', message: 'Please pass an image'});
                                    }else{
                                        console.log(files)
                                        var comment_img_arr = [];
                                        files.forEach(function(factor, index){
                                                console.log(factor);
                                                var filename                        =   factor.fd.split('/');
                                                filename                            =   filename[filename.length-1];
                                                var image_name;

                                                comment_img_arr.push({
                                                                cmnt_img_url       :   commentImage_path + filename
                                                            });
                                        });
                                        console.log("------------comment Images----------------")
                                        console.log(comment_img_arr)
                                        return res.json(200, {status: 1, status_type: 'Success', message: 'Successfully uploaded Collage images',
                                                              comment_img_arr: comment_img_arr
                                                        });
                                    }
                            }
                    });

        },
/* ==================================================================================================================================
               To delete a comment
   ==================================================================================================================================== */
        commentDelete  :  function (req, res) {
                    console.log("++++++++++++++++ Delete a comment +++++++++++++++");
                    var tokenCheck                  =     req.options.tokenCheck;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    //var server_baseUrl              =     req.options.server_baseUrl;
                    //var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                    //var collageImg_path             =     server_image_baseUrl + req.options.file_path.collageImg_path;
                    var comment_unlink_path         =     req.options.file_path.commentImg_path_assets;
                    var collageId                   =     req.param("dither_id");
                    var commentId                   =     req.param("comment_id");
                    console.log(req.params.all());

                    function commentLikeSuccess(){
                            var roomName  = "socket_dither_"+collageId;
                            sails.sockets.broadcast(roomName,{
                                                            type            :   "update",
                                                            id              :   collageId,
                                                            user_id         :   userId,
                                                            message         :   "Delete Comment - Room Broadcast",
                                                            //roomName        :   roomName,
                                                            //subscribers     :   sails.sockets.subscribers(roomName),
                                                            //socket          :   sails.sockets.rooms()
                                                            });

                            return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully deleted the comment',
                                                comment_id : commentId
                                });
                    }
                    if(!collageId || !commentId){
                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please pass dither_id and comment_id'});
                    }else{
                            Collage.findOne({id: collageId}).exec(function (err, foundCollage){
                                    if(err){
                                            console.log(err);
                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding the Dither', error_details: err});
                                    }else{

                                            if(!foundCollage){
                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage found'});
                                            }else{
                                                CollageComments.findOne({id: commentId}).exec(function (err, foundComment){
                                                    if(err){
                                                            console.log(err);
                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding the comment', error_details: err});
                                                    }else{
                                                            if(!foundComment){
                                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No comment found'});
                                                            }else{

                                                                if(userId == foundComment.userId || userId == foundCollage.userId){
                                                                        CollageComments.destroy({id: commentId}).exec(function (err, deleteComment){
                                                                            if(err){
                                                                                    console.log(err);
                                                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Deleting commentLikes', error_details: err});
                                                                            }else{

                                                                                CommentLikes.destroy({commentId: commentId}).exec(function (err, deleteCommentLike){
                                                                                    if(err){
                                                                                            console.log(err);
                                                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Deleting the Dither', error_details: err});
                                                                                    }else{

                                                                                        NotificationLog.destroy({collageCommentId: commentId}).exec(function (err, deleteNotification){
                                                                                            if(err){
                                                                                                    console.log(err);
                                                                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Deleting the Dither', error_details: err});
                                                                                            }else{

                                                                                                CommentImages.find({commentId: commentId}).exec(function (err, foundCommentImages){
                                                                                                    if(err){
                                                                                                            console.log(err);
                                                                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding the comment', error_details: err});
                                                                                                    }else{
                                                                                                            console.log(foundCommentImages);
                                                                                                            if(!foundCommentImages.length){
                                                                                                                            commentLikeSuccess();
                                                                                                            }else{
                                                                                                                //Unlinking comment image
                                                                                                                foundCommentImages.forEach(function(factor, index){
                                                                                                                    if(factor.image == null || factor.image == ""){
                                                                                                                    }else{
                                                                                                                            console.log("Unlinking comment image======");
                                                                                                                            //var resize_comment_image  = factor.image;
                                                                                                                            //var ext                   = resize_comment_image.split('.');
                                                                                                                            //fs.unlink(comment_unlink_path + ext[0] + "_50x50" + "." +ext[1]);
                                                                                                                            fs.unlink(comment_unlink_path + factor.image);
                                                                                                                    }
                                                                                                                });

                                                                                                                CommentImages.destroy({commentId: commentId}).exec(function (err, deleteCommentImages){
                                                                                                                    if(err){
                                                                                                                            console.log(err);
                                                                                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Deleting the Dither', error_details: err});
                                                                                                                    }else{
                                                                                                                            commentLikeSuccess();
                                                                                                                    }
                                                                                                                });
                                                                                                            }
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                });
                                                                            }
                                                                        });
                                                                }else{
                                                                        return res.json(200, {status: 2, status_type: 'Failure' , message: 'Only commentor or dither creator can delete'});
                                                                }
                                                            }
                                                    }
                                                });
                                            }

                                    }
                            });
                    }
        }


};

