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
                    var query;
                    console.log("Get Feed  -------------------- ================================================");
                    //return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully get the feed'});
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
                                    console.log(results);
                                    console.log(results[0].id);
                                    console.log(results[1].id);
                                    console.log(results[2].id);
                                    console.log(results.length);
                                    var resultsPushArray = [];
                                    results.forEach(function(factor, index){
                                            console.log("factor");
                                            console.log(factor);
                                            resultsPushArray.push(factor.id);
                                    });
                                    console.log(resultsPushArray);

                                    query = " SELECT clgdt.collageId, clgdt.position, clgdt.totalVote, clg.userId, clg.image AS collage_image, clg.createdAt,"+
                                            " usr.profilePic, usr.name"+
                                            " FROM collage clg"+
                                            " INNER JOIN collageDetails clgdt ON clgdt.collageId = clg.id"+
                                            " INNER JOIN user usr ON usr.id = clg.userId"+
                                            " WHERE clg.id"+
                                            " IN ("+resultsPushArray+")"+
                                            " ORDER BY clg.createdAt";
                                    console.log(query);
                                    Collage.query(query, function(err, allCollageImgResults) {
                                            if(err)
                                            {
                                                console.log(err);
                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in grtting Images in collage of logged user', error_details: err});
                                            }
                                            else
                                            {
                                                console.log(allCollageImgResults);
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
                                                        var totalVoteArray =[];
                                                        for (var j = dataResults.length - 1; j >= 0; j--)
                                                        {
                                                            if(dataResults[j]["collageId"]==collageId_val)
                                                            {
                                                                imagesPositionArray.push(dataResults[j]["position"]) ;
                                                                totalVoteArray.push(dataResults[j]["totalVote"]) ;

                                                            }
                                                        }
                                                        //To combine images and vote into single Array (key - value pair)
                                                        var combineImgVoteArray = {};
                                                        for (var k = 0; k < imagesPositionArray.length; k++)
                                                        {
                                                             combineImgVoteArray[imagesPositionArray[k]] = totalVoteArray[k];
                                                        }
                                                        console.log("combine_array ========================================");
                                                        console.log(combineImgVoteArray);
                                                        console.log(imagesPositionArray);
                                                        if(dataResults[i]["profilePic"] == null || dataResults[i]["profilePic"] == ""){
                                                                    dataResultsObj.profile_image="";
                                                        }else{

                                                                    dataResultsObj.profile_image = dataResults[i]["profilePic"];
                                                        }

                                                        dataResultsObj.user_name=dataResults[i]["name"];
                                                        dataResultsObj.user_id=dataResults[i]["userId"];
                                                        dataResultsObj.date_time=dataResults[i]["createdAt"];
                                                        dataResultsObj.collage_id=collageId_val;
                                                        dataResultsObj.collage_image = server_baseUrl+"images/collage/"+dataResults[i]["collage_image"];
                                                        //dataResultsObj.image=imagesArray;
                                                        //dataResultsObj.vote=items2;
                                                        dataResultsObj.vote=combineImgVoteArray;

                                                        key.push(dataResultsObj);
                                                        dataResultsKeys.push(collageId_val);

                                                    }
                                                }
                                                //console.log(key);
                                                //console.log(key.reverse());
                                                console.log(JSON.stringify(key.reverse()));
                                                return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully get the Feeds', recent: key.reverse()});
                                            }
                                    });

                                }
                        });

    }
};

