/**
 * CollagePopularController
 *
 * @description :: Server-side logic for managing collagepopulars
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
                 To get popular dithers
     ==================================================================================================================================== */
        getPopularDithers :  function (req, res) {

                    console.log("dithers ===== api");
                    var tokenCheck                  =     req.options.tokenCheck;
                    var server_baseUrl              =     req.options.server_baseUrl;
                    var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                    var collageImg_path             =     server_image_baseUrl + req.options.file_path.collageImg_path;
                    var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var data_view_limit             =     req.options.global.data_view_limit;
                    var received_userId             =     req.param("user_id");
                    //var received_dither_type        =     req.param("type");
                    var received_focus_limit_number =     req.param("focus_limit_number");
                    var received_userName,
                        received_userProfilePic,
                        query,
                        offset_data_view_limit,
                        popular_totalVote;

                    console.log("======================= ------------ Get Popular Dithers  -------------------- ================================================");
                    console.log(received_userId);
                    //console.log(received_dither_type);
                    //console.log(req.param("page_type"));
                    console.log(req.param("focus_dither_id"));
                    //var page_type                   =       req.param("page_type");
                    //var focus_dither_id             =       req.param("focus_dither_id");
                    /*focus_dither_id_0_order         =       "";

                            switch(page_type){

                                        case 'new' :
                                                    offset_data_view_limit =  "> "+focus_dither_id;
                                                    //if(focus_dither_id == 0 || received_dither_type == "popular"){
                                                        focus_dither_id_0_order         =   " DESC";
                                                    //}
                                        break;

                                        case 'old' :
                                                    offset_data_view_limit =  "< "+focus_dither_id;
                                                    focus_dither_id_0_order         =   " DESC";
                                        break;
                            }*/

                            console.log("offset_data_view_limit ----------------++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                            console.log(offset_data_view_limit);


                    if(!received_userId || !received_focus_limit_number){
                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please Pass user_id and focus_limit_number'});
                    }else{
                                /*var query_offset_data_view_limit;
                                //check the focus_dither id 0 or not
                                if(focus_dither_id == 0){
                                        query_offset_data_view_limit             =   "";
                                        query_offset_data_view_limit_for_zero    =   " LIMIT "+data_view_limit;

                                }else{
                                        query_offset_data_view_limit             =   " AND clg.id "+offset_data_view_limit;
                                        query_offset_data_view_limit_for_zero     =  "";

                                }
                                //check the dither type (recent or popular)
                                switch(received_dither_type){

                                        case 'recent' :
                                                    query_order_same_user1      =   " ORDER BY clg.createdAt " +focus_dither_id_0_order;
                                                    query_order_same_user2      =   " ORDER BY temp_clg.createdAt DESC";

                                                    query_order_other_user1     =   " ORDER BY clg.createdAt" +focus_dither_id_0_order;
                                                    query_order_other_user2     =   " ORDER BY clg.createdAt DESC";
                                                    popular_totalVote           =   "";


                                        break;

                                        case 'popular' :
                                                    query_order_same_user1      =   " ORDER BY clg.totalVote "+focus_dither_id_0_order+", clg.createdAt "+focus_dither_id_0_order;
                                                    query_order_same_user2      =   " ORDER BY temp_clg.totalVote, temp_clg.createdAt";

                                                    query_order_other_user1     =   " ORDER BY clg.totalVote "+focus_dither_id_0_order+", clg.createdAt "+focus_dither_id_0_order;
                                                    query_order_other_user2     =   " ORDER BY clg.totalVote DESC, clg.createdAt DESC";
                                                    popular_totalVote           =   " AND clg.totalVote != 0";

                                        break;
                                }*/
                                if(received_userId == userId){
                                        console.log("Same Id ----------------------------------------------------");
                                        /*query = "SELECT"+
                                                " clgdt.id AS imgId, clgdt.collageId, clgdt.position, clgdt.vote,"+
                                                " temp_clg.userId, temp_clg.image AS collage_image, temp_clg.totalVote, temp_clg.createdAt, temp_clg.updatedAt,"+
                                                " usr.profilePic, usr.name,"+
                                                " clglk.likeStatus, clglk.likePosition , clglk.userId likeUserId"+
                                                " FROM"+
                                                "("+
                                                " SELECT *"+
                                                " FROM collage clg"+
                                                " WHERE clg.userId = '"+userId+"'"+
                                                popular_totalVote+
                                                query_offset_data_view_limit+
                                                query_order_same_user1+
                                                " LIMIT "+data_view_limit+
                                                ") AS temp_clg"+
                                                " INNER JOIN collageDetails clgdt ON clgdt.collageId = temp_clg.id"+
                                                " INNER JOIN user usr ON usr.id = temp_clg.userId"+
                                                " LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.likePosition = clgdt.position"+
                                                " GROUP BY clgdt.id"+
                                                query_order_same_user2;*/
                                        query = "SELECT"+
                                                " clgdt.id AS imgId, clgdt.collageId, clgdt.position, clgdt.vote,"+
                                                " temp_clg.userId, temp_clg.image AS collage_image, temp_clg.totalVote, temp_clg.createdAt, temp_clg.updatedAt,"+
                                                " usr.profilePic, usr.name,"+
                                                " clglk.likeStatus, clglk.likePosition , clglk.userId likeUserId"+
                                                " FROM"+
                                                " ("+
                                                " SELECT temp.*"+
                                                " FROM ("+
                                                " SELECT *"+
                                                " FROM collage clg"+
                                                " WHERE clg.userId =  '"+userId+"'"+
                                                " AND clg.totalVote !=0"+
                                                " ORDER BY clg.totalVote DESC , clg.createdAt DESC"+
                                                " ) AS temp"+
                                                " LIMIT "+received_focus_limit_number+", "+data_view_limit+
                                                ") AS temp_clg"+
                                                " INNER JOIN collageDetails clgdt ON clgdt.collageId = temp_clg.id"+
                                                " INNER JOIN user usr ON usr.id = temp_clg.userId"+
                                                " LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.likePosition = clgdt.position"+
                                                " GROUP BY clgdt.id"+
                                                " ORDER BY temp_clg.totalVote, temp_clg.createdAt";


                                }else{
                                        console.log("Not a logged User ----------------------------------------------------");
                                        //Show tagged logged user and created by received_user

                                        /*query = " SELECT clg.id, clg.imgTitle, clg.image AS collage_image, clg.location, clg.userId, clg.totalVote, clg.createdAt, clg.updatedAt,"+
                                                " clgdt.id AS imgId, clgdt.collageId, clgdt.position, clgdt.vote,"+
                                                " usr.profilePic, usr.name,"+
                                                " clglk.likeStatus, clglk.likePosition , clglk.userId likeUserId"+
                                                " FROM("+
                                                //" SELECT temp_union.* FROM ("+
                                                //" SELECT clg.id"+
                                                //" FROM collage clg"+
                                                //" WHERE clg.userId = '"+received_userId+"'"+
                                                //" UNION"+
                                                //" SELECT tg.collageId AS id"+
                                                //" FROM tags tg"+
                                                //" WHERE tg.userId = '"+userId+"'"+
                                                //" LIMIT "+data_view_limit+
                                                " SELECT clg.id"+
                                                " FROM collage clg"+
                                                " INNER JOIN tags tg ON tg.collageId = clg.id"+
                                                " WHERE tg.userId =  '"+userId+"'"+
                                                " AND clg.userId =  '"+received_userId+"'"+
                                                popular_totalVote+
                                                query_offset_data_view_limit+
                                                query_order_other_user1+
                                                query_offset_data_view_limit_for_zero+
                                                //" ) AS temp_union"+
                                                //" INNER JOIN collage clg ON clg.id = temp_union.id"+
                                                //popular_totalVote+
                                                //query_offset_data_view_limit+
                                                //query_order_other_user1+
                                                " ) AS temp_clg"+
                                                " INNER JOIN collage clg ON clg.id = temp_clg.id"+
                                                " INNER JOIN collageDetails clgdt ON clgdt.collageId = clg.id"+
                                                " INNER JOIN tags tg ON tg.collageId = clg.id"+
                                                " INNER JOIN user usr ON usr.id = tg.userId"+
                                                " LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.likePosition = clgdt.position"+
                                                //" WHERE clg.userId = '"+received_userId+"' AND tg.userId = '"+userId+"'"+
                                                " GROUP BY clgdt.id"+
                                                query_order_other_user2;*/

                                        query = " SELECT clg.id, clg.imgTitle, clg.image AS collage_image, clg.location, clg.userId, clg.totalVote, clg.createdAt, clg.updatedAt,"+
                                                " clgdt.id AS imgId, clgdt.collageId, clgdt.position, clgdt.vote,"+
                                                " usr.profilePic, usr.name,"+
                                                " clglk.likeStatus, clglk.likePosition , clglk.userId likeUserId"+
                                                " FROM("+
                                                " SELECT temp.*"+
                                                " FROM ("+
                                                " SELECT clg.id FROM collage clg INNER JOIN tags tg ON tg.collageId = clg.id"+
                                                " WHERE"+
                                                " tg.userId =  '"+received_userId+"' AND clg.userId =  '"+userId+"' AND clg.totalVote != 0"+
                                                " ORDER BY clg.totalVote  DESC, clg.createdAt  DESC"+
                                                " ) AS temp"+
                                                " LIMIT "+received_focus_limit_number+", "+data_view_limit+
                                                " ) AS temp_clg"+
                                                " INNER JOIN collage clg ON clg.id = temp_clg.id"+
                                                " INNER JOIN collageDetails clgdt ON clgdt.collageId = clg.id"+
                                                " INNER JOIN tags tg ON tg.collageId = clg.id"+
                                                " INNER JOIN user usr ON usr.id = tg.userId"+
                                                " LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.likePosition = clgdt.position"+
                                                " GROUP BY clgdt.id"+
                                                " ORDER BY clg.totalVote, clg.createdAt";

                                }

                                        console.log(query);
                                        Collage.query(query, function(err, results) {
                                                if(err)
                                                {
                                                    console.log(err);
                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting dithers with type', error_details: err});
                                                }
                                                else
                                                {
                                                    //console.log(results);
                                                    //console.log(results.length);
                                                    if(!results.length){
                                                            User.findOne({id: received_userId}).exec(function (err, foundUserDetails){
                                                                    if (err) {
                                                                        console.log(err);
                                                                           return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in finding fbId', error_details: err});
                                                                    }else{
                                                                                console.log(foundUserDetails);
                                                                                if(!foundUserDetails){
                                                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage and no user found',
                                                                                                        username                : "",
                                                                                                        user_profile_image      : "",
                                                                                                        //recent_dithers          : [],
                                                                                                        popular_dithers         : []
                                                                                    });
                                                                                }else{
                                                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage Found by the user',
                                                                                                        username                : foundUserDetails.name,
                                                                                                        user_profile_image      : profilePic_path + foundUserDetails.profilePic,
                                                                                                        //recent_dithers          : [],
                                                                                                        popular_dithers         : []
                                                                                    });
                                                                                }
                                                                    }
                                                            });

                                                    }else{
                                                            var dataResults         =   results;
                                                            var key                 =   [];
                                                            var dataResultsKeys     =   [];
                                                            //var like_position,
                                                               // likeStatus;
                                                            var recent_dithers,
                                                                popular_dithers,
                                                                imgDetailsArrayOrder;
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

                                                                        if(dataResults[j]["collageId"]==collageId_val)
                                                                        {
                                                                            console.log(dataResults[j]["id"]);
                                                                            console.log("+++++++++++++++++++++++++++++---LIKE VOTE ---+++++++++++++++++++++++++++++");
                                                                            console.log(dataResults[j]["likeStatus"]);
                                                                            if(dataResults[j]["likeStatus"] == null || dataResults[j]["likeStatus"] == "" || dataResults[j]["likeStatus"] == 0){
                                                                                        likeStatus = 0;
                                                                            }else{
                                                                                    likeStatus = 1;
                                                                                    console.log("Inside ----->>>> likePosition not null");
                                                                                    if(dataResults[j]["likeUserId"] == userId && dataResults[j]["userId"] != userId){
                                                                                        console.log("Inside factor like User id check ================ ++++++++++++++");
                                                                                        like_position_Array.push(dataResults[j]["likePosition"]);
                                                                                    }
                                                                            }
                                                                            imgDetailsArray.push({
                                                                                            image_id        : dataResults[j]["imgId"],
                                                                                            position        : dataResults[j]["position"],
                                                                                            like_status     : likeStatus,
                                                                                            vote            : dataResults[j]["vote"]
                                                                                            });
                                                                        }
                                                                    }
                                                                    if(like_position_Array.length != 0){
                                                                                console.log("like_position_Array === >>>  length != 0");
                                                                                like_position = like_position_Array[0];
                                                                    }else{
                                                                                console.log("like_position_Array === >>>  length == 0");
                                                                                like_position = 0;
                                                                    }
                                                                    imgDetailsArrayOrder                        =       imgDetailsArray.sort(predicatBy("position"));
                                                                    received_userName                           =       dataResults[i]["name"];
                                                                    received_userProfilePic                     =       profilePic_path + dataResults[i]["profilePic"];
                                                                    dataResultsObj.created_date_time            =       dataResults[i]["createdAt"];
                                                                    dataResultsObj.updated_date_time            =       dataResults[i]["updatedAt"];
                                                                    dataResultsObj.dither_like_position         =       like_position;
                                                                    dataResultsObj.totalVote                    =       dataResults[i]["totalVote"];
                                                                    dataResultsObj.collage_id                   =       collageId_val;
                                                                    dataResultsObj.collage_image                =       collageImg_path + dataResults[i]["collage_image"];
                                                                    dataResultsObj.vote                         =       imgDetailsArrayOrder;
                                                                    dataResultsObj.mainOrder                    =       i;


                                                                    key.push(dataResultsObj);
                                                                    dataResultsKeys.push(collageId_val);
                                                                    //if(received_dither_type == "popular"){
                                                                    popular_dithers                             =       key.sort( predicatBy("mainOrder") ).reverse();
                                                                    console.log("popular_dithers =====================");
                                                                    //console.log(popular_dithers);
                                                                    //}
                                                                    //recent_dithers                              =       key;
                                                                    //popular_dithers                             =       key;
                                                                }
                                                            }

                                                            User.findOne({id: received_userId}).exec(function (err, foundUserDetails){
                                                                    if (err) {
                                                                            console.log(err);
                                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in finding fbId', error_details: err});
                                                                    }else{
                                                                        if(!foundUserDetails){
                                                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No user details found',
                                                                                                username                : "",
                                                                                                user_profile_image      : "",
                                                                                                popular_dithers         : popular_dithers });

                                                                        }else{
                                                                                var user_profile_image = "";
                                                                                if(foundUserDetails.profilePic != "" || foundUserDetails.profilePic != null){
                                                                                            user_profile_image  = profilePic_path + foundUserDetails.profilePic;
                                                                                }
                                                                                return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully get the popular Dithers',
                                                                                                username                : foundUserDetails.name,
                                                                                                user_profile_image      : profilePic_path + foundUserDetails.profilePic,
                                                                                                popular_dithers         : popular_dithers });
                                                                        }
                                                                    }
                                                            });
                                                   }//Results length check else
                                                }
                                        });
                    }
        },

};

