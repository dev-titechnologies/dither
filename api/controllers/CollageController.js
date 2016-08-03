/**
 * CollageController
 *
 * @description :: Server-side logic for managing collages
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
               To create Dither (collage)
     ==================================================================================================================================== */

        createDither:  function (req, res) {

                    //console.log(req.body.REQUEST);
                    var server_baseUrl              =     req.options.server_baseUrl;
                    var tokenCheck                  =     req.options.tokenCheck;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var profilePic_path             =     server_baseUrl + req.options.file_path.profilePic_path;
                    var collageImg_path             =     server_baseUrl + req.options.file_path.collageImg_path;
                    var imageUploadDirectoryPath    =     '../../assets/images/collage';
                    var concatUploadImgArray;

                req.file('collage_image').upload({dirname: imageUploadDirectoryPath, maxBytes: 100 * 1000 * 1000},function (err, files) {
                        if (err)
                        {
                            console.log(err);
                            return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in uploading collage image', error_details: err});
                        }
                        else
                        {
                            console.log(files);
                                if(files.length != 0){


                                                            //if(files[0].filename === "image_0"){
                                                                collage_imageName = files[0].fd.split('/');
                                                                collage_imageName = collage_imageName[collage_imageName.length-1];
                                                           // }
                                                            console.log("collage_imageName =--------------------");
                                                            console.log(files);
                                                            console.log(collage_imageName);


                                                            var values = {
                                                                imgTitle        : req.param('img_caption'),
                                                                image           : collage_imageName,
                                                                location        : req.param('location'),
                                                                latitude        : req.param('latitude'),
                                                                longitude       : req.param('longitude'),
                                                                userId          : userId,
                                                            };
                                                        Collage.create(values).exec(function(err, results){
                                                                if(err){
                                                                        console.log(err);
                                                                        callback();
                                                                }
                                                                else{
                                                                            var collageDetailImgArray = [];
                                                                            files.forEach(function(factor, index){
                                                                                 console.log("factor");
                                                                                 console.log(factor);
                                                                                 filename = factor.fd.split('/');
                                                                                 filename = filename[filename.length-1];
                                                                                 console.log(filename);

                                                                                 var switchKey = factor.filename;
                                                                                 var position;
                                                                                 switch(switchKey){
                                                                                        case "image_1.jpg":    position = "image_one";
                                                                                        break;
                                                                                        case "image_2.jpg":    position = "image_two";
                                                                                        break;
                                                                                        case "image_3.jpg":    position = "image_three";
                                                                                        break;
                                                                                        case "image_4.jpg":    position = "image_four";
                                                                                        break;
                                                                                 }
                                                                                 //collageDetailImgArray.push("('"+filename+"','"+position+"',"+results.id+", now(), now())");
                                                                                if(factor.filename != "image_0.jpg"){
                                                                                        collageDetailImgArray.push({image: filename, position: position, collageId: results.id});
                                                                                }
                                                                            });

                                                                            CollageDetails.create(collageDetailImgArray, function(err, createdCollageDetails) {
                                                                                    if(err)
                                                                                    {
                                                                                        console.log(err);
                                                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage Detail creation', error_details: err});
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        var taggedUserArray = [{user_id: 3},{user_id: 6}];
                                                                                        //var taggedUserArray = [];
                                                                                        console.log(taggedUserArray.length);
                                                                                        if(taggedUserArray.length == 0){
                                                                                                    return res.json(200, {status: 1, status_type: 'Success', message: 'Successfully created Collage'});
                                                                                        }else{
                                                                                                console.log(taggedUserArray);
                                                                                                var tagCollageArray = [];
                                                                                                taggedUserArray.forEach(function(factor, index){
                                                                                                     console.log(factor);
                                                                                                     console.log(index);
                                                                                                     tagCollageArray.push("("+results.id+","+factor.user_id+", now(), now())");
                                                                                                });
                                                                                               var query = "INSERT INTO tags"+
                                                                                                            " (collageId, userId, createdAt, updatedAt)"+
                                                                                                            " VALUES"+tagCollageArray;
                                                                                                console.log(query);
                                                                                                Tags.query(query, function(err, createdCollageTags) {
                                                                                                        if(err)
                                                                                                        {
                                                                                                            console.log(err);
                                                                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in inserting collage tagged users', error_details: err});
                                                                                                        }
                                                                                                        else
                                                                                                        {
                                                                                                            console.log(createdCollageTags);
                                                                                                            console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++   -------------------------------------------");
                                                                                                            console.log(results);
                                                                                                            //req.param('Invite_friends_NUM');
                                                                                                            var inviteFriends = [{user_id: 3},{user_id: 6}];
                                                                                                            //var inviteFriends  = [];
                                                                                                            if(inviteFriends.length == 0){
                                                                                                                        return res.json(200, {status: 1, status_type: 'Success', message: 'Successfully created Collage', dither_id: results.id});
                                                                                                            }else{
                                                                                                                    /*var inviteFriendsArray = [];
                                                                                                                    taggedUserArray.forEach(function(factor, index){
                                                                                                                         console.log(factor);
                                                                                                                         console.log(index);

                                                                                                                    });*/



                                                                                                                /*SmsService.sendSms(function(err, sendSmsResults) {
                                                                                                                        if(err)
                                                                                                                        {
                                                                                                                                console.log(err);
                                                                                                                                //return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in Sms Send on signup', error_details: sendSmsResults});
                                                                                                                                //callback();
                                                                                                                                callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Sms Send to invite', error_details: err});
                                                                                                                        }else{
                                                                                                                            consol.log("-----------------");
                                                                                                                                return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully completed the signup'});
                                                                                                                                //callback();
                                                                                                                                //callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Sms Send to invite', error_details: err});
                                                                                                                        }
                                                                                                                });*/
                                                                                                                console.log("-----------------------------------");
                                                                                                                console.log(createdCollageDetails);
                                                                                                                var vote = [];
                                                                                                                createdCollageDetails.forEach(function(factor, index){
                                                                                                                        console.log("factor");
                                                                                                                        console.log(factor);
                                                                                                                        vote.push({image_id: factor.id, position: factor.position, like_status: 0, vote: 0});
                                                                                                                });
                                                                                                                console.log("Predicated -------------------------");
                                                                                                                //console.log(vote.sort( predicatBy("image_id") ));
                                                                                                                sortedVote = vote.sort( predicatBy("image_id") );
                                                                                                                return res.json(200, {status: 1, status_type: 'Success', message: 'Successfully created Collage',
                                                                                                                                      profile_image      :     profilePic_path + tokenCheck.tokenDetails.profilePic,
                                                                                                                                      user_name          :     tokenCheck.tokenDetails.name,
                                                                                                                                      user_id            :     tokenCheck.tokenDetails.userId,
                                                                                                                                      date_time          :     results.createdAt,
                                                                                                                                      collage_id         :     results.id,
                                                                                                                                      collage_image      :     collageImg_path + results.image,
                                                                                                                                      vote               :     sortedVote
                                                                                                                                      });
                                                                                                            }

                                                                                                        }
                                                                                                });
                                                                                        }//tagged user Array length check

                                                                                    }
                                                                            });
                                                                }
                                                        });


                                }
                                else{
                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage Image found to add'});
                                }
                    }

                });

        },

 /* ==================================================================================================================================
               To get Dither (collage)[My dithers]
     ==================================================================================================================================== */
        getDither:  function (req, res) {

                    var tokenCheck                  =     req.options.tokenCheck;
                    var server_baseUrl              =     req.options.server_baseUrl;
                    var collageImg_path             =     server_baseUrl + req.options.file_path.collageImg_path;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var userName                    =     tokenCheck.tokenDetails.name;
                    var userProfilePic              =     server_baseUrl + req.options.file_path.profilePic_path + tokenCheck.tokenDetails.profilePic;
                    var query;
                    console.log("Get Dither My profile  -------------------- ================================================");
                    query = " SELECT clg.id FROM collage clg WHERE clg.userId = "+userId;
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
                                if(results.length == 0){
                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage Found by the user', recent_dithers: [], dithers_with_max_votes: []});
                                }else{
                                        var resultsPushArray = [];
                                        results.forEach(function(factor, index){
                                                console.log("factor");
                                                console.log(factor);
                                                resultsPushArray.push(factor.id);
                                        });
                                        console.log(resultsPushArray);
                                        query = " SELECT clgdt.id AS imgId, clgdt.collageId, clgdt.position, clgdt.vote, clg.userId, clg.image AS collage_image, clg.totalVote, clg.createdAt,"+
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
                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting Images in collage of logged user', error_details: err});
                                                }
                                                else
                                                {

                                                    if(allCollageImgResults.length == 0){
                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage Found by the user', recent_dithers: [], dithers_with_max_votes: []});
                                                    }else{


                                                query = " SELECT"+
                                                        " *"+
                                                        " FROM"+
                                                        " collageLikes clglk"+
                                                        " WHERE"+
                                                        " collageId IN("+resultsPushArray+")";
                                                console.log(query);
                                                Collage.query(query, function(err, allImgLikeResults) {
                                                        if(err)
                                                        {
                                                            console.log(err);
                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting likeStatus of Images in collage', error_details: err});
                                                        }
                                                        else
                                                        {
                                                            console.log("allImgLikeResults +++++++++++++++++++++++++++++++++++++++++");
                                                            console.log(allImgLikeResults);
                                                                var dataResults = allCollageImgResults;
                                                                var key = [];
                                                                var dataResultsKeys = [];
                                                                for (var i = dataResults.length - 1; i >= 0; i--) {
                                                                    var dataResultsObj = new Object();
                                                                    var collageId_val =dataResults[i]["collageId"];
                                                                    if ( dataResultsKeys.indexOf( collageId_val ) == -1 )
                                                                    {
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
                                                                        var imgDetailsArrayOrder        =       imgDetailsArray.reverse();
                                                                        dataResultsObj.date_time        =       dataResults[i]["createdAt"];
                                                                        dataResultsObj.collage_id       =       collageId_val;
                                                                        dataResultsObj.collage_image    =       collageImg_path + dataResults[i]["collage_image"];
                                                                        dataResultsObj.totalVote        =       dataResults[i]["totalVote"];
                                                                        dataResultsObj.vote             =       imgDetailsArrayOrder;

                                                                        key.push(dataResultsObj);
                                                                        dataResultsKeys.push(collageId_val);

                                                                        var recent_dithers              =       key.reverse();
                                                                        var dithers_with_max_votes      =       key.reverse().sort( predicatBy("totalVote") );


                                                                    }
                                                                }

                                                                //console.log(key);
                                                                //console.log(key.reverse());
                                                                console.log(JSON.stringify(key.reverse()));
                                                                return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully get the Dithers',
                                                                                     username: userName,
                                                                                     user_profile_image: userProfilePic,
                                                                                     recent_dithers: recent_dithers,
                                                                                     dithers_with_max_votes: dithers_with_max_votes });
                                                            }
                                                        });


                                                    }//allCollageImgResults length check
                                                }
                                        });

                                }//results length check
                            }
                    });
        },


