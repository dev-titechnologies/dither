/**
 * CollageDetailsController
 *
 * @description :: Server-side logic for managing collagedetails
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs          = require('fs');

//Function to get ordered, by value, in json array key value pair
function predicatBy(prop){
   return function(a,b){
      if( a[prop] > b[prop]){
          return 1;
      }else if( a[prop] < b[prop] ){
          return -1;
      }
      return 0;
   }
}

//Function to remove duplicate values from json Array
function removeDuplicate(arr, prop) {
        var new_arr = [];
        var lookup = {};
        for (var i in arr) {
            lookup[arr[i][prop]] = arr[i];
        }
        for (i in lookup) {
            new_arr.push(lookup[i]);
        }
        //console.log(new_arr);
        return new_arr;
}
/*function remove_duplicate_from_array(arg1, arg2){
        //var arr = [1, 2, 3, 4, 5, 6, 7];
        //var ar = [2, 4, 6, 8, 10];
        //var newID = [];
        for(var i = 0; i < arg1.length; i++){
            for(var j = 0; j < arg2.length; j++){
                if(arg1[i] == arg2[j]){
                    //newID.push(arr[i]);
                    arg1.splice(i, 1);
                    arg2.splice(j, 1);
                    break;
                }
            }
        }
        return arg1;
}*/
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
                var commentImage_path           =     server_image_baseUrl + req.options.file_path.commentImage_path;
                var profilePic_path_assets      =     req.options.file_path.profilePic_path_assets;
                var collageImg_path_assets      =     req.options.file_path.collageImg_path_assets;
                var tokenCheck                  =     req.options.tokenCheck;
                var userId                      =     tokenCheck.tokenDetails.userId;
                var userName                    =     tokenCheck.tokenDetails.name;
                var userMentionId               =     tokenCheck.tokenDetails.mentionId;
                var userProfilePic              =     tokenCheck.tokenDetails.profilePic;
                var dither_expiry_hour          =     req.options.settingsKeyValue.DITHER_EXPIRY_HOUR;
                var today                       =     new Date().toISOString();
                console.log(req.param("dither_id"));
                var get_collage_id              =     req.param("dither_id");
                var query;
                var total_taggedUser_Array      =     [];
                var comment_arr_Final           =     [];

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
                                " LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.userId = "+userId+
                                " WHERE clg.id = "+get_collage_id+
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
                                                                    id              : factor.imageId,
                                                                    position        : factor.position
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
                                            //imageArray          =       imageArray.sort(predicatBy("position"));
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
                                                        query = "SELECT clgcmt.id, clgcmt.comment,clgcmt.createdAt,"+
                                                                " cmntImg.image, cmntImg.commentId AS commentId,"+
                                                                " usr.name, usr.mentionId, usr.profilePic, usr.id userId"+
                                                                " FROM collageComments clgcmt"+
                                                                " LEFT JOIN commentImages AS cmntImg ON cmntImg.commentId = clgcmt.id"+
                                                                " INNER JOIN user usr ON usr.id = clgcmt.userId"+
                                                                " WHERE clgcmt.collageId = "+get_collage_id+
                                                                " ORDER BY clgcmt.createdAt";
                                                        console.log(query);
                                                        CollageComments.query(query, function(err, collageCommentResults) {
                                                                if(err){
                                                                    console.log(err);
                                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting the Collage Comments'});
                                                                }else{
                                                                        if(collageCommentResults.length){
                                                                            var dataResults         =   collageCommentResults;
                                                                            var comment_arr = [];
                                                                            for (var i = dataResults.length - 1; i >= 0; i--){
                                                                                var dataResultsObj      =  new Object();
                                                                                var commentId_val       =  dataResults[i]["id"];
                                                                                var comment_img_arr = [];
                                                                                for (var j = dataResults.length - 1; j >= 0; j--){
                                                                                    if(dataResults[j]["id"]==commentId_val){
                                                                                        if(dataResults[i]["image"] == null || dataResults[i]["image"] == ""){
                                                                                        }else{
                                                                                             comment_img_arr.push(commentImage_path + dataResults[j]["image"]);
                                                                                        }
                                                                                    }
                                                                                }
                                                                                var profile_image;
                                                                                if(dataResults[i]["profilePic"] == null || dataResults[i]["profilePic"] == ""){
                                                                                     profile_image  = "";
                                                                                }else{
                                                                                    var imageSrc                    =     profilePic_path_assets + dataResults[i]["profilePic"];
                                                                                    var ext                         =     imageSrc.split('/');
                                                                                    ext                             =     ext[ext.length-1].split('.');
                                                                                    profile_image                   =     profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                                                                }
                                                                                dataResultsObj.comment_id                       =   dataResults[i]["id"];
                                                                                dataResultsObj.user_id                          =   dataResults[i]["userId"];
                                                                                dataResultsObj.user_name                        =   dataResults[i]["name"];
                                                                                dataResultsObj.user_profile_pic_url             =   profile_image;
                                                                                dataResultsObj.mention_id                       =   dataResults[i]["mentionId"];
                                                                                dataResultsObj.message                          =   dataResults[i]["comment"];
                                                                                dataResultsObj.comment_created_date_time        =   dataResults[i]["createdAt"];
                                                                                dataResultsObj.comment_img                      =   comment_img_arr;

                                                                                comment_arr.push(dataResultsObj);
                                                                            }
                                                                            comment_arr_Final   =  removeDuplicate(comment_arr, 'comment_id');
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
                                                                                                    if(factor.profilePic == "" || factor.profilePic == null){
                                                                                                        profile_image                   =     "";
                                                                                                    }else{
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
                                                                                                            if(userProfilePic == "" || userProfilePic == null){
                                                                                                                profile_image                   =     "";
                                                                                                            }else{
                                                                                                                var imageSrc                    =     userProfilePic;
                                                                                                                var ext                         =     imageSrc.split('.');
                                                                                                                profile_image                   =     profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                                                                                            }
                                                                                                            total_taggedUser_Array = [{
                                                                                                                        name            :   userName,
                                                                                                                        userId          :   userId,
                                                                                                                        profile_image   :   profile_image,
                                                                                                                        mention_id      :   userMentionId
                                                                                                            }];
                                                                                                    }
                                                                                                    var testImgArray =  imageArray.sort(predicatBy("position"));
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
                                                                                                                                        comments                   : comment_arr_Final,
                                                                                                                                        invite_friends_NUM         : inviteeArray,
                                                                                                                                        testImgArray               : testImgArray,
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
