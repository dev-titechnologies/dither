/**
 * CollageDetailsController
 *
 * @description :: Server-side logic for managing collagedetails
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

/* ==================================================================================================================================
               To get a single Dither Details (For Both logged User and Other User)
  ==================================================================================================================================== */
        getDitherDetail: function (req, res) {
                var server_baseUrl              =     req.options.server_baseUrl;
                var tokenCheck                  =     req.options.tokenCheck;
                var userId                      =     tokenCheck.tokenDetails.userId;
                var get_collage_id = req.param("dither_id");
                var query;

                query = " SELECT clg.image AS collageImage, clg.imgTitle, clg.location, clg.userId AS collageCreatorId, clg.totalVote, clg.createdAt,"+
                            " clgdt.id AS imageId, clgdt.collageId, clgdt.image, clgdt.position, clgdt.vote,"+
                            " usr.name AS collageCreator, usr.profilePic"+
                            " FROM collage clg"+
                            " INNER JOIN collageDetails clgdt ON clgdt.collageId = clg.id"+
                            " INNER JOIN user usr ON usr.id = clg.userId"+
                            " WHERE clg.id = "+get_collage_id;
                console.log(query);
                Collage.query(query, function(err, results) {
                        if(err)
                        {
                            console.log(err);
                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting the Collage Details'});
                        }
                        else
                        {
                            if(results.length == 0){
                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage Found by this Id'});
                            }else{
                                    var imageArray = [];
                                    results.forEach(function(factor, index){
                                            console.log("factor");
                                            console.log(factor);
                                            imageArray.push({imageUrl : server_baseUrl + req.options.file_path.profilePic_path + factor.image, like_count: factor.vote, id: factor.imageId});
                                    });
                                    console.log(imageArray);


                                    query = " SELECT clgcmt.comment, usr.name, usr.profilePic, usr.id userId"+
                                            " FROM collageComments clgcmt"+
                                            " INNER JOIN user usr ON usr.id = clgcmt.userId"+
                                            " WHERE clgcmt.collageId = "+get_collage_id;
                                    console.log(query);
                                    CollageComments.query(query, function(err, collageCommentResults) {
                                            if(err)
                                            {
                                                console.log(err);
                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting the Collage Comments'});
                                            }
                                            else
                                            {
                                                console.log(collageCommentResults);
                                                var commentArray = [];
                                                if(collageCommentResults.length !== 0){
                                                    collageCommentResults.forEach(function(factor, index){
                                                            console.log("factor");
                                                            console.log(factor);
                                                            commentArray.push({user_name: factor.name,  user_profile_pic_url : server_baseUrl + req.options.file_path.profilePic_path + factor.profilePic, message: factor.comment});
                                                    });
                                                }

                                                values = {
                                                            collageId : get_collage_id,
                                                            userId    : userId,
                                                        };
                                                CollageLikes.findOne(values).exec(function (err, collageLikeResults){
                                                    if (err) {
                                                           return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in checking logged users collage like status', error_details: err});
                                                    }
                                                    else{
                                                            console.log(collageLikeResults);

                                                            values = {
                                                            collageId : get_collage_id,
                                                                    };
                                                            Tags.find(values).exec(function (err, tagResults){
                                                                if (err) {
                                                                       return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in finding collage tagged Users', error_details: err});
                                                                }
                                                                else{
                                                                    console.log("tagResults ===============================");
                                                                    console.log(tagResults);
                                                                    taggedUserArray = [];
                                                                    if(tagResults != 0){
                                                                        tagResults.forEach(function(factor, index){
                                                                                console.log("factor");
                                                                                console.log(factor);
                                                                                taggedUserArray.push(factor.userId);
                                                                        });

                                                                    }

                                                                    return res.json(200, {status: 2, status_type: 'Failure' , message: 'No collage Found by this Id',
                                                                         dither_desc                : results[0].imgTitle,
                                                                         dither_created_date        : results[0].createdAt,
                                                                         dither_like_status         : collageLikeResults.likeStatus,
                                                                         dither_id                  : results[0].collageId,
                                                                         dither_created_username    : results[0].collageCreator,
                                                                         dither_created_userID      : results[0].collageCreatorId,
                                                                         dither_created_profile_pic : server_baseUrl + req.options.file_path.profilePic_path + results[0].profilePic,
                                                                         dithers                    : imageArray,
                                                                         ditherCount                : imageArray.length,
                                                                         comments                   : commentArray,
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
        },
};

