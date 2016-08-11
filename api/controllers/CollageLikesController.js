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
                    console.log(req.param("dither_id"));
                    //console.log(req.param("user_id"));
                    console.log(req.param("dither_like_image_id"));
                    var tokenCheck                  =     req.options.tokenCheck;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var collageId                   =     req.param("dither_id");
                    //var likedUserId               =     req.param("user_id");
                    var likedImageId                =     req.param("dither_like_image_id");
                    var imgPosition                 =     req.param("image_position");

                    if(!collageId || !likedImageId || !imgPosition){
                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please pass the dither_id and dither_like_image_id and position'});
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
                                                            console.log("results ======================");
                                                            console.log(results);
                                                            console.log(results.collageId);
                                                            console.log(results.imageId);
                                                            //To check the CollageId and the ImageId is existing or not
                                                            CollageDetails.findOne({id: results.imageId, collageId: results.collageId}).exec(function (err, foundImgResults){
                                                                    if(err){
                                                                        console.log(err);
                                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding image from Image Details', error_details: err});
                                                                    }else{
                                                                        console.log(foundImgResults);
                                                                            if(!foundImgResults){
                                                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No Image of the Dither Found by this id'});
                                                                            }else{
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
                                                                                            //To check the collage is existing or not
                                                                                            Collage.findOne({id: results.collageId}).exec(function (err, foundCollageResults){
                                                                                                    if(err){
                                                                                                        console.log(err);
                                                                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding dither', error_details: err});
                                                                                                    }else{

                                                                                                                if(!foundCollageResults){
                                                                                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No Dither Found by this id'});
                                                                                                                }else{

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
                                                                                                                                  return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully voted the Image',
                                                                                                                                            total_like_count       :  updatedVoteCount[0].vote,
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

                                                            });

                                                        }
                                                });
                                        }
                                    }
                                });
                    }

        },
};
