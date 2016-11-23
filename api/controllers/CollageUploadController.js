/**
 * CollageUploadController
 *
 * @description :: Server-side logic for managing collageuploads
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

//Function to get ordered, by value, in json array key value pair
/*function predicatBy(prop){
   return function(a,b){
      if( a[prop] > b[prop]){
          return 1;
      }else if( a[prop] < b[prop] ){
          return -1;
      }
      return 0;
   }
}*/

//Function to convert duplicate values to a single occurence for a normal array
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

//Function to get Duplicate
/*function find_duplicate_in_array(param) {
  var i,
  len=param.length,
  result = [],
  obj = {};
  for (i=0; i<len; i++)
  {
  obj[param[i]]=0;
  }
  for (i in obj) {
  result.push(i);
  }
  return result;
}*/

//Function to remove duplicate values completely from a normal array
function remove_duplicate_array(arg1, arg2){
        //var arr = [1, 2, 3, 4, 5, 6, 7];
        //var ar = [2, 4, 6, 8, 10];
        //var newID = [];
        for(var i = 0; i < arg1.length; i++){
            for(var j = 0; j < arg2.length; j++){
                if(arg1[i] == arg2[j]){
                    //newID.push(arr[i]);
                    arg1.splice(i, 1);
                    arg2.splice(j, 1);
                    break;
                }
            }
        }
        return arg1.concat(arg2);
}

