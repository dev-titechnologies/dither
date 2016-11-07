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
                var received_userName, received_userProfilePic;
                var query;
                console.log("Get Dither Other Profile  -------------------- ================================================");
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
                        var recent_dithers,
                            popular_dithers,
                            imgDetailsArrayOrder,
                            total_opinion;
                        for (var i = dataResults.length - 1; i >= 0; i--) {
                            var like_position_Array = [];
                            var like_position;
                            var likeStatus;
                            var dataResultsObj      =  new Object();
                            var collageId_val       =  dataResults[i]["collageId"];
                            if ( dataResultsKeys.indexOf( collageId_val ) == -1 )
                            {
                                var imgDetailsArray = [];
                                for (var j = dataResults.length - 1; j >= 0; j--)
                                {
                                    if(dataResults[j]["collageId"]==collageId_val){
                                                if(dataResults[j]["likePosition"] == dataResults[j]["position"]){
                                                    console.log("likeStatus if ==============");
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
                                imgDetailsArrayOrder                    =       imgDetailsArray.reverse();
                                received_userName                       =       dataResults[i]["name"];
                                received_userProfilePic                 =       profilePic_path + dataResults[i]["profilePic"];
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
                        //return  [total_opinion, recent_dithers, popular_dithers];
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
                                            " (SELECT SUM(totalVote) FROM collage WHERE userId = '"+userId+"')as opinionCount,"+
                                            " clglk.likeStatus, clglk.likePosition, clglk.userId likeUserId"+
                                            " FROM ("+
                                            " SELECT clg.id, clg.userId, clg.image AS collage_image, clg.totalVote, clg.createdAt, clg.updatedAt"+
                                            " FROM collage clg"+
                                            " WHERE clg.userId =  '"+userId+"'"+
                                            " ORDER BY clg.createdAt DESC"+
                                            " LIMIT 4"+
                                            " ) AS temp"+
                                            " INNER JOIN collageDetails clgdt ON clgdt.collageId = temp.id"+
                                            " INNER JOIN user usr ON usr.id = temp.userId"+
                                            //" LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.likePosition = clgdt.position AND clglk.userId = "+userId+
                                            " LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.userId = "+userId+
                                            " WHERE"+
                                            " temp.userId = '"+userId+"'"+
                                            " GROUP BY clgdt.id"+
                                            " ORDER BY temp.createdAt DESC";

                                    query_popular = "SELECT"+
                                            " temp.*,"+
                                            " clgdt.id AS imgId, clgdt.collageId, clgdt.position, clgdt.vote,"+
                                            " usr.profilePic, usr.name,"+
                                            " (SELECT SUM(totalVote) FROM collage WHERE userId = '"+userId+"')as opinionCount,"+
                                            " clglk.likeStatus, clglk.likePosition, clglk.userId likeUserId"+
                                            " FROM ("+
                                            " SELECT clg.id, clg.userId, clg.image AS collage_image, clg.totalVote, clg.createdAt, clg.updatedAt"+
                                            " FROM collage clg"+
                                            " WHERE clg.userId =  '"+userId+"' AND clg.totalVote != 0"+
                                            " ORDER BY clg.totalVote DESC"+
                                            " LIMIT 4"+
                                            " ) AS temp"+
                                            " INNER JOIN collageDetails clgdt ON clgdt.collageId = temp.id"+
                                            " INNER JOIN user usr ON usr.id = temp.userId"+
                                           // " LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.likePosition = clgdt.position AND clglk.userId = "+userId+
                                            " LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.userId = "+userId+
                                            " WHERE"+
                                            " temp.userId = '"+userId+"'"+
                                            " GROUP BY clgdt.id"+
                                            " ORDER BY temp.totalVote DESC, temp.createdAt DESC";

                            }else{
                                    console.log("Not a logged User ----------------------------------------------------");
                                    //only tagged logged user and created by received_user
                                    query_recent = "SELECT"+
                                            " temp_union.id, clg.imgTitle, clg.image AS collage_image, clg.location, clg.userId, clg.totalVote, clg.createdAt, clg.updatedAt,"+
                                            " clgdt.id AS imgId, clgdt.collageId, clgdt.position, clgdt.vote,"+
                                            " usr.profilePic, usr.name,"+
                                            " (SELECT SUM(totalVote) FROM collage WHERE userId = '"+received_userId+"')as opinionCount,"+
                                            " clglk.likeStatus, clglk.likePosition, clglk.userId likeUserId"+
                                            " FROM ("+
                                            " SELECT temp.id"+
                                            " FROM ("+
                                            //" SELECT clg.id"+
                                            //" FROM collage clg"+
                                            //" WHERE clg.userId =  '"+received_userId+"'"+
                                            //" UNION SELECT tg.collageId AS id"+
                                            " SELECT tg.collageId AS id"+
                                            " FROM tags tg"+
                                            " WHERE tg.userId =  '"+userId+"'"+
                                            " ) AS temp"+
                                            " INNER JOIN collage clg ON temp.id = clg.id"+
                                            " WHERE clg.userId = "+received_userId+
                                            " ORDER BY clg.createdAt DESC"+
                                            " LIMIT 4"+
                                            " ) AS temp_union"+
                                            " INNER JOIN collage clg ON clg.id = temp_union.id"+
                                            " INNER JOIN collageDetails clgdt ON clgdt.collageId = clg.id"+
                                            " INNER JOIN tags tg ON tg.collageId = clg.id"+
                                            " INNER JOIN user usr ON usr.id = tg.userId"+
                                           // " LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.likePosition = clgdt.position AND clglk.userId = "+userId+
                                            " LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.userId = "+userId+
                                            " GROUP BY clgdt.id"+
                                            " ORDER BY clg.createdAt DESC";

                                    query_popular = "SELECT"+
                                            " temp_union.id, clg.imgTitle, clg.image AS collage_image, clg.location, clg.userId, clg.totalVote, clg.createdAt, clg.updatedAt,"+
                                            " clgdt.id AS imgId, clgdt.collageId, clgdt.position, clgdt.vote,"+
                                            " usr.profilePic, usr.name,"+
                                             " (SELECT SUM(totalVote) FROM collage WHERE userId = '"+received_userId+"')as opinionCount,"+
                                            " clglk.likeStatus, clglk.likePosition, clglk.userId likeUserId"+
                                            " FROM ("+
                                            " SELECT temp.id"+
                                            " FROM ("+
                                            //" SELECT clg.id"+
                                            //" FROM collage clg"+
                                           // " WHERE clg.userId =  '"+received_userId+"'"+
                                            //" UNION SELECT tg.collageId AS id"+
                                            " SELECT tg.collageId AS id"+
                                            " FROM tags tg"+
                                            " WHERE tg.userId =  '"+userId+"'"+
                                            " ) AS temp"+
                                            " INNER JOIN collage clg ON temp.id = clg.id"+
                                            " WHERE clg.totalVote != 0"+
                                            " AND clg.userId = "+received_userId+
                                            " ORDER BY clg.totalVote DESC"+
                                            " LIMIT 4"+
                                            " ) AS temp_union"+
                                            " INNER JOIN collage clg ON clg.id = temp_union.id"+
                                            " INNER JOIN collageDetails clgdt ON clgdt.collageId = clg.id"+
                                            " INNER JOIN tags tg ON tg.collageId = clg.id"+
                                            " INNER JOIN user usr ON usr.id = tg.userId"+
                                            //" LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.likePosition = clgdt.position AND clglk.userId = "+userId+
                                            " LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.userId = "+userId+
                                            " GROUP BY clgdt.id"+
                                            " ORDER BY clg.totalVote DESC, clg.createdAt DESC";

                            }

                            console.log(query_recent);
                            console.log(query_popular);
                            Collage.query(query_recent, function(err, recentResults) {
                                    if(err)
                                    {
                                        console.log(err);
                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting recent collages of the user', error_details: err});
                                    }
                                    else
                                    {

                                        Collage.query(query_popular, function(err, popularResults) {
                                                if(err)
                                                {
                                                    console.log(err);
                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting popular collages of the user', error_details: err});
                                                }
                                                else
                                                {
                                                    //console.log(recentResults);
                                                    if(recentResults.length == 0 && popularResults.length == 0){
                                                            User.findOne({id: received_userId}).exec(function (err, foundUserDetails){
                                                                    if (err) {
                                                                        console.log(err);
                                                                           return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in finding fbId', error_details: err});
                                                                    }else{

                                                                        if(!foundUserDetails){
                                                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No user details found',
                                                                                                    username                : "",
                                                                                                    user_profile_image      : "",
                                                                                                    recent_dithers          : [],
                                                                                                    popular_dithers         : []
                                                                                });
                                                                        }else{
                                                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage Found by the user',
                                                                                                    username                : foundUserDetails.name,
                                                                                                    user_profile_image      : profilePic_path + foundUserDetails.profilePic,
                                                                                                    recent_dithers          : [],
                                                                                                    popular_dithers         : []
                                                                                });
                                                                        }
                                                                    }
                                                            });
                                                    }else{

                                                            User.findOne({id: received_userId}).exec(function (err, foundUserDetails){
                                                                    if (err) {
                                                                           console.log(err);
                                                                           return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in finding fbId', error_details: err});
                                                                    }else{

                                                                        if(!foundUserDetails){
                                                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No user details found',
                                                                                                    username                : "",
                                                                                                    user_profile_image      : "",
                                                                                                    recent_dithers          : [],
                                                                                                    popular_dithers         : []
                                                                                });
                                                                        }else{
                                                                                console.log("function abcd()++++++++++++++++++++++++++++++++++++++++");
                                                                                var recent_DitherResults    =   commonKeyFunction(recentResults);
                                                                                var popular_DitherResults   =   commonKeyFunction(popularResults);
                                                                                var user_profile_image = "";
                                                                                if(foundUserDetails.profilePic != "" || foundUserDetails.profilePic != null){
                                                                                            user_profile_image  = profilePic_path + foundUserDetails.profilePic;
                                                                                }
                                                                                recent_dithers          =  recent_DitherResults.common_dithers.reverse();
                                                                                popular_dithers         =  popular_DitherResults.common_dithers;
                                                                                popular_dithers         =  popular_dithers.sort( predicatBy("totalVote") ).reverse();
                                                                                return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully get the Dithers',
                                                                                                        username                : foundUserDetails.name,
                                                                                                        user_profile_image      : user_profile_image,
                                                                                                        total_opinion           : recent_DitherResults.total_opinion,
                                                                                                        recent_dithers          : recent_dithers,
                                                                                                        popular_dithers         : popular_dithers,
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
                    var tokenCheck                  =     req.options.tokenCheck;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    console.log("Edit Dithers ===== api");
                    console.log(req.params.all());
                    console.log(req.param("dither_id"));
                    console.log(req.param("dither_desc"));
                    console.log(req.param("dither_location"));
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
                            var taggedUserArrayFinal        =      [];
                            //var inviteFriends               =      JSON.parse(invite_friends_NUM);
                            var inviteFriends               =      invite_friends_NUM;
                            var inviteFriendsArray          =      [];
                            var invitedFriends_NUM_Final;
                            var collage_results             =      "";
                            var tagNotifyArray              =      [];

            async.series([
                    function(callback) {
                                console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^CALL BACK ----1 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                                Collage.findOne({id: collageId}).exec(function (err, foundCollage){
                                        if(err){
                                                    console.log(err);
                                                    //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding the Dither', error_details: err});
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
                                                        if(err)
                                                        {
                                                            console.log(err);
                                                            //return res.json(200, {status: 2, status_type: 'Failure', message: 'Some error has occured in Updating the Dither'});
                                                            callback();
                                                        }
                                                        else
                                                        {
                                                            console.log("++++++++++++++ -------------- taggedUserArray -------------- +++++++++++++  STARTS");
                                                            console.log(taggedUserArray);
                                                            console.log("++++++++++++++ ---------------- taggedUserArray -------------- +++++++++++++  ENDS");
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
                                                            console.log("Successfully updated =======================");
                                                            console.log(updatedCollage);
                                                            collage_results = foundCollage;
                                                            callback();

                                                        }
                                                    });
                                            }
                                        }
                                });
                    },
                    function(callback) {
                            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^CALL BACK ----2 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                                if(taggedUserArray.length != 0){
                                        console.log(collage_results);
                                        console.log("results.id+++++++++++++++++");
                                        console.log(collage_results.id);

                                        var tagCollageArray         = [];
                                        var deleteTagCollageArray   = [];
                                        taggedUserArray.forEach(function(factor, index){
                                            console.log("Refy tagged User ======>>>>> factor");
                                            console.log(factor);
                                            tagCollageArray.push({collageId: collage_results.id, userId: factor});
                                            //deleteTagCollageArray.push({collageId: collage_results.id});
                                        });
                                        console.log("tagCollageArray }}}}}}}}}}}}}}}}}}}}}}}}");
                                        console.log(tagCollageArray);


                                        //Collage.destroy({id: collageId}).exec(function (err, deleteCollage) {
                                            Tags.destroy({collageId: collage_results.id}).exec(function(err, deleteCollageTags){
                                                    if(err)
                                                    {
                                                        console.log(err);
                                                        console.log("Error in Deleting Collage Tags");
                                                        callback();
                                                    }else{
                                                        Tags.create(tagCollageArray).exec(function(err, createdCollageTags) {
                                                                if(err)
                                                                {
                                                                    console.log(err);
                                                                    console.log("+++++++++++++++++++++++++");
                                                                    callback();
                                                                    //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in inserting collage tagged users', error_details: err});
                                                                }
                                                                else
                                                                {
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
                                                                        AddressBook.query(query, function(err, taggedUsersFinalResults) {
                                                                                if(err)
                                                                                {
                                                                                    console.log(err);
                                                                                    callback();
                                                                                }
                                                                                else
                                                                                {
                                                                                    console.log(query);
                                                                                    console.log(taggedUsersFinalResults);
                                                                                    console.log(taggedUsersFinalResults.length);

                                                                                    if(taggedUsersFinalResults){
                                                                                        taggedUsersFinalResults.forEach(function(factor, index){
                                                                                                console.log("factor ------------))))))))))))))))======================");
                                                                                                console.log(factor);
                                                                                                taggedUserArrayFinal.push({name: factor.name,userId: factor.userId});
                                                                                        });
                                                                                    }
                                                                                    callback();
                                                                                    /*if(taggedUserArray.length){
                                                                                        taggedUserArray.forEach(function(factor, index){
                                                                                                //tagNotifyArray.push({id:factor.user_id});
                                                                                                tagNotifyArray.push(factor.user_id);

                                                                                        });
                                                                                        console.log(tagNotifyArray.length);
                                                                                        console.log(tagNotifyArray);
                                                                                        var query = "SELECT notificationTypeId,tagged_users FROM notificationLog where collage_id = '"+collageId+"' and notificationTypeId = 1";
                                                                                       var query = "DELETE FROM notificationLog where collage_id = '"+collageId+"' and notificationTypeId = 1";
                                                                                       NotificationLog.query(query, function(err, deleteCommentNtfn){
                                                                                           if(err)
                                                                                           {
                                                                                               console.log(err)
                                                                                               callback();
                                                                                           }
                                                                                           else
                                                                                           {
                                                                                               console.log("deleted")
                                                                                               console.log(deleteCommentNtfn)



                                                                                            var values ={
                                                                                                            notificationTypeId  :   1,
                                                                                                            userId              :   userId,
                                                                                                            collage_id          :   collage_results.id,
                                                                                                            tagged_users        :   tagNotifyArray,
                                                                                                            description         :   tagNotifyArray.length
                                                                                                        }
                                                                                            console.log(values);
                                                                                            NotificationLog.create(values).exec(function(err, createdNotificationTags) {
                                                                                                if(err)
                                                                                                {
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

                                                                                                        console.log("Successfully Inserted to---->>. NotificationLog table");
                                                                                                        console.log(createdNotificationTags);
                                                                                                        callback();

                                                                                                }
                                                                                            });
                                                                                           }
                                                                                        });

                                                                                    }else{

                                                                                        callback();

                                                                                    }*/
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
                                            if(err)
                                            {
                                                console.log(err);
                                                callback();
                                            }
                                            else
                                            {
                                                console.log(query);
                                                console.log(taggedUsersFinalResults);
                                                console.log(taggedUsersFinalResults.length);

                                                if(taggedUsersFinalResults != 0){
                                                    taggedUsersFinalResults.forEach(function(factor, index){
                                                            taggedUserArrayFinal.push({name: factor.name,userId: factor.userId});
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
                    function(callback)
                    {
                      console.log("===============CALLBACK 3=====NOTIFICATION===============================")

                      if(taggedUserArray.length){
                            var ntfyArr = [];
                            taggedUserArray.forEach(function(factor, index){
                                //tagNotifyArray.push({id:factor.user_id});
                                tagNotifyArray.push(factor);
                                console.log(tagNotifyArray)
                                var query = "SELECT notificationTypeId,tagged_users FROM notificationLog where collage_id = '"+collageId+"' and notificationTypeId = 1 and FIND_IN_SET("+factor+",tagged_users)";
                                console.log(query)
                                NotificationLog.query(query, function(err, selectNotification){
                                    if(err)
                                    {
                                        console.log(err)
                                    }
                                    else
                                    {
                                        if(!selectNotification.length)
                                        {
                                            ntfyArr.push(factor);
                                        }
                                    }
                                });


                            });



                            console.log(tagNotifyArray);
                            console.log("-------------------Norify Array--------------------")
                            console.log(ntfyArr);
                            if(tagNotifyArray.length)
                            {

                            var query = "DELETE FROM notificationLog where collage_id = '"+collageId+"' and notificationTypeId = 1";
                            NotificationLog.query(query, function(err, deleteCommentNtfn){
                             if(err)
                              {
                                console.log(err)
                                callback();
                              }
                              else
                              {
                                var values ={
                                                notificationTypeId  :   1,
                                                userId              :   userId,
                                                collage_id          :   collage_results.id,
                                                tagged_users        :   tagNotifyArray,
                                                description         :   tagNotifyArray.length
                                            }
                                console.log(values);
                                NotificationLog.create(values).exec(function(err, createdNotificationTags) {
                                    if(err)
                                    {
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

                                            console.log("Successfully Inserted to---->>. NotificationLog table");
                                            console.log(createdNotificationTags);

                                            console.log("====================PUSH NOTIFICATION =======================")
                                            console.log(ntfyArr)
                                            var deviceId_arr    = [];
                                            var message   = 'Notification For Opinion';
                                            var ntfn_body =  tokenCheck.tokenDetails.name +" is Asking for Your Opinion";
                                            User_token.find({userId: ntfyArr}).exec(function (err, response) {
                                                if(err)
                                                {
                                                    console.log(err)
                                                    callback();
                                                }
                                                else
                                                {
                                                    console.log("--------------device idssssssssss--------------------")
                                                    console.log(response)
                                                    response.forEach(function(factor, index){

                                                        if(factor.deviceId!=req.get('device_id'))
                                                        {
                                                            deviceId_arr.push(factor.deviceId);
                                                        }

                                                    });

                                                    if(deviceId_arr.length)
                                                    {

                                                        console.log("=============PUSH NTFN FOR EDIT TAGGING============================")

                                                        var data        = {message:message,device_id:deviceId_arr,NtfnBody:ntfn_body,NtfnType:1,id:collage_results.id,notification_id:createdNotificationTags.id};
                                                        console.log(data)
                                                        NotificationService.NtfnInAPP(data, function(err, ntfnSend) {
                                                                                if(err)
                                                                                {
                                                                                    console.log("Error in Push Notification Sending")
                                                                                    console.log(err)
                                                                                    callback();
                                                                                }
                                                                                else
                                                                                {
                                                                                    console.log("Push notification result")
                                                                                    console.log(ntfnSend)
                                                                                    console.log("Push Notification sended")
                                                                                    callback();

                                                                                }
                                                        });



                                                    }
                                                    else
                                                    {
                                                        console.log("No deviceId")
                                                        callback();
                                                    }
                                                }

                                            });
                                    }
                                });
                              }
                            });
                            }
                            else
                            {
                                callback();
                            }

                        }else{

                            callback();

                        }

                    },
                    function(callback) {
                                console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^CALL BACK ----3 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                                //[5,6,7,8,9,10,11]
                                /*var inviteFriends = [
                                                    {"phone_number": "5", "name":"A"},
                                                    {"phone_number": "6", "name":"B"},
                                                    {"phone_number": "7", "name":"C"},
                                                    {"phone_number": "8", "name":"D"},
                                                    {"phone_number": "9", "name":"E"},
                                                    {"phone_number": "10", "name":"F"},
                                                    {"phone_number": "11", "name":"G"},
                                                    ];*/
                                             //inviteFriends    =   ["5","6","7","8","9","10","11"];
                                if(inviteFriends.length != 0){
                                    //phoneNumber
                                    //userId
                                    console.log(userId);
                                    var foundInvitePNFinalArray         =       [];
                                    var unique_push_array               =       [];
                                    var duplicate_push_array            =       [];
                                    var inviteFriends_onlyPNArray       =       [];
                                    var inviteFinalArray                =       [];
                                    Invitation.find({collageId: collage_results.id}).exec(function (err, foundInvitationCollage){
                                            if(err){
                                                       // console.log(err);
                                                       // return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding the Dither', error_details: err});
                                            }else{
                                                    //var foundInvitationCollage = [1,2,3,4,5,6,7];

                                                    /*console.log("^^^^^^^^^^^^^^^^^^^^ foundInvitationCollage ^^^^^^^^^^^^^^^^^^^^");
                                                    console.log(foundInvitationCollage);
                                                    foundInvitationCollage.forEach(function(factor, index){
                                                             foundInvitePNFinalArray.push(factor.phoneNumber);

                                                    });

                                                    console.log("^^^^^^^^^^^^^^^^foundInvitePNFinalArray^^^^^^^^^^^^^^^^^^^^^^^^^^");
                                                    console.log(foundInvitePNFinalArray);
                                                    console.log("^^^^^^^^^^^^^^^^foundInvitePNFinalArray^^^^^^^^^^^^^^^^^^^^^^^^^^");
                                                    inviteFriends.forEach(function(factor, index){
                                                             inviteFriends_onlyPNArray.push(factor.phoneNumber);
                                                    });*/
                                                  //  console.log(inviteFriends);
                                                    /*var foundInvitation_Collage =[
                                                                                {"phoneNumber": "1", "name":"P"},
                                                                                {"phoneNumber": "2", "name":"Q"},
                                                                                {"phoneNumber": "3", "name":"R"},
                                                                                {"phoneNumber": "4", "name":"S"},
                                                                                {"phoneNumber": "5", "name":"T"},
                                                                                {"phoneNumber": "6", "name":"U"},
                                                                                {"phoneNumber": "7", "name":"V"},
                                                                                ];*/
                                                        //foundInvitationCollage = ["1","2","3","4","5","6","7"];
                                                        var foundInvitePNFinal_Array = [];
                                                        foundInvitationCollage.forEach(function(factor, index){
                                                             console.log("factor----------->>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<");
                                                             console.log(factor);

                                                             foundInvitePNFinal_Array.push(factor.phoneNumber);
                                                        });

                                                        console.log("ONLY NUM ARRAY -------------foundInvitePNFinalArray");
                                                        console.log(foundInvitePNFinal_Array);

                                                    for (var i=0; i<inviteFriends.length; i++) {
                                                            console.log("Loop Started  +++++++++++++++++++++++++++++++");
                                                            console.log(inviteFriends[i]);
                                                            console.log(inviteFriends[i].phone_number);
                                                            console.log("Loop Started  +++++++++++++++++++++++++++++++");
                                                            index = foundInvitePNFinal_Array.indexOf(inviteFriends[i].phone_number);
                                                            console.log("index===========");
                                                            console.log(inviteFriends[i].phone_number+"------------------------------------------>>>>>>>>>>"+index);
                                                            //Removing the Duplicate Values
                                                            if(index == -1){
                                                                    unique_push_array.push({name: inviteFriends[i].name, phone_number : inviteFriends[i].phone_number});
                                                            }
                                                            if(index != -1){
                                                                    duplicate_push_array.push({name: inviteFriends[i].name, phone_number : inviteFriends[i].phone_number});
                                                            }
                                                    }

                                                    console.log("unique push array ++++++++++++++++++++++");
                                                    console.log(unique_push_array);

                                                    console.log("duplicate_push_array ++++++++++++++++++++++");
                                                    console.log(duplicate_push_array);


                                                    async.series([
                                                            function(callback) {
                                                                            console.log("------------------- SERIES callback--1-----------------");
                                                                            if(unique_push_array.length != 0){
                                                                                    unique_push_array.forEach(function(factor, index){
                                                                                             inviteFinalArray.push({userId: parseInt(userId), collageId: collage_results.id, phoneNumber: factor.phone_number, invitee: factor.name});
                                                                                    });
                                                                                    console.log("inviteFinalArray =============");
                                                                                    console.log(inviteFinalArray);
                                                                                    Invitation.create(inviteFinalArray).exec(function(err, createdInvitation) {
                                                                                            if(err)
                                                                                            {
                                                                                                console.log("Invitation error ============>>>>>>>>>>>>>");
                                                                                                console.log(err);
                                                                                                //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in inserting collage tagged users', error_details: err});
                                                                                            }else{
                                                                                                    console.log("Successfully inserted Invitation New Invitation");

                                                                                                    //duplicate_push_array
                                                                                                    //SMS HERE
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
                                                                            if(duplicate_push_array.length != 0){
                                                                                async.forEach(duplicate_push_array, function (factor, callback){
                                                                                        var criteria            =   {
                                                                                                                        collageId       :   collage_results.id,
                                                                                                                        phoneNumber     :   factor.phone_number
                                                                                                                    };
                                                                                        var values              =   {
                                                                                                                        invitee         :   factor.name
                                                                                                                    };

                                                                                        Invitation.update(criteria,values).exec(function(err, updateInvitation) {

                                                                                                console.log("Invite update name");
                                                                                                //console.log(updateInvitation);
                                                                                                //callback();
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
                                                                                    if(err)
                                                                                    {
                                                                                        console.log(err);
                                                                                        callback();
                                                                                        //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Selecting tagged users from both address book and fb friends'});
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        console.log("==========Selected Invited Members --------");
                                                                                        console.log(inviteFriend_Results);
                                                                                        invitedFriends_NUM_Final = inviteFriend_Results;
                                                                                        callback();
                                                                                    }
                                                                            });
                                                                            //callback();

                                                            }
                                                    ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
                                                                        if (err) {
                                                                            console.log(err);
                                                                            callback();
                                                                            //return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in Edit Dither', error_details: err}); //If an error occured, we let express/connect handle it by calling the "next" function
                                                                        }else{
                                                                            console.log("Edit Dither =============>>>>>>>>>>>>>>");
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
            ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
                                if (err) {
                                    console.log(err);
                                    return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in Edit Dither', error_details: err}); //If an error occured, we let express/connect handle it by calling the "next" function
                                }else{
                                    console.log("Edit Dither =============>>>>>>>>>>>>>>");
                                    //sails.sockets.blast('edit-dither', {status : "success", name : "editDither"});
                                    sails.sockets.blast('edit-dither', {status : 1, status_type: 'Success', message : "editDither Blasted successfully",
                                                                        dither_id:collageId,
                                                                        dither_type:'details'});
                                    //console.log(sortedVote);
                                    //console.log(taggedUserArrayFinal);
                                    //console.log(invite_friends_NUM);
                                    console.log("********************taggedUserArrayFinal**********************")
                                    console.log(taggedUserArrayFinal)
                                    return res.json(200, {status: 1, status_type: 'Success', message: 'Succesfully updated the Dither',
                                                          taggedUsers           : taggedUserArrayFinal,
                                                          invite_friends_NUM    : invitedFriends_NUM_Final,
                                                         });
                                    //return res.json(200, {status: 1, status_type: 'Success' , message: 'Successfully added phone contact list to addressBook and fbcontacts to fbFriends', ditherPhoneContact: ditherUserInAddressBook, ditherFBuser: ditherUserInFbFriends});
                                }
            });


                                                                   // return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully updated the Dither'});


                    }
        },

/* ==================================================================================================================================
               To Delete Dither
     ==================================================================================================================================== */
        deleteDither:  function (req, res) {

                    console.log("Delete Dithers ===== api");
                    console.log(req.param("dither_id"));
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
                                                    //Unlinking collage image
                                                    fs.unlink(collage_unlink_path + foundCollage.image);
                                                    //Finding the collageDetails
                                                    CollageDetails.find({collageId: collageId}).exec(function (err, foundCollageDetails){
                                                            if(err){
                                                                        console.log(err);
                                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding the Dither Details', error_details: err});
                                                            }else{
                                                                    //Unlinking collageDetail image
                                                                    foundCollageDetails.forEach(function(factor, index){
                                                                            fs.unlink(collage_unlink_path + factor.image);
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
                            });//Collage

                    }//Passed details check else

        },

};

