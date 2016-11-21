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

module.exports = {
    /* ==================================================================================================================================
                 To get popular dithers
     ==================================================================================================================================== */
        getPopularDithers :  function (req, res) {

                    console.log("======================= ------------ Get Popular Dithers  -------------------- ================================================");
                    var tokenCheck                  =     req.options.tokenCheck;
                    var server_baseUrl              =     req.options.server_baseUrl;
                    var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                    var collageImg_path             =     server_image_baseUrl + req.options.file_path.collageImg_path;
                    var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var data_view_limit             =     req.options.global.data_view_limit;
                    var received_userId             =     req.param("user_id");
                    var received_focus_limit_number =     req.param("focus_limit_number");
                    var today                       =     new Date().toISOString();
                    var received_userName,
                        received_userProfilePic,
                        query,
                        offset_data_view_limit,
                        popular_totalVote;
                    if(!received_userId || !received_focus_limit_number){
                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please Pass user_id and focus_limit_number'});
                    }else{
                        if(received_userId == userId){
                                console.log("Same Id ----------------------------------------------------");
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
                                        " AND clg.expiryDate > '"+today+"'"+
                                        " ORDER BY clg.totalVote DESC , clg.createdAt DESC"+
                                        " ) AS temp"+
                                        " LIMIT "+received_focus_limit_number+", "+data_view_limit+
                                        ") AS temp_clg"+
                                        " INNER JOIN collageDetails clgdt ON clgdt.collageId = temp_clg.id"+
                                        " INNER JOIN user usr ON usr.id = temp_clg.userId"+
                                        " LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.userId = "+userId+
                                        " GROUP BY clgdt.id"+
                                        " ORDER BY temp_clg.totalVote, temp_clg.createdAt";
                        }else{
                                console.log("Not a logged User ----------------------------------------------------");
                                //Show tagged logged user and created by received_user
                                query = " SELECT clg.id, clg.imgTitle, clg.image AS collage_image, clg.location, clg.userId, clg.totalVote, clg.createdAt, clg.updatedAt,"+
                                        " clgdt.id AS imgId, clgdt.collageId, clgdt.position, clgdt.vote,"+
                                        " usr.profilePic, usr.name,"+
                                        " clglk.likeStatus, clglk.likePosition , clglk.userId likeUserId"+
                                        " FROM("+
                                        " SELECT temp.*"+
                                        " FROM ("+
                                        " SELECT clg.id FROM collage clg INNER JOIN tags tg ON tg.collageId = clg.id"+
                                        " WHERE"+
                                        " tg.userId =  '"+userId+"' AND clg.userId =  '"+received_userId+"' AND clg.totalVote != 0"+
                                        " AND clg.expiryDate > '"+today+"'"+
                                        " ORDER BY clg.totalVote  DESC, clg.createdAt  DESC"+
                                        " ) AS temp"+
                                        " LIMIT "+received_focus_limit_number+", "+data_view_limit+
                                        " ) AS temp_clg"+
                                        " INNER JOIN collage clg ON clg.id = temp_clg.id"+
                                        " INNER JOIN collageDetails clgdt ON clgdt.collageId = clg.id"+
                                        " INNER JOIN tags tg ON tg.collageId = clg.id"+
                                        " INNER JOIN user usr ON usr.id = tg.userId"+
                                        " LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.userId = "+userId+
                                        " GROUP BY clgdt.id"+
                                        " ORDER BY clg.totalVote, clg.createdAt";

                        }
                        console.log(query);
                        Collage.query(query, function(err, results) {
                            if(err){
                                console.log(err);
                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting dithers with type', error_details: err});
                            }else{
                                if(!results.length){
                                    User.findOne({id: received_userId}).exec(function (err, foundUserDetails){
                                            if (err) {
                                                console.log(err);
                                                   return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in finding fbId', error_details: err});
                                            }else{
                                                        //console.log(foundUserDetails);
                                                        if(!foundUserDetails){
                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage and no user found',
                                                                                username                : "",
                                                                                user_profile_image      : "",
                                                                                popular_dithers         : []
                                                            });
                                                        }else{
                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage Found by the user',
                                                                                username                : foundUserDetails.name,
                                                                                user_profile_image      : profilePic_path + foundUserDetails.profilePic,
                                                                                popular_dithers         : []
                                                            });
                                                        }
                                            }
                                    });
                                }else{
                                    var dataResults         =   results;
                                    var key                 =   [];
                                    var dataResultsKeys     =   [];
                                    var popular_dithers,
                                        imgDetailsArrayOrder;
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
                                            popular_dithers                             =       key.sort( predicatBy("mainOrder") ).reverse();
                                        }
                                    }
                                    User.findOne({id: received_userId}).exec(function (err, foundUserDetails){
                                        if(err){
                                                console.log(err);
                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in finding fbId', error_details: err});
                                        }else{
                                            if(!foundUserDetails){
                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No user details found',
                                                                    username                : "",
                                                                    user_profile_image      : "",
                                                                    popular_dithers         : popular_dithers });

                                            }else{
                                                    var user_profile_image;
                                                    if(foundUserDetails.profilePic == "" || foundUserDetails.profilePic == null){
                                                            user_profile_image = ""
                                                    }else{
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

