/**
 * CollageUploadController
 *
 * @description :: Server-side logic for managing collageuploads
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
               To Upload Dither (collage) Images
     ==================================================================================================================================== */
    uploadDither :  function (req, res) {
            console.log("uploadDither ========");
            var server_baseUrl              =     req.options.server_baseUrl;
            var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
            var collageImg_path             =     server_image_baseUrl + req.options.file_path.collageImg_path;
            var collageUploadDirectoryPath  =     '../../assets/images/collage';

            req.file('collage_image').upload({dirname: collageUploadDirectoryPath, maxBytes: 100 * 1000 * 1000},function (err, files) {
                    if (err){
                        console.log(err);
                        return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in uploading collage image', error_details: err});
                    }
                    else{

                        console.log("files ========================= >>>>>>>>>>>>>>  ");
                        console.log(files);
                        if(!files.length){
                                //console.log("File length zero ------------->>>>>>>>>>>>>  ");
                                return res.json(200, {status: 2, status_type: 'Failure', message: 'Please pass an image'});
                        }else{
                                //console.log("File length is there ------------->>>>>>>>>>>>>  ");
                                var collage_imageName           =   "";
                                var collageDetailImgArray       =   [];
                                //var keyArray = [];
                                //var valueArray = [];
                                files.forEach(function(factor, index){
                                        //console.log(factor);
                                        //console.log("++++++++++++++++");
                                        var filename                        =   factor.fd.split('/');
                                        filename                            =   filename[filename.length-1];
                                        var filename_without_extension      =   factor.filename.split('.');
                                        filename_without_extension          =   filename_without_extension[0];
                                        var image_name;
                                        //keyArray.push(filename_without_extension);
                                        //valueArray.push(collageImg_path + filename);
                                        collageDetailImgArray.push({
                                                    image_name      :   filename_without_extension,
                                                    image_url       :   collageImg_path + filename
                                                    });
                                });
                                //console.log("collageDetailImgArray =================");
                                //console.log(collageDetailImgArray);
                                 /*var keyValueArray = {},
                                        i;
                                //Merge 2 arrays
                                for (i = 0; i < keyArray.length; i++) {
                                    keyValueArray[keyArray[i]] = valueArray[i];
                                }
                                console.log("Key Value Array");
                                console.log(keyValueArray);*/
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
                            //console.log(req.param("REQUEST"));
                            //console.log(JSON.parse(req.param("REQUEST")));

                            var server_baseUrl              =     req.options.server_baseUrl;
                            var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                            var dither_expiry_hour          =     req.options.settingsKeyValue.DITHER_EXPIRY_HOUR;
                            var expiry_date                 =     new Date(new Date().getTime() + (dither_expiry_hour*1000*60*60));
                            var tokenCheck                  =     req.options.tokenCheck;
                            var userId                      =     tokenCheck.tokenDetails.userId;
                            var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                            var collageImg_path             =     server_image_baseUrl + req.options.file_path.collageImg_path;
                            //var imageUploadDirectoryPath    =     '../../assets/images/collage';
                            //var concatUploadImgArray;

                            var request                     =     JSON.parse(req.param("REQUEST"));

                            //console.log("request Using Param-----------------------------------------");
                            //console.log(request);
                            //console.log(request.dither_title);
                            //console.log(request.dither_location);
                            var device_type                 =     req.get('device_type');
                            //console.log("json parse====>>>>");
                            //console.log(JSON.parse(request));
                            //Tagged Users ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                            var vote                        =     [];
                            var sortedVote                  =     [];
                            var tagged_fbUser               =   request.tagged_fb_user;
                            var tagged_contactUser          =   request.tagged_user;
                            var get_dither_images           =   request.dither_images;
                            //var taggedUserArray        =   tagged_fbUser.concat(tagged_contactUser);
                            var taggedUserArray             =   union_arrays(tagged_fbUser, tagged_contactUser);
                            //var taggedUserArray = [];
                            //console.log("tagged_fbUser ++++++++++++++++++++");
                            //console.log(tagged_fbUser);
                            //console.log("tagged_contactUser ++++++++++++++++++++");
                            //console.log(tagged_contactUser);

                            var taggedUserArrayFinal        =   [];
                            //console.log("taggedUserArray ++++++++++++++++++++");
                            //console.log(taggedUserArray);
                            //console.log(taggedUserArray.length);
                            //Invite ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                            var inviteFriends               =   request.invite_friends_NUM;
                            //console.log("Without  parse inviteFriends =========================");
                            //console.log(inviteFriends);
                            inviteFriends                   =   JSON.parse(inviteFriends);
                            var inviteFriendsArray          =   [];
                            //console.log(req.param('invite_friends_NUM'));
                            //console.log("inviteFriends =========================");
                            //console.log(inviteFriends);

                            inviteFriends.forEach(function(factor, index){
                                        //console.log("factor  ========>>>>>>>> results");
                                        //console.log(factor);
                                        inviteFriendsArray.push(factor.phone_number);
                            });
                            //console.log(inviteFriendsArray.length);
                            var inviteFinalArray            =  [];
                            var tagNotifyArray              =  [];

                            var collage_results             =  "";
            async.series([
                    function(callback) {
                                console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^CALL BACK ----1 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                               /* req.file('collage_image').upload({dirname: imageUploadDirectoryPath, maxBytes: 100 * 1000 * 1000},function (err, files) {
                                        if (err)
                                        {
                                            console.log(err);
                                            return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in uploading collage image', error_details: err});
                                        }
                                        else
                                        {*/
                            //console.log(get_dither_images);
                            if(get_dither_images.length != 0){
                                    var collage_imageName           =   "";
                                    var collageDetailImgArray       =   [];
                                    //console.log(request);
                                    get_dither_images.forEach(function(factor, index){
                                        if(factor.image_name === "image_0"){
                                                collage_imageName       =   factor.image_url.split('/');
                                                collage_imageName       =   collage_imageName[collage_imageName.length-1];
                                                //console.log(collage_imageName);
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
                                    console.log("values---------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>");
                                    console.log(values);
                                    Collage.create(values).exec(function(err, results){
                                            if(err){
                                                    console.log(err);
                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage creation', error_details: err});
                                            }else{

                                                    if(results.length == 0){
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
                                                                    //console.log("switchKey_1================");
                                                                    //console.log(switchKey);
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
                                                                    //console.log(position);
                                                                    var switchKey_2 = filename_without_extension;
                                                                    //console.log("switchKey_2================");
                                                                    //console.log(switchKey_2);
                                                                    switch(switchKey_2){
                                                                            case 'image_0':
                                                                            break;
                                                                            default:
                                                                                    collageDetailImgArray.push({image: uploadedfilename, position: position, collageId: results.id, vote: 0});
                                                                            break;
                                                                    }
                                                                    //console.log("collageDetailImgArray ++++++++++++++++++++++");
                                                                    //console.log(collageDetailImgArray);
                                                            });

                                                            CollageDetails.create(collageDetailImgArray).exec(function(err, createdCollageDetails) {
                                                                    if(err)
                                                                    {
                                                                        console.log(err);
                                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage Detail creation', error_details: err});
                                                                    }else{
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
                                            }
                                    });
                            }else{
                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage Image found to add'});
                            }
                                       /* }

                                });*/
                    },
                    function(callback) {
                            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^CALL BACK ----2 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                                if(taggedUserArray.length != 0){
                                        //console.log(collage_results);
                                        //console.log("results.id+++++++++++++++++");
                                        //console.log(collage_results.id);

                                        var tagCollageArray = [];
                                        taggedUserArray.forEach(function(factor, index){
                                            //console.log("Refy tagged User ======>>>>> factor");
                                            //console.log(factor);
                                            tagCollageArray.push({collageId: collage_results.id, userId: factor});
                                        });
                                        //console.log("tagCollageArray }}}}}}}}}}}}}}}}}}}}}}}}");
                                        //console.log(tagCollageArray);

                                        Tags.create(tagCollageArray).exec(function(err, createdCollageTags) {
                                                if(err)
                                                {
                                                    console.log(err);
                                                    //console.log("+++++++++++++++++++++++++");
                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in inserting collage tagged users', error_details: err});
                                                }
                                                else
                                                {
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
                                                        AddressBook.query(query, function(err, taggedUsersFinalResults) {
                                                                if(err)
                                                                {
                                                                    console.log(err);
                                                                    //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Selecting tagged users from both address book and fb friends'});
                                                                }
                                                                else
                                                                {
                                                                    //console.log(query);
                                                                    //console.log(taggedUsersFinalResults);
                                                                    //console.log(taggedUsersFinalResults.length);


                                                                    if(taggedUsersFinalResults != 0){
                                                                        taggedUsersFinalResults.forEach(function(factor, index){
                                                                                //console.log("factor ------------))))))))))))))))======================");
                                                                                //console.log(factor);
                                                                                taggedUserArrayFinal.push({name: factor.name,userId: factor.ditherUserId});
                                                                        });
                                                                    }

                                                                    if(taggedUserArray.length !=0){
                                                                            taggedUserArray.forEach(function(factor, index){
                                                                                    //tagNotifyArray.push({id:factor.user_id});
                                                                                    tagNotifyArray.push(factor);
                                                                            });
                                                                            //console.log(tagNotifyArray.length);
                                                                            //console.log("tagged arrayyyyyyyyyyyyyyyyyyyyyyyyyy")
                                                                            //console.log(tagNotifyArray);
                                                                            var values ={
                                                                                            notificationTypeId  :   1,
                                                                                            userId              :   userId,
                                                                                            collage_id          :   collage_results.id,
                                                                                            tagged_users        :   tagNotifyArray,
                                                                                            //description         :   tagNotifyArray.length
                                                                                        }
                                                                            //console.log(values);
                                                                            NotificationLog.create(values).exec(function(err, createdNotificationTags) {
                                                                                if(err)
                                                                                {
                                                                                    console.log(err);
                                                                                    callback();
                                                                                    //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in inserting collage tagged users', error_details: err});
                                                                                }else{
                                                                                        taggedUserArray.forEach(function(factor, index){
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
                                                                                        console.log("Successfully Inserted to---->>. NotificationLog table");
                                                                                        console.log(createdNotificationTags);


                                                                                   //---------------------Push Notification In Tagged Users--------------------------------

                                                                                  var tagNtfyPush = [];
                                                                                  console.log("--------------------Tag Notify ArRAy---------------")
                                                                                  console.log(tagNotifyArray)
                                                                                  if(tagNotifyArray.length) {
                                                                                      //console.log("inside tagging")
                                                                                      
                                                                                    async.series([
																								function(callback) {   
																									
																									                                                                                      
																									   async.forEach(tagNotifyArray, function (factor, callback){
																										//tagNotifyArray.forEach(function(factor, index){
																												 User.findOne({id:factor}).exec(function (err, notifySettings){
																													   if(err)
																													   {
																														   console.log(err)
																													   }
																													   else
																													   {
																														 console.log("???????---Result----?????????")
																														 console.log(notifySettings)
																														 //console.log(notifySettings.notifyOpinion)
																														 if(notifySettings.notifyOpinion)
																														 {
																															console.log(factor)
																															tagNtfyPush.push(factor);
																														 }

																													   }
																													});
																											},callback());

																									
																								},
																								function(callback) {   
																									
																									
																									//console.log("Asking for your opinoin")
																									//console.log(tagNtfyPush)
																									var deviceId_arr    = [];
																									var message   = 'Notification For Opinion';
																									var ntfn_body =  tokenCheck.tokenDetails.name +" is Asking for Your Opinion";
																									User_token.find({userId: tagNtfyPush}).exec(function (err, response) {
																										if(err)
																										{
																											console.log(err)
																											callback();
																										}
																										else
																										{
																											console.log("------------Tag Notification Response----------------------")
																											console.log(response)
																											response.forEach(function(factor, index){

																												if(factor.deviceId!=req.get('device_id'))
																												{
																													deviceId_arr.push(factor.deviceId);
																												}

																											});

																											if(deviceId_arr.length)
																											{

																												console.log("=============PUSH NTFN============================")

																													var data        = {message:message,device_id:deviceId_arr,NtfnBody:ntfn_body,NtfnType:1,id:collage_results.id,notification_id:createdNotificationTags.id};
																													NotificationService.NtfnInAPP(data, function(err, ntfnSend) {
																																			if(err)
																																			{
																																				console.log("Error in Push Notification Sending")
																																				console.log(err)
																																				callback();
																																			}
																																			else
																																			{
																																				console.log("Push notification result")
																																				console.log(ntfnSend)
																																				console.log("Push Notification sended")
																																				callback();

																																			}
																													});



																											}
																											else
																											{
																												console.log("No deviceId")
																												callback();
																											}
																										   }

																										});
																								},
																								], function(err) {
																									if(err)
																									{
																										callback();
																									}
																									else
																									{
																										callback();
																									}
																								});

                                                                                        }
                                                                                 //-------------------END Of PUSH Notification-------------------------------------------------------------------
                                                                                      //  callback();

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
                                    //console.log(userId);
                                    inviteFriends.forEach(function(factor, index){
                                             inviteFinalArray.push({userId: parseInt(userId), collageId: collage_results.id, phoneNumber: factor.phone_number, invitee: factor.name});
                                    });
                                    //console.log("inviteFinalArray  -----------------------------++++++++++++++++++++++++++++++++++++");
                                    //console.log(inviteFinalArray);
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
                                    //console.log(sortedVote);
                                    //console.log(taggedUserArrayFinal);
                                    //console.log(invite_friends_NUM);

                                    taggedUserArrayFinal.forEach(function(factor, index){
                                            //console.log(factor);
                                            var roomName = "socket_user_"+factor.userId;
                                            //console.log(roomName);
                                            //sails.sockets.join(req.socket, roomName);
                                            //console.log(sails.sockets.subscribers(roomName));
                                            //console.log(sails.sockets.subscribers(socket_dither_3));
                                            sails.sockets.broadcast(roomName,{
                                                                            type            :   "new",
                                                                            id              :   collage_results.id,
                                                                            message         :   "========== ditherCreate Room Broadcast --------",
                                                                            roomName        :   roomName,
                                                                            subscribers     :   sails.sockets.subscribers(roomName),
                                                                            socket          :   sails.sockets.rooms()
                                                                            });
                                    });
                                    //console.log(collageImg_path + collage_results.image);
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
                                }
            });

            }

        },


};

