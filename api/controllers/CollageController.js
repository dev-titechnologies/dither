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
                    console.log("createDither   Entered ++++++++++++++++++++++++++++++++++++++++++");
                    //console.log(req.body.REQUEST);
                    var server_baseUrl              =     req.options.server_baseUrl;
                    var tokenCheck                  =     req.options.tokenCheck;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var profilePic_path             =     server_baseUrl + req.options.file_path.profilePic_path;
                    var collageImg_path             =     server_baseUrl + req.options.file_path.collageImg_path;
                    var imageUploadDirectoryPath    =     '../../assets/images/collage';
                    var concatUploadImgArray;
                    var request                     =     JSON.parse(req.param("REQUEST"));

                    console.log("request Using Param-----------------------------------------");
                    console.log(request);
                    console.log(request.dither_title);
                    console.log(request.dither_location);

                    /*var request                     =     req.body.REQUEST;
                    console.log("request Using Body-----------------------------------------");
                    console.log(request);
                    console.log(request.dither_title);
                    console.log(request.dither_location);*/



                    console.log(request);
                    console.log("json parse====>>>>");
                    //console.log(JSON.parse(request));

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

                                            //console.log(files);
                                            var collage_imageName = "";
                                            files.forEach(function(factor, index){
                                                         var filename = factor.fd.split('/');
                                                         filename = filename[filename.length-1];
                                                         //console.log(filename);
                                                         //sum = sum + factor.size;

                                                         var filename_without_extension         =   factor.filename.split('.');
                                                         filename_without_extension             =   filename_without_extension[0];
                                                         if(filename_without_extension === "image_0"){
                                                                console.log("filename_without_extension >>>>>>>>>>>>>>>>>>>>>>>");
                                                                console.log(filename_without_extension);
                                                                collage_imageName = factor.fd.split('/');
                                                                console.log(collage_imageName);
                                                                collage_imageName = collage_imageName[collage_imageName.length-1];
                                                         }
                                            });

                                            console.log(request);
                                            var values = {
                                                imgTitle        : request.dither_title,
                                                image           : collage_imageName,
                                                location        : request.dither_location,
                                                latitude        : request.latitude,
                                                longitude       : request.longitude,
                                                userId          : userId,
                                                vote            : 0,
                                            };
                                        console.log("values---------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>");
                                        console.log(values);
                                        Collage.create(values).exec(function(err, results){
                                                if(err){
                                                        console.log(err);
                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage creation', error_details: err});
                                                }
                                                else{
                                                            var sum = 0;
                                                            var collageDetailImgArray = [];
                                                            files.forEach(function(factor, index){
                                                                 //console.log("factor +++++++++++++++++++++++++++++++++++++++++");
                                                                 //console.log(factor);
                                                                 var filename = factor.fd.split('/');
                                                                 filename = filename[filename.length-1];
                                                                 //console.log(filename);
                                                                 //sum = sum + factor.size;

                                                                 var filename_without_extension         =   factor.filename.split('.');
                                                                 //console.log(filename_without_extension);
                                                                 //console.log(filename_without_extension[0]);
                                                                 filename_without_extension             =   filename_without_extension[0];

                                                                 var switchKey = filename_without_extension;
                                                                 var position;
                                                                 switch(switchKey){
                                                                        case "image_1":    position = 1;
                                                                        break;
                                                                        case "image_2":    position = 2;
                                                                        break;
                                                                        case "image_3":    position = 3;
                                                                        break;
                                                                        case "image_4":    position = 4;
                                                                        break;
                                                                 }
                                                                 //collageDetailImgArray.push("('"+filename+"','"+position+"',"+results.id+", now(), now())");
                                                                //if(filename_without_extension != "image_0"){
                                                                        //collageDetailImgArray.push({image: filename, position: position, collageId: results.id, vote: 0});
                                                                //}
                                                                var switchKey = filename_without_extension;
                                                                switch(switchKey){
                                                                        case 'image_0':

                                                                        break;

                                                                        default:
                                                                                collageDetailImgArray.push({image: filename, position: position, collageId: results.id, vote: 0});
                                                                        break;
                                                                }
                                                            });

                                                            CollageDetails.create(collageDetailImgArray).exec(function(err, createdCollageDetails) {
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
                                                                                //console.log(taggedUserArray);
                                                                                var tagCollageArray = [];
                                                                                taggedUserArray.forEach(function(factor, index){

                                                                                     tagCollageArray.push({collageId: results.id, userId: factor.user_id});
                                                                                });

                                                                                Tags.create(tagCollageArray).exec(function(err, createdCollageTags) {

                                                                                        if(err)
                                                                                        {
                                                                                            console.log(err);
                                                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in inserting collage tagged users', error_details: err});
                                                                                        }
                                                                                        else
                                                                                        {
																							//------------Notification Log Insertion-------------------
																							
																							var tagNotifyArray = [];
																							taggedUserArray.forEach(function(factor, index){

																									//tagNotifyArray.push({id:factor.user_id});
																									tagNotifyArray.push(factor.user_id)
																									
																							 });
																							 
																							 console.log(tagNotifyArray.length)
																							 console.log(tagNotifyArray)
																							
																										var values ={
																								
																														notificationTypeId	:	1,
																														userId				:   userId,
																				 										ditherUserId		:	userId,
																														collage_id			:	results.id,
																														tagged_users		:   tagNotifyArray,
																														description			:	tagNotifyArray.length
																													}
																													
																										
																										NotificationLog.create(values).exec(function(err, createdNotificationTags) {

																											if(err)
																											{
																												console.log(err);
																												return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in inserting collage tagged users', error_details: err});
																											}
																											else
																											{
																												console.log(createdNotificationTags)
																											}
																										});
																							
		 
																								//tagNotifyArray.push("(1,"+userId+","+factor.user_id+","+results.id+","+factor.user_id+" ,"'false'","'count'",now(), now())");

																							
																							 
																							
																							
=                                                                                            //console.log(createdCollageTags);
                                                                                            //console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++   -------------------------------------------");
                                                                                            //console.log(results);
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
                                                                                                //console.log("-----------------------------------");
                                                                                                //console.log(createdCollageDetails);
                                                                                                var vote = [];
                                                                                                createdCollageDetails.forEach(function(factor, index){
                                                                                                        //console.log("factor");
                                                                                                        //console.log(factor);
                                                                                                        vote.push({image_id: factor.id, position: factor.position, like_status: 0, vote: 0});
                                                                                                });
                                                                                                //console.log("created in collage Details=====");
                                                                                                //console.log(vote);
                                                                                                console.log("Predicated -------------------------");

                                                                                                //console.log(vote.sort( predicatBy("image_id") ));
                                                                                                sortedVote = vote.sort( predicatBy("position") );
                                                                                                //console.log(results);

                                                                                                //Query to get tagged users from both addressBook and fbFriends
                                                                                                query = " SELECT"+
                                                                                                        " adb.userId, adb.ditherUsername, usr.name"+
                                                                                                        " FROM addressBook adb"+
                                                                                                        " INNER JOIN user usr ON usr.id = adb.userId"+
                                                                                                        " LEFT JOIN collage clg ON clg.userId = usr.id"+
                                                                                                        " LEFT JOIN tags tg ON tg.userId = usr.id"+
                                                                                                        " WHERE"+
                                                                                                        " tg.collageId = "+results.id+" AND clg.userId = "+userId+
                                                                                                        " GROUP BY adb.userId"+
                                                                                                        " UNION"+
                                                                                                        " SELECT"+
                                                                                                        " fbf.userId, fbf.ditherUsername, usr.name"+
                                                                                                        " FROM addressBook fbf"+
                                                                                                        " INNER JOIN user usr ON usr.id = fbf.userId"+
                                                                                                        " LEFT JOIN collage clg ON clg.userId = usr.id"+
                                                                                                        " LEFT JOIN tags tg ON tg.userId = usr.id"+
                                                                                                        " WHERE"+
                                                                                                        " tg.collageId = "+results.id+" AND clg.userId = "+userId+
                                                                                                        " GROUP BY fbf.userId";

                                                                                                AddressBook.query(query, function(err, taggedUsersFinalResults) {
                                                                                                        if(err)
                                                                                                        {
                                                                                                            console.log(err);
                                                                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Selecting tagged users from both address book and fb friends'});
                                                                                                        }
                                                                                                        else
                                                                                                        {

                                                                                                            console.log(query);
                                                                                                            //console.log(taggedUsersFinalResults);
                                                                                                            var taggedUserArrayFinal = [];
                                                                                                            if(taggedUsersFinalResults != 0){
                                                                                                                taggedUsersFinalResults.forEach(function(factor, index){
                                                                                                                        //console.log("factor");
                                                                                                                        //console.log(factor);
                                                                                                                        taggedUserArrayFinal.push({name: factor.name,userId: factor.userId});
                                                                                                                });
                                                                                                            }

                                                                                                                            return res.json(200, {status: 1, status_type: 'Success', message: 'Successfully created Collage',
                                                                                                                                                  profile_image      :     profilePic_path + tokenCheck.tokenDetails.profilePic,
                                                                                                                                                  user_name          :     tokenCheck.tokenDetails.name,
                                                                                                                                                  user_id            :     tokenCheck.tokenDetails.userId,
                                                                                                                                                  created_date_time  :     results.createdAt,
                                                                                                                                                  updated_date_time  :     results.updatedAt,
                                                                                                                                                  collage_id         :     results.id,
                                                                                                                                                  collage_image      :     collageImg_path + results.image,
                                                                                                                                                  location           :     results.location,
                                                                                                                                                  caption            :     results.imgTitle,
                                                                                                                                                  vote               :     sortedVote,
                                                                                                                                                  dither_count       :     sortedVote.length,
                                                                                                                                                  taggedUsers        :     taggedUserArrayFinal
                                                                                                                                                  });
                                                                                                            }
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
               To get Profile Dithers
     ==================================================================================================================================== */
        getProfileDithers:  function (req, res) {

                    console.log("get Profile Dithers ===================");
                    var tokenCheck                  =     req.options.tokenCheck;
                    var server_baseUrl              =     req.options.server_baseUrl;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var collageImg_path             =     server_baseUrl + req.options.file_path.collageImg_path;
                    var received_userId             =     req.param("user_id");
                    var other_userName, other_userProfilePic;
                    var query;
                    console.log("Get Dither Other Profile  -------------------- ================================================");
                    console.log("received_userId ------------------------------");
                    console.log(received_userId);
                    console.log("userId ------------------------------");
                    console.log(userId);
                    if(!received_userId){
                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please Pass user_id'});
                    }else{
                                if(received_userId == userId){
                                        console.log("Same Id ----------------------------------------------------");
                                        query = "SELECT"+
                                                " clgdt.id AS imgId, clgdt.collageId, clgdt.position, clgdt.vote,"+
                                                " clg.userId, clg.image AS collage_image, clg.totalVote, clg.createdAt, clg.updatedAt,"+
                                                " usr.profilePic, usr.name,"+
                                                " clglk.likeStatus, clglk.likePosition"+
                                                " FROM collage clg"+
                                                " INNER JOIN collageDetails clgdt ON clgdt.collageId = clg.id"+
                                                " INNER JOIN user usr ON usr.id = clg.userId"+
                                                " LEFT JOIN collageLikes clglk ON clglk.userId = usr.id"+
                                                " WHERE"+
                                                " usr.id = '"+received_userId+"'"+
                                                " GROUP BY clgdt.id"+
                                                " ORDER BY clg.createdAt DESC";

                                }else{
                                        console.log("Not a logged User ----------------------------------------------------");
                                        query = "SELECT"+
                                                " temp_union.id, clg.imgTitle, clg.image AS collage_image, clg.location, clg.userId, clg.totalVote, clg.createdAt, clg.updatedAt,"+
                                                " clgdt.id AS imgId, clgdt.collageId, clgdt.position, clgdt.vote,"+
                                                " usr.profilePic, usr.name,"+
                                                " clglk.likeStatus"+
                                                " FROM ("+
                                                " SELECT clg.id"+
                                                " FROM collage clg"+
                                                " WHERE clg.userId = '"+received_userId+"'"+
                                                " UNION"+
                                                " SELECT tg.collageId as id"+
                                                " FROM tags tg"+
                                                //" LEFT JOIN collage clg ON clg.id = tg.collageId"+
                                                " WHERE tg.userId = '"+received_userId+"'"+
                                                " ) AS temp_union"+
                                                " INNER JOIN collage clg ON clg.id = temp_union.id"+
                                                " INNER JOIN collageDetails clgdt ON clgdt.collageId = clg.id"+
                                                " INNER JOIN user usr ON usr.id = clg.userId"+
                                                " LEFT JOIN collageLikes clglk ON clglk.userId = usr.id"+
                                                " GROUP BY clgdt.id"+
                                                " ORDER BY clg.createdAt DESC";

                                }

                                console.log(query);
                                Collage.query(query, function(err, results) {
                                        if(err)
                                        {
                                            console.log(err);
                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting collages of the user', error_details: err});
                                        }
                                        else
                                        {
                                            //console.log(results);
                                            if(results.length == 0){
                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage Found by the user', recent_dithers: [], dithers_with_max_votes: []});
                                            }else{

                                                                        //console.log(results);
                                                                        var dataResults         = results;
                                                                        var key                 = [];
                                                                        var dataResultsKeys     = [];
                                                                        var opinionArray        = [];
                                                                        var like_position;
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
                                                                                        if(dataResults[j]["likeStatus"] == null || dataResults[j]["likeStatus"] == "" || dataResults[j]["likeStatus"] == 0){
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
                                                                                        if(dataResults[j]["likePosition"] != null || dataResults[j]["likePosition"] != "" || dataResults[j]["likePosition"] != 0){
                                                                                                like_position = dataResults[j]["likePosition"];
                                                                                        }

                                                                                    }
                                                                                }
                                                                                var imgDetailsArrayOrder = imgDetailsArray.reverse();
                                                                                other_userName                          =       dataResults[i]["name"];
                                                                                other_userProfilePic                    =       server_baseUrl + req.options.file_path.profilePic_path + dataResults[i]["profilePic"];
                                                                                dataResultsObj.created_date_time        =       dataResults[i]["createdAt"];
                                                                                dataResultsObj.updated_date_time        =       dataResults[i]["updatedAt"];
                                                                                dataResultsObj.dither_like_position     =       like_position;
                                                                                dataResultsObj.collage_id               =       collageId_val;
                                                                                dataResultsObj.collage_image            =       collageImg_path + dataResults[i]["collage_image"];
                                                                                dataResultsObj.totalVote                =       dataResults[i]["totalVote"];
                                                                                dataResultsObj.vote                     =       imgDetailsArrayOrder;
                                                                                dataResultsObj.mainOrder                =       i;

                                                                                key.push(dataResultsObj);
                                                                                dataResultsKeys.push(collageId_val);
                                                                                opinionArray.push(dataResults[i]["totalVote"]);
                                                                                var recent_dithers                      =       key;
                                                                                var popular_dithers                     =       key.sort( predicatBy("totalVote") );
                                                                            }
                                                                        }
                                                                        console.log("Opinion ==============");
                                                                        console.log(opinionArray);
                                                                        var total_opinion = 0;
                                                                        opinionArray.forEach(function(factor, index){
                                                                                        console.log(factor);
                                                                                        total_opinion += factor;
                                                                        });
                                                                        console.log(total_opinion);
                                                                        //console.log(key);
                                                                        //console.log(key.reverse());
                                                                        //console.log(JSON.stringify(key.reverse()));
                                                                        var recent_dithers_Array_4      =   [];
                                                                        var popular_dithers_Array_4     =   [];
                                                                        recent_dithers.forEach(function(factor, index){
                                                                                        console.log(factor);
                                                                                        if(index < 4){
                                                                                            recent_dithers_Array_4.push(factor);
                                                                                        }
                                                                        });
                                                                        popular_dithers.forEach(function(factor, index){
                                                                                        console.log(factor);
                                                                                        if(index < 4){
                                                                                            popular_dithers_Array_4.push(factor);
                                                                                        }
                                                                        });

                                                                        recent_dithers_Array_4 = recent_dithers_Array_4.sort( predicatBy("mainOrder") );
                                                                        return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully get the Dithers',
                                                                                                username                : other_userName,
                                                                                                user_profile_image      : other_userProfilePic,
                                                                                                total_opinion           : total_opinion,
                                                                                                recent_dithers          : recent_dithers_Array_4,
                                                                                                popular_dithers         : popular_dithers_Array_4 });
                                            }//Results length check else
                                        }
                                });
                    }
        },

/* ==================================================================================================================================
               To get All Dithers
     ==================================================================================================================================== */
        allTypeDithers:  function (req, res) {

                    console.log("dithers ===== api");
                    var tokenCheck                  =     req.options.tokenCheck;
                    var server_baseUrl              =     req.options.server_baseUrl;
                    var collageImg_path             =     server_baseUrl + req.options.file_path.collageImg_path;
                    var profilePic_path             =     server_baseUrl + req.options.file_path.profilePic_path;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var received_userId             =     req.param("user_id");
                    var received_dither_type        =     req.param("type");
                    var other_userName, other_userProfilePic;
                    var query = "";
                    console.log("Get all Type Dither  -------------------- ================================================");
                    console.log(received_userId);
                    console.log(received_dither_type);
                    if(!received_userId || !received_dither_type){
                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please Pass both user_id and type'});
                    }else{
                                if(received_userId == userId){
                                        console.log("Same Id ----------------------------------------------------");
                                        query = "SELECT"+
                                                " clgdt.id AS imgId, clgdt.collageId, clgdt.position, clgdt.vote,"+
                                                " clg.userId, clg.image AS collage_image, clg.totalVote, clg.createdAt, clg.updatedAt,"+
                                                " usr.profilePic, usr.name,"+
                                                " clglk.likeStatus, clglk.likePosition"+
                                                " FROM collage clg"+
                                                " INNER JOIN collageDetails clgdt ON clgdt.collageId = clg.id"+
                                                " INNER JOIN user usr ON usr.id = clg.userId"+
                                                " LEFT JOIN collageLikes clglk ON clglk.userId = usr.id"+
                                                " WHERE"+
                                                " usr.id = '"+received_userId+"'"+
                                                " GROUP BY clgdt.id"+
                                                " ORDER BY clg.createdAt DESC, clgdt.collageId DESC";


                                }else{
                                        console.log("Not a logged User ----------------------------------------------------");
                                        query = " SELECT temp_union.id, clg.imgTitle, clg.image AS collage_image, clg.location, clg.userId, clg.totalVote, clg.createdAt, clg.updatedAt,"+
                                                " clgdt.id AS imgId, clgdt.collageId, clgdt.position, clgdt.vote,"+
                                                " usr.profilePic, usr.name,"+
                                                " clglk.likeStatus, clglk.likePosition"+
                                                " FROM ("+
                                                " SELECT clg.id"+
                                                " FROM collage clg"+
                                                " WHERE clg.userId = '"+received_userId+"'"+
                                                " UNION"+
                                                " SELECT tg.collageId as id"+
                                                " FROM tags tg"+
                                                " WHERE tg.userId = '"+received_userId+"'"+
                                                " ) AS temp_union"+
                                                " INNER JOIN collage clg ON clg.id = temp_union.id"+
                                                " INNER JOIN collageDetails clgdt ON clgdt.collageId = clg.id"+
                                                " INNER JOIN user usr ON usr.id = clg.userId"+
                                                " LEFT JOIN collageLikes clglk ON clglk.userId = usr.id"+
                                                " GROUP BY clgdt.id"+
                                                " ORDER BY clg.createdAt DESC, clgdt.collageId DESC";

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
                                                    if(results.length == 0){
                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage Found by the user', recent_dithers: [], dithers_with_max_votes: []});
                                                    }else{
                                                            var dataResults = results;
                                                            var key = [];
                                                            var dataResultsKeys = [];
                                                            var like_position;
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
                                                                            if(dataResults[j]["likeStatus"] == null || dataResults[j]["likeStatus"] == "" || dataResults[j]["likeStatus"] == 0){
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
                                                                            if(dataResults[j]["likePosition"] != null || dataResults[j]["likePosition"] != "" || dataResults[j]["likePosition"] != 0){
                                                                                            like_position = dataResults[j]["likePosition"];
                                                                            }

                                                                        }
                                                                    }
                                                                    //console.log(imgDetailsArray);
                                                                    //var imgDetailsArrayOrder                =       imgDetailsArray.reverse();
                                                                    var imgDetailsArrayOrder = imgDetailsArray.sort(predicatBy("position"));


                                                                    other_userName                              =       dataResults[i]["name"];
                                                                    other_userProfilePic                        =       server_baseUrl + req.options.file_path.profilePic_path + dataResults[i]["profilePic"];
                                                                    //dataResultsObj.user_name                    =       dataResults[i]["name"];
                                                                    //dataResultsObj.user_id                      =       dataResults[i]["userId"];
                                                                    dataResultsObj.created_date_time            =       dataResults[i]["createdAt"];
                                                                    dataResultsObj.updated_date_time            =       dataResults[i]["updatedAt"];
                                                                    dataResultsObj.dither_like_position         =       like_position;
                                                                    dataResultsObj.collage_id                   =       collageId_val;
                                                                    dataResultsObj.collage_image                =       collageImg_path + dataResults[i]["collage_image"];
                                                                    dataResultsObj.vote                         =       imgDetailsArrayOrder;
                                                                    dataResultsObj.mainOrder                    =       i;


                                                                    key.push(dataResultsObj);
                                                                    dataResultsKeys.push(collageId_val);
                                                                    //console.log("+++++++++++++++++++++++++++key+++++++++++++++++++++++++++++++++++");
                                                                    //console.log(key.reverse());
                                                                    var recent_dithers                          =       key.sort( predicatBy("mainOrder") );
                                                                    var popular_dithers                         =       key.sort( predicatBy("totalVote") );
                                                                }
                                                            }

                                                            //console.log(key);
                                                            //console.log(key.reverse());
                                                            //console.log(JSON.stringify(key.reverse()));
                                                            if(received_dither_type == "popular"){
                                                                    return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully get the popular Dithers',
                                                                                    username                : other_userName,
                                                                                    user_profile_image      : other_userProfilePic,
                                                                                    popular_dithers         : popular_dithers });

                                                            }else if(received_dither_type == "recent"){

                                                                    return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully get the recent Dithers',
                                                                                    username                : other_userName,
                                                                                    user_profile_image      : other_userProfilePic,
                                                                                    recent_dithers          : recent_dithers,
                                                                                    });
                                                            }
                                                   }//Results length check else
                                                }
                                        });
                    }
        },

