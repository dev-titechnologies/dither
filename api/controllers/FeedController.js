/**
 * FeedController
 *
 * @description :: Server-side logic for managing feeds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
var offset_data_view_limit;
var fs          = require('fs');

module.exports = {

    /* ==================================================================================================================================
               To Get Feed
     ==================================================================================================================================== */
    getFeed  :  function (req, res) {
                    console.log("++++++++++++++++ Get Feed Api +++++++++++++++");
                    var tokenCheck                  =     req.options.tokenCheck;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var server_baseUrl              =     req.options.server_baseUrl;
                    var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                    var collageImg_path             =     server_image_baseUrl + req.options.file_path.collageImg_path;
                    var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                    var collageImg_path_assets      =     req.options.file_path.collageImg_path_assets;
                    var profilePic_path_assets      =     req.options.file_path.profilePic_path_assets;
                    var data_view_limit             =     req.options.global.data_view_limit;
                    var dither_expiry_hour          =     req.options.settingsKeyValue.DITHER_EXPIRY_HOUR;
                    var query,
                        offset_data_view_limit;
                    var page_type                   =   req.param("page_type");
                    var focus_dither_id             =   req.param("focus_dither_id");
                    var dither_image                =   '';
                    var today                       =   new Date().toISOString();
                    if(!page_type || !focus_dither_id){
                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please Pass both page_type and focus_dither_id'});
                    }else{
                            switch(page_type){
                                        case 'new' :
                                                    offset_data_view_limit =  "> "+focus_dither_id;
                                        break;

                                        case 'old' :
                                                    offset_data_view_limit =  "< "+focus_dither_id;
                                        break;
                            }
                            var query_offset_data_view_limit;
                            if(focus_dither_id == 0){
                                    query_offset_data_view_limit = "";
                            }else{
                                    query_offset_data_view_limit = " WHERE temp1.id "+offset_data_view_limit;
                            }
                            query  = " SELECT"+
                                            " temp_union.id, clg.imgTitle, clg.image AS collage_image, clg.location, clg.userId, clg.totalVote, clg.createdAt, clg.updatedAt,"+
                                            " clgdt.id AS imgId, clgdt.collageId, clgdt.position, clgdt.vote,"+
                                            " usr.profilePic, usr.name,"+
                                            " clglk.likePosition, clglk.userId likeUserId"+
                                            " FROM ("+
                                            " SELECT temp1.*"+
                                            " FROM ("+
                                            " SELECT clg.id, clg.createdAt"+
                                            " FROM collage clg"+
                                            " WHERE clg.userId = "+userId+" AND clg.expiryDate > '"+today+"' AND clg.status = 'active'"+
                                            " UNION ("+
                                            " SELECT tg.collageId AS id, clg.createdAt"+
                                            " FROM tags tg"+
                                            " INNER JOIN collage clg ON clg.id = tg.collageId"+
                                            " WHERE tg.userId = "+userId+" AND clg.expiryDate > '"+today+"' AND clg.status = 'active'"+
                                            " )"+
                                            " ) AS temp1"+
                                            query_offset_data_view_limit+
                                            " ORDER BY temp1.createdAt DESC, temp1.id DESC"+
                                            " LIMIT "+data_view_limit+
                                            " ) AS temp_union"+
                                            " INNER JOIN collage clg ON clg.id = temp_union.id"+
                                            " INNER JOIN collageDetails clgdt ON clgdt.collageId = clg.id"+
                                            " INNER JOIN user usr ON usr.id = clg.userId"+
                                            " LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.userId = "+userId+
                                            " GROUP BY clgdt.id"+
                                            " ORDER BY clg.createdAt DESC, clgdt.collageId DESC";

                            console.log(query);
                            Collage.query(query, function(err, results){
                                    if(err){
                                            console.log(err);
                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting collages of logged user', error_details: err});
                                    }else{
                                        if(!results.length){
                                                return res.json(200, {status: 1, status_type: 'Success' ,message: 'No collage Found by the user', feeds: []});
                                        }else{
                                                var dataResults         =   results;
                                                var key                 =   [];
                                                var dataResultsKeys     =   [];
                                                var imgDetailsArrayOrder,
                                                    feeds;
                                                for (var i = dataResults.length - 1; i >= 0; i--){
                                                    var like_position_Array = [];
                                                    var like_position;
                                                    var likeStatus;
                                                    var dataResultsObj  =   new Object();
                                                    var collageId_val   =   dataResults[i]["collageId"];

                                                    if ( dataResultsKeys.indexOf( collageId_val ) == -1 ){
                                                        var imagesPositionArray         = [];
                                                        var voteArray                   = [];
                                                        var likeStatusArray             = [];
                                                        var imgIdArray                  = [];
                                                        var imgDetailsArray             = [];
                                                        for(var j = dataResults.length - 1; j >= 0; j--){
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
                                                        var profile_image;
                                                        if(dataResults[i]["profilePic"] == "" || dataResults[i]["profilePic"] == null){
                                                                profile_image    =   "";
                                                        }else{
                                                                profile_image    =   profilePic_path + dataResults[i]["profilePic"];
                                                        }

                                                        imgDetailsArrayOrder                        =       imgDetailsArray.sort(predicatBy("position"));
                                                        dataResultsObj.dither_expiry_hour           =       dither_expiry_hour;
                                                        dataResultsObj.user_name                    =       dataResults[i]["name"];
                                                        dataResultsObj.user_id                      =       dataResults[i]["userId"];
                                                        dataResultsObj.profile_image                =       profile_image;
                                                        dataResultsObj.created_date_time            =       dataResults[i]["createdAt"];
                                                        dataResultsObj.updated_date_time            =       dataResults[i]["updatedAt"];
                                                        dataResultsObj.dither_like_position         =       like_position;
                                                        dataResultsObj.collage_id                   =       collageId_val;
                                                        dataResultsObj.collage_image                =       collageImg_path + dataResults[i]["collage_image"];
                                                        dataResultsObj.vote                         =       imgDetailsArrayOrder;
                                                        dataResultsObj.mainOrder                    =       i;

                                                        key.push(dataResultsObj);
                                                        dataResultsKeys.push(collageId_val);
                                                        feeds                                       =       key.sort( predicatBy("mainOrder") );
                                                    }
                                                }
                                                return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully get the Feeds',
                                                                    feeds: feeds
                                                });
                                        }//results length check
                                    }
                            });
                    }
    }
};
