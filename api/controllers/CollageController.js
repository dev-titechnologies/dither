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
module.exports = {

    /* ==================================================================================================================================
               To create Dither (collage)
     ==================================================================================================================================== */

        createDither:  function (req, res) {
            console.log("createDither   api ++++++++++++++++++++++++++++++++++++++++++");
            console.log(req.param("REQUEST"));
            //console.log(req.param("collage_image"));
            if(!req.param("REQUEST") ){
                    console.log("|||||||||||||||||| Not found");
                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please Pass both REQUEST and collage_image'});
            }else{
                            console.log(req.param("REQUEST"));
                            console.log(JSON.parse(req.param("REQUEST")));

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

                            console.log("json parse====>>>>");
                            //console.log(JSON.parse(request));
                            //Tagged Users ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                            var vote                        =     [];
                            var sortedVote                  =     [];
                            var tagged_fbUser               =   request.tagged_fb_user;
                            var tagged_contactUser          =   request.tagged_user;
                            //var taggedUserArray        =   tagged_fbUser.concat(tagged_contactUser);
                            var taggedUserArray             =   union_arrays(tagged_fbUser, tagged_contactUser);
                            //var taggedUserArray = [];
                            console.log("tagged_fbUser ++++++++++++++++++++");
                            console.log(tagged_fbUser);
                            console.log("tagged_contactUser ++++++++++++++++++++");
                            console.log(tagged_contactUser);

                            var taggedUserArrayFinal        =   [];
                            console.log("taggedUserArray ++++++++++++++++++++");
                            console.log(taggedUserArray);
                            console.log(taggedUserArray.length);
                            //Invite ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                            var inviteFriends               =   request.invite_friends_NUM;
                            console.log("Without  parse inviteFriends =========================");
                            console.log(inviteFriends);
                            inviteFriends                   =   JSON.parse(inviteFriends);
                            var inviteFriendsArray          =   [];
                            console.log(req.param('invite_friends_NUM'));
                            console.log("inviteFriends =========================");
                            console.log(inviteFriends);

                           // var parseJson = JSON.parse(inviteFriends);
                            //console.log("parseJson >>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                            //console.log(parseJson);
                            //var inviteFriends           = inviteFriends.split(',');
                            inviteFriends.forEach(function(factor, index){
                                        console.log("factor  ========>>>>>>>> results");
                                        console.log(factor);
                                        inviteFriendsArray.push(factor.phone_number);
                            });
                            console.log(inviteFriendsArray.length);
                            var inviteFinalArray            =  [];
                            var tagNotifyArray              =  [];

                            var collage_results             =  "";
            async.series([
                    function(callback) {
                                console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^CALL BACK ----1 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
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
                                                                                        createdCollageDetails.forEach(function(factor, index){
                                                                                                //console.log("factor");
                                                                                                //console.log(factor);
                                                                                                vote.push({image_id: factor.id, position: factor.position, like_status: 0, vote: 0});
                                                                                        });
                                                                                        sortedVote                  = vote.sort( predicatBy("position") );

                                                                                        collage_results             = results;
                                                                                        callback();


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
                    function(callback) {
                            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^CALL BACK ----2 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                                if(taggedUserArray.length != 0){
                                        console.log(collage_results);
                                        console.log("results.id+++++++++++++++++");
                                        console.log(collage_results.id);

                                        var tagCollageArray = [];
                                        taggedUserArray.forEach(function(factor, index){
                                            console.log("Refy tagged User ======>>>>> factor");
                                            console.log(factor);
                                            tagCollageArray.push({collageId: collage_results.id, userId: factor});
                                        });
                                        console.log("tagCollageArray }}}}}}}}}}}}}}}}}}}}}}}}");
                                        console.log(tagCollageArray);

                                        Tags.create(tagCollageArray).exec(function(err, createdCollageTags) {
                                                if(err)
                                                {
                                                    console.log(err);
                                                    console.log("+++++++++++++++++++++++++");
                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in inserting collage tagged users', error_details: err});
                                                }
                                                else
                                                {

                                                        //console.log("created in collage Details=====");
                                                        //console.log(vote);
                                                        console.log("Predicated -------------------------");
                                                        console.log("Created Collage Tags -------------------------");
                                                        console.log(createdCollageTags);

                                                        //console.log(vote.sort( predicatBy("image_id") ));

                                                        //console.log(results);
                                                        /*var query_test = " SELECT temp.*"+
                                                                        " FROM ("+
                                                                        " SELECT adb.ditherUserId, adb.ditherUsername, usr.name"+
                                                                        " FROM tags tg"+
                                                                        " INNER JOIN user usr ON usr.id = tg.userId"+
                                                                        " INNER JOIN addressBook adb ON adb.ditherUserId = tg.userId"+
                                                                        " LEFT JOIN collage clg ON clg.id = tg.collageId"+
                                                                        " WHERE tg.collageId = "+collage_results.id+
                                                                        " AND adb.userId = "+userId+
                                                                        " UNION"+
                                                                        " SELECT fbf.ditherUserId, fbf.ditherUsername, usr.name"+
                                                                        " FROM tags tg"+
                                                                        " INNER JOIN user usr ON usr.id = tg.userId"+
                                                                        " INNER JOIN fbFriends fbf ON fbf.ditherUserId = tg.userId"+
                                                                        " LEFT JOIN collage clg ON clg.id = tg.collageId"+
                                                                        " WHERE tg.collageId = "+collage_results.id+
                                                                        " AND fbf.userId = "+userId+
                                                                        " ) AS temp"+
                                                                        " GROUP BY temp.ditherUserId";

                                                        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ query_test ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                                                        console.log(query_test);
                                                        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ query_test ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                                                        */
                                                        //Query to get tagged users from both addressBook and fbFriends
                                                        /*query = " SELECT"+
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
                                                               // " LEFT JOIN collage clg ON clg.userId = usr.id"+
                                                                " LEFT JOIN tags tg ON tg.userId = usr.id"+
                                                                " LEFT JOIN collage clg ON clg.id = tg.collageId"+
                                                                " WHERE"+
                                                                " tg.collageId = "+collage_results.id+" AND clg.userId = "+userId+
                                                                " GROUP BY fbf.userId";*/
                                                        query = " SELECT temp.*"+
                                                                " FROM ("+
                                                                " SELECT adb.ditherUserId, adb.ditherUsername, usr.name"+
                                                                " FROM tags tg"+
                                                                " INNER JOIN user usr ON usr.id = tg.userId"+
                                                                " INNER JOIN addressBook adb ON adb.ditherUserId = tg.userId"+
                                                                " LEFT JOIN collage clg ON clg.id = tg.collageId"+
                                                                " WHERE tg.collageId = "+collage_results.id+
                                                                " AND adb.userId = "+userId+
                                                                " UNION"+
                                                                " SELECT fbf.ditherUserId, fbf.ditherUsername, usr.name"+
                                                                " FROM tags tg"+
                                                                " INNER JOIN user usr ON usr.id = tg.userId"+
                                                                " INNER JOIN fbFriends fbf ON fbf.ditherUserId = tg.userId"+
                                                                " LEFT JOIN collage clg ON clg.id = tg.collageId"+
                                                                " WHERE tg.collageId = "+collage_results.id+
                                                                " AND fbf.userId = "+userId+
                                                                " ) AS temp"+
                                                                " GROUP BY temp.ditherUserId";
                                                        console.log(query);
                                                        AddressBook.query(query, function(err, taggedUsersFinalResults) {
                                                                if(err)
                                                                {
                                                                    console.log(err);
                                                                    //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Selecting tagged users from both address book and fb friends'});
                                                                }
                                                                else
                                                                {
                                                                    console.log(query);
                                                                    console.log(taggedUsersFinalResults);
                                                                    console.log(taggedUsersFinalResults.length);


                                                                    if(taggedUsersFinalResults != 0){
                                                                        taggedUsersFinalResults.forEach(function(factor, index){
                                                                                console.log("factor ------------))))))))))))))))======================");
                                                                                console.log(factor);
                                                                                taggedUserArrayFinal.push({name: factor.name,userId: factor.ditherUserId});
                                                                        });
                                                                    }

                                                                    if(taggedUserArray.length !=0){
                                                                            taggedUserArray.forEach(function(factor, index){
                                                                                    //tagNotifyArray.push({id:factor.user_id});
                                                                                    tagNotifyArray.push(factor.user_id);

                                                                            });
                                                                            console.log(tagNotifyArray.length);
                                                                            console.log(tagNotifyArray);
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
                                                                                    //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in inserting collage tagged users', error_details: err});
                                                                                }else{
                                                                                        console.log("Successfully Inserted to---->>. NotificationLog table");
                                                                                        console.log(createdNotificationTags);
                                                                                        callback();

                                                                                }
                                                                            });
                                                                    }else{

                                                                        callback();

                                                                    }
                                                                }

                                                        });
                                                }
                                        });

                                }else{

                                    callback();

                                }
                    },
                    function(callback) {
                                console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^CALL BACK ----3 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                                if(inviteFriends.length != 0){
                                    //phoneNumber
                                    //userId
                                    console.log(userId);
                                    inviteFriends.forEach(function(factor, index){
                                             inviteFinalArray.push({userId: parseInt(userId), collageId: collage_results.id, phoneNumber: factor.phone_number, invitee: factor.name});
                                    });
                                    console.log("inviteFinalArray  -----------------------------++++++++++++++++++++++++++++++++++++");
                                    console.log(inviteFinalArray);
                                    Invitation.create(inviteFinalArray).exec(function(err, createdInvitation) {
                                            if(err)
                                            {
                                                console.log("Invitation error ============>>>>>>>>>>>>>");
                                                console.log(err);
                                                //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in inserting collage tagged users', error_details: err});
                                            }else{
                                                    console.log("Successfully inserted Invitation");

                                                    //SMS HERE
                                                    callback();
                                            }
                                    });

                                }else{
                                    callback();
                                }
                    },
            ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
                                if (err) {
                                    console.log(err);
                                    //return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in address book creation or in fbFriend creation or getting fbfriends or grtting contacts', error_details: err}); //If an error occured, we let express/connect handle it by calling the "next" function
                                }else{
                                    console.log("Create Dither =============>>>>>>>>>>>>>>");
                                    console.log(sortedVote);
                                    console.log(taggedUserArrayFinal);
                                    //console.log(invite_friends_NUM);
                                    return res.json(200, {status: 1, status_type: 'Success', message: 'Successfully created Collage',
                                                              profile_image      :     profilePic_path + tokenCheck.tokenDetails.profilePic,
                                                              user_name          :     tokenCheck.tokenDetails.name,
                                                              user_id            :     tokenCheck.tokenDetails.userId,
                                                              created_date_time  :     collage_results.createdAt,
                                                              updated_date_time  :     collage_results.updatedAt,
                                                              collage_id         :     collage_results.id,
                                                              collage_image      :     collageImg_path + collage_results.image,
                                                              location           :     collage_results.location,
                                                              caption            :     collage_results.imgTitle,
                                                              vote               :     sortedVote,
                                                              dither_count       :     sortedVote.length,
                                                              taggedUsers        :     taggedUserArrayFinal,
                                                              invite_friends_NUM :     request.invite_friends_NUM,
                                    });
                                    //return res.json(200, {status: 1, status_type: 'Success' , message: 'Successfully added phone contact list to addressBook and fbcontacts to fbFriends', ditherPhoneContact: ditherUserInAddressBook, ditherFBuser: ditherUserInFbFriends});
                                }
            });

        }

        },