module.exports = {

/* ==================================================================================================================================
               To Upload Dither (collage) Images
     ==================================================================================================================================== */
    uploadDither :  function (req, res) {
            console.log("uploadDither ========");
            var server_baseUrl              =     req.options.server_baseUrl;
            var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
            var collageImg_path             =     server_image_baseUrl + req.options.file_path.collageImg_path;
            var collageUploadDirectoryPath  =     '../../assets/images/collage';

            req.file('collage_image').upload({dirname: collageUploadDirectoryPath, maxBytes: 100 * 1000 * 1000, adapter: require('skipper-disk')},function (err, files) {
                    if(err){
                        console.log(err);
                        return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in uploading collage image', error_details: err});
                    }else{

                        console.log("files ========================= >>>>>>>>>>>>>>  ");
                        console.log(files);
                        console.log(files.length);
                        if(!files.length){
                                console.log("File length zero ------------->>>>>>>>>>>>>  ");
                                return res.json(200, {status: 2, status_type: 'Failure', message: 'Please pass an image'});
                        }else{
                                console.log("File length zero Else ------------->>>>>>>>>>>>>  ");
                                var collage_imageName           =   "";
                                var collageDetailImgArray       =   [];
                                files.forEach(function(factor, index){
                                        console.log(factor);
                                        var filename                        =   factor.fd.split('/');
                                        filename                            =   filename[filename.length-1];
                                        var filename_without_extension      =   factor.filename.split('.');
                                        filename_without_extension          =   filename_without_extension[0];
                                        var image_name;
                                        console.log("filename_without_extension ==============");
                                        console.log(filename_without_extension);
                                        collageDetailImgArray.push({
                                                    image_name      :   filename_without_extension,
                                                    image_url       :   collageImg_path + filename
                                                    });
                                });
                                console.log("collageDetailImgArray ==============");
                                console.log(collageDetailImgArray);
                                return res.json(200, {status: 1, status_type: 'Success', message: 'Successfully uploaded Collage images',
                                                    dither_images : collageDetailImgArray,
                                                    });
                        }
                    }
            });
    },




  /* ==================================================================================================================================
               To create Dither (collage)
     ==================================================================================================================================== */

        createDither:  function (req, res) {
            console.log("createDither   api ++++++++++++++++++++++++++++++++++++++++++");
            console.log(req.param("REQUEST"));
            //console.log(req.param("collage_image"));
            if(!req.param("REQUEST") ){
                    console.log("|||||||||||||||||| Not found");
                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please Pass the REQUEST'});
            }else{
                            //var server_baseUrl                      =     req.options.server_baseUrl;
                            var server_image_baseUrl                =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                            var dither_expiry_hour                  =     req.options.settingsKeyValue.DITHER_EXPIRY_HOUR;
                            var expiry_date                         =     new Date(new Date().getTime() + (dither_expiry_hour*1000*60*60));
                            var tokenCheck                          =     req.options.tokenCheck;
                            var userId                              =     tokenCheck.tokenDetails.userId;
                            //var profilePic_path                     =     server_image_baseUrl + req.options.file_path.profilePic_path;
                            //var collageImg_path                     =     server_image_baseUrl + req.options.file_path.collageImg_path;
                            var collageImg_path_assets              =     req.options.file_path.collageImg_path_assets;
                            var request                             =     JSON.parse(req.param("REQUEST"));
                            //var device_type                         =     req.get('device_type');
                            var vote                                =     [];
                            //var sortedVote                          =     [];
                            var tagged_fbUser                       =     request.tagged_fb_user;
                            var tagged_contactUser                  =     request.tagged_user;
                            var get_dither_images                   =     request.dither_images;
                            var taggedUserArray                     =     union_arrays(tagged_fbUser, tagged_contactUser);
                            var taggedUserArrayFinal                =     [];
                            var inviteFriends                       =     request.invite_friends_NUM;
                            inviteFriends                           =     JSON.parse(inviteFriends);
                            var inviteFriendsArray                  =     [];
                            var inviteFinalArray                    =     [];
                            var tagNotifyArray                      =     [];
                            var tagNtfyPush                         =     [];
                            var collage_results                     =     "";
                            var reportUserResults_Array             =     [];
                            var reportUserResults_JSON_Array        =     [];
                            /*var loggedUser_JSON_Array               =     [{
                                                                            name        :    tokenCheck.tokenDetails.name,
                                                                            userId      :    tokenCheck.tokenDetails.userId
                                                                           }];*/
                            //var total_taggedUser_Array              =     [];
                            inviteFriends.forEach(function(factor, index){
                                        inviteFriendsArray.push(factor.phone_number);
                            });

                            var query   =  " SELECT rusr.reporterId, usr.name"+
                                           " FROM reportUser as rusr INNER JOIN user as usr ON rusr.reporterId = usr.id"+
                                           " where rusr.userId = '"+userId+"'";
                            console.log(query);
                            ReportUser.query(query, function(err, reportUserResults) {
                                if(err){
                                    console.log(err)
                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in get Reported User List', error_details: err});
                                }else{

                                        reportUserResults.forEach(function(factor, index){
                                                if(index){
                                                    reportUserResults_Array.push(factor.reporterId);
                                                    reportUserResults_JSON_Array.push({
                                                                    userId      :   factor.reporterId,
                                                                    name        :   factor.name
                                                                    });
                                                }
                                        });
                                        //var combine_tagged_report_array         =   taggedUserArray.concat(reportUserResults_Array);
                                        //var duplicate_tagged_report_array       =   find_duplicate_in_array(combine_tagged_report_array);
                                        var final_tagged_users_Array            =   remove_duplicate_array(taggedUserArray, reportUserResults_Array);

                                        console.log("###################################################################################");
                                        console.log("taggedUserArray --------------------------------");
                                        console.log(taggedUserArray);
                                        console.log("reportUserResults_Array --------------------------------");
                                        console.log(reportUserResults_Array);
                                        console.log("combine_tagged_report_array --------------------------------");
                                        //console.log(combine_tagged_report_array);
                                        console.log("duplicate_tagged_report_array +++++++++++++++++++++++++++++++++");
                                        //console.log(duplicate_tagged_report_array);
                                        console.log("final_tagged_users_Array =====================================");
                                        console.log(final_tagged_users_Array);
                                        console.log("###################################################################################");


                                        if(!final_tagged_users_Array.length){
                                                return res.json(200, {status: 2, status_type: 'Failure', message: 'Tagged users reported you. So Dither not created'});
                                        }else{
                                                async.series([
                                                        function(callback) {
                                                                console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^CALL BACK ----1 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                                                                if(!get_dither_images.length){
                                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage Image found to add'});
                                                                }else{
                                                                    console.log("Success Entered");
                                                                        var collage_imageName           =   "";
                                                                        var collageDetailImgArray       =   [];
                                                                        get_dither_images.forEach(function(factor, index){
                                                                            if(factor.image_name === "image_0"){
                                                                                    collage_imageName       =   factor.image_url.split('/');
                                                                                    collage_imageName       =   collage_imageName[collage_imageName.length-1];
                                                                            }
                                                                        });
                                                                        var values = {
                                                                            imgTitle        : request.dither_title,
                                                                            image           : collage_imageName,
                                                                            location        : request.dither_location,
                                                                            latitude        : request.latitude,
                                                                            longitude       : request.longitude,
                                                                            userId          : userId,
                                                                            expiryDate      : expiry_date,
                                                                        };
                                                                        Collage.create(values).exec(function(err, results){
                                                                                if(err){
                                                                                        console.log(err);
                                                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage creation', error_details: err});
                                                                                }else{
                                                                                        if(!results){
                                                                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Collage not created'});
                                                                                        }else{
                                                                                                get_dither_images.forEach(function(factor, index){
                                                                                                        var uploadedfilename                   =    factor.image_url.split('/');
                                                                                                        uploadedfilename                       =    uploadedfilename[uploadedfilename.length-1];
                                                                                                        var filename                           =    factor.image_name;
                                                                                                        var filename_without_extension         =    filename.split('.');
                                                                                                        filename_without_extension             =    filename_without_extension[0];
                                                                                                        var switchKey                          =    filename_without_extension;
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
                                                                                                        var switchKey_2 = filename_without_extension;
                                                                                                        switch(switchKey_2){
                                                                                                                case 'image_0':
                                                                                                                break;
                                                                                                                default:
                                                                                                                        collageDetailImgArray.push({
                                                                                                                                            image       : uploadedfilename,
                                                                                                                                            position    : position,
                                                                                                                                            collageId   : results.id,
                                                                                                                                            vote        : 0
                                                                                                                                            });
                                                                                                                break;
                                                                                                        }
                                                                                                });
                                                                                                CollageDetails.create(collageDetailImgArray).exec(function(err, createdCollageDetails) {
                                                                                                        if(err){
                                                                                                            console.log(err);
                                                                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage Detail creation', error_details: err});
                                                                                                        }else{
                                                                                                            /*createdCollageDetails.forEach(function(factor, index){
                                                                                                                    vote.push({
                                                                                                                            image_id        : factor.id,
                                                                                                                            position        : factor.position,
                                                                                                                            like_status     : 0,
                                                                                                                            vote            : 0
                                                                                                                            });
                                                                                                            });
                                                                                                            sortedVote                  = vote.sort( predicatBy("position") );*/
                                                                                                            collage_results             = results;
                                                                                                            callback();
                                                                                                        }
                                                                                                });
                                                                                        }
                                                                                }
                                                                        });
                                                                }

                                                        },
                                                        function(callback) {
                                                                console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^CALL BACK ----2 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                                                                var imageSrc                    =     collageImg_path_assets + collage_results.image;
                                                                var ext                         =     imageSrc.split('/');
                                                                ext                             =     ext[ext.length-1].split('.');
                                                                var imageDst                    =     collageImg_path_assets + ext[0] + "_50x50" + "." +ext[1];
                                                                console.log(imageSrc);
                                                                console.log(imageDst);
                                                                ImgResizeService.imageResize(imageSrc, imageDst, function(err, imageResizeResults) {
                                                                        if(err){
                                                                                console.log(err);
                                                                                console.log("Error in image resize !!!!");
                                                                                callback();
                                                                        }else{
                                                                                callback();
                                                                        }
                                                                });
                                                        },
                                                        function(callback) {
                                                                    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^CALL BACK ----3 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                                                                    if(final_tagged_users_Array.length){
                                                                            var tagCollageArray = [];
                                                                            final_tagged_users_Array.forEach(function(factor, index){
                                                                                tagCollageArray.push({
                                                                                                collageId   : collage_results.id,
                                                                                                userId      : factor
                                                                                                });
                                                                            });
                                                                            Tags.create(tagCollageArray).exec(function(err, createdCollageTags) {
                                                                                    if(err){
                                                                                        console.log(err);
                                                                                        callback();
                                                                                    }else{
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
                                                                                            //console.log(query);
                                                                                            AddressBook.query(query, function(err, taggedUsersFinalResults){
                                                                                                    if(err){
                                                                                                        console.log(err);
                                                                                                        callback();
                                                                                                    }else{
                                                                                                        if(taggedUsersFinalResults.length){
                                                                                                            taggedUsersFinalResults.forEach(function(factor, index){
                                                                                                                    taggedUserArrayFinal.push({
                                                                                                                                        name        : factor.name,
                                                                                                                                        userId      : factor.ditherUserId
                                                                                                                                        });
                                                                                                            });
                                                                                                            //total_taggedUser_Array  =  taggedUserArrayFinal.concat(loggedUser_JSON_Array);
                                                                                                        }
                                                                                                        final_tagged_users_Array.forEach(function(factor, index){
                                                                                                                //tagNotifyArray.push({id:factor.user_id});
                                                                                                                tagNotifyArray.push(factor);
                                                                                                                User.findOne({id:factor}).exec(function (err, notifySettings){
                                                                                                                    if(err){
                                                                                                                       console.log(err);
                                                                                                                       callback();
                                                                                                                    }else{
                                                                                                                        if(notifySettings){
                                                                                                                            if(notifySettings.notifyOpinion){
                                                                                                                                    tagNtfyPush.push(factor);
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                });
                                                                                                        });
                                                                                                        var values ={
                                                                                                                        notificationTypeId  :   1,
                                                                                                                        userId              :   userId,
                                                                                                                        collage_id          :   collage_results.id,
                                                                                                                        tagged_users        :   tagNotifyArray,
                                                                                                                        //description         :   tagNotifyArray.length
                                                                                                                    }
                                                                                                        NotificationLog.create(values).exec(function(err, createdNotificationTags) {
                                                                                                            if(err){
                                                                                                                console.log(err);
                                                                                                                callback();
                                                                                                            }else{
                                                                                                                    final_tagged_users_Array.forEach(function(factor, index){
                                                                                                                            var taggedUser_roomName  = "socket_user_"+factor;
                                                                                                                            sails.sockets.broadcast(taggedUser_roomName,{
                                                                                                                                                                    type                       :       "notification",
                                                                                                                                                                    id                         :       createdCollageTags.collageId,
                                                                                                                                                                    message                    :       "Create Dither - Room Broadcast - to Tagged Users",
                                                                                                                                                                    roomName                   :       taggedUser_roomName,
                                                                                                                                                                    subscribers                :       sails.sockets.subscribers(taggedUser_roomName),
                                                                                                                                                                    socket                     :       sails.sockets.rooms(),
                                                                                                                                                                    notification_type          :       1,
                                                                                                                                                                    notification_id            :       createdNotificationTags.id,
                                                                                                                                                                    });
                                                                                                                    });
                                                                                                                //---------------------Push Notification In Tagged Users--------------------------------
                                                                                                                if(tagNotifyArray.length) {
                                                                                                                    var deviceId_arr    = [];
                                                                                                                    var message   = 'Notification For Opinion';
                                                                                                                    var ntfn_body =  tokenCheck.tokenDetails.name +" is Asking for Your Opinion";
                                                                                                                    User_token.find({userId: tagNtfyPush}).exec(function (err, response) {
                                                                                                                        if(err){
                                                                                                                            console.log(err)
                                                                                                                            callback();
                                                                                                                        }else{
                                                                                                                            response.forEach(function(factor, index){
                                                                                                                                    deviceId_arr.push(factor.deviceId);
                                                                                                                            });
                                                                                                                            if(deviceId_arr.length){
                                                                                                                                console.log("=============PUSH NTFN============================")
                                                                                                                                var data        = {
                                                                                                                                                    message             :   message,
                                                                                                                                                    device_id           :   deviceId_arr,
                                                                                                                                                    NtfnBody            :   ntfn_body,
                                                                                                                                                    NtfnType            :   1,
                                                                                                                                                    id                  :   collage_results.id,
                                                                                                                                                    notification_id     :   createdNotificationTags.id
                                                                                                                                                };
                                                                                                                                NotificationService.NotificationPush(data, function(err, ntfnSend) {
                                                                                                                                        if(err){
                                                                                                                                            console.log("Error in Push Notification Sending")
                                                                                                                                            console.log(err)
                                                                                                                                            callback();
                                                                                                                                        }else{
                                                                                                                                            callback();
                                                                                                                                        }
                                                                                                                                });
                                                                                                                            }else{
                                                                                                                                console.log("No deviceId")
                                                                                                                                callback();
                                                                                                                            }
                                                                                                                        }
                                                                                                                    });
                                                                                                                }
                                                                                                             //-------------------END Of PUSH Notification-------------------------------------------------------------------
                                                                                                            }
                                                                                                        });

                                                                                                    }

                                                                                            });
                                                                                    }
                                                                            });

                                                                    }else{
                                                                            callback();
                                                                    }
                                                        },
                                                        function(callback) {
                                                                    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^CALL BACK ----4 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                                                                    if(inviteFriends.length){
                                                                        inviteFriends.forEach(function(factor, index){
                                                                                 inviteFinalArray.push({
                                                                                                        userId          : parseInt(userId),
                                                                                                        collageId       : collage_results.id,
                                                                                                        phoneNumber     : factor.phone_number,
                                                                                                        invitee         : factor.name
                                                                                                    });
                                                                        });
                                                                        Invitation.create(inviteFinalArray).exec(function(err, createdInvitation) {
                                                                                if(err){
                                                                                    console.log(err);
                                                                                    callback();
                                                                                }else{
                                                                                    callback();
                                                                                }
                                                                        });

                                                                    }else{
                                                                        callback();
                                                                    }
                                                        },
                                                ],function(err){ //This function gets called after the two tasks have called their "task callbacks"
                                                            if(err){
                                                                console.log(err);
                                                                return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in dither creation', error_details: err}); //If an error occured, we let express/connect handle it by calling the "next" function
                                                            }else{
                                                                final_tagged_users_Array.forEach(function(factor, index){
                                                                        var roomName = "socket_user_"+factor;
                                                                        sails.sockets.broadcast(roomName,{
                                                                                                        type            :   "new",
                                                                                                        id              :   collage_results.id,
                                                                                                        message         :   "========== ditherCreate Room Broadcast --------",
                                                                                                        roomName        :   roomName,
                                                                                                        subscribers     :   sails.sockets.subscribers(roomName),
                                                                                                        socket          :   sails.sockets.rooms()
                                                                                                        });
                                                                });
                                                                /*taggedUserArrayFinal.forEach(function(factor, index){
                                                                        var roomName = "socket_user_"+factor.userId;
                                                                        sails.sockets.broadcast(roomName,{
                                                                                                        type            :   "new",
                                                                                                        id              :   collage_results.id,
                                                                                                        message         :   "========== ditherCreate Room Broadcast --------",
                                                                                                        roomName        :   roomName,
                                                                                                        subscribers     :   sails.sockets.subscribers(roomName),
                                                                                                        socket          :   sails.sockets.rooms()
                                                                                                        });
                                                                });*/
                                                                //console.log( "profile_image -----------" +profilePic_path + tokenCheck.tokenDetails.profilePic);
                                                                //console.log(" created_date_time-------------" +collage_results.createdAt);
                                                                //console.log("updated_date_time ------------" +collage_results.updatedAt);

                                                                //console.log(" collage_id-----------------"+collage_results.id);
                                                                //console.log(" collage_image-------------------"+collageImg_path + collage_results.image);
                                                                //console.log( "taggedUsers -------------------" +taggedUserArrayFinal);
                                                                //console.log(" dither_count ----------------------"+sortedVote.length);
                                                                //console.log("invite_friends_NUM--------------------------"+invite_friends_NUM);
                                                                //console.log(sortedVote);
                                                                //console.log(collage_results.imgTitle);
                                                                //console.log(collage_results.location);

                                                                return res.json(200, {status: 1, status_type: 'Success', message: 'Successfully created Collage',
                                                                                          //profile_image      :     profilePic_path + tokenCheck.tokenDetails.profilePic,
                                                                                          //user_name          :     tokenCheck.tokenDetails.name,
                                                                                          //user_id            :     tokenCheck.tokenDetails.userId,
                                                                                          //created_date_time  :     collage_results.createdAt,
                                                                                          //updated_date_time  :     collage_results.updatedAt,
                                                                                          collage_id         :     collage_results.id,
                                                                                          //collage_image      :     collageImg_path + collage_results.image,
                                                                                          //location           :     collage_results.location,
                                                                                          //caption            :     collage_results.imgTitle,
                                                                                          //vote               :     sortedVote,
                                                                                          //dither_count       :     sortedVote.length,
                                                                                          //taggedUsers        :     total_taggedUser_Array,
                                                                                          //invite_friends_NUM :     request.invite_friends_NUM,
                                                                                          reportedUsers      :     reportUserResults_JSON_Array,
                                                                });
                                                            }
                                                });

                                        }

                                }
                            });

            }
        },


};

