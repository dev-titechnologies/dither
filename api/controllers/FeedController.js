/**
 * FeedController
 *
 * @description :: Server-side logic for managing feeds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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

                    query = " SELECT clg.id FROM collage clg WHERE clg.userId = "+userId+
                            " UNION"+
                            " SELECT tg.collageId FROM tags tg WHERE tg.userId = "+userId;
                    console.log(query);
                    Collage.query(query, function(err, results) {
                            if(err)
                            {
                                console.log(err);
                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting collages of logged user', error_details: err});
                            }
                            else
                            {
                                if(results.length == 0){
                                        return res.json(200, {status: 1, status_type: 'Success' ,message: 'No collage Found by the user', feeds: []});
                                }else{
                                    //console.log(results.length);
                                    var resultsPushArray = [];
                                    results.forEach(function(factor, index){
                                            resultsPushArray.push(factor.id);
                                    });

                                    query = " SELECT clgdt.id AS imgId, clgdt.collageId, clgdt.position, clgdt.vote, clg.userId, clg.image AS collage_image, clg.createdAt,"+
                                            " usr.profilePic, usr.name,"+
                                            " clglk.likeStatus"+
                                            " FROM collage clg"+
                                            " INNER JOIN collageDetails clgdt ON clgdt.collageId = clg.id"+
                                            " INNER JOIN user usr ON usr.id = clg.userId"+
                                            " LEFT JOIN collageLikes clglk ON clglk.userId = usr.id"+
                                            " WHERE clg.id"+
                                            " IN ("+resultsPushArray+")"+
                                            " ORDER BY clg.createdAt";
                                    console.log(query);
                                    Collage.query(query, function(err, allCollageImgResults) {
                                            if(err)
                                            {
                                                console.log(err);
                                                return res.json(200, {status: 1, status_type: 'Success' ,message: 'Some error occured in grtting Images in collage of logged user', error_details: err});
                                            }
                                            else
                                            {
                                                //console.log(allCollageImgResults);
                                                if(allCollageImgResults.length == 0){
                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage Found by the user', feeds: []});
                                                }else{
                                                    var dataResults = allCollageImgResults;
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
                                                            var imgDetailsArrayOrder = imgDetailsArray.reverse();
                                                            if(dataResults[i]["profilePic"] == null || dataResults[i]["profilePic"] == ""){
                                                                        dataResultsObj.profile_image = "";
                                                            }else{

                                                                        dataResultsObj.profile_image = profilePic_path + dataResults[i]["profilePic"];
                                                            }

                                                            dataResultsObj.user_name=dataResults[i]["name"];
                                                            dataResultsObj.user_id=dataResults[i]["userId"];
                                                            dataResultsObj.date_time=dataResults[i]["createdAt"];
                                                            dataResultsObj.collage_id=collageId_val;
                                                            dataResultsObj.collage_image = collageImg_path + dataResults[i]["collage_image"];
                                                            dataResultsObj.vote = imgDetailsArrayOrder;

                                                            key.push(dataResultsObj);
                                                            dataResultsKeys.push(collageId_val);

                                                            var feeds = key.reverse();

                                                        }
                                                    }
                                                    //console.log(key);
                                                    //console.log(key.reverse());
                                                    //console.log(JSON.stringify(key.reverse()));
                                                    return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully get the Feeds', feeds: feeds});
                                                }//allCollageImgResults length check
                                            }
                                    });
                                }//results length check
                            }
                    });

    }
};