/* ==================================================================================================================================
               To get Updated Dithers
     ==================================================================================================================================== */

        getUpdatedDithers:  function (req, res) {

                    console.log("Get Updated Dithers ===== api");
                    //console.log(dither_data);
                    var dither_data = [
                                        {dither_id: 15, dither_local_time: '2016-08-04 18:37:52'},
                                        {dither_id: 16, dither_local_time: '2016-08-04 18:40:50'},
                                        {dither_id: 17, dither_local_time: '2016-08-05 18:41:41'}
                                      ];
                    var push_Request_Array   = [];
                    var push_Result_Array     = [];
                    console.log("dither_data=======================>>>>>>>>>>>>>>");
                    console.log(dither_data);
                    console.log(dither_data.length);
                    var foundCollageArray;
                    dither_data.forEach(function(factor, index){
                            console.log(factor);
                            console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
                            console.log(index);
                            push_Request_Array.push(factor.dither_id);
                            Collage.findOne({id: factor.dither_id, updatedAt: factor.dither_local_time}).exec(function (err, foundCollage){
                                if(err){
                                            console.log(err);
                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding the Dither', error_details: err});
                                }else{

                                            if(foundCollage){
                                                    push_Result_Array.push(foundCollage.id);
                                                    //console.log("factor==================");
                                                    //console.log(factor);
                                                    console.log("foundCollage==================");
                                                    console.log(foundCollage);
                                                    //foundCollageArray = foundCollage;
                                            }

                                            if (index == dither_data.length - 1) {
                                                            console.log("index last array");
                                                            console.log(push_Result_Array);
                                                            console.log("Request   index last array");
                                                            console.log(push_Request_Array);
                                                            completeSend(push_Request_Array, push_Result_Array);
                                                            //foundCollageArray = pushResultArray;
                                            }

                                }
                            });
                    });
                    function completeSend (resultsRequest, results) {

                            var results             = "["+results+"]";
                            var resultsRequest      = "["+resultsRequest+"]";

                            console.log("11111111111111111111111111111"  + resultsRequest);
                            console.log("2222222222222222222222222222"  + results);
                            //return res.send(results, 200);
                    }


        },
