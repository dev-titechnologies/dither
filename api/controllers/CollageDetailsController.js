/**
 * CollageDetailsController
 *
 * @description :: Server-side logic for managing collagedetails
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs          = require('fs');
module.exports = {

/* ==================================================================================================================================
               To get a single Dither Details (For Both logged User and Other User)
  ==================================================================================================================================== */
        getDitherDetail: function (req, res) {
                console.log("collage details api==================");
                var server_baseUrl              =     req.options.server_baseUrl;
                var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                var collageImg_path             =     server_image_baseUrl + req.options.file_path.collageImg_path;
                var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                var profilePic_path_assets      =     req.options.file_path.profilePic_path_assets;
                var collageImg_path_assets      =     req.options.file_path.collageImg_path_assets;
                var tokenCheck                  =     req.options.tokenCheck;
                var userId                      =     tokenCheck.tokenDetails.userId;
                var dither_expiry_hour          =     req.options.settingsKeyValue.DITHER_EXPIRY_HOUR;
                var today                       =     new Date().toISOString();
                console.log(req.param("dither_id"));
                var get_collage_id              =     req.param("dither_id");
                var query;
                var total_taggedUser_Array      =     [];

                if(!get_collage_id){
                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please pass the dither_id'});
                }else{
                        query = " SELECT clg.image AS collageImage, clg.imgTitle, clg.location, clg.userId AS collageCreatorId, clg.totalVote, clg.createdAt, clg.updatedAt,"+
                                " clgdt.id AS imageId, clgdt.collageId, clgdt.image, clgdt.position, clgdt.vote,"+
                                " usr.name AS collageCreator, usr.profilePic, usr.mentionId,"+
                                " clglk.likeStatus, clglk.likePosition, clglk.userId likeUserId"+
                                " FROM collage clg"+
                                " INNER JOIN collageDetails clgdt ON clgdt.collageId = clg.id"+
                                " INNER JOIN user usr ON usr.id = clg.userId"+
                                //" LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.likePosition = clgdt.position AND clglk.userId = "+userId+
                                " LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.userId = "+userId+
                                " WHERE clg.id = "+get_collage_id+
                                //" AND clg.expiryDate > '"+today+"'"+
                                " GROUP BY clgdt.id";
                        console.log(query);
                        Collage.query(query, function(err, results){
                                if(err){
                                    console.log(err);
                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting the Collage Details'});
                                }else{
                                    if(!results.length){
                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage Found by this Id'});
                                    }else{
                                            var imageArray = [];
                                            var like_position_Array = [];
                                            var like_position;
                                            var like_status, like_count;
                                            results.forEach(function(factor, index){
                                                    var like_status;
                                                    if(factor.likeStatus == null || factor.likeStatus == "" || factor.likeStatus == 0){
                                                            like_status = 0;
                                                    }else{
                                                            like_status = 1;
                                                    }
                                                    imageArray.push({
                                                                    imageUrl        : collageImg_path + factor.image,
                                                                    like_count      : factor.vote,
                                                                    like_status     : like_status,
                                                                    id              : factor.imageId
                                                                    });
                                                        if(factor.likeUserId == null || factor.likeUserId == "" ){
                                                        }else{
                                                                if(factor.likePosition == "" || factor.likePosition == null){
                                                                }else{
                                                                    if(factor.likeUserId == userId && factor.collageCreatorId != userId){
                                                                        like_position_Array.push(factor.likePosition);
                                                                    }
                                                                }
                                                        }
                                            });
                                            if(like_position_Array.length != 0){
                                                        like_position = like_position_Array[0];
                                            }else{
                                                        like_position = 0;
                                            }
                                            User.findOne({id: results[0].collageCreatorId}).exec(function (err, collageCreator_details){
                                                    if(err){
                                                            console.log(err);
                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in finding collageCreator Details', error_details: err});
                                                    }else{
                                                        console.log("collageCreator_details ======================");
                                                        console.log(collageCreator_details);
                                                        var collageCreator_profilePic;
                                                        if(collageCreator_details.profilePic == "" || collageCreator_details.profilePic == null){
                                                                    collageCreator_profilePic  =  "";
                                                        }else{
                                                                    collageCreator_profilePic  =  profilePic_path + collageCreator_details.profilePic;
                                                        }
                                                        var collageCreator_JSON_Array       =     [{
                                                                                                name                :    collageCreator_details.name,
                                                                                                userId              :    collageCreator_details.id,
                                                                                                profile_image       :    collageCreator_profilePic,
                                                                                                mention_id          :    collageCreator_details.mentionId
                                                                                               }];
                                                        console.log("collageCreator_JSON_Array ======================");
                                                        console.log(collageCreator_JSON_Array);
                                                        query = " SELECT clgcmt.id, clgcmt.comment, usr.name,usr.mentionId, clgcmt.createdAt,usr.profilePic, usr.id userId"+
                                                                " FROM collageComments clgcmt"+
                                                                " INNER JOIN user usr ON usr.id = clgcmt.userId"+
                                                                " WHERE clgcmt.collageId = "+get_collage_id+
                                                                " ORDER BY clgcmt.createdAt";

                                                        CollageComments.query(query, function(err, collageCommentResults) {
                                                                if(err){
                                                                    console.log(err);
                                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting the Collage Comments'});
                                                                }else{
                                                                        //console.log(collageCommentResults);
                                                                        var commentArray = [];
                                                                        if(collageCommentResults.length){
                                                                            collageCommentResults.forEach(function(factor, index){
                                                                                    //console.log("factor");
                                                                                    //console.log(factor);
                                                                                    var profile_image;
                                                                                    if(factor.profilePic == null || factor.profilePic == ""){
                                                                                         profile_image  = "";
                                                                                    }else{
                                                                                        var imageSrc                    =     profilePic_path_assets + factor.profilePic;
                                                                                        var ext                         =     imageSrc.split('/');
                                                                                        ext                             =     ext[ext.length-1].split('.');
                                                                                        profile_image                   =     profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                                                                    }
                                                                                    commentArray.push({comment_id                   : factor.id,
                                                                                                        user_id                     : factor.userId,
                                                                                                        user_name                   : factor.name,
                                                                                                        user_profile_pic_url        : profile_image,
                                                                                                        mention_id                  : factor.mentionId,
                                                                                                        message                     : factor.comment,
                                                                                                        comment_created_date_time   : factor.createdAt
                                                                                    });


                                                                            });
                                                                        }
                                                                        //Query to get tagged users from both addressBook and fbFriends
                                                                            query  = "SELECT *"+
                                                                                    " FROM ("+
                                                                                    " SELECT adb.ditherUserId, adb.ditherUsername, usr.name,usr.profilePic,usr.mentionId"+
                                                                                    " FROM tags tg"+
                                                                                    " INNER JOIN user usr ON usr.id = tg.userId"+
                                                                                    " LEFT JOIN addressBook adb ON adb.ditherUserId = tg.userId"+
                                                                                    " LEFT JOIN collage clg ON clg.id = tg.collageId"+
                                                                                    " WHERE tg.collageId = "+get_collage_id+
                                                                                    " GROUP BY adb.ditherUserId"+
                                                                                    " UNION"+
                                                                                    " SELECT fbf.ditherUserId, fbf.ditherUsername, usr.name, usr.profilePic,usr.mentionId"+
                                                                                    " FROM tags tg"+
                                                                                    " INNER JOIN user usr ON usr.id = tg.userId"+
                                                                                    " LEFT JOIN fbFriends fbf ON fbf.ditherUserId = tg.userId"+
                                                                                    " LEFT JOIN collage clg ON clg.id = tg.collageId"+
                                                                                    " WHERE tg.collageId = "+get_collage_id+
                                                                                    " GROUP BY fbf.ditherUserId"+
                                                                                    " ) AS temp"+
                                                                                    " WHERE temp.ditherUserId IS NOT NULL"+
                                                                                    " AND temp.ditherUserId != "+results[0].collageCreatorId+
                                                                                    " GROUP BY temp.ditherUserId";
                                                                            console.log(query);
                                                                            AddressBook.query(query, function(err, taggedUsersFinalResults){
                                                                                    if(err){
                                                                                        console.log(err);
                                                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Selecting tagged users from both address book and fb friends'});
                                                                                    }else{
                                                                                        console.log(query);
                                                                                        var profile_image = "";
                                                                                        //console.log(taggedUsersFinalResults);
                                                                                        var taggedUserArrayFinal = [];
                                                                                        if(taggedUsersFinalResults.length){
                                                                                            taggedUsersFinalResults.forEach(function(factor, index){
                                                                                                    //console.log("factor");
                                                                                                    //console.log(factor);
                                                                                                    profile_image                   =   "";
                                                                                                    if(factor.profilePic){
                                                                                                        var imageSrc                    =     factor.profilePic;
                                                                                                        var ext                         =     imageSrc.split('.');
                                                                                                        profile_image                   =     profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                                                                                    }
                                                                                                    taggedUserArrayFinal.push({
                                                                                                                name            :   factor.name,
                                                                                                                userId          :   factor.ditherUserId,
                                                                                                                profile_image   :   profile_image,
                                                                                                                mention_id      :   factor.mentionId
                                                                                                    });
                                                                                            });

                                                                                            total_taggedUser_Array = taggedUserArrayFinal.concat(collageCreator_JSON_Array);
                                                                                            console.log(total_taggedUser_Array);
                                                                                        }
                                                                                        query = " SELECT invt.phoneNumber, invt.invitee"+
                                                                                                " FROM invitation invt"+
                                                                                                " WHERE invt.collageId = "+get_collage_id;
                                                                                        console.log(query);
                                                                                        Invitation.query(query, function(err, invitedUsersFinalResults){
                                                                                                if(err){
                                                                                                    console.log(err);
                                                                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Selecting invited users'});
                                                                                                }else{
                                                                                                    //console.log("Invited Users =============>>>>>>>>>>>>>>>>>>   ");
                                                                                                    var inviteeArray;
                                                                                                    if(invitedUsersFinalResults.length){
                                                                                                            inviteeArray = invitedUsersFinalResults;
                                                                                                    }else{
                                                                                                            inviteeArray = [];
                                                                                                    }
                                                                                                    var user_profile_image;
                                                                                                    if(results[0].profilePic == "" || results[0].profilePic == null){
                                                                                                            user_profile_image    =     ""
                                                                                                    }else{

                                                                                                            var imageSrc                    =     results[0].profilePic;
                                                                                                            var ext                         =     imageSrc.split('.');
                                                                                                            user_profile_image              =     profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                                                                                            //user_profile_image              =     profilePic_path + results[0].profilePic;
                                                                                                    }
                                                                                                    //When super user creates a dither he is not in logged user contact
                                                                                                    if(total_taggedUser_Array.length == 0){
                                                                                                            total_taggedUser_Array = [userId];
                                                                                                    }
                                                                                                    return res.json(200, {status: 1, status_type: 'Success' , message: 'Dither Details',
                                                                                                                                        dither_expiry_hour         : dither_expiry_hour,
                                                                                                                                        dither_desc                : results[0].imgTitle,
                                                                                                                                        dither_created_date_time   : results[0].createdAt,
                                                                                                                                        dither_updated_date_time   : results[0].updatedAt,
                                                                                                                                        dither_id                  : results[0].collageId,
                                                                                                                                        dither_created_username    : results[0].collageCreator,
                                                                                                                                        dither_created_mentionId   : results[0].mentionId,
                                                                                                                                        dither_created_userID      : results[0].collageCreatorId,
                                                                                                                                        dither_created_profile_pic : user_profile_image,
                                                                                                                                        dither_location            : results[0].location,
                                                                                                                                        dither_image               : collageImg_path + results[0].collageImage,
                                                                                                                                        dither_like_position       : like_position,
                                                                                                                                        dithers                    : imageArray,
                                                                                                                                        ditherCount                : imageArray.length,
                                                                                                                                        taggedUsers                : total_taggedUser_Array,
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
                    var server_image_baseUrl                     =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                    var collageImg_path                          =     server_image_baseUrl + req.options.file_path.collageImg_path;
                    var profilePic_path                          =     server_image_baseUrl + req.options.file_path.profilePic_path;
                    var collageImg_path_assets                   =     req.options.file_path.collageImg_path_assets;
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
                                    //" LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.likePosition = clgdt.position"+
                                    " LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id"+
                                    " INNER JOIN user usr ON usr.id = clglk.userId"+
                                    " WHERE"+
                                    " clgdt.collageId = '"+received_collage_id+"' AND clgdt.id = '"+received_single_image_id+"'";
                            console.log(query);
                            CollageDetails.query(query, function(err, results) {
                                    if(err){
                                        console.log(err);
                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting Single Dither Details'});
                                    }else{
                                        if(!results.length){
                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No users voted to this image'});
                                        }else{
                                                var votedUsersArray = [];
                                                var profile_image;
                                                results.forEach(function(factor, index){
                                                        if(factor.profilePic == "" || factor.profilePic == null){
                                                                profile_image   =  "";
                                                        }else{
                                                                var imageSrc                    =     factor.profilePic;
                                                                var ext                         =     imageSrc.split('.');
                                                                profile_image                   =     profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                                                //profile_image = profilePic_path + factor.profilePic;
                                                        }
                                                        votedUsersArray.push({
                                                                            user_id : factor.user_id,
                                                                            user_name : factor.name,
                                                                            user_pic : profile_image
                                                                            });
                                                });

                                                var dither_image                    =     collageImg_path + results[0].collageImage;
                                                return res.json(200, {status: 1, status_type: 'Success' , message: 'Single Dither Details',
                                                                      single_image_url              :   collageImg_path + results[0].image,
                                                                      dither_title                  :   results[0].imgTitle,
                                                                      dither_image                  :   dither_image,
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