/* ==================================================================================================================================
               To get Dither (collage)[Other dithers]
     ==================================================================================================================================== */
        getOtherUserDither:  function (req, res) {

                    console.log("get--- Dither");
                    var tokenCheck                  =     req.options.tokenCheck;
                    var server_baseUrl              =     req.options.server_baseUrl;
                    var collageImg_path             =     server_baseUrl + req.options.file_path.collageImg_path;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var other_userId                =     req.param("user_id");
                    var other_userName, other_userProfilePic;
                    var query;
                    console.log("Get Dither Other Profile  -------------------- ================================================");
                    query = " SELECT"+
                            " clg.id, clg.userId"+
                            " FROM"+
                            " collage clg"+
                            " INNER JOIN user usr ON usr.id = clg.userId"+
                            " WHERE"+
                            " usr.status = 'active' AND"+
                            " clg.id IN (SELECT tg.collageId FROM tags tg WHERE tg.userId = "+other_userId+" )";
                    console.log(query);
                    Collage.query(query, function(err, results) {
                            if(err)
                            {
                                console.log(err);
                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting collages of Other user', error_details: err});
                            }
                            else
                            {
                                console.log(results);
                                if(results.length == 0){
                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage Found by the user', recent_dithers: [], dithers_with_max_votes: []});
                                }else{
                                        var resultsPushArray = [];
                                        results.forEach(function(factor, index){
                                                console.log("factor");
                                                console.log(factor);
                                                resultsPushArray.push(factor.id);
                                        });
                                        console.log(resultsPushArray);
                                        query = " SELECT clgdt.id AS imgId, clgdt.collageId, clgdt.position, clgdt.vote, clg.userId, clg.image AS collage_image, clg.totalVote, clg.createdAt,"+
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
                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting Images in collage of other user'});
                                                }
                                                else
                                                {
                                                    if(allCollageImgResults.length == 0){
                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage Found by the user', recent_dithers: [], dithers_with_max_votes: []});
                                                    }else{
                                                            console.log(allCollageImgResults);
                                                            var dataResults = allCollageImgResults;
                                                            var key = [];
                                                            var dataResultsKeys = [];
                                                            for (var i = dataResults.length - 1; i >= 0; i--) {
                                                                var dataResultsObj      =  new Object();
                                                                var collageId_val       =  dataResults[i]["collageId"];
                                                                if ( dataResultsKeys.indexOf( collageId_val ) == -1 )
                                                                {
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
                                                                    other_userName                          =       dataResults[i]["name"];
                                                                    other_userProfilePic                    =       server_baseUrl + req.options.file_path.profilePic_path + dataResults[i]["profilePic"];
                                                                    dataResultsObj.date_time                =       dataResults[i]["createdAt"];
                                                                    dataResultsObj.collage_id               =       collageId_val;
                                                                    dataResultsObj.collage_image            =       collageImg_path + dataResults[i]["collage_image"];
                                                                    dataResultsObj.totalVote                =       dataResults[i]["totalVote"];
                                                                    dataResultsObj.vote                     =       imgDetailsArrayOrder;

                                                                    key.push(dataResultsObj);
                                                                    dataResultsKeys.push(collageId_val);
                                                                    var recent_dithers                      =       key.reverse();
                                                                    var dithers_with_max_votes              =       key.reverse().sort( predicatBy("totalVote") );
                                                                }
                                                            }
                                                            //console.log(key);
                                                            //console.log(key.reverse());
                                                            console.log(JSON.stringify(key.reverse()));
                                                            return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully get the Dithers',
                                                                                    username: other_userName,
                                                                                    user_profile_image: other_userProfilePic,
                                                                                    recent_dithers: recent_dithers,
                                                                                    dithers_with_max_votes: dithers_with_max_votes });

                                                    }//allCollageImgResults length check else
                                                }
                                        });

                               }//Results length check else
                            }
                    });
        },

};