/* ==================================================================================================================================
               To Edit Dither
     ==================================================================================================================================== */
        editDither:  function (req, res) {

                    console.log("Edit Dithers ===== api");
                    console.log(req.param("dither_id"));
                    console.log(req.param("dither_desc"));
                    console.log(req.param("dither_location"));
                    var collageId                   =      req.param("dither_id");
                    var imgTitle                    =      req.param("dither_desc");
                    var location                    =      req.param("dither_location");

                    if(!imgTitle || !location || !collageId){
                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please Pass dither_id and dither_desc and dither_location'});
                    }else{
                            Collage.findOne({id: collageId}).exec(function (err, foundCollage){
                                                if(err){
                                                            console.log(err);
                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding the Dither', error_details: err});
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
                                                                    return res.json(200, {status: 2, status_type: 'Failure', message: 'Some error has occured in Updating the Dither'});
                                                                }
                                                                else
                                                                {
                                                                    console.log("Successfully updated =======================");
                                                                    console.log(updatedCollage);
                                                                    return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully updated the Dither'});
                                                                }
                                                            });
                                                    }
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

                    var collageId                   =      req.param("dither_id");

                    if(!collageId){
                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please Pass dither_id'});
                    }else{
                            Collage.findOne({id: collageId}).exec(function (err, foundCollage){
                                        if(err){
                                                    console.log(err);
                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding the Dither', error_details: err});
                                        }else{

                                            if(!foundCollage){
                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No dither found by this id'});
                                            }else{
                                                    //Deleting from collage Table
                                                    Collage.destroy({id: collageId}).exec(function (err, deleteCollage) {
                                                            if (err){
                                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Deleting the Dither', error_details: err});
                                                            }else {
                                                                    //Deleting from collage Details Table
                                                                    CollageDetails.destroy({collageId: collageId}).exec(function (err, deleteCollageDetails) {
                                                                        if (err){
                                                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Deleting the Single Dithers', error_details: err});
                                                                        }else{
                                                                                //Deleting from collage Likes Table
                                                                                CollageLikes.destroy({collageId: collageId}).exec(function (err, deleteCollageLikes) {
                                                                                    if (err){
                                                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Deleting the Dither Votes', error_details: err});
                                                                                    }else {
                                                                                            //Deleting from collage Comments Table
                                                                                            CollageComments.destroy({collageId: collageId}).exec(function (err, deleteCollageComments) {
                                                                                                if (err){
                                                                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Deleting the Dither Comments', error_details: err});
                                                                                                }else {
                                                                                                        //console.log("Deleted Single Dither");
                                                                                                        return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully Deleted the dither'});
                                                                                                }
                                                                                            });
                                                                                    }
                                                                                });
                                                                        }
                                                                    });
                                                            }
                                                    });//Collage Details
                                            }
                                        }
                            });//Collage

                    }//Passed details check else

        },

findallStudents: function(req, res) {
    var id = req.param('id');
    Student.findOne({ stdid: id })
        .then(function(stdData) {
            //If no student found
            if (stdData === undefined)
                return res.json({ notFound: true });
            // Store Class Data
            var classData = Classroom.findOne({ classid: stdData.classroom })
                .then(function(classData) {

                    var new_data = classData;
                    delete new_data.createdAt;
                    delete new_data.updatedAt;
                    return new_data;

                });
            var std_data = Student.find({ classroom: stdData.classroom })
                .then(function(allData) {
                    var new_data = allData;
                    delete new_data.createdAt;
                    delete new_data.updatedAt;
                    return new_data;
                });
            return [classData, std_data];
        })
        .spread(function(classData, stdData) {

            var newJson = {};
            newJson.classname = classData.name;
            newJson.students = stdData;
            return res.json({ notFound: false, data: newJson });
        })
        .fail(function(err) {
            console.log(err);
            res.json({ notFound: true, error: err });
        });

}

};


