/**
 * CollageController
 *
 * @description :: Server-side logic for managing collages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

//Require the external modules
var fs                  =       require('fs');

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

//Function to avoid duplicate values for a normal array
function union_arrays (x, y) {
  var obj = {};
  for (var i = x.length-1; i >= 0; -- i)
     obj[x[i]] = x[i];
  for (var i = y.length-1; i >= 0; -- i)
     obj[y[i]] = y[i];
  var res = []
  for (var k in obj) {
    if (obj.hasOwnProperty(k))  // <-- optional
      res.push(obj[k]);
  }
  return res;
}

var collage_unlink_path         =      "assets/images/collage/";
module.exports = {

/* ==================================================================================================================================
               To get Profile Dithers
     ==================================================================================================================================== */
        getProfileDithers:  function (req, res) {

                console.log("get Profile Dithers ===================");
                var tokenCheck                  =     req.options.tokenCheck;
                var server_baseUrl              =     req.options.server_baseUrl;
                var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                var userId                      =     tokenCheck.tokenDetails.userId;
                var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                var collageImg_path             =     server_image_baseUrl + req.options.file_path.collageImg_path;
                var received_userId             =     req.param("user_id");
                var today                       =     new Date().toISOString();
                var received_userName,
                    received_userProfilePic,
                    query;
                console.log("received_userId ------------------------------");
                console.log(received_userId);
                console.log("userId ------------------------------");
                console.log(userId);


                function commonKeyFunction(commonResults){
                        //console.log(recentResults);
                        var dataResults         = commonResults;
                        var key                 = [];
                        var dataResultsKeys     = [];
                        var opinionArray        = [];
                        //var like_position;
                        var imgDetailsArrayOrder,
                            total_opinion;
                        for (var i = dataResults.length - 1; i >= 0; i--){
                            var like_position_Array = [];
                            var like_position;
                            var likeStatus;
                            var dataResultsObj      =  new Object();
                            var collageId_val       =  dataResults[i]["collageId"];
                            if ( dataResultsKeys.indexOf( collageId_val ) == -1 ){
                                var imgDetailsArray = [];
                                for (var j = dataResults.length - 1; j >= 0; j--){
                                    if(dataResults[j]["collageId"]==collageId_val){
                                                if(dataResults[j]["likePosition"] == dataResults[j]["position"]){
                                                    likeStatus = 1;
                                                }else{
                                                    likeStatus = 0;
                                                }
                                                if(dataResults[j]["likeUserId"] == userId && dataResults[j]["userId"] != userId){
                                                    like_position_Array.push(dataResults[j]["likePosition"]);
                                                }
                                                imgDetailsArray.push({
                                                                    image_id        : dataResults[j]["imgId"],
                                                                    position        : dataResults[j]["position"],
                                                                    like_status     : likeStatus,
                                                                    vote            : dataResults[j]["vote"]
                                                                    });
                                    }
                                }
                                if(like_position_Array.length){
                                            like_position = like_position_Array[0];
                                }else{
                                            like_position = 0;
                                }

                                imgDetailsArrayOrder                    =       imgDetailsArray.sort(predicatBy("position"));
                                dataResultsObj.created_date_time        =       dataResults[i]["createdAt"];
                                dataResultsObj.updated_date_time        =       dataResults[i]["updatedAt"];
                                dataResultsObj.dither_like_position     =       like_position;
                                dataResultsObj.collage_id               =       collageId_val;
                                dataResultsObj.collage_image            =       collageImg_path + dataResults[i]["collage_image"];
                                dataResultsObj.totalVote                =       dataResults[i]["totalVote"];
                                dataResultsObj.vote                     =       imgDetailsArrayOrder;
                                key.push(dataResultsObj);
                                dataResultsKeys.push(collageId_val);
                                total_opinion                           =       dataResults[i]["opinionCount"];
                                common_dithers                          =       key;
                            }
                        }
                        return  {
                                total_opinion       :    total_opinion,
                                common_dithers      :    common_dithers,
                                };
                }
                if(!received_userId){
                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please Pass user_id'});
                }else{

                    if(received_userId == userId){
                            console.log("Same Id ----------------------------------------------------");
                            query_recent = "SELECT"+
                                    " temp.*,"+
                                    " clgdt.id AS imgId, clgdt.collageId, clgdt.position, clgdt.vote,"+
                                    " usr.profilePic, usr.name,"+
                                    //" (SELECT SUM(totalVote) FROM collage WHERE userId = '"+userId+"' AND status = 'active')as opinionCount,"+
                                    " clglk.likeStatus, clglk.likePosition, clglk.userId likeUserId"+
                                    " FROM ("+
                                    " SELECT clg.id, clg.userId, clg.image AS collage_image, clg.totalVote, clg.createdAt, clg.updatedAt"+
                                    " FROM collage clg"+
                                    " WHERE clg.userId =  '"+userId+"' AND clg.status = 'active' AND clg.expiryDate > '"+today+"'"+
                                    " ORDER BY clg.createdAt DESC, clg.id DESC"+
                                    " LIMIT 4"+
                                    " ) AS temp"+
                                    " INNER JOIN collageDetails clgdt ON clgdt.collageId = temp.id"+
                                    " INNER JOIN user usr ON usr.id = temp.userId"+
                                    " LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.userId = "+userId+
                                    " WHERE"+
                                    " temp.userId = '"+userId+"'"+
                                    " GROUP BY clgdt.id"+
                                    " ORDER BY temp.createdAt DESC, temp.id DESC";

                            query_popular = "SELECT"+
                                    " temp.*,"+
                                    " clgdt.id AS imgId, clgdt.collageId, clgdt.position, clgdt.vote,"+
                                    " usr.profilePic, usr.name,"+
                                    //" (SELECT SUM(totalVote) FROM collage WHERE userId = '"+userId+"' AND status = 'active')as opinionCount,"+
                                    " clglk.likeStatus, clglk.likePosition, clglk.userId likeUserId"+
                                    " FROM ("+
                                    " SELECT clg.id, clg.userId, clg.image AS collage_image, clg.totalVote, clg.createdAt, clg.updatedAt"+
                                    " FROM collage clg"+
                                    " WHERE clg.userId =  '"+userId+"' AND clg.totalVote != 0 AND clg.status = 'active' AND clg.expiryDate > '"+today+"'"+
                                    " ORDER BY clg.totalVote DESC, clg.id DESC"+
                                    " LIMIT 4"+
                                    " ) AS temp"+
                                    " INNER JOIN collageDetails clgdt ON clgdt.collageId = temp.id"+
                                    " INNER JOIN user usr ON usr.id = temp.userId"+
                                    " LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.userId = "+userId+
                                    " WHERE"+
                                    " temp.userId = '"+userId+"'"+
                                    " GROUP BY clgdt.id"+
                                    " ORDER BY temp.totalVote DESC, temp.createdAt DESC, temp.id DESC";

                    }else{
                            console.log("Not a logged User ----------------------------------------------------");
                            //only tagged logged user and created by received_user
                            query_recent = "SELECT"+
                                    " temp_union.id, clg.imgTitle, clg.image AS collage_image, clg.location, clg.userId, clg.totalVote, clg.createdAt, clg.updatedAt,"+
                                    " clgdt.id AS imgId, clgdt.collageId, clgdt.position, clgdt.vote,"+
                                    " usr.profilePic, usr.name,"+
                                    //" (SELECT SUM(totalVote) FROM collage WHERE userId = '"+received_userId+"' AND status = 'active')as opinionCount,"+
                                    " clglk.likeStatus, clglk.likePosition, clglk.userId likeUserId"+
                                    " FROM ("+
                                    " SELECT temp.id"+
                                    " FROM ("+
                                    " SELECT tg.collageId AS id"+
                                    " FROM tags tg"+
                                    " WHERE tg.userId =  '"+userId+"'"+
                                    " ) AS temp"+
                                    " INNER JOIN collage clg ON temp.id = clg.id"+
                                    " WHERE clg.userId = "+received_userId+" AND clg.status = 'active' AND clg.expiryDate > '"+today+"'"+
                                    " ORDER BY clg.createdAt DESC, clg.id DESC"+
                                    " LIMIT 4"+
                                    " ) AS temp_union"+
                                    " INNER JOIN collage clg ON clg.id = temp_union.id"+
                                    " INNER JOIN collageDetails clgdt ON clgdt.collageId = clg.id"+
                                    " INNER JOIN tags tg ON tg.collageId = clg.id"+
                                    " INNER JOIN user usr ON usr.id = tg.userId"+
                                    " LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.userId = "+userId+
                                    " GROUP BY clgdt.id"+
                                    " ORDER BY clg.createdAt DESC, clg.id DESC";

                            query_popular = "SELECT"+
                                    " temp_union.id, clg.imgTitle, clg.image AS collage_image, clg.location, clg.userId, clg.totalVote, clg.createdAt, clg.updatedAt,"+
                                    " clgdt.id AS imgId, clgdt.collageId, clgdt.position, clgdt.vote,"+
                                    " usr.profilePic, usr.name,"+
                                    //" (SELECT SUM(totalVote) FROM collage WHERE userId = '"+received_userId+"' AND status = 'active')as opinionCount,"+
                                    " clglk.likeStatus, clglk.likePosition, clglk.userId likeUserId"+
                                    " FROM ("+
                                    " SELECT temp.id"+
                                    " FROM ("+
                                    " SELECT tg.collageId AS id"+
                                    " FROM tags tg"+
                                    " WHERE tg.userId =  '"+userId+"'"+
                                    " ) AS temp"+
                                    " INNER JOIN collage clg ON temp.id = clg.id"+
                                    " WHERE clg.totalVote != 0"+
                                    " AND clg.userId = "+received_userId+" AND clg.status = 'active' AND clg.expiryDate > '"+today+"'"+
                                    " ORDER BY clg.totalVote DESC"+
                                    " LIMIT 4"+
                                    " ) AS temp_union"+
                                    " INNER JOIN collage clg ON clg.id = temp_union.id"+
                                    " INNER JOIN collageDetails clgdt ON clgdt.collageId = clg.id"+
                                    " INNER JOIN tags tg ON tg.collageId = clg.id"+
                                    " INNER JOIN user usr ON usr.id = tg.userId"+
                                    " LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.userId = "+userId+
                                    " GROUP BY clgdt.id"+
                                    " ORDER BY clg.totalVote DESC, clg.createdAt DESC, clg.id DESC";

                    }

                    console.log(query_recent);
                    console.log(query_popular);
                    Collage.query(query_recent, function(err, recentResults) {
                            if(err){
                                console.log(err);
                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting recent collages of the user', error_details: err});
                            }else{

                                Collage.query(query_popular, function(err, popularResults) {
                                        if(err){
                                            console.log(err);
                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting popular collages of the user', error_details: err});
                                        }else{
                                            //console.log(recentResults);
                                            if(!recentResults.length && !popularResults.length){
                                                    User.findOne({id: received_userId}).exec(function (err, foundUserDetails){
                                                            if(err){
                                                                console.log(err);
                                                                   return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in finding User Details', error_details: err});
                                                            }else{
                                                                if(!foundUserDetails){
                                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No user details found',
                                                                                            username                : "",
                                                                                            user_profile_image      : "",
                                                                                            total_opinion           : 0,
                                                                                            closed_dither_count     : 0,
                                                                                            recent_dithers          : [],
                                                                                            popular_dithers         : [],
                                                                        });
                                                                }else{
                                                                        var user_profile_image;
                                                                        if(foundUserDetails.profilePic == "" || foundUserDetails.profilePic == null){
                                                                                user_profile_image = "";
                                                                        }else{
                                                                                user_profile_image  = profilePic_path + foundUserDetails.profilePic;
                                                                        }

                                                                        var query = " SELECT COUNT(clg.id) as closedDitherCount,"+
                                                                                    " (SELECT SUM(totalVote) FROM collage WHERE userId = '"+received_userId+"' AND status = 'active')as opinionCount"+
                                                                                    " FROM collage clg"+
                                                                                    " WHERE clg.userId = "+received_userId+" AND clg.expiryDate < '"+today+"'";
                                                                        console.log("closed Dither query ======>>>>");
                                                                        console.log(query);
                                                                        Collage.query(query, function(err, results){
                                                                            if(err){
                                                                                console.log(err);
                                                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting closedDitherCount', error_details: err});
                                                                            }else{
                                                                                    var closedDitherCount, opinionCount;
                                                                                    if(results[0].closedDitherCount == null || results[0].closedDitherCount == '' || results[0].closedDitherCount == 0){
                                                                                        closedDitherCount = 0;
                                                                                    }else{
                                                                                        closedDitherCount  = results[0].closedDitherCount;
                                                                                    }
                                                                                    if(results[0].opinionCount == null || results[0].opinionCount == '' || results[0].opinionCount == 0){
                                                                                        opinionCount = 0;
                                                                                    }else{
                                                                                        opinionCount  = results[0].opinionCount;
                                                                                    }
                                                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage Found by the user',
                                                                                                            username                : foundUserDetails.name,
                                                                                                            user_profile_image      : user_profile_image,
                                                                                                            total_opinion           : opinionCount,
                                                                                                            closed_dither_count     : closedDitherCount,
                                                                                                            recent_dithers          : [],
                                                                                                            popular_dithers         : [],
                                                                                        });
                                                                            }
                                                                        });
                                                                }
                                                            }
                                                    });
                                            }else{
                                                    User.findOne({id: received_userId}).exec(function (err, foundUserDetails){
                                                            if(err){
                                                                   console.log(err);
                                                                   return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in finding fbId', error_details: err});
                                                            }else{
                                                                if(!foundUserDetails){
                                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No user details found',
                                                                                            username                : "",
                                                                                            user_profile_image      : "",
                                                                                            total_opinion           : 0,
                                                                                            closed_dither_count     : 0,
                                                                                            recent_dithers          : [],
                                                                                            popular_dithers         : [],
                                                                        });
                                                                }else{
                                                                        var recent_dithers;
                                                                        var popular_dithers;
                                                                        if(recentResults.length){
                                                                            var recent_DitherResults     =   commonKeyFunction(recentResults);
                                                                            recent_dithers               =  recent_DitherResults.common_dithers.reverse();
                                                                        }else{
                                                                            recent_dithers               =   [];
                                                                        }

                                                                        if(popularResults.length){
                                                                            var popular_DitherResults    =   commonKeyFunction(popularResults);
                                                                            popular_dithers              =  popular_DitherResults.common_dithers;
                                                                            popular_dithers              =  popular_dithers.sort( predicatBy("totalVote") ).reverse();
                                                                        }else{
                                                                            popular_dithers              =   [];
                                                                        }
                                                                        var user_profile_image;
                                                                        if(foundUserDetails.profilePic == "" || foundUserDetails.profilePic == null){
                                                                                    user_profile_image   = "";
                                                                        }else{
                                                                                    user_profile_image   = profilePic_path + foundUserDetails.profilePic;
                                                                        }
                                                                        var query = " SELECT COUNT(clg.id) as closedDitherCount,"+
                                                                                    " (SELECT SUM(totalVote) FROM collage WHERE userId = '"+received_userId+"' AND status = 'active')as opinionCount"+
                                                                                    " FROM collage clg"+
                                                                                    " WHERE clg.userId = "+received_userId+" AND clg.expiryDate < '"+today+"'";
                                                                        console.log("closed Dither query ======>>>>");
                                                                        console.log(query);
                                                                        Collage.query(query, function(err, results){
                                                                            if(err){
                                                                                console.log(err);
                                                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting closedDitherCount', error_details: err});
                                                                            }else{
                                                                                    console.log(query);
                                                                                    console.log(results);
                                                                                    var closedDitherCount, opinionCount;
                                                                                    if(results[0].closedDitherCount == null || results[0].closedDitherCount == '' || results[0].closedDitherCount == 0){
                                                                                        closedDitherCount = 0;
                                                                                    }else{
                                                                                        closedDitherCount  = results[0].closedDitherCount;
                                                                                    }
                                                                                    if(results[0].opinionCount == null || results[0].opinionCount == '' || results[0].opinionCount == 0){
                                                                                        opinionCount = 0;
                                                                                    }else{
                                                                                        opinionCount  = results[0].opinionCount;
                                                                                    }
                                                                                    return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully get the Dithers',
                                                                                                            username                : foundUserDetails.name,
                                                                                                            user_profile_image      : user_profile_image,
                                                                                                            total_opinion           : opinionCount,
                                                                                                            closed_dither_count     : closedDitherCount,
                                                                                                            recent_dithers          : recent_dithers,
                                                                                                            popular_dithers         : popular_dithers,
                                                                                                        });
                                                                             }
                                                                        });
                                                                }
                                                            }
                                                    });
                                            }//Results length check else
                                        }
                                });
                            }
                    });

                }
        },