/* ==================================================================================================================================
               To get Profile Dithers
     ==================================================================================================================================== */
        getProfileDithers:  function (req, res) {

                    console.log("get Profile Dithers ===================");
                    var tokenCheck                  =     req.options.tokenCheck;
                    var server_baseUrl              =     req.options.server_baseUrl;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var profilePic_path             =     server_baseUrl + req.options.file_path.profilePic_path;
                    var collageImg_path             =     server_baseUrl + req.options.file_path.collageImg_path;
                    var received_userId             =     req.param("user_id");
                    var received_userName, received_userProfilePic;
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
                                                //" LEFT JOIN collageLikes clglk ON clglk.userId = usr.id"+
                                                " LEFT JOIN collageLikes clglk ON clglk.collageId = clg.id"+
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
                                                " INNER JOIN tags tg ON tg.collageId = clg.id"+
                                                " INNER JOIN user usr ON usr.id = tg.userId"+
                                                //" INNER JOIN user usr ON usr.id = clg.userId"+
                                                //" LEFT JOIN collageLikes clglk ON clglk.userId = usr.id"+
                                                " LEFT JOIN collageLikes clglk ON clglk.collageId = clg.id"+
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
                                                                                        if(dataResults[j]["likePosition"] == null || dataResults[j]["likePosition"] == "" || dataResults[j]["likePosition"] == 0){
                                                                                                like_position = 0;
                                                                                        }else{
                                                                                                like_position = dataResults[j]["likePosition"];
                                                                                        }

                                                                                    }
                                                                                }
                                                                                var imgDetailsArrayOrder = imgDetailsArray.reverse();
                                                                                received_userName                       =       dataResults[i]["name"];
                                                                                received_userProfilePic                 =       profilePic_path + dataResults[i]["profilePic"];
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
                                                                        /*return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully get the Dithers',
                                                                                                username                : received_userName,
                                                                                                user_profile_image      : received_userProfilePic,
                                                                                                total_opinion           : total_opinion,
                                                                                                recent_dithers          : recent_dithers_Array_4,
                                                                                                popular_dithers         : popular_dithers_Array_4 });*/
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
                                                                                            return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully get the Dithers',
                                                                                                                username                : foundUserDetails.name,
                                                                                                                user_profile_image      : profilePic_path + foundUserDetails.profilePic,
                                                                                                                total_opinion           : total_opinion,
                                                                                                                recent_dithers          : recent_dithers_Array_4,
                                                                                                                popular_dithers         : popular_dithers_Array_4 });
                                                                                    }
                                                                                }
                                                                        });

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
                    var received_userName, received_userProfilePic;
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
                                                //" LEFT JOIN collageLikes clglk ON clglk.userId = usr.id"+
                                                " LEFT JOIN collageLikes clglk ON clglk.collageId = clg.id"+
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
                                                " INNER JOIN tags tg ON tg.collageId = clg.id"+
                                                " INNER JOIN user usr ON usr.id = tg.userId"+
                                                //" LEFT JOIN collageLikes clglk ON clglk.userId = usr.id"+
                                                " LEFT JOIN collageLikes clglk ON clglk.collageId = clg.id"+
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
                                                            User.findOne({id: received_userId}).exec(function (err, foundUserDetails){
                                                                    if (err) {
                                                                        console.log(err);
                                                                           return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in finding fbId', error_details: err});
                                                                    }else{
                                                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage Found by the user',
                                                                                                    username                : foundUserDetails.name,
                                                                                                    user_profile_image      : profilePic_path + foundUserDetails.profilePic,
                                                                                                    recent_dithers          : [],
                                                                                                    popular_dithers         : []
                                                                                });
                                                                    }
                                                            });

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
                                                                            if(dataResults[j]["likePosition"] == null || dataResults[j]["likePosition"] == "" || dataResults[j]["likePosition"] == 0){
                                                                                    like_position = 0;
                                                                            }else{
                                                                                    like_position = dataResults[j]["likePosition"];
                                                                            }

                                                                        }
                                                                    }
                                                                    //console.log(imgDetailsArray);
                                                                    //var imgDetailsArrayOrder                =       imgDetailsArray.reverse();
                                                                    var imgDetailsArrayOrder = imgDetailsArray.sort(predicatBy("position"));


                                                                    received_userName                           =       dataResults[i]["name"];
                                                                    received_userProfilePic                     =       profilePic_path + dataResults[i]["profilePic"];
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
                                                            /*if(received_dither_type == "popular"){
                                                                    return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully get the popular Dithers',
                                                                                    username                : received_userName,
                                                                                    user_profile_image      : received_userProfilePic,
                                                                                    popular_dithers         : popular_dithers });

                                                            }else if(received_dither_type == "recent"){

                                                                    return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully get the recent Dithers',
                                                                                    username                : received_userName,
                                                                                    user_profile_image      : received_userProfilePic,
                                                                                    recent_dithers          : recent_dithers,
                                                                                    });
                                                            }*/
                                                            User.findOne({id: received_userId}).exec(function (err, foundUserDetails){
                                                                    if (err) {
                                                                        console.log(err);
                                                                           return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in finding fbId', error_details: err});
                                                                    }else{

                                                                        if(!foundUserDetails){
                                                                                /*return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No user details found',
                                                                                                    username                : foundUserDetails.name,
                                                                                                    user_profile_image      : server_baseUrl + req.options.file_path.profilePic_path + foundUserDetails.profilePic,
                                                                                                    recent_dithers          : [],
                                                                                                    popular_dithers         : []
                                                                                });*/
                                                                                if(received_dither_type == "popular"){
                                                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No user details found',
                                                                                                        username                : "",
                                                                                                        user_profile_image      : "",
                                                                                                        popular_dithers         : popular_dithers });

                                                                                }else if(received_dither_type == "recent"){

                                                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No user details found',
                                                                                                        username                : "",
                                                                                                        user_profile_image      : "",
                                                                                                        recent_dithers          : recent_dithers,
                                                                                                        });
                                                                                }
                                                                        }else{
                                                                                /*return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully get the Dithers',
                                                                                                    username                : received_userName,
                                                                                                    user_profile_image      : received_userProfilePic,
                                                                                                    total_opinion           : total_opinion,
                                                                                                    recent_dithers          : recent_dithers_Array_4,
                                                                                                    popular_dithers         : popular_dithers_Array_4 });*/
                                                                                if(received_dither_type == "popular"){
                                                                                        return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully get the popular Dithers',
                                                                                                        username                : foundUserDetails.name,
                                                                                                        user_profile_image      : profilePic_path + foundUserDetails.profilePic,
                                                                                                        popular_dithers         : popular_dithers });

                                                                                }else if(received_dither_type == "recent"){

                                                                                        return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully get the recent Dithers',
                                                                                                        username                : foundUserDetails.name,
                                                                                                        user_profile_image      : profilePic_path + foundUserDetails.profilePic,
                                                                                                        recent_dithers          : recent_dithers,
                                                                                                        });
                                                                                }
                                                                        }
                                                                    }
                                                            });
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
                    var tokenCheck                  =     req.options.tokenCheck;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var server_baseUrl              =     req.options.server_baseUrl;
                    var collageImg_path             =     server_baseUrl + req.options.file_path.collageImg_path;
                    var profilePic_path             =     server_baseUrl + req.options.file_path.profilePic_path;
                    var getCollageData              =     req.param("dither_data");
                    //console.log(dither_data);
                    /*var dither_data = [
                                        {dither_id: 15, dither_local_time: '2016-08-04 18:37:52'},
                                        {dither_id: 16, dither_local_time: '2016-08-04 18:40:50'},
                                        {dither_id: 17, dither_local_time: '2016-08-05 18:41:41'}
                                      ];*/
                    if(!getCollageData){
                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please Pass dither_data'});
                    }else{
                            console.log("get collage data=======================>>>>>>>>>>>>>>");
                            console.log(getCollageData);
                            var dither_data                 =     JSON.parse(getCollageData);
                            if(dither_data.length == 0){
                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No Dithers yet'});
                            }else{
                                    var push_Request_Array          =     [];
                                    var push_Result_Array           =     [];
                                    console.log("dither_data=======================>>>>>>>>>>>>>>");
                                    console.log(dither_data);
                                    console.log(dither_data.length);
                                    var foundCollageArray;
                                    dither_data.forEach(function(factor, index){
                                            //console.log(factor);
                                            //console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
                                            //console.log(index);
                                            push_Request_Array.push(factor.dither_id);
                                            Collage.findOne({id: factor.dither_id, updatedAt: factor.dither_local_time}).exec(function (err, foundCollage){
                                                if(err){
                                                            console.log(err);
                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding the Dither', error_details: err});
                                                }else{
                                                        console.log("factor Find dithers==================");
                                                        console.log(factor);

                                                            if(foundCollage){
                                                                    push_Result_Array.push(foundCollage.id);
                                                                    //console.log("factor==================");
                                                                    //console.log(factor);
                                                                    //console.log("foundCollage==================");
                                                                    //console.log(foundCollage);
                                                                    //foundCollageArray = foundCollage;
                                                            }

                                                            if (index == dither_data.length - 1) {
                                                                    setTimeout(function() {
                                                                            console.log("Result Push array ++++++++++++++");
                                                                            console.log(push_Result_Array);
                                                                            console.log("Request Push array +++++++++++++");
                                                                            console.log(push_Request_Array);
                                                                            console.log('Blah blah blah blah extra-blah');
                                                                            console.log(push_Result_Array.length);
                                                                            //if(push_Result_Array.length == push_Request_Array || push_Result_Array.length == 0){
                                                                            if(push_Result_Array.length == push_Request_Array){
                                                                                        return res.json(200, {status: 1, status_type: 'Success' ,message: 'Given Dithers are not updated', feeds: []});
                                                                            }else{
                                                                                        //return res.json(200, {status: 1, status_type: 'Success' ,message: 'ha ha ha ha ha ha hah hahah h', feeds: []});
                                                                                        uniqueDither(push_Request_Array, push_Result_Array);
                                                                            }

                                                                    }, 1000);
                                                            }

                                                }
                                            });
                                    });

                                    function uniqueDither(resultsRequest, results){

                                            //var results             = "["+results+"]";
                                            //var resultsRequest      = "["+resultsRequest+"]";
                                            console.log("11111111111111111111111111111+++++++++++ get"  + resultsRequest);
                                            console.log("2222222222222222222222222222 +++++++++ get"  + results);

                                            console.log(results.length);
                                            console.log(resultsRequest.length);

                                            var results               = results.toString().split(',');
                                            var resultsRequest        = resultsRequest.toString().split(',');
                                            var index;
                                            var unique_push_array     = [];
                                            var results_array         = [];
                                            var resultsRequest_array  = [];

                                            console.log("11111111111111111111111111111"  + resultsRequest);
                                            console.log("2222222222222222222222222222"  + results);
                                            //return res.send(results, 200);
                                            console.log("concat ----------------------------");

                                            //console.log(results_array.length);
                                            results.forEach(function(factor, index){
                                                        console.log("factor  ========>>>>>>>> results");
                                                        console.log(factor);
                                                        if(factor != "" || factor != null){
                                                            results_array.push(factor);
                                                        }
                                            });
                                            resultsRequest.forEach(function(factor, index){
                                                        console.log("factor ========>>>>>>>>> resultsRequest");
                                                        console.log(factor);
                                                        if(factor != "" || factor != null){
                                                            resultsRequest_array.push(factor);
                                                        }
                                            });
                                            //console.log(results_array);
                                            //console.log(resultsRequest_array);

                                            console.log("8888888888888888888888888888888");
                                            console.log(results_array.length);
                                            //if(results_array.length != 0){
                                            for (var i=0; i<resultsRequest_array.length; i++) {
                                                    index = results_array.indexOf(resultsRequest_array[i]);
                                                    console.log("index===========");
                                                    console.log(resultsRequest_array[i]+"------------------------------------------>>>>>>>>>>"+index);
                                                    //Removing the Duplicate Values
                                                    if(index != -1){
                                                            unique_push_array.push(resultsRequest_array[i]);
                                                    }
                                            }
                                            //}else{

                                                   // unique_push_array   = resultsRequest_array;
                                                    //console.log("unique_push_array-------------------------------");

                                            //}
                                            console.log("++++++++++++++++unique_push_array++++++++++++++++");
                                            console.log(unique_push_array);


                                            /* ##################################### */

                                                        /*var array1 = ['A', 'B', 'C', 'D', 'D', 'E'];
                                                        var array2 = ['D', 'E', 'R' , 'T', 'A'];
                                                        var index;

                                                        for (var i=0; i<array2.length; i++) {
                                                            index = array1.indexOf(array2[i]);
                                                            console.log("index===========");
                                                            console.log(array2[i]+"------------------------------------------>>>>>>>>>>"+index);
                                                            if(index == -1) {

                                                            }
                                                        }
                                                        console.log("2nd For looop==========================");
                                                        for (var j=0; j<array1.length; j++) {
                                                            index = array2.indexOf(array1[j]);
                                                            console.log("index===========");
                                                            console.log(array1[j]+"------------------------------------------>>>>>>>>>>"+index);
                                                            if(index == -1) {

                                                            }
                                                        }*/
                                            /* #################################### */

                                            if(unique_push_array.length == 0){
                                                    unique_push_array  =  resultsRequest_array;
                                                    console.log("unique_push_array length = 0");
                                                    console.log(unique_push_array);
                                                    return res.json(200, {status: 1, status_type: 'Success' ,message: 'Given Dithers are not updated', feeds: []});
                                            }else{
                                                query = " SELECT"+
                                                        " clg.imgTitle, clg.image AS collage_image, clg.location, clg.userId, clg.totalVote, clg.createdAt, clg.updatedAt,"+
                                                        " clgdt.id AS imgId, clgdt.collageId, clgdt.position, clgdt.vote,"+
                                                        " usr.profilePic, usr.name,"+
                                                        " clglk.likeStatus, clglk.likePosition"+
                                                        " FROM collage clg"+
                                                        " INNER JOIN collageDetails clgdt ON clgdt.collageId = clg.id"+
                                                        " INNER JOIN user usr ON usr.id = clg.userId"+
                                                        //" LEFT JOIN collageLikes clglk ON clglk.userId = usr.id"+
                                                        " LEFT JOIN collageLikes clglk ON clglk.collageId = clg.id"+
                                                        " WHERE clg.id"+
                                                        " IN ( "+unique_push_array+" )"+
                                                        " GROUP BY clgdt.id"+
                                                        " ORDER BY clg.createdAt DESC";
                                                console.log(query);
                                                Collage.query(query, function(err, results) {
                                                        if(err)
                                                        {
                                                                console.log(err);
                                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting updated dithers', error_details: err});
                                                        }else{
                                                            console.log("results _++++++++++++++++++++++++++++__________________");
                                                            console.log(results);
                                                            /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
                                                            if(results.length == 0){
                                                                        return res.json(200, {status: 1, status_type: 'Success' ,message: 'No collage Found', feeds: []});
                                                            }else{
                                                                        console.log("else part =================");
                                                                        var dataResults = results;
                                                                        var key = [];
                                                                        var dataResultsKeys = [];
                                                                        var like_position;
                                                                        for (var i = dataResults.length - 1; i >= 0; i--) {
                                                                            var dataResultsObj = new Object();
                                                                            var collageId_val =dataResults[i]["collageId"];
                                                                            //console.log(data[i]);
                                                                            if ( dataResultsKeys.indexOf( collageId_val ) == -1 )
                                                                            {
                                                                                var imagesPositionArray         = [];
                                                                                var voteArray                   = [];
                                                                                var likeStatusArray             = [];
                                                                                var imgIdArray                  = [];
                                                                                var imgDetailsArray             = [];
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

                                                                                        if(dataResults[j]["likePosition"] == null || dataResults[j]["likePosition"] == "" || dataResults[j]["likePosition"] == 0){
                                                                                                like_position = 0;
                                                                                        }else{
                                                                                                like_position = dataResults[j]["likePosition"];
                                                                                        }
                                                                                    }
                                                                                }
                                                                                //var imgDetailsArrayOrder = imgDetailsArray.reverse();
                                                                               // var imgDetailsArrayOrder = imgDetailsArray.reverse();
                                                                               var imgDetailsArrayOrder = imgDetailsArray.sort(predicatBy("position"));

                                                                                if(dataResults[i]["profilePic"] == null || dataResults[i]["profilePic"] == ""){
                                                                                            dataResultsObj.profile_image = "";
                                                                                }else{

                                                                                            dataResultsObj.profile_image = profilePic_path + dataResults[i]["profilePic"];
                                                                                }

                                                                                dataResultsObj.user_name                    =       dataResults[i]["name"];
                                                                                dataResultsObj.user_id                      =       dataResults[i]["userId"];
                                                                                dataResultsObj.created_date_time            =       dataResults[i]["createdAt"];
                                                                                dataResultsObj.updated_date_time            =       dataResults[i]["updatedAt"];
                                                                                dataResultsObj.dither_like_position         =       like_position;
                                                                                dataResultsObj.collage_id                   =       collageId_val;
                                                                                dataResultsObj.collage_image                =       collageImg_path + dataResults[i]["collage_image"];
                                                                                dataResultsObj.vote                         =       imgDetailsArrayOrder;
                                                                                dataResultsObj.mainOrder                    =       i;
                                                                                //console.log("dataResultsObj====================");
                                                                                //console.log(dataResultsObj);
                                                                                //console.log("dataResultsObj====================");
                                                                                key.push(dataResultsObj);
                                                                                dataResultsKeys.push(collageId_val);

                                                                                //console.log(key);
                                                                                //var feeds = key.reverse();
                                                                                //var feeds = key;
                                                                                var feeds              =       key.sort( predicatBy("mainOrder") );
                                                                                //console.log("Final Key -----------------------------------------------------------------");
                                                                                //console.log(feeds);
                                                                            }
                                                                        }
                                                                        //console.log(key);
                                                                        //console.log(key.reverse());
                                                                        //console.log(JSON.stringify(key.reverse()));
                                                                        return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully get the updated Feeds',
                                                                                            feeds: feeds
                                                                        });
                                                            }//results length check

                                                            /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
                                                        }
                                                });
                                            }
                                    }//function close
                            }
                    }


        },
