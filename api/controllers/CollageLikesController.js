/**
 * CollageLikesController
 *
 * @description :: Server-side logic for managing collagelikes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /* ==================================================================================================================================
               To Vote or Like a Dither
     ==================================================================================================================================== */
        voteDither:  function (req, res) {
            console.log("Like  Dithers ===== api");
            var tokenCheck                  =     req.options.tokenCheck;
            var userId                      =     tokenCheck.tokenDetails.userId;
            var userName                    =     tokenCheck.tokenDetails.name;
            var collageId                   =     req.param("dither_id");
            var likedImageId                =     req.param("dither_like_image_id");
            var imgPosition                 =     req.param("image_position");
            var old_id                      =     '';
            if(!collageId || !likedImageId || !imgPosition){
                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please pass the dither_id and dither_like_image_id and image_position'});
            }else{
                //To check the user already voted for this image or not
                CollageLikes.findOne({collageId: collageId, userId: userId}).exec(function (err, found){
                    if(err){
                        console.log(err);
                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding user voted the image earlier or not', error_details: err});
                    }else{
                        if(found){
                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'You already voted against this dither'});
                        }else{

                            //To check the collage is existing or not
                            Collage.findOne({id: collageId}).exec(function (err, foundCollageResults){
                                if(err){
                                        console.log(err);
                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding dither', error_details: err});
                                }else{
                                        if(!foundCollageResults){
                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No Dither Found by this id'});
                                        }else{
                                            //To Check vote by Dither creator or not
                                            if(userId   ==  foundCollageResults.userId){
                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Dither created by current user'});
                                            }else{
                                                //To check the CollageId and the ImageId is existing or not
                                                CollageDetails.findOne({id: likedImageId, collageId: collageId}).exec(function (err, foundImgResults){
                                                    if(err){
                                                        console.log(err);
                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding image from Image Details', error_details: err});
                                                    }else{
                                                        //console.log(foundImgResults);
                                                        if(!foundImgResults){
                                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No Image of the Dither Found by this id'});
                                                        }else{

                                                            var values = {
                                                                collageId       :       collageId,
                                                                imageId         :       likedImageId,
                                                                userId          :       userId,
                                                                likeStatus      :       true,
                                                                likePosition    :       imgPosition,
                                                            };
                                                            //Creating the vote
                                                            CollageLikes.create(values).exec(function(err, results){
                                                                if(err){
                                                                        console.log(err);
                                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Dither Vote Creation', error_details: err});
                                                                }
                                                                else{
                                                                    var criteria = {id: foundImgResults.id};
                                                                    var values   = {vote: parseInt(foundImgResults.vote) + 1};
                                                                    //To Update the vote count against the image
                                                                    CollageDetails.update(criteria, values).exec(function(err, updatedVoteCount) {
                                                                        if(err){
                                                                            console.log(err);
                                                                            return res.json(200, {status: 2, status_type: 'Failure', message: 'Some error has occured in Updating vote count of a single image'});
                                                                        }else{
                                                                            var criteria = {id: foundCollageResults.id};
                                                                            var values   = {totalVote: parseInt(foundCollageResults.totalVote) + 1};
                                                                            //To update the totalVote (opinion) against that collage
                                                                            Collage.update(criteria, values).exec(function(err, updatedTotalVoteCount) {
                                                                                if(err){
                                                                                    console.log(err);
                                                                                    return res.json(200, {status: 2, status_type: 'Failure', message: 'Some error has occured in Updating total opinion of a Dither'});
                                                                                }else{
                                                                                    var roomName  = "socket_dither_"+collageId;
                                                                                    sails.sockets.broadcast(roomName,{
                                                                                                                    type            :   "update",
                                                                                                                    id              :   collageId,
                                                                                                                    user_id         :   userId,
                                                                                                                    message         :   "Like Dither - Room Broadcast",
                                                                                                                    //roomName        :   roomName,
                                                                                                                    //subscribers     :   sails.sockets.subscribers(roomName),
                                                                                                                    //socket          :   sails.sockets.rooms()
                                                                                                                    });
                                                                                    var data        =   {
                                                                                                    collageId                   :    collageId,
                                                                                                    notificationTypeId          :    2,
                                                                                                    userId                      :    userId,
                                                                                                    collageCreatorId            :    foundCollageResults.userId,
                                                                                                    notificationSettingsType    :    "notifyVote",
                                                                                                    message                     :    "dither vote notification",
                                                                                                    ntfn_body                   :    userName + " voted on your Dither",
                                                                                                    totalVote                   :    foundCollageResults.totalVote,
                                                                                                    likedImageId                :    likedImageId,
                                                                                                    };
                                                                                    NotificationService.collageNotificationLogCreation(data, function(err, createdNotification){
                                                                                        if(err){
                                                                                            console.log(err);
                                                                                            return res.json(200, { status: 2, status_type: 'Failure' , message: 'Some error occured in notificationLogCreation' , error_details: err});
                                                                                        }else{

                                                                                                return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully voted the image', total_like_count : updatedVoteCount[0].vote});
                                                                                        }
                                                                                    });
                                                                                   /* //-----------Notification log Insertion----------------
                                                                                    var query = "SELECT id FROM notificationLog where collage_id = '"+collageId+"' and notificationTypeId = 2";
                                                                                    NotificationLog.query(query, function(err, selCommentNtfn){
                                                                                    if(err){
                                                                                        console.log(err)
                                                                                        callback();
                                                                                    }else{
                                                                                   // old_id      = selCommentNtfn[0].id;
                                                                                   if(selCommentNtfn.length!=0){
                                                                                            console.log(selCommentNtfn[0].id)
                                                                                            old_id   =  selCommentNtfn[0].id;
                                                                                    }
                                                                                    var query = "DELETE FROM notificationLog where collage_id = '"+collageId+"' and notificationTypeId = 2";
                                                                                    NotificationLog.query(query, function(err, deleteLikeNtfn){
                                                                                            if(err){
                                                                                               console.log(err)
                                                                                               //callback();
                                                                                            }else{
                                                                                                var values ={
                                                                                                        notificationTypeId  :   2,
                                                                                                        userId              :   userId,
                                                                                                        ditherUserId        :   foundCollageResults.userId,
                                                                                                        collage_id          :   collageId,
                                                                                                        image_id            :   likedImageId,
                                                                                                        description         :   parseInt(foundCollageResults.totalVote) + 1
                                                                                                }
                                                                                                NotificationLog.create(values).exec(function(err, createdNotificationTags) {
                                                                                                    if(err){
                                                                                                        console.log(err);
                                                                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in inserting collage tagged users', error_details: err});
                                                                                                    }else{
                                                                                                        var creator_roomName  = "socket_user_"+foundCollageResults.userId;
                                                                                                        sails.sockets.broadcast(creator_roomName,{
                                                                                                                                                type                       :       "notification",
                                                                                                                                                id                         :       collageId,
                                                                                                                                                user_id                    :       userId,
                                                                                                                                                message                    :       "Like Dither - Room Broadcast - to Creator",
                                                                                                                                                //roomName                   :       creator_roomName,
                                                                                                                                                //subscribers                :       sails.sockets.subscribers(creator_roomName),
                                                                                                                                                //socket                     :       sails.sockets.rooms(),
                                                                                                                                                notification_type          :       2,
                                                                                                                                                notification_id            :       createdNotificationTags.id
                                                                                                                                                });
                                                                                                        //###################################
                                                                                                        User.findOne({id:foundCollageResults.userId}).exec(function (err, notifySettings){
                                                                                                                if(err){
                                                                                                                    console.log(err)
                                                                                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in retrieving user details ', error_details: err});
                                                                                                                }else{
                                                                                                                    //console.log("--------------------------notifySettings------------------")
                                                                                                                    console.log(notifySettings)
                                                                                                                    if(!notifySettings){
                                                                                                                         return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully voted the Image',
                                                                                                                                                total_like_count       :  updatedVoteCount[0].vote,
                                                                                                                                              });

                                                                                                                    }else{
                                                                                                                        if(notifySettings.notifyVote == 0){
                                                                                                                                 return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully voted the Image',
                                                                                                                                                        total_like_count       :  updatedVoteCount[0].vote,
                                                                                                                                                      });
                                                                                                                        }else{

                                                                                                                            //var query   =  "SELECT DISTINCT(deviceId) FROM userToken where userId ='"+foundCollageResults.userId+"'";
                                                                                                                            //User_token.query(query, function(err, getDeviceId) {

                                                                                                                            User_token.find({userId: foundCollageResults.userId }).exec(function (err, getDeviceId){
                                                                                                                                if(err){
                                                                                                                                      console.log(err);
                                                                                                                                      return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in findig deviceId', error_details: err});
                                                                                                                                }else{
                                                                                                                                    //console.log("Get-------------Device--------------ID")
                                                                                                                                    //console.log(getDeviceId)
                                                                                                                                    var message     =  'Vote Notification';
                                                                                                                                    var ntfn_body   =  tokenCheck.tokenDetails.name +" Voted on Your Dither";
                                                                                                                                   // var device_id   =  getDeviceId.deviceId;
                                                                                                                                    var deviceId_arr    = [];
                                                                                                                                    getDeviceId.forEach(function(factor, index){
                                                                                                                                                deviceId_arr.push(factor.deviceId);
                                                                                                                                    });
                                                                                                                                    if(!deviceId_arr.length){
                                                                                                                                            return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully voted the Image',
                                                                                                                                                                            total_like_count       :  updatedVoteCount[0].vote,
                                                                                                                                                                });
                                                                                                                                    }else{
                                                                                                                                        //device_id         =  device_id.split(',');sails.log.debug(device_id);
                                                                                                                                        var data        =  {
                                                                                                                                                            message             :   message,
                                                                                                                                                            device_id           :   deviceId_arr,
                                                                                                                                                            NtfnBody            :   ntfn_body,
                                                                                                                                                            NtfnType            :   2,
                                                                                                                                                            id                  :   collageId,
                                                                                                                                                            notification_id     :   createdNotificationTags.id,
                                                                                                                                                            old_id              :   old_id
                                                                                                                                                            };
                                                                                                                                        async.series([
                                                                                                                                        function(callback) {
                                                                                                                                            NotificationService.NotificationPush(data, function(err, ntfnSend) {
                                                                                                                                                    if(err){
                                                                                                                                                        console.log("Error in Push Notification Sending")
                                                                                                                                                        console.log(err)
                                                                                                                                                        callback();
                                                                                                                                                    }else{
                                                                                                                                                        callback();
                                                                                                                                                    }
                                                                                                                                            });
                                                                                                                                        },
                                                                                                                                          ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
                                                                                                                                                    if(err){

                                                                                                                                                        console.log(err);
                                                                                                                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured Like Updation', error_details: err});

                                                                                                                                                    }else{

                                                                                                                                                            //console.log("result")
                                                                                                                                                            return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully voted the Image',
                                                                                                                                                                                total_like_count       :  updatedVoteCount[0].vote,
                                                                                                                                                            });
                                                                                                                                                    }
                                                                                                                                        });

                                                                                                                                    }
                                                                                                                                    //------------------------------
                                                                                                                                }
                                                                                                                            });
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                        });
                                                                                                                    //###################################
                                                                                                    }
                                                                                                });

                                                                                            }
                                                                                    });   //-----------------------------End OF NotificationLog---------------------------------
                                                                                    }
                                                                                    });*/

                                                                                }//Collage totalVote count Update
                                                                            });

                                                                        }//CollageDetails vote count Update
                                                                    });

                                                                }//Like Creation End
                                                            });

                                                        }//Collage Details exising Check Else
                                                    }
                                                });
                                            }//Voted by creator or not
                                        }//Collage existing check

                                }
                            });
                        }// already Liked by user check,  Else stop
                    }
                });
            //}
            }

        },
};


