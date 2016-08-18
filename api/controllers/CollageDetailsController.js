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
                console.log("collage details api==================");
                var server_baseUrl              =     req.options.server_baseUrl;
                var collageImg_path             =     server_baseUrl + req.options.file_path.collageImg_path;
                var profilePic_path             =     server_baseUrl + req.options.file_path.profilePic_path;
                var tokenCheck                  =     req.options.tokenCheck;
                var userId                      =     tokenCheck.tokenDetails.userId;
                console.log(req.param("dither_id"));
                var get_collage_id              =     req.param("dither_id");
                var query;
                if(!get_collage_id){
                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please pass the dither_id'});
                }else{
                    query = " SELECT clg.image AS collageImage, clg.imgTitle, clg.location, clg.userId AS collageCreatorId, clg.totalVote, clg.createdAt, clg.updatedAt,"+
                                " clgdt.id AS imageId, clgdt.collageId, clgdt.image, clgdt.position, clgdt.vote,"+
                                " usr.name AS collageCreator, usr.profilePic,"+
                                 " clglk.likeStatus, clglk.likePosition"+
                                " FROM collage clg"+
                                " INNER JOIN collageDetails clgdt ON clgdt.collageId = clg.id"+
                                " INNER JOIN user usr ON usr.id = clg.userId"+
                                //" LEFT JOIN collageLikes clglk ON clglk.userId = usr.id"+
                                " LEFT JOIN collageLikes clglk ON clglk.collageId = clg.id"+
                                " WHERE clg.id = "+get_collage_id+
                                " GROUP BY clgdt.id";
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
                                        console.log("results  ---------- getLike .....................++++++++++++++++++++");
                                        console.log(results);
                                        var like_position;
                                        results.forEach(function(factor, index){
                                                //console.log("factor");
                                                console.log(factor.likeStatus);
                                                var like_status;

                                                if(factor.likeStatus == null || factor.likeStatus == "" || factor.likeStatus == 0){
                                                        like_status = 0;
                                                }else{
                                                        like_status = 1;
                                                }
                                                imageArray.push({
                                                                imageUrl : collageImg_path + factor.image,
                                                                like_count: factor.vote,
                                                                like_status: like_status,
                                                                id: factor.imageId
                                                                });
                                                if(factor.likePosition == null || factor.likePosition == "" || factor.likePosition == 0){
                                                        like_position = 0;
                                                }else{
                                                        like_position = factor.likePosition;
                                                }
                                        });
                                        console.log("like_position+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                                        console.log(like_position);


                                        query = " SELECT clgcmt.id, clgcmt.comment, usr.name, usr.profilePic, usr.id userId"+
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
                                                        //console.log(collageCommentResults);
                                                        var commentArray = [];
                                                        if(collageCommentResults.length !== 0){
                                                            collageCommentResults.forEach(function(factor, index){
                                                                    //console.log("factor");
                                                                    //console.log(factor);
                                                                    commentArray.push({comment_id: factor.id, user_id: factor.userId, user_name: factor.name,  user_profile_pic_url : profilePic_path + factor.profilePic, message: factor.comment});
                                                            });
                                                        }
                                                        //Query to get tagged users from both addressBook and fbFriends
                                                            /*query = " SELECT"+
                                                                    " adb.userId, adb.ditherUsername, usr.name"+
                                                                    " FROM addressBook adb"+
                                                                    " INNER JOIN user usr ON usr.id = adb.userId"+
                                                                    " LEFT JOIN collage clg ON clg.userId = usr.id"+
                                                                    " LEFT JOIN tags tg ON tg.userId = usr.id"+
                                                                    " WHERE"+
                                                                    " tg.collageId = "+get_collage_id+" AND clg.userId = "+userId+
                                                                    " GROUP BY adb.userId"+
                                                                    " UNION"+
                                                                    " SELECT"+
                                                                    " fbf.userId, fbf.ditherUsername, usr.name"+
                                                                    " FROM addressBook fbf"+
                                                                    " INNER JOIN user usr ON usr.id = fbf.userId"+
                                                                    " LEFT JOIN collage clg ON clg.userId = usr.id"+
                                                                    " LEFT JOIN tags tg ON tg.userId = usr.id"+
                                                                    " WHERE"+
                                                                    " tg.collageId = "+get_collage_id+" AND clg.userId = "+userId+
                                                                    " GROUP BY fbf.userId";*/
                                                            /*query = " SELECT"+
                                                                    " adb.userId, adb.ditherUsername, usr.name"+
                                                                    " FROM addressBook adb"+
                                                                    " INNER JOIN user usr ON usr.id = adb.userId"+
                                                                    " LEFT JOIN tags tg ON tg.userId = usr.id"+
                                                                    " LEFT JOIN collage clg ON clg.id = tg.collageId"+
                                                                    " WHERE"+
                                                                    //" tg.collageId = "+collage_results.id+" AND clg.userId = "+userId+
                                                                    " tg.collageId = "+get_collage_id+
                                                                    " GROUP BY adb.userId"+
                                                                    " UNION"+
                                                                    " SELECT"+
                                                                    " fbf.userId, fbf.ditherUsername, usr.name"+
                                                                    " FROM addressBook fbf"+
                                                                    " INNER JOIN user usr ON usr.id = fbf.userId"+
                                                                   // " LEFT JOIN collage clg ON clg.userId = usr.id"+
                                                                    " LEFT JOIN tags tg ON tg.userId = usr.id"+
                                                                    " LEFT JOIN collage clg ON clg.id = tg.collageId"+
                                                                    " WHERE"+
                                                                    //" tg.collageId = "+collage_results.id+" AND clg.userId = "+userId+
                                                                    " tg.collageId = "+get_collage_id+
                                                                    " GROUP BY fbf.userId";*/
                                                            /*query = " SELECT temp.*"+
                                                                    " FROM ("+
                                                                    " SELECT adb.ditherUserId, adb.ditherUsername, usr.name"+
                                                                    " FROM tags tg"+
                                                                    " INNER JOIN user usr ON usr.id = tg.userId"+
                                                                    " INNER JOIN addressBook adb ON adb.ditherUserId = tg.userId"+
                                                                    " LEFT JOIN collage clg ON clg.id = tg.collageId"+
                                                                    " WHERE tg.collageId = "+get_collage_id+
                                                                    " AND adb.userId = "+userId+
                                                                    " UNION"+
                                                                    " SELECT fbf.ditherUserId, fbf.ditherUsername, usr.name"+
                                                                    " FROM tags tg"+
                                                                    " INNER JOIN user usr ON usr.id = tg.userId"+
                                                                    " INNER JOIN fbFriends fbf ON fbf.ditherUserId = tg.userId"+
                                                                    " LEFT JOIN collage clg ON clg.id = tg.collageId"+
                                                                    " WHERE tg.collageId = "+get_collage_id+
                                                                    " AND fbf.userId = "+userId+
                                                                    " ) AS temp"+
                                                                    " GROUP BY temp.ditherUserId";*/
                                                            query  = "SELECT *"+
                                                                        " FROM ("+
                                                                        " SELECT adb.ditherUserId, adb.ditherUsername, usr.name"+
                                                                        " FROM tags tg"+
                                                                        " INNER JOIN user usr ON usr.id = tg.userId"+
                                                                        " LEFT JOIN addressBook adb ON adb.ditherUserId = tg.userId"+
                                                                        " LEFT JOIN collage clg ON clg.id = tg.collageId"+
                                                                        " WHERE tg.collageId = "+get_collage_id+
                                                                        " GROUP BY adb.ditherUserId"+
                                                                        " UNION"+
                                                                        " SELECT fbf.ditherUserId, fbf.ditherUsername, usr.name"+
                                                                        " FROM tags tg"+
                                                                        " INNER JOIN user usr ON usr.id = tg.userId"+
                                                                        " LEFT JOIN fbFriends fbf ON fbf.ditherUserId = tg.userId"+
                                                                        " LEFT JOIN collage clg ON clg.id = tg.collageId"+
                                                                        " WHERE tg.collageId = "+get_collage_id+
                                                                        " GROUP BY fbf.ditherUserId"+
                                                                        " ) AS temp"+
                                                                        " WHERE temp.ditherUserId IS NOT NULL"+
                                                                        " AND temp.ditherUserId != "+results.userId+
                                                                        " AND temp.ditherUserId != "+userId+
                                                                        " GROUP BY temp.ditherUserId";

                                                            AddressBook.query(query, function(err, taggedUsersFinalResults) {
                                                                    if(err)
                                                                    {
                                                                        console.log(err);
                                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Selecting tagged users from both address book and fb friends'});
                                                                    }
                                                                    else
                                                                    {

                                                                        console.log(query);
                                                                        //console.log(taggedUsersFinalResults);
                                                                        var taggedUserArrayFinal = [];
                                                                        if(taggedUsersFinalResults != 0){
                                                                            taggedUsersFinalResults.forEach(function(factor, index){
                                                                                    //console.log("factor");
                                                                                    //console.log(factor);
                                                                                    taggedUserArrayFinal.push({name: factor.name,userId: factor.ditherUserId});
                                                                            });
                                                                        }

                                                                        query = " SELECT invt.phoneNumber, invt.invitee"+
                                                                                " FROM invitation invt"+
                                                                                " WHERE invt.collageId = "+get_collage_id;
                                                                        console.log(query);
                                                                        Invitation.query(query, function(err, invitedUsersFinalResults){
                                                                                if(err)
                                                                                {
                                                                                    console.log(err);
                                                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Selecting invited users'});
                                                                                }
                                                                                else
                                                                                {
                                                                                    console.log("Invited Users =============>>>>>>>>>>>>>>>>>>   ");
                                                                                    var inviteeArray;
                                                                                    if(invitedUsersFinalResults.length != 0){

                                                                                            inviteeArray = invitedUsersFinalResults;
                                                                                    }else{

                                                                                            inviteeArray = [];
                                                                                    }
                                                                                    return res.json(200, {status: 1, status_type: 'Success' , message: 'Dither Details',
                                                                                                 dither_desc                : results[0].imgTitle,
                                                                                                 dither_created_date_time   : results[0].createdAt,
                                                                                                 dither_updated_date_time   : results[0].updatedAt,
                                                                                                 dither_id                  : results[0].collageId,
                                                                                                 dither_created_username    : results[0].collageCreator,
                                                                                                 dither_created_userID      : results[0].collageCreatorId,
                                                                                                 dither_created_profile_pic : server_baseUrl + req.options.file_path.profilePic_path + results[0].profilePic,
                                                                                                 dither_location            : results[0].location,
                                                                                                 dither_image               : collageImg_path + results[0].collageImage,
                                                                                                 dither_like_position       : like_position,
                                                                                                 dithers                    : imageArray,
                                                                                                 ditherCount                : imageArray.length,
                                                                                                 taggedUsers                : taggedUserArrayFinal,
                                                                                                 comments                   : commentArray,
                                                                                                 invite_friends_NUM         : inviteeArray,
                                                                                    });
                                                                                }
                                                                        });

                                                                    }
                                                            });//Selecting Tagged Users from both contact List and FB Friends

                                                }
                                        });
                                }
                            }
                    });
                }

        },



 /* ==================================================================================================================================
               To get a single Dither Details (For Both logged User and Other User)
  ==================================================================================================================================== */
        getSingleDitherDetails: function (req, res) {
                    console.log("Single Dither Details api==================");
                    var server_baseUrl                           =     req.options.server_baseUrl;
                    var collageImg_path                          =     server_baseUrl + req.options.file_path.collageImg_path;
                    var profilePic_path                          =     server_baseUrl + req.options.file_path.profilePic_path;
                    var received_collage_id                      =     req.param("dither_id");
                    var received_single_image_id                 =     req.param("dither_single_id");
                    var query;

                    if(!received_collage_id || !received_single_image_id){
                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please Pass both dither_id and dither_single_id'});
                    }else{
                            query = " SELECT"+
                                    " clgdt.id as single_image_id, clgdt.image, clgdt.vote,"+
                                    " clg.image as collageImage, clg.imgTitle,"+
                                    " usr.id as user_id, usr.name, usr.profilePic"+
                                    " FROM"+
                                    " collageDetails clgdt"+
                                    " INNER JOIN collage clg ON clg.id = clgdt.collageId"+
                                    " LEFT JOIN collageLikes clglk ON clglk.collageId = clgdt.collageId"+
                                    " INNER JOIN user usr ON usr.id = clglk.userId"+
                                    " WHERE"+
                                    " clgdt.collageId = '"+received_collage_id+"' AND clgdt.id = '"+received_single_image_id+"'";
                            console.log(query);
                            CollageDetails.query(query, function(err, results) {
                                    if(err)
                                    {
                                        console.log(err);
                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting Single Dither Details'});
                                    }
                                    else
                                    {
                                        if(results.length == 0){
                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No users voted to this image'});
                                        }else{
                                                var votedUsersArray = [];
                                                var profile_image;
                                                results.forEach(function(factor, index){
                                                        if(factor.profilePic == null || factor.profilePic == ""){
                                                                    profile_image = "";
                                                        }else{

                                                                    profile_image = profilePic_path + factor.profilePic;
                                                        }
                                                        votedUsersArray.push({
                                                                            user_id : factor.user_id,
                                                                            user_name : factor.name,
                                                                            user_pic : profile_image
                                                                            });
                                                });
                                                return res.json(200, {status: 1, status_type: 'Success' , message: 'Single Dither Details',
                                                                      single_image_url              :   collageImg_path + results[0].image,
                                                                      dither_title                  :   results[0].imgTitle,
                                                                      dither_image                  :   collageImg_path + results[0].collageImage,
                                                                      total_vote                    :   results[0].vote,
                                                                      single_dither_id              :   results[0].single_image_id,
                                                                      voted_users                   :   votedUsersArray,
                                                                });
                                        }
                                    }
                            });
                    }
        },
};

