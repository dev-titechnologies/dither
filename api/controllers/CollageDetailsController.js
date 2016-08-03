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
                var collageImg_path             =     server_baseUrl + req.options.file_path.collageImg_path;
                var tokenCheck                  =     req.options.tokenCheck;
                var userId                      =     tokenCheck.tokenDetails.userId;
                console.log(req.param("dither_id"));
                var get_collage_id = req.param("dither_id");
                var query;
                if(!get_collage_id){
                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please pass the Dither Id'});
                }else{
                    query = " SELECT clg.image AS collageImage, clg.imgTitle, clg.location, clg.userId AS collageCreatorId, clg.totalVote, clg.createdAt,"+
                                " clgdt.id AS imageId, clgdt.collageId, clgdt.image, clgdt.position, clgdt.vote,"+
                                " usr.name AS collageCreator, usr.profilePic,"+
                                 " clglk.likeStatus"+
                                " FROM collage clg"+
                                " INNER JOIN collageDetails clgdt ON clgdt.collageId = clg.id"+
                                " INNER JOIN user usr ON usr.id = clg.userId"+
                                " LEFT JOIN collageLikes clglk ON clglk.userId = usr.id"+
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
                                                var like_status;
                                                if(factor.likeStatus == null || factor.likeStatus == ""){
                                                        like_status = 0;
                                                }else{
                                                        like_status = 1;
                                                }
                                                imageArray.push({
                                                                imageUrl : server_baseUrl + req.options.file_path.profilePic_path + factor.image,
                                                                like_count: factor.vote,
                                                                like_status: like_status,
                                                                id: factor.imageId
                                                                });
                                        });



                                        query = " SELECT clgcmt.comment, usr.name, usr.profilePic, usr.id userId"+
                                                " FROM collageComments clgcmt"+
                                                " INNER JOIN user usr ON usr.id = clgcmt.userId"+
                                                " WHERE clgcmt.collageId = "+get_collage_id;

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
                                                                };
                                                        Tags.find(values).exec(function (err, tagResults){
                                                            if (err) {
                                                                   return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in finding collage tagged Users', error_details: err});
                                                            }
                                                            else{

                                                                var taggedUserArray = [];
                                                                    if(tagResults != 0){
                                                                        tagResults.forEach(function(factor, index){
                                                                                console.log("factor");
                                                                                console.log(factor);
                                                                                taggedUserArray.push(factor.userId);
                                                                        });
                                                                    }else{
                                                                        taggedUserArray = ['0'];
                                                                    }
                                                                    //Query to get tagged users from both addressBook and fbFriends
                                                                    query = " SELECT adb.userId, adb.ditherUsername, usr.name"+
                                                                            " FROM addressBook adb"+
                                                                            " INNER JOIN user usr ON usr.id = adb.userId"+
                                                                            " WHERE adb.userId"+
                                                                            " IN ( "+taggedUserArray+" )"+
                                                                            " GROUP BY adb.userId"+
                                                                            " UNION"+
                                                                            " SELECT fbf.userId, fbf.ditherUsername, usr.name"+
                                                                            " FROM addressBook fbf"+
                                                                            " INNER JOIN user usr ON usr.id = fbf.userId"+
                                                                            " WHERE fbf.userId"+
                                                                            " IN ( "+taggedUserArray+" )"+
                                                                            " GROUP BY fbf.userId";

                                                                    AddressBook.query(query, function(err, taggedUsersFinalResults) {
                                                                            if(err)
                                                                            {
                                                                                console.log(err);
                                                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Selecting tagged users from both address book and fb friends'});
                                                                            }
                                                                            else
                                                                            {

                                                                                console.log(query);
                                                                                console.log(taggedUsersFinalResults);
                                                                                var taggedUserArrayFinal = [];
                                                                                if(taggedUsersFinalResults != 0){
                                                                                    taggedUsersFinalResults.forEach(function(factor, index){
                                                                                            console.log("factor");
                                                                                            console.log(factor);
                                                                                            taggedUserArrayFinal.push({name: factor.name,userId: factor.userId});
                                                                                    });
                                                                                }else{
                                                                                    taggedUserArrayFinal = [];
                                                                                }
                                                                                return res.json(200, {status: 1, status_type: 'Success' , message: 'Dither Details',
                                                                                     dither_desc                : results[0].imgTitle,
                                                                                     dither_created_date        : results[0].createdAt,
                                                                                     dither_id                  : results[0].collageId,
                                                                                     dither_created_username    : results[0].collageCreator,
                                                                                     dither_created_userID      : results[0].collageCreatorId,
                                                                                     dither_created_profile_pic : server_baseUrl + req.options.file_path.profilePic_path + results[0].profilePic,
                                                                                     dither_location            : results[0].location,
                                                                                     dither_image               : collageImg_path + results[0].collageImage,
                                                                                     dithers                    : imageArray,
                                                                                     ditherCount                : imageArray.length,
                                                                                     taggedUsers                : taggedUserArrayFinal,
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
                }




        },
};

