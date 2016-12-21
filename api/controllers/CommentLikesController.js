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
                                    console.log("Find collage --- success");
                                    CollageComments.findOne({id: commentId}).exec(function (err, foundComment){
                                        if(err){
                                            console.log(err);
                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding the comment', error_details: err});
                                        }else{
                                            if(!foundComment){
                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No comment found'});
                                            }else{
                                                console.log("FInd collageComments --- success");
                                                CommentLikes.findOne({commentId: commentId, userId : userId, likeStatus: 1}).exec(function (err, foundCommentLike){
                                                    if(err){
                                                        console.log(err);
                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding the commentLike', error_details: err});
                                                    }else{
                                                        if(foundCommentLike){
                                                             return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Already liked this comment'});
                                                        }else{
                                                            console.log("FInd commentLike --- success");
                                                            var values = {
                                                                        commentId   : commentId,
                                                                        userId      : userId,
                                                                        likeStatus  : 1
                                                                        };
                                                            CommentLikes.create(values).exec(function(err, results){
                                                                if(err){
                                                                    console.log(err);
                                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Comment Like Insertion', error_details: err});
                                                                }else{
                                                                    console.log("Create commentLike --- success");
                                                                    var criteria = {id: foundComment.id};
                                                                    var values   = {likeCount: parseInt(foundComment.likeCount) + 1};
                                                                    CollageComments.update(criteria, values).exec(function(err, updatedLikeCount) {
                                                                        if(err){
                                                                            console.log(err);
                                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Comment Like Insertion', error_details: err});
                                                                        }else{
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
                                                                                return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully like a comment',
                                                                                    });
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
    }

};

