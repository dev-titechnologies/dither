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

                    var values = {
                        collageId       :       collageId,
                        imageId         :       likedImageId,
                        userId          :       userId,
                        likeStatus      :       1,
                    };
                    CollageLikes.create(values).exec(function(err, results){
                            if(err){
                                    console.log(err);
                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Dither Vote Creation', error_details: err});
                            }
                            else{
                                CollageDetails.findOne({collageId: results.collageId,id: results.imageId}).exec(function (err, foundImgResults){
                                        if(err){
                                            console.log(err);
                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding image from Image Details', error_details: err});
                                        }else{

                                            var criteria = {id: foundImgResults.id};
                                            var values   = {vote: parseInt(foundImgResults.vote) + 1};
                                            CollageDetails.update(criteria, values).exec(function(err, updatedVoteCount) {
                                                if(err)
                                                {
                                                    console.log(err);
                                                    return res.json(200, {status: 2, status_type: 'Failure', message: 'Some error has occured in Updating vote count of a single image'});
                                                }
                                                else
                                                {
                                                        /*console.log(foundImgResults);
                                                        console.log(foundImgResults.vote);
                                                        console.log("Success");
                                                        console.log(updatedVoteCount[0]);*/
                                                        console.log(updatedVoteCount);
                                                        return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully voted the Image',
                                                                            total_like_count       :  updatedVoteCount[0].vote,
                                                                        });
                                                }
                                            });

                                        }

                                });

                            }
                    });

    },
};

