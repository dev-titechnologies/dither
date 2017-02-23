/**
 * CommentLikesController
 *
 * @description :: Server-side logic for managing commentlikes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    commentLike  :  function (req, res) {
                    console.log("++++++++++++++++ Like a comment +++++++++++++++");
                    var tokenCheck                  =     req.options.tokenCheck;
                    console.log(req.options.tokenCheck);
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var userName                    =     tokenCheck.tokenDetails.name;
                    var server_baseUrl              =     req.options.server_baseUrl;
                    var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                    var collageImg_path             =     server_image_baseUrl + req.options.file_path.collageImg_path;
                    var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                    var commentId                   =     req.param("comment_id");
                    var collageId                   =     req.param("dither_id");
                    console.log(req.params.all());

                    if(!commentId || !collageId){
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
                                                CommentLikes.findOne({commentId: commentId, userId : userId, likeStatus: 1}).exec(function (err, foundCommentLike){
                                                    if(err){
                                                        console.log(err);
                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding the commentLike', error_details: err});
                                                    }else{
                                                        console.log(foundCommentLike);
                                                        if(foundCommentLike){
                                                             return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Already liked this comment'});
                                                        }else{
                                                            var values = {
                                                                        commentId   : commentId,
                                                                        userId      : userId,
                                                                        likeStatus  : true
                                                                        };
                                                            console.log(values);
                                                            CommentLikes.create(values).exec(function(err, results){
                                                                if(err){
                                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Comment Like Insertion', error_details: err});
                                                                }else{
                                                                    var criteria = {id: foundComment.id};
                                                                    var values   = {likeCount: parseInt(foundComment.likeCount) + 1};
                                                                    console.log(criteria);
                                                                    console.log(values);
                                                                    CollageComments.update(criteria, values).exec(function(err, updatedLikeCount) {
                                                                        if(err){
                                                                            console.log(err);
                                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Comment Like Insertion', error_details: err});
                                                                        }else{
                                                                                var total_like_count  =  parseInt(foundComment.likeCount) + 1;
                                                                                console.log("Update likeCount --- success");
                                                                                var roomName  = "socket_dither_"+collageId;
                                                                                sails.sockets.broadcast(roomName,{
                                                                                                                type            :   "update",
                                                                                                                id              :   collageId,
                                                                                                                user_id         :   userId,
                                                                                                                message         :   "Like Comment - Room Broadcast",
                                                                                                                //roomName        :   roomName,
                                                                                                                //subscribers     :   sails.sockets.subscribers(roomName),
                                                                                                                //socket          :   sails.sockets.rooms()
                                                                                                                });
                                                                                if(foundComment.userId == userId){
                                                                                        return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully like a comment',
                                                                                                            total_like_count  :    total_like_count,
                                                                                                    });
                                                                                }else{
																				  var query = "SELECT * FROM tags where userId='"+foundComment.userId+"' and collageId='"+collageId+"'";	
																				  Tags.query(query, function (err, taggedUser) {
																				   if(err){
																					   return res.json(200, { status: 2, status_type: 'Failure' , message: 'Some error occured in tag users checking' , error_details: err});
																					   
																				   }else{
																					   
																					   console.log("---------------------taggedusersss---------------")
																					   console.log(taggedUser)
																					  if(!taggedUser.length){
																							return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully like a comment',
																													total_like_count  :    total_like_count,
																											});
																						}else{
																					
																								var data        =   {
																														collageId                   :    collageId,
																														notificationTypeId          :    9,
																														userId                      :    userId,
																														//collageCreatorId            :    foundCollage.userId,
																														commentCreatorId            :    foundComment.userId,
																														notificationSettingsType    :    "notifyCommentLike",
																														message                     :    "comment like notification",
																														ntfn_body                   :    userName + " likes your comment",
																														totalLikeCount              :    foundComment.likeCount,
																														commentId					:    commentId
																													};
																								NotificationService.collageNotificationLogCreation(data, function(err, createdNotification){
																									if(err){
																										return res.json(200, { status: 2, status_type: 'Failure' , message: 'Some error occured in notificationLogCreation' , error_details: err});
																									}else{
																											/*if(createdNotification.notifySettings == 0 || createdNotification.notifySettings == ""){
																													 return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully like a comment'});
																											}else{

																											}*/

																											return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully like a comment',
																													total_like_count  :    total_like_count,
																											});
																									}
																								});
																								
                                                                                        }
                                                                                     }
																				   }); 
                                                                                        
                                                                                }

                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    }
                                                });


                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
    },
    likedUsersList  :  function (req, res) {
                    console.log("++++++++++++++++ Liked users list +++++++++++++++");
                    var tokenCheck                  =     req.options.tokenCheck;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                    var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                    var commentId                   =     req.param("comment_id");
                    //var collageId                   =     req.param("dither_id");

                    if(!commentId){
                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please pass comment_id'});
                    }else{
                            CollageComments.findOne({id: commentId}).exec(function (err, foundComment){
                                if(err){
                                    console.log(err);
                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding the comment', error_details: err});
                                }else{
                                    if(!foundComment){
                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No comment found'});
                                    }else{
                                        var query    =   " SELECT usr.id, usr.name, usr.profilePic"+
                                                         " FROM commentLikes cmtlk"+
                                                         " INNER JOIN user usr ON cmtlk.userId = usr.id"+
                                                         " WHERE cmtlk.commentId = "+commentId;
                                        CommentLikes.query(query, function(err, results) {
                                                if(err){
                                                    console.log(err);
                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting list of liked users on the comment', error_details: err});
                                                }else{
                                                    if(!results.length){
                                                            return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully get the liked users list on the comment',
                                                                                likedUsers : []
                                                            });
                                                    }else{
                                                            var likedUsers                  =     [];
                                                            var profilePic;
                                                            results.forEach(function(factor, index){
                                                                    if(factor.profilePic == "" || factor.profilePic == null){
                                                                            profilePic                  =     ""
                                                                    }else{
                                                                            profilePic                  =     profilePic_path + factor.profilePic;
                                                                    }
                                                                    likedUsers.push({
                                                                                user_id         :  factor.id,
                                                                                user_name       :  factor.name,
                                                                                user_pic        :  profilePic,
                                                                        });
                                                            });
                                                            //console.log("likedUsers >>>>>>>>>>>>>>>>>>>>>");
                                                            //console.log(likedUsers);
                                                            return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully get the liked users list on the comment',
                                                                                    likedUsers : likedUsers
                                                            });
                                                    }
                                                }
                                        });
                                    }
                                }
                            });
                    }

    },

};

