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
            console.log(sails.sockets.getId(req));
            console.log("Like  Dithers ===== api");
            console.log(req.param("dither_id"));
            //console.log(req.param("user_id"));
            console.log(req.param("dither_like_image_id"));
            var tokenCheck                  =     req.options.tokenCheck;
            var userId                      =     tokenCheck.tokenDetails.userId;
            var collageId                   =     req.param("dither_id");
            //var likedUserId               =     req.param("user_id");
            var likedImageId                =     req.param("dither_like_image_id");
            var imgPosition                 =     req.param("image_position");
            var device_type                 =     req.get('device_type');

            //collageId                   =     63;
            //likedImageId                =     128;
            //imgPosition                 =     1;


            if(!collageId || !likedImageId || !imgPosition || !device_type){
                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please pass the device_type and dither_id and dither_like_image_id and position'});
            }else{
                //To check the user already voted for this image or not
                CollageLikes.findOne({collageId: collageId, userId: userId}).exec(function (err, found){
                    if(err){
                        console.log(err);
                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding user voted the image earlier or not', error_details: err});
                    }else{
                        if(found){
                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'User already voted against this image'});
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

                                            //To check the CollageId and the ImageId is existing or not
                                            CollageDetails.findOne({id: likedImageId, collageId: collageId}).exec(function (err, foundImgResults){
                                                if(err){
                                                    console.log(err);
                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding image from Image Details', error_details: err});
                                                }else{
                                                    console.log(foundImgResults);
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
                                                        console.log(values);
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
                                                                    if(err)
                                                                    {
                                                                        console.log(err);
                                                                        return res.json(200, {status: 2, status_type: 'Failure', message: 'Some error has occured in Updating vote count of a single image'});
                                                                    }
                                                                    else
                                                                    {
                                                                        var criteria = {id: foundCollageResults.id};
                                                                        var values   = {totalVote: parseInt(foundCollageResults.totalVote) + 1};
                                                                        //To update the totalVote (opinion) against that collage
                                                                        Collage.update(criteria, values).exec(function(err, updatedTotalVoteCount) {
                                                                            if(err)
                                                                            {
                                                                                console.log(err);
                                                                                return res.json(200, {status: 2, status_type: 'Failure', message: 'Some error has occured in Updating total opinion of a Dither'});
                                                                            }
                                                                            else
                                                                            {
                                                                                //-----------Notification log Insertion----------------
                                                                                var values ={
                                                                                        notificationTypeId  :   2,
                                                                                        userId              :   userId,
                                                                                        ditherUserId        :   foundCollageResults.userId,
                                                                                        collage_id          :   collageId,
                                                                                        image_id            :   likedImageId,
                                                                                        //description         :   likeDetails.length
                                                                                }
                                                                                NotificationLog.create(values).exec(function(err, createdNotificationTags) {
                                                                                    if(err)
                                                                                    {
                                                                                        console.log(err);
                                                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in inserting collage tagged users', error_details: err});
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                       /* //console.log(req);
                                                                                        console.log(req.isSocket);
                                                                                        if (!req.isSocket) {
                                                                                                console.log("No socket");
                                                                                                console.log(sails.sockets.getId(req));
                                                                                        }
                                                                                        console.log(sails.sockets.getId(req));
                                                                                        console.log(sails.sockets.socketRooms(req.socket));
                                                                                        //sails.sockets.blast('like-dither', {status : 1, status_type: 'Success', message : "likeDither Blasted successfully"});
                                                                                        sails.sockets.broadcast(sails.sockets.getId(req),'like-dither', {status : 1, status_type: 'Success', message : "likeDither Blasted Broadcast successfully"});
                                                                                        //sails.sockets.emit('like-dither', {status : 1, status_type: 'Success', message : "likeDither Blasted Broadcast successfully"});
                                                                                        console.log(createdNotificationTags);
                                                                                        //return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully voted the Image',
                                                                                                //total_like_count       :  updatedVoteCount[0].vote,
                                                                                        //});*/

                                                                                //###################################

                                                                                        /*------------------------------------------------------------------------------------                                                                                          /*------------------------------------------------------------------------------------
                                                                                                                    PUSH NOTIFICATION
                                                                                         -------------------------------------------------------------------------------------*/

                                                                                        User_token.findOne({userId: foundCollageResults.userId }).exec(function (err, getDeviceId){
                                                                                            if(err)
                                                                                            {
                                                                                                  console.log(err);
                                                                                                  return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in findig deviceId', error_details: err});
                                                                                            }
                                                                                            else
                                                                                            {

                                                                                                var message     =  'Vote Notification';
                                                                                                var ntfn_body   =  tokenCheck.tokenDetails.name +" Voted on Your Dither";
                                                                                                var device_id   =  getDeviceId.deviceId;
                                                                                                var data        =  {message:message,device_id:device_id,NtfnBody:ntfn_body};

                                                                                                if(!device_id){
                                                                                                        return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully voted the Image',
                                                                                                                                        total_like_count       :  updatedVoteCount[0].vote,
                                                                                                                            });
                                                                                                }else{
                                                                                                        var switchKey  =  device_type;
                                                                                                        switch(switchKey){
                                                                                                                case 'ios' :
                                                                                                                            NotificationService.pushNtfnApn(data, function(err, ntfnSend) {
                                                                                                                                if(err)
                                                                                                                                {
                                                                                                                                    console.log("Error in Push Notification Sending")
                                                                                                                                    console.log(err)
                                                                                                                                    //callback();
                                                                                                                                }
                                                                                                                                else
                                                                                                                                {
                                                                                                                                    console.log("Push notification result")
                                                                                                                                    console.log(ntfnSend)
                                                                                                                                    console.log("Push Notification sended")
                                                                                                                                    //callback();
                                                                                                                                    return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully voted the Image',
                                                                                                                                        total_like_count       :  updatedVoteCount[0].vote,
                                                                                                                                    });
                                                                                                                                }
                                                                                                                            });
                                                                                                                break;

                                                                                                                case 'android' :
                                                                                                                            NotificationService.pushNtfnGcm(data, function(err, ntfnSend) {
                                                                                                                                if(err)
                                                                                                                                {
                                                                                                                                    console.log("Error in Push Notification Sending")
                                                                                                                                    console.log(err)
                                                                                                                                    //callback();
                                                                                                                                }
                                                                                                                                else
                                                                                                                                {
                                                                                                                                    console.log("Push notification result")
                                                                                                                                    console.log(ntfnSend)
                                                                                                                                    console.log("Push Notification sended")
                                                                                                                                    //callback();
                                                                                                                                    return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully voted the Image',
                                                                                                                                            total_like_count       :  updatedVoteCount[0].vote,
                                                                                                                                    });
                                                                                                                                }
                                                                                                                            });
                                                                                                                break;

                                                                                                                default:
                                                                                                                            return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully voted the Image',
                                                                                                                                        total_like_count       :  updatedVoteCount[0].vote,
                                                                                                                            });

                                                                                                                break;


                                                                                                        }
                                                                                                }

                                                                                            //------------------------------
                                                                                            }
                                                                                          });
                                                                                            //###################################
                                                                                    }
                                                                                });
                                                                                //-----------------------------End OF NotificationLog---------------------------------

                                                                            }//Collage totalVote count Update
                                                                        });

                                                                    }//CollageDetails vote count Update
                                                                });

                                                            }//Like Creation End
                                                        });

                                                    }//Collage Details exising Check Else
                                                }
                                            });

                                        }//Collage existing check
                                     }
                                });
                        }// already Liked by user check,  Else stop
                    }
                });
            }

        },
};