/* ==================================================================================================================================
               To Edit Dither
     ==================================================================================================================================== */
        editDither:  function (req, res) {

                  /*  console.log("Edit Dithers ===== api");
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
                    var taggedUserArray             =      union_arrays(tagged_fbUser, tagged_contactUser);
                    var taggedUserArrayFinal        =      [];
                    var inviteFriends               =      req.param("invite_friends_NUM");
                    var inviteFriendsArray          =      [];

                    if(!imgTitle || !location || !collageId){
                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please Pass dither_id and dither_desc and dither_location'});
                    }else{


//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
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
                                                            console.log("Successfully updated =======================");
                                                            console.log(updatedCollage);
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

                                        var tagCollageArray = [];
                                        taggedUserArray.forEach(function(factor, index){
                                            console.log("Refy tagged User ======>>>>> factor");
                                            console.log(factor);
                                            tagCollageArray.push({collageId: collage_results.id, userId: factor});
                                        });
                                        console.log("tagCollageArray }}}}}}}}}}}}}}}}}}}}}}}}");
                                        console.log(tagCollageArray);

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

                                                        //console.log("created in collage Details=====");
                                                        //console.log(vote);
                                                        console.log("Predicated -------------------------");
                                                        console.log("Created Collage Tags -------------------------");
                                                        console.log(createdCollageTags);

                                                        //console.log(vote.sort( predicatBy("image_id") ));

                                                        //console.log(results);

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
                                                               // " LEFT JOIN collage clg ON clg.userId = usr.id"+
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
                                                                    //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Selecting tagged users from both address book and fb friends'});
                                                                }
                                                                else
                                                                {
                                                                    console.log(query);
                                                                    console.log(taggedUsersFinalResults);
                                                                    console.log(taggedUsersFinalResults.length);

                                                                    if(taggedUsersFinalResults != 0){
                                                                        taggedUsersFinalResults.forEach(function(factor, index){
                                                                                console.log("factor ------------))))))))))))))))======================");
                                                                                console.log(factor);
                                                                                taggedUserArrayFinal.push({name: factor.name,userId: factor.userId});
                                                                        });
                                                                    }

                                                                    if(taggedUserArray.length !=0){
                                                                            taggedUserArray.forEach(function(factor, index){
                                                                                    //tagNotifyArray.push({id:factor.user_id});
                                                                                    tagNotifyArray.push(factor.user_id);

                                                                            });
                                                                            console.log(tagNotifyArray.length);
                                                                            console.log(tagNotifyArray);
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
                                                                                    //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in inserting collage tagged users', error_details: err});
                                                                                }else{
                                                                                        console.log("Successfully Inserted to---->>. NotificationLog table");
                                                                                        console.log(createdNotificationTags);
                                                                                        callback();

                                                                                }
                                                                            });
                                                                    }else{

                                                                        callback();

                                                                    }
                                                                }

                                                        });
                                                }
                                        });

                                }else{

                                    callback();

                                }
                    },
                    function(callback) {
                                console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^CALL BACK ----3 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                                if(inviteFriends.length != 0){
                                    //phoneNumber
                                    //userId
                                    console.log(userId);
                                    inviteFriends.forEach(function(factor, index){
                                             inviteFinalArray.push({userId: parseInt(userId), collageId: collage_results.id, phoneNumber: factor.phone_number, invitee: factor.name});
                                    });
                                    console.log("inviteFinalArray  -----------------------------++++++++++++++++++++++++++++++++++++");
                                    console.log(inviteFinalArray);
                                    Invitation.create(inviteFinalArray).exec(function(err, createdInvitation) {
                                            if(err)
                                            {
                                                console.log("Invitation error ============>>>>>>>>>>>>>");
                                                console.log(err);
                                                //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in inserting collage tagged users', error_details: err});
                                            }else{
                                                    console.log("Successfully inserted Invitation");

                                                    //SMS HERE
                                                    callback();
                                            }
                                    });

                                }else{
                                    callback();
                                }
                    },
            ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
                                if (err) {
                                    console.log(err);
                                    return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in Edit Dither', error_details: err}); //If an error occured, we let express/connect handle it by calling the "next" function
                                }else{
                                    console.log("Edit Dither =============>>>>>>>>>>>>>>");
                                    //console.log(sortedVote);
                                    //console.log(taggedUserArrayFinal);
                                    //console.log(invite_friends_NUM);
                                    return res.json(200, {status: 1, status_type: 'Success', message: 'Succesfully updated the Dither'});
                                    //return res.json(200, {status: 1, status_type: 'Success' , message: 'Successfully added phone contact list to addressBook and fbcontacts to fbFriends', ditherPhoneContact: ditherUserInAddressBook, ditherFBuser: ditherUserInFbFriends});
                                }
            });

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
                                                                   // return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully updated the Dither'});


                    }*/

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
                    console.log("Edit Dithers ===== api");
                    console.log(req.param("dither_id"));
                    console.log(req.param("dither_desc"));
                    console.log(req.param("dither_location"));
                    var collageId                   =      req.param("dither_id");
                    var imgTitle                    =      req.param("dither_desc");
                    var location                    =      req.param("dither_location");
                    var taggedUsers                 =      req.param("tagged_users");

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
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

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
                                                                                                        //console.log("Deleted Single Dither");
                                                                                                            //Deleting from invitation Table
                                                                                                            Invitation.destroy({collageId: collageId}).exec(function (err, deleteCollageInvitation) {
                                                                                                                if (err){
                                                                                                                        console.log(err);
                                                                                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Deleting the Dither Invitation', error_details: err});
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
                                                                    });
                                                            }
                                                    });//Collage Details
                                            }
                                        }
                            });//Collage

                    }//Passed details check else

        },

};