/* ==================================================================================================================================
               To Edit Dither
     ==================================================================================================================================== */
        editDither:  function (req, res) {
                    console.log("Edit Dithers ===== api");
                    console.log(req.params.all());
                    var smsAccountSid               =      req.options.settingsKeyValue.SMS_ACCOUNT_SID;
                    var smsAuthToken                =      req.options.settingsKeyValue.SMS_AUTH_TOKEN;
                    var smsFrom                     =      req.options.settingsKeyValue.SMS_FROM;
                    var tokenCheck                  =      req.options.tokenCheck;
                    var userId                      =      tokenCheck.tokenDetails.userId;
                    var username                    =      tokenCheck.tokenDetails.name;
                    var collageId                   =      req.param("dither_id");
                    var imgTitle                    =      req.param("dither_desc");
                    var location                    =      req.param("dither_location");
                    //var taggedUsers                 =      req.param("tagged_users");
                    var tagged_fbUser               =      req.param("tagged_fb_user");
                    var tagged_contactUser          =      req.param("tagged_user");
                    //var taggedUserArray               =   tagged_fbUser.concat(tagged_contactUser);
                    var invite_friends_NUM          =      req.param("invite_friends_NUM");

                    if(!imgTitle || !location || !collageId){
                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please Pass dither_location  and dither_desc and dither_id'});
                    }else{

                            var taggedUserArray             =      union_arrays(tagged_fbUser, tagged_contactUser);
                            //wwwww
                            //var must_taggedUserArray                =     [8,90,7];
                            //var must_taggedUserArray                =     [2];
                            //var taggedUserArray_1                   =     union_arrays(tagged_fbUser, tagged_contactUser);
                            //var taggedUserArray                     =     union_arrays(taggedUserArray_1, must_taggedUserArray);
                            //wwwww
                            var taggedUserArrayFinal        =      [];
                            //var inviteFriends               =      JSON.parse(invite_friends_NUM);
                            var inviteFriends               =      invite_friends_NUM;
                            var inviteFriendsArray          =      [];
                            var invitedFriends_NUM_Final;
                            var collage_results             =      "";
                            var tagNotifyArray              =      [];
                            var sms_arr                     =      [];

            async.series([
                    function(callback) {
                                console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^CALL BACK ----1 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                                Collage.findOne({id: collageId}).exec(function (err, foundCollage){
                                        if(err){
                                                    console.log(err);
                                                    callback();
                                        }else{

                                            if(!foundCollage){
                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No dither found by this id'});
                                            }else{
                                                    var criteria    =   {id: foundCollage.id};
                                                    var values      =   {
                                                                            imgTitle           :    imgTitle,
                                                                            location           :    location,
                                                                        };
                                                    Collage.update(criteria, values).exec(function(err, updatedCollage) {
                                                        if(err){
                                                            console.log(err);
                                                            callback();
                                                        }else{
                                                            if(taggedUserArray.length){
                                                                    taggedUserArray.forEach(function(factor, index){
                                                                            var taggedUser_roomName  = "socket_user_"+factor;
                                                                            sails.sockets.broadcast(taggedUser_roomName,{
                                                                                                                    type                       :       "update",
                                                                                                                    id                         :       collageId,
                                                                                                                    user_id                    :       userId,
                                                                                                                    message                    :       "Edit Dither - Room Broadcast - to Tagged Users",
                                                                                                                    roomName                   :       taggedUser_roomName,
                                                                                                                    subscribers                :       sails.sockets.subscribers(taggedUser_roomName),
                                                                                                                    socket                     :       sails.sockets.rooms(),
                                                                                                                    });
                                                                    });
                                                            }
                                                            collage_results = foundCollage;
                                                            callback();
                                                        }
                                                    });
                                            }
                                        }
                                });
                    },
                    function(callback){
                            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^CALL BACK ----2 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                                if(taggedUserArray.length){
                                        var tagCollageArray         = [];
                                        var deleteTagCollageArray   = [];
                                        taggedUserArray.forEach(function(factor, index){
                                            tagCollageArray.push({
                                                                collageId   : collage_results.id,
                                                                userId      : factor
                                                                });
                                        });
                                        //Collage.destroy({id: collageId}).exec(function (err, deleteCollage) {
                                        Tags.destroy({collageId: collage_results.id}).exec(function(err, deleteCollageTags){
                                                if(err){
                                                        console.log(err);
                                                        callback();
                                                }else{
                                                    Tags.create(tagCollageArray).exec(function(err, createdCollageTags){
                                                            if(err){
                                                                    console.log(err);
                                                                    callback();
                                                            }else{
                                                                    //Query to get tagged users from both addressBook and fbFriends
                                                                    query = " SELECT"+
                                                                            " adb.userId, adb.ditherUsername, usr.name"+
                                                                            " FROM addressBook adb"+
                                                                            " INNER JOIN user usr ON usr.id = adb.userId"+
                                                                            " LEFT JOIN tags tg ON tg.userId = usr.id"+
                                                                            " LEFT JOIN collage clg ON clg.id = tg.collageId"+
                                                                            " WHERE"+
                                                                            " tg.collageId = "+collage_results.id+" AND clg.userId = "+userId+
                                                                            " GROUP BY adb.userId"+
                                                                            " UNION"+
                                                                            " SELECT"+
                                                                            " fbf.userId, fbf.ditherUsername, usr.name"+
                                                                            " FROM fbFriends fbf"+
                                                                            " INNER JOIN user usr ON usr.id = fbf.userId"+
                                                                            " LEFT JOIN tags tg ON tg.userId = usr.id"+
                                                                            " LEFT JOIN collage clg ON clg.id = tg.collageId"+
                                                                            " WHERE"+
                                                                            " tg.collageId = "+collage_results.id+" AND clg.userId = "+userId+
                                                                            " GROUP BY fbf.userId";
                                                                    console.log(query);
                                                                    AddressBook.query(query, function(err, taggedUsersFinalResults){
                                                                            if(err){
                                                                                console.log(err);
                                                                                callback();
                                                                            }else{
                                                                                console.log(query);
                                                                                if(taggedUsersFinalResults.length){
                                                                                    taggedUsersFinalResults.forEach(function(factor, index){
                                                                                            taggedUserArrayFinal.push({
                                                                                                                    name        : factor.name,
                                                                                                                    userId      : factor.userId
                                                                                                                    });
                                                                                    });
                                                                                }
                                                                                callback();
                                                                            }

                                                                    });
                                                            }
                                                    });
                                                }
                                        });

                                }else{

                                    //Query to get tagged users from both addressBook and fbFriends
                                    query = " SELECT"+
                                            " adb.userId, adb.ditherUsername, usr.name"+
                                            " FROM addressBook adb"+
                                            " INNER JOIN user usr ON usr.id = adb.userId"+
                                            " LEFT JOIN tags tg ON tg.userId = usr.id"+
                                            " LEFT JOIN collage clg ON clg.id = tg.collageId"+
                                            " WHERE"+
                                            " tg.collageId = "+collage_results.id+" AND clg.userId = "+userId+
                                            " GROUP BY adb.userId"+
                                            " UNION"+
                                            " SELECT"+
                                            " fbf.userId, fbf.ditherUsername, usr.name"+
                                            " FROM addressBook fbf"+
                                            " INNER JOIN user usr ON usr.id = fbf.userId"+
                                            " LEFT JOIN tags tg ON tg.userId = usr.id"+
                                            " LEFT JOIN collage clg ON clg.id = tg.collageId"+
                                            " WHERE"+
                                            " tg.collageId = "+collage_results.id+" AND clg.userId = "+userId+
                                            " GROUP BY fbf.userId";
                                    console.log(query);
                                    AddressBook.query(query, function(err, taggedUsersFinalResults) {
                                            if(err){
                                                console.log(err);
                                                callback();
                                            }else{
                                                if(taggedUsersFinalResults.length){
                                                    taggedUsersFinalResults.forEach(function(factor, index){
                                                            taggedUserArrayFinal.push({
                                                                                    name        : factor.name,
                                                                                    userId      : factor.userId
                                                                                    });
                                                    });
                                                    callback();
                                                }else{
                                                    callback();
                                                }

                                            }
                                    });
                                }
                                //callback();
                    },
                    function(callback){
                        console.log("===============CALLBACK 3=====NOTIFICATION===============================")
                        if(taggedUserArray.length){
                            var ntfyArr = [];
                            taggedUserArray.forEach(function(factor, index){
                                //tagNotifyArray.push({id:factor.user_id});
                                tagNotifyArray.push(factor);
                                var query = "SELECT notificationTypeId,tagged_users FROM notificationLog where collage_id = '"+collageId+"' and notificationTypeId = 1 and FIND_IN_SET("+factor+",tagged_users)";
                                console.log(query)
                                NotificationLog.query(query, function(err, selectNotification){
                                    if(err){
                                        console.log(err)
                                    }else{
                                        if(!selectNotification.length){
                                            ntfyArr.push(factor);
                                        }
                                    }
                                });
                            });
                            if(tagNotifyArray.length){
                                var query = "DELETE FROM notificationLog where collage_id = '"+collageId+"' and notificationTypeId = 1";
                                NotificationLog.query(query, function(err, deleteCommentNtfn){
                                    if(err){
                                        console.log(err)
                                        callback();
                                    }else{
                                        var tagNtfyPush = [];
                                        ntfyArr.forEach(function(factor, index){
                                            //tagNotifyArray.push({id:factor.user_id});
                                            tagNotifyArray.push(factor);
                                            if(factor!=0){
                                                User.findOne({id:factor}).exec(function (err, notifySettings){
                                                    if(err){
                                                       console.log(err)
                                                    }else{
                                                         if(notifySettings){
                                                            if(notifySettings.notifyOpinion){
                                                                tagNtfyPush.push(factor);
                                                            }
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                        var values ={
                                                        notificationTypeId  :   1,
                                                        userId              :   userId,
                                                        collage_id          :   collage_results.id,
                                                        tagged_users        :   tagNotifyArray,
                                                        description         :   tagNotifyArray.length
                                                    }
                                        NotificationLog.create(values).exec(function(err, createdNotificationTags) {
                                            if(err){
                                                console.log(err);
                                                callback();
                                            }else{
                                                    taggedUserArray.forEach(function(factor, index){
                                                            var taggedUser_roomName  = "socket_user_"+factor;
                                                            sails.sockets.broadcast(taggedUser_roomName,{
                                                                                    type                       :       "notification",
                                                                                    id                         :       collageId,
                                                                                    message                    :       "Edit Dither - Room Broadcast - to Tagged Users",
                                                                                    roomName                   :       taggedUser_roomName,
                                                                                    subscribers                :       sails.sockets.subscribers(taggedUser_roomName),
                                                                                    socket                     :       sails.sockets.rooms(),
                                                                                    });
                                                    });
                                                    var deviceId_arr    =   [];
                                                    var message         =   'Notification For Opinion';
                                                    var ntfn_body       =   tokenCheck.tokenDetails.name +" is Asking for Your Opinion";
                                                    User_token.find({userId: tagNtfyPush}).exec(function (err, response){
                                                        if(err){
                                                            console.log(err)
                                                            callback();
                                                        }else{
                                                            response.forEach(function(factor, index){
                                                                if(factor.deviceId!=req.get('device_id')){
                                                                    deviceId_arr.push(factor.deviceId);
                                                                }
                                                            });
                                                            if(deviceId_arr.length){
                                                                var data        = {message:message,device_id:deviceId_arr,NtfnBody:ntfn_body,NtfnType:1,id:collage_results.id,notification_id:createdNotificationTags.id,old_id:''};
                                                                NotificationService.NotificationPush(data, function(err, ntfnSend){
                                                                        if(err){
                                                                            console.log(err)
                                                                            callback();
                                                                        }else{
                                                                            callback();
                                                                        }
                                                                });
                                                            }else{
                                                                console.log("No deviceId")
                                                                callback();
                                                            }
                                                        }
                                                    });
                                            }
                                        });
                                  }
                                });
                            }else{
                                callback();
                            }

                        }else{
                            callback();
                        }
                    },
                    function(callback){
                                console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^CALL BACK ----3 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                                if(inviteFriends.length){
                                    var foundInvitePNFinalArray         =       [];
                                    var unique_push_array               =       [];
                                    var duplicate_push_array            =       [];
                                    var inviteFriends_onlyPNArray       =       [];
                                    var inviteFinalArray                =       [];
                                    Invitation.find({collageId: collage_results.id}).exec(function (err, foundInvitationCollage){
                                            if(err){
                                                      console.log(err);
                                                      callback();
                                            }else{
                                                    var foundInvitePNFinal_Array = [];
                                                    foundInvitationCollage.forEach(function(factor, index){
                                                         foundInvitePNFinal_Array.push(factor.phoneNumber);
                                                    });
                                                    for (var i=0; i<inviteFriends.length; i++){
                                                            index = foundInvitePNFinal_Array.indexOf(inviteFriends[i].phone_number);
                                                            //Removing the Duplicate Values
                                                            if(index == -1){
                                                                    unique_push_array.push({
                                                                                        name            : inviteFriends[i].name,
                                                                                        phone_number    : inviteFriends[i].phone_number
                                                                                    });
                                                            }
                                                            if(index != -1){
                                                                    duplicate_push_array.push({
                                                                                        name            : inviteFriends[i].name,
                                                                                        phone_number    : inviteFriends[i].phone_number
                                                                                        });
                                                            }
                                                    }
                                                    async.series([
                                                            function(callback) {
                                                                            console.log("------------------- SERIES callback--1-----------------");
                                                                            if(unique_push_array.length){
                                                                                    unique_push_array.forEach(function(factor, index){
                                                                                             inviteFinalArray.push({
                                                                                                                userId          : parseInt(userId),
                                                                                                                collageId       : collage_results.id,
                                                                                                                phoneNumber     : factor.phone_number,
                                                                                                                invitee         : factor.name
                                                                                                                });
                                                                                    });
                                                                                    Invitation.create(inviteFinalArray).exec(function(err, createdInvitation) {
                                                                                            if(err)
                                                                                            {
                                                                                                console.log(err);
                                                                                                //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in inserting collage tagged users', error_details: err});
                                                                                            }else{
                                                                                                    callback();
                                                                                            }
                                                                                    });
                                                                            }else{
                                                                                    callback();
                                                                            }
                                                                            //callback();
                                                            },
                                                            function(callback) {
                                                                            console.log("------------------- SERIES callback--2-----------------");
                                                                            if(duplicate_push_array.length){
                                                                                async.forEach(duplicate_push_array, function (factor, callback){
                                                                                        var criteria            =   {
                                                                                                                        collageId       :   collage_results.id,
                                                                                                                        phoneNumber     :   factor.phone_number
                                                                                                                    };
                                                                                        var values              =   {
                                                                                                                        invitee         :   factor.name
                                                                                                                    };

                                                                                        Invitation.update(criteria,values).exec(function(err, updateInvitation) {

                                                                                         });
                                                                                },callback());

                                                                            }else{
                                                                                    callback();
                                                                            }
                                                                            //callback();

                                                            },
                                                            function(callback) {
                                                                            console.log("------------------- SERIES callback--3-----------------");
                                                                            query = " SELECT invt.phoneNumber, invt.invitee"+
                                                                                    " FROM invitation invt"+
                                                                                    " WHERE invt.collageId = "+collageId;
                                                                            Invitation.query(query, function(err, inviteFriend_Results) {
                                                                                    if(err){
                                                                                        console.log(err);
                                                                                        callback();
                                                                                        //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Selecting tagged users from both address book and fb friends'});
                                                                                    }else{
                                                                                        invitedFriends_NUM_Final = inviteFriend_Results;
                                                                                        callback();
                                                                                    }
                                                                            });
                                                                            //callback();

                                                            }
                                                    ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
                                                                        if(err){
                                                                            console.log(err);
                                                                            callback();
                                                                            //return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in Edit Dither', error_details: err}); //If an error occured, we let express/connect handle it by calling the "next" function
                                                                        }else{
                                                                            callback();
                                                                        }
                                                    });
                                            }
                                    });

                                }else{
                                    callback();
                                }
                                //callback();
                    },
                     function(callback){
                                console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^CALL BACK ---SMS TO INVITED FRNDS ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                                if(inviteFriends.length){
                                    inviteFriends.forEach(function(factor, index){
                                        sms_arr.push(factor.phone_number);
                                    });
                                    console.log(sms_arr)
                                    //-----------------sms-send--------------------------------
                                    SmsService.sendSms(smsAccountSid, smsAuthToken, smsFrom,sms_arr,username, function(err,sendSmsResults)  {
                                            if(err){
                                                    console.log("mobile resulttttttttttttt")
                                                    console.log(err);
                                                    callback();
                                            }else{
                                                    sails.log(req.param("mobile"))
                                                    callback();
                                            }
                                        });

                                }
                                else{
                                    callback();
                                }

                    },

            ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
                                if(err){
                                    console.log(err);
                                    return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in Edit Dither', error_details: err}); //If an error occured, we let express/connect handle it by calling the "next" function
                                }else{
                                    //sails.sockets.blast('edit-dither', {status : "success", name : "editDither"});
                                    sails.sockets.blast('edit-dither', {status : 1, status_type: 'Success', message : "editDither Blasted successfully",
                                                                        dither_id:collageId,
                                                                        dither_type:'details'});
                                    return res.json(200, {status: 1, status_type: 'Success', message: 'Succesfully updated the Dither',
                                                          taggedUsers           : taggedUserArrayFinal,
                                                          invite_friends_NUM    : invitedFriends_NUM_Final,
                                                         });
                                }
            });
                    }
        },

/* ==================================================================================================================================
               To Delete Dither
     ==================================================================================================================================== */
        deleteDither:  function (req, res) {

                    console.log("Delete Dithers ===== api");
                    console.log(req.param("dither_id"));
                    var tokenCheck                  =     req.options.tokenCheck;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var collageId                   =      req.param("dither_id");
                    if(!collageId){
                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please Pass dither_id'});
                    }else{
                        //Finding the collage
                        Collage.findOne({id: collageId}).exec(function (err, foundCollage){
                            if(err){
                                        console.log(err);
                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding the Dither', error_details: err});
                            }else{
                                if(!foundCollage){
                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No dither found by this id'});
                                }else{
                                    if(foundCollage.userId != userId){
                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Only creator can delete the collage'});
                                    }else{
                                        //Unlinking collage image
                                        if(foundCollage.image == null || foundCollage.image == ""){
                                        }else{
                                                console.log("Unlinking collage image======");
                                                var resize_collage_image  = foundCollage.image;
                                                var ext                   = resize_collage_image.split('.');
                                                //fs.unlink(collage_unlink_path + ext[0] + "_50x50" + "." +ext[1]);
                                                //fs.unlink(collage_unlink_path + foundCollage.image);
                                        }
                                        //Finding the collageDetails
                                        CollageDetails.find({collageId: collageId}).exec(function (err, foundCollageDetails){
                                            if(err){
                                                        console.log(err);
                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding the Dither Details', error_details: err});
                                            }else{
                                                //Unlinking collageDetail image
                                                foundCollageDetails.forEach(function(factor, index){
                                                        if(factor.image == null || factor.image == ""){
                                                        }else{
                                                            console.log("Unlinking collageDetail image======");
                                                            //fs.unlink(collage_unlink_path + factor.image);
                                                        }
                                                });

                                                //Deleting from collage Table
                                                Collage.destroy({id: collageId}).exec(function (err, deleteCollage) {
                                                    if (err){
                                                            console.log(err);
                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Deleting the Dither', error_details: err});
                                                    }else {
                                                        //Deleting from collage Details Table
                                                        CollageDetails.destroy({collageId: collageId}).exec(function (err, deleteCollageDetails) {
                                                            if (err){
                                                                    console.log(err);
                                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Deleting the Single Dithers', error_details: err});
                                                            }else{
                                                                //Deleting from collage Likes Table
                                                                CollageLikes.destroy({collageId: collageId}).exec(function (err, deleteCollageLikes) {
                                                                    if (err){
                                                                            console.log(err);
                                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Deleting the Dither Votes', error_details: err});
                                                                    }else {
                                                                        //Deleting from collage Comments Table
                                                                        CollageComments.destroy({collageId: collageId}).exec(function (err, deleteCollageComments) {
                                                                            if (err){
                                                                                    console.log(err);
                                                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Deleting the Dither Comments', error_details: err});
                                                                            }else {
                                                                                //Deleting from invitation Table
                                                                                Invitation.destroy({collageId: collageId}).exec(function (err, deleteCollageInvitation) {
                                                                                    if (err){
                                                                                            console.log(err);
                                                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Deleting the Dither Invitation', error_details: err});
                                                                                    }else {
                                                                                        //Deleting from notificationLog Table
                                                                                        NotificationLog.destroy({collage_id: collageId}).exec(function (err, deleteNotificationLog) {
                                                                                            if (err){
                                                                                                    console.log(err);
                                                                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Deleting the Dither NotificationLog', error_details: err});
                                                                                            }else {
                                                                                                    return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully Deleted the dither'});

                                                                                            }
                                                                                        });
                                                                                    }
                                                                                });
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });//Collage Details
                                            }
                                        });
                                    }
                                }
                            }
                        });//Collage
                    }//Passed details check else
        },

        /* ==================================================================================================================================
               To Untag Users
     ==================================================================================================================================== */
        untagUser:  function (req, res) {
                    console.log("untag user==== api");
                     var tokenCheck                  =     req.options.tokenCheck;
                     var userId                      =     tokenCheck.tokenDetails.userId;
                     var untagId                     =     req.param("user_id");
                     var ditherId                    =     req.param("dither_id");

                     console.log("request params")
                     console.log(req.params.all());

                     if(!untagId || !ditherId){
                         console.log("params missing")
                         return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please Pass dither_id and user_id'});
                     }
                     else{

                         User.find({id: untagId}).exec(function (err, getUserId){
                             if(err){
                                 console.log(err)
                                 return res.json(200, {status: 2, status_type: 'Failure' ,message: 'error in find user!'});
                             }
                             else{
                                 if(!getUserId){
                                    return res.json(200, {status: 3, status_type: 'Failure' ,message: 'Not a valid user!'});
                                 }
                                 else{
                                     var query  =   "DELETE FROM tags where collageId='"+ditherId+"' and userId='"+untagId+"'";
                                     Tags.query(query, function(err, deleteTags) {

                                         if(err){
                                             console.log(err)
                                             return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Deletion Failed!'});
                                         }
                                         else{
                                             console.log(deleteTags)
                                             return res.json(200, {status: 1, status_type: 'success' ,message: 'Succesfully untagged!'});
                                         }

                                     });
                                }
                            }
                        });

                     }
        }

};

