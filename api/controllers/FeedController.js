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
module.exports = {

    /* ==================================================================================================================================
               To Get Feed
     ==================================================================================================================================== */
    getFeed  :  function (req, res) {
                    var tokenCheck                  =     req.options.tokenCheck;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var server_baseUrl              =     req.options.server_baseUrl;
                    var collageImg_path             =     server_baseUrl + req.options.file_path.collageImg_path;
                    var profilePic_path             =     server_baseUrl + req.options.file_path.profilePic_path;
                    var query;
                    console.log("Get Feed  -------------------- ================================================");

                    console.log(req.param("page_no"));
                    console.log(req.param("page_type"));
                    console.log(req.param("focus_id"));
                    var focus_limit_id;
                    var no_of_data_per_page     =   3;
                    var page_no                 =   req.param("page_no");
                    var page_type               =   req.param("page_type");
                    var focus_id                =   req.param("focus_id");
                    if(page_type == "new"){
                                focus_limit_id = parseInt(focus_id) + parseInt(no_of_data_per_page);
                    }else{
                                focus_limit_id = parseInt(focus_id) - parseInt(no_of_data_per_page);
                    }
                    console.log("focus_limit_id ----------------++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                    console.log(focus_limit_id);

                    query = " SELECT temp_union.id, clg.id, clg.imgTitle, clg.image AS collage_image, clg.location, clg.userId, clg.totalVote, clg.updatedAt,"+
                            " clgdt.id AS imgId, clgdt.collageId, clgdt.position, clgdt.vote,"+
                            " usr.profilePic, usr.name,"+
                            " clglk.likeStatus"+
                            " FROM ("+
                            " SELECT clg.id"+
                            " FROM collage clg"+
                            " WHERE clg.userId ="+userId+
                            " UNION"+
                            " SELECT tg.collageId"+
                            " FROM tags tg"+
                            " WHERE tg.userId = "+userId+
                            " ) AS temp_union"+
                            " INNER JOIN collage clg ON clg.id = temp_union.id"+
                            " INNER JOIN collageDetails clgdt ON clgdt.collageId = clg.id"+
                            " INNER JOIN user usr ON usr.id = clg.userId"+
                            " LEFT JOIN collageLikes clglk ON clglk.userId = usr.id"+
                            " ORDER BY clg.updatedAt DESC";
                    console.log(query);
                    Collage.query(query, function(err, results) {
                            if(err)
                            {
                                console.log(err);
                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting collages of logged user', error_details: err});
                            }
                            else
                            {
                                console.log("results ----------------->>>>>>>>>>>>>>");
                                console.log(results);
                                if(results.length == 0){
                                        return res.json(200, {status: 1, status_type: 'Success' ,message: 'No collage Found by the user', feeds: []});
                                }else{

                                                    var dataResults = results;
                                                    var key = [];
                                                    var dataResultsKeys = [];
                                                    for (var i = dataResults.length - 1; i >= 0; i--) {
                                                        var dataResultsObj = new Object();
                                                        var collageId_val =dataResults[i]["collageId"];
                                                        //console.log(data[i]);
                                                        if ( dataResultsKeys.indexOf( collageId_val ) == -1 )
                                                        {
                                                            var imagesPositionArray =[];
                                                            var voteArray =[];
                                                            var likeStatusArray =[];
                                                            var imgIdArray =[];
                                                            var imgDetailsArray = [];
                                                            for (var j = dataResults.length - 1; j >= 0; j--)
                                                            {
                                                                if(dataResults[j]["collageId"]==collageId_val)
                                                                {
                                                                    var likeStatus;
                                                                    if(dataResults[j]["likeStatus"] == null || dataResults[j]["likeStatus"] == ""){
                                                                            likeStatus = 0;
                                                                    }else{
                                                                            likeStatus = 1;
                                                                    }
                                                                    imgDetailsArray.push({
                                                                                        image_id        : dataResults[j]["imgId"],
                                                                                        position        : dataResults[j]["position"],
                                                                                        like_status     : likeStatus,
                                                                                        vote            : dataResults[j]["vote"]
                                                                                        });
                                                                }
                                                            }
                                                            //var imgDetailsArrayOrder = imgDetailsArray.reverse();
                                                           // var imgDetailsArrayOrder = imgDetailsArray.reverse();
                                                           var imgDetailsArrayOrder = imgDetailsArray.sort(predicatBy("position"));
console.log("imgDetailsArrayOrder ====================================================+++++++++++++++++++++++++++++++++++++++++++++");
console.log(imgDetailsArrayOrder);
                                                            if(dataResults[i]["profilePic"] == null || dataResults[i]["profilePic"] == ""){
                                                                        dataResultsObj.profile_image = "";
                                                            }else{

                                                                        dataResultsObj.profile_image = profilePic_path + dataResults[i]["profilePic"];
                                                            }

                                                            dataResultsObj.user_name=dataResults[i]["name"];
                                                            dataResultsObj.user_id=dataResults[i]["userId"];
                                                            dataResultsObj.date_time=dataResults[i]["updatedAt"];
                                                            dataResultsObj.collage_id=collageId_val;
                                                            dataResultsObj.collage_image = collageImg_path + dataResults[i]["collage_image"];
                                                            dataResultsObj.vote = imgDetailsArrayOrder;

                                                            key.push(dataResultsObj);
                                                            dataResultsKeys.push(collageId_val);

                                                            var feeds = key.reverse();
                                                            //var feeds = key;

                                                        }
                                                    }
                                                    //console.log(key);
                                                    //console.log(key.reverse());
                                                    //console.log(JSON.stringify(key.reverse()));
                                                    return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully get the Feeds',
                                                                        feeds: feeds
                                                    });
                                }//results length check
                            }
                    });

    }
};

