/**
 * CollageDetailsController
 *
 * @description :: Server-side logic for managing collagedetails
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs          = require('fs');
module.exports = {

/* ==================================================================================================================================
               To get a single Dither Details (For Both logged User and Other User)
  ==================================================================================================================================== */
        getDitherDetail: function (req, res) {
                console.log("collage details api==================");
                var server_baseUrl              =     req.options.server_baseUrl;
                var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                var collageImg_path             =     server_image_baseUrl + req.options.file_path.collageImg_path;
                var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                var profilePic_path_assets      =     req.options.file_path.profilePic_path_assets;
                var collageImg_path_assets      =     req.options.file_path.collageImg_path_assets;
                var tokenCheck                  =     req.options.tokenCheck;
                var userId                      =     tokenCheck.tokenDetails.userId;
                console.log(req.param("dither_id"));
                var get_collage_id              =     req.param("dither_id");
                var query;

                if(!get_collage_id){
                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please pass the dither_id'});
                }else{

                    if(req.isSocket){
                            console.log("Dither Details socket -------++++++++++  ");
                            /* // sails.sockets.join(socket, roomName);
                            console.log("Joining socket ------->>>>>>>>>>>  ");
                            console.log(sails.sockets.rooms());

                            //console.log(sails.sockets.socketRooms());
                            var roomName = "ditherDetail_"+get_collage_id;
                            sails.sockets.join(req.socket, roomName);
                            //console.log(sails.sockets.subscribers("ditherDetail_"+get_collage_id));
                            //console.log(sails.sockets.getId(req));
                            //console.log(sails.sockets);
                            //console.log(sails);
                            //console.log(req.session);
                            //console.log(currentSocketId);
                            //console.log(sails.sockets.getId(socket));
                            //console.log(socket);
                            console.log("roomName ---------");
                            console.log(roomName);
                            console.log("roomName 2nd---------");
                            console.log("ditherDetail_"+get_collage_id);
                            //console.log(currentSocketId);

                            console.log(sails.sockets.getId(req.socket));
                            console.log("SocketId For Blast ======= ---------");
                            console.log(sails.sockets.rooms());
                            console.log(sails.sockets.rooms(roomName));

                            console.log("sails.sockets.subscribers(roomName) ========== ---------------");
                            console.log(sails.sockets.subscribers(roomName));

                            sails.sockets.blast("dither_details", { greeting: 'Hola!' , type: "Blast --------", members : sails.sockets.rooms(), joinedMembers: sails.sockets.subscribers(roomName)});
                            sails.sockets.broadcast(sails.sockets.subscribers(roomName),{ greeting: 'dither Details ==== ++++!' , type: "==========Room Broadcast --------"});
                            //sails.sockets.broadcast(sails.sockets.getId(req.socket), sails.sockets.getId(req.socket),{ greeting: 'dither Details ==== ++++!' , type: "==========Id Broadcast --------"});
                            //console.log(sails.sockets.rooms(req));
                            console.log("Joining socket -------++++++++++  ");*/
                    }else{
                        query = " SELECT clg.image AS collageImage, clg.imgTitle, clg.location, clg.userId AS collageCreatorId, clg.totalVote, clg.createdAt, clg.updatedAt,"+
                                " clgdt.id AS imageId, clgdt.collageId, clgdt.image, clgdt.position, clgdt.vote,"+
                                " usr.name AS collageCreator, usr.profilePic,"+
                                " clglk.likeStatus, clglk.likePosition, clglk.userId likeUserId"+
                                " FROM collage clg"+
                                " INNER JOIN collageDetails clgdt ON clgdt.collageId = clg.id"+
                                " INNER JOIN user usr ON usr.id = clg.userId"+
                                " LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.likePosition = clgdt.position AND clglk.userId = "+userId+
                                //" LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.userId = "+userId+
                                " WHERE clg.id = "+get_collage_id+
                                " GROUP BY clgdt.id";
                        console.log(query);
                        Collage.query(query, function(err, results) {
                                if(err)
                                {
                                    console.log(err);
                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting the Collage Details'});
                                }
                                else
                                {
                                    if(results.length == 0){
                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage Found by this Id'});
                                    }else{

                                            //console.log("collage imagee")
                                            //console.log(results[0].collageImage)


                                            var imageArray = [];
                                            //console.log("results  ---------- getLike .....................++++++++++++++++++++");
                                            //console.log(results);
                                            var like_position_Array = [];
                                            var like_position;
                                            var like_status;
                                            results.forEach(function(factor, index){
                                                    //console.log("factor");
                                                    //console.log(factor.likeStatus);
                                                    var like_status;

                                                    if(factor.like_status == null || factor.like_status == "" || factor.like_status == 0){
                                                            like_status = 0;
                                                    }else{
                                                            like_status = 1;
                                                    }
                                                    imageArray.push({
                                                                    imageUrl : collageImg_path + factor.image,
                                                                    like_count: factor.vote,
                                                                    like_status: like_status,
                                                                    id: factor.imageId
                                                                    });
                                                            //console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                                                            //console.log("_______factor.likeUserId__________"+factor.likeUserId);
                                                            //console.log("_______factor.collageCreatorId__________"+factor.collageCreatorId);
                                                            //console.log("_______userId__________"+userId);
                                                            //console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                                                        if(factor.likeUserId != null || factor.likeUserId != "" ){
                                                                //console.log("Inside factor likeUserId not null ==============");
                                                                if(factor.likePosition != "" || factor.likePosition != null){
                                                                    if(factor.likeUserId == userId && factor.collageCreatorId != userId){
                                                                        //like_position = factor.likePosition;
                                                                        //console.log("Inside factor like User id check ================");
                                                                        like_position_Array.push(factor.likePosition);
                                                                    }
                                                                }
                                                        }
                                                        //console.log(like_position_Array);*/
                                                        /*if(factor.likePosition == factor.position){
                                                            console.log("like_status if ==============");
                                                            like_status = 1;
                                                        }else{
                                                            like_status = 0;
                                                        }
                                                        if(factor.likeStatus == null || factor.likeStatus == "" || factor.likeStatus == 0){
                                                            like_status = 0;
                                                        }else{
                                                                like_status = 1;
                                                        }
                                                        if(factor.likeUserId == userId && factor.userId != userId){
                                                            like_position_Array.push(factor.likePosition);
                                                        }*/
                                                        /*if(factor.likeUserId != null || factor.likeUserId != "" ){
                                                                //console.log("Inside factor likeUserId not null ==============");
                                                                if(factor.likePosition != "" || factor.likePosition !== null){
                                                                    if(factor.likeUserId == userId && factor.collageCreatorId != userId){
                                                                        //like_position = factor.likePosition;
                                                                        //console.log("Inside factor like User id check ================");
                                                                        like_position_Array.push(factor.likePosition);
                                                                    }
                                                                }
                                                        }
                                                        imageArray.push({
                                                                    imageUrl        :   collageImg_path + factor.image,
                                                                    like_count      :   factor.vote,
                                                                    like_status     :   like_status,
                                                                    id              :   factor.imageId
                                                                    });
                                                        */



                                            });
                                            //console.log("like_position+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                                            //console.log(like_position_Array);
                                            if(like_position_Array.length != 0){
                                                        like_position = like_position_Array[0];
                                            }else{
                                                        like_position = 0;
                                            }


                                            query = " SELECT clgcmt.id, clgcmt.comment, usr.name,usr.mentionId, clgcmt.createdAt,usr.profilePic, usr.id userId"+
                                                    " FROM collageComments clgcmt"+
                                                    " INNER JOIN user usr ON usr.id = clgcmt.userId"+
                                                    " WHERE clgcmt.collageId = "+get_collage_id+
                                                    " ORDER BY clgcmt.createdAt";

                                            CollageComments.query(query, function(err, collageCommentResults) {
                                                    if(err)
                                                    {
                                                        console.log(err);
                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting the Collage Comments'});
                                                    }
                                                    else
                                                    {
                                                            //console.log(collageCommentResults);
                                                            var commentArray = [];
                                                            if(collageCommentResults.length){
                                                                collageCommentResults.forEach(function(factor, index){
                                                                        //console.log("factor");
                                                                        //console.log(factor);
                                                                        var profile_image;
                                                                        if(factor.profilePic == null || factor.profilePic == ""){
                                                                             profile_image  = "";
                                                                        }else{
                                                                            //var imageSrc                    =     profilePic_path_assets + factor.profilePic;
                                                                           // var ext                         =     imageSrc.split('/');
                                                                           // ext                             =     ext[ext.length-1].split('.');
                                                                            //profile_image                   =     profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                                                            //var imageDst                    =     profilePic_path_assets + ext[0] + "_50x50" + "." +ext[1];
                                                                            var imageSrc                    =     profilePic_path_assets + factor.profilePic;
                                                                            fs.exists(imageSrc, function(exists) {
                                                                                 if (exists) {

                                                                                        //console.log("Image exists");

                                                                                        var ext                         =     imageSrc.split('/');
                                                                                        ext                             =     ext[ext.length-1].split('.');
                                                                                        var imageDst                    =     profilePic_path_assets + ext[0] + "_50x50" + "." +ext[1];
                                                                                        //console.log(imageSrc)
                                                                                        //console.log(imageDst)
                                                                                        ImgResizeService.isImageExist(imageSrc, imageDst, function(err, imageResizeResults) {
                                                                                            if(err)
                                                                                            {
                                                                                                console.log("thumbNail creation error occured")
                                                                                                console.log(err)


                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                //console.log(imageResizeResults)
                                                                                                profile_image = profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                                                                                console.log("--------**********************************************--------");
                                                                                                //console.log(commentArray)
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        profile_image = profilePic_path + factor.profilePic;
                                                                                    }

                                                                            });
                                                                        }
                                                                        commentArray.push({comment_id                   : factor.id,
                                                                                            user_id                     : factor.userId,
                                                                                            user_name                   : factor.name,
                                                                                            user_profile_pic_url        : profile_image,
                                                                                            mention_id                  : factor.mentionId,
                                                                                            message                     : factor.comment,
                                                                                            comment_created_date_time   : factor.createdAt
                                                                        });

                                                                });
                                                            }
                                                            //Query to get tagged users from both addressBook and fbFriends
                                                                query  = "SELECT *"+
                                                                        " FROM ("+
                                                                        " SELECT adb.ditherUserId, adb.ditherUsername, usr.name,usr.profilePic,usr.mentionId"+
                                                                        " FROM tags tg"+
                                                                        " INNER JOIN user usr ON usr.id = tg.userId"+
                                                                        " LEFT JOIN addressBook adb ON adb.ditherUserId = tg.userId"+
                                                                        " LEFT JOIN collage clg ON clg.id = tg.collageId"+
                                                                        " WHERE tg.collageId = "+get_collage_id+
                                                                        " GROUP BY adb.ditherUserId"+
                                                                        " UNION"+
                                                                        " SELECT fbf.ditherUserId, fbf.ditherUsername, usr.name, usr.profilePic,usr.mentionId"+
                                                                        " FROM tags tg"+
                                                                        " INNER JOIN user usr ON usr.id = tg.userId"+
                                                                        " LEFT JOIN fbFriends fbf ON fbf.ditherUserId = tg.userId"+
                                                                        " LEFT JOIN collage clg ON clg.id = tg.collageId"+
                                                                        " WHERE tg.collageId = "+get_collage_id+
                                                                        " GROUP BY fbf.ditherUserId"+
                                                                        " ) AS temp"+
                                                                        " WHERE temp.ditherUserId IS NOT NULL"+
                                                                        " AND temp.ditherUserId != "+results[0].collageCreatorId+
                                                                        " GROUP BY temp.ditherUserId";
                                                                    console.log(query);
                                                                AddressBook.query(query, function(err, taggedUsersFinalResults) {
                                                                        if(err)
                                                                        {
                                                                            console.log(err);
                                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Selecting tagged users from both address book and fb friends'});
                                                                        }
                                                                        else
                                                                        {

                                                                            console.log(query);
                                                                            var profile_image = "";
                                                                            //console.log(taggedUsersFinalResults);
                                                                            var taggedUserArrayFinal = [];
                                                                            if(taggedUsersFinalResults){
                                                                                taggedUsersFinalResults.forEach(function(factor, index){
                                                                                        //console.log("factor");
                                                                                        //console.log(factor);
                                                                                        if(factor.profilePic){
                                                                                            var imageSrc                    =     profilePic_path_assets + factor.profilePic;
                                                                                            //var ext                         =     imageSrc.split('/');
                                                                                            //ext                             =     ext[ext.length-1].split('.');
                                                                                            //profile_image                   =     profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                                                                            //console.log("--------**********************************************--------")

                                                                                            fs.exists(imageSrc, function(exists) {
                                                                                                    if (exists) {

                                                                                                        //console.log("Image exists");

                                                                                                        var ext                         =     imageSrc.split('/');
                                                                                                        ext                             =     ext[ext.length-1].split('.');
                                                                                                        var imageDst                    =     profilePic_path_assets + ext[0] + "_50x50" + "." +ext[1];
                                                                                                        //console.log(imageSrc)
                                                                                                        //console.log(imageDst)
                                                                                                        ImgResizeService.isImageExist(imageSrc, imageDst, function(err, imageResizeResults) {
                                                                                                            if(err)
                                                                                                            {
                                                                                                                console.log("thumbNail creation error occured")
                                                                                                                console.log(err)


                                                                                                            }
                                                                                                            else
                                                                                                            {
                                                                                                                //console.log(imageResizeResults)
                                                                                                                profile_image = profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                                                                                                //console.log("--------**********************************************--------")
                                                                                                                taggedUserArrayFinal.push({
                                                                                                                name            :   factor.name,
                                                                                                                userId          :   factor.ditherUserId,
                                                                                                                profile_image   :   profile_image,
                                                                                                                mention_id      :   factor.mentionId
                                                                                                                });
                                                                                                                //console.log(taggedUserArrayFinal)

                                                                                                            }
                                                                                                        });
                                                                                                    }
                                                                                                    else
                                                                                                    {
                                                                                                        profile_image = profilePic_path + factor.profilePic;
                                                                                                        taggedUserArrayFinal.push({
                                                                                                                name            :   factor.name,
                                                                                                                userId          :   factor.ditherUserId,
                                                                                                                profile_image   :   profile_image,
                                                                                                                mention_id      :   factor.mentionId
                                                                                                                });
                                                                                                    }

                                                                                            });
                                                                                        }
                                                                                        taggedUserArrayFinal.push({
                                                                                                    name            :   factor.name,
                                                                                                    userId          :   factor.ditherUserId,
                                                                                                    profile_image   :   profile_image,
                                                                                                    mention_id      :   factor.mentionId
                                                                                        });

                                                                                });
                                                                            }

                                                                            query = " SELECT invt.phoneNumber, invt.invitee"+
                                                                                    " FROM invitation invt"+
                                                                                    " WHERE invt.collageId = "+get_collage_id;
                                                                            console.log(query);
                                                                            Invitation.query(query, function(err, invitedUsersFinalResults){
                                                                                    if(err)
                                                                                    {
                                                                                        console.log(err);
                                                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Selecting invited users'});
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        //console.log("Invited Users =============>>>>>>>>>>>>>>>>>>   ");
                                                                                        var inviteeArray;
                                                                                        if(invitedUsersFinalResults.length){

                                                                                                inviteeArray = invitedUsersFinalResults;
                                                                                        }else{

                                                                                                inviteeArray = [];
                                                                                        }
                                                                                        var user_profile_image    =     "";
                                                                                        if(results[0].profilePic != "" || results[0].profilePic != null){
                                                                                            user_profile_image              =     profilePic_path + results[0].profilePic;
                                                                                        }

                                                                                    async.series([

                                                                                      function(callback) {

                                                                                            //------------------------------Generate ThumbnailImage-----------------------------------------------
                                                                                            /*if(results[0].profilePic){
                                                                                                    var imageSrc                    =     profilePic_path_assets + results[0].profilePic;
                                                                                                    var ext                         =     imageSrc.split('/');
                                                                                                    ext                             =     ext[ext.length-1].split('.');
                                                                                                    user_profile_image              =     profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                                                                                    callback();
                                                                                            }else{
                                                                                                    callback();
                                                                                            }*/
                                                                                            var imageSrc                    =     profilePic_path_assets + results[0].profilePic;
                                                                                            fs.exists(imageSrc, function(exists) {
                                                                                                    if (exists) {
                                                                                                        console.log("Image exists");
                                                                                                        var imageSrc                    =     profilePic_path_assets + results[0].profilePic;
                                                                                                        var ext                         =     imageSrc.split('/');
                                                                                                        ext                             =     ext[ext.length-1].split('.');
                                                                                                        var imageDst                    =     profilePic_path_assets + ext[0] + "_50x50" + "." +ext[1];
                                                                                                        //console.log(imageSrc)
                                                                                                        //console.log(imageDst)
                                                                                                        ImgResizeService.isImageExist(imageSrc, imageDst, function(err, imageResizeResults) {
                                                                                                            if(err)
                                                                                                            {
                                                                                                                console.log("thumbNail creation error occured")
                                                                                                                console.log(err)
                                                                                                                callback();

                                                                                                            }
                                                                                                            else
                                                                                                            {
                                                                                                                //console.log(imageResizeResults)
                                                                                                                user_profile_image = profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                                                                                                //console.log("--------**********************************************--------")
                                                                                                                //console.log(user_profile_image)
                                                                                                                callback();

                                                                                                            }
                                                                                                        });
                                                                                                    }
                                                                                                    else
                                                                                                    {
                                                                                                        callback();
                                                                                                    }
                                                                                            });
                                                                                        },


                                                                                        ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
                                                                                        if (err) {

                                                                                            console.log(err);
                                                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured Comment Updation', error_details: err});

                                                                                        }else{

                                                                                                console.log("result")
                                                                                                return res.json(200, {status: 1, status_type: 'Success' , message: 'Dither Details',
                                                                                                                             dither_desc                : results[0].imgTitle,
                                                                                                                             dither_created_date_time   : results[0].createdAt,
                                                                                                                             dither_updated_date_time   : results[0].updatedAt,
                                                                                                                             dither_id                  : results[0].collageId,
                                                                                                                             dither_created_username    : results[0].collageCreator,
                                                                                                                             dither_created_userID      : results[0].collageCreatorId,
                                                                                                                             dither_created_profile_pic : user_profile_image,
                                                                                                                             dither_location            : results[0].location,
                                                                                                                             dither_image               : collageImg_path + results[0].collageImage,
                                                                                                                             dither_like_position       : like_position,
                                                                                                                             dithers                    : imageArray,
                                                                                                                             ditherCount                : imageArray.length,
                                                                                                                             taggedUsers                : taggedUserArrayFinal,
                                                                                                                             comments                   : commentArray,
                                                                                                                             invite_friends_NUM         : inviteeArray,
                                                                                                                });
                                                                                             }
                                                                                        });


                                                                                    }
                                                                            });

                                                                        }
                                                                });//Selecting Tagged Users from both contact List and FB Friends

                                                    }
                                            });
                                    }
                                }
                        });
                    }//Else socket

                }

        },



 /* ==================================================================================================================================
               To get a single Dither Details (For Both logged User and Other User)
  ==================================================================================================================================== */
        getSingleDitherDetails: function (req, res) {
                    console.log("Single Dither Details api==================");
                    var server_baseUrl                           =     req.options.server_baseUrl;
                    var server_image_baseUrl                     =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                    var collageImg_path                          =     server_image_baseUrl + req.options.file_path.collageImg_path;
                    var profilePic_path                          =     server_image_baseUrl + req.options.file_path.profilePic_path;
                    var collageImg_path_assets                   =     req.options.file_path.collageImg_path_assets;
                    var received_collage_id                      =     req.param("dither_id");
                    var received_single_image_id                 =     req.param("dither_single_id");
                    var query;

                    if(!received_collage_id || !received_single_image_id){
                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please Pass both dither_id and dither_single_id'});
                    }else{
                            query = " SELECT"+
                                    " clgdt.id as single_image_id, clgdt.image, clgdt.vote,"+
                                    " clg.image as collageImage, clg.imgTitle,"+
                                    " usr.id as user_id, usr.name, usr.profilePic"+
                                    " FROM"+
                                    " collageDetails clgdt"+
                                    " INNER JOIN collage clg ON clg.id = clgdt.collageId"+
                                    " LEFT JOIN collageLikes clglk ON clglk.imageId = clgdt.id AND clglk.likePosition = clgdt.position"+
                                    " INNER JOIN user usr ON usr.id = clglk.userId"+
                                    " WHERE"+
                                    " clgdt.collageId = '"+received_collage_id+"' AND clgdt.id = '"+received_single_image_id+"'";
                            console.log(query);
                            CollageDetails.query(query, function(err, results) {
                                    if(err)
                                    {
                                        console.log(err);
                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting Single Dither Details'});
                                    }
                                    else
                                    {
                                        if(!results.length){
                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No users voted to this image'});
                                        }else{
                                                var votedUsersArray = [];
                                                var profile_image;
                                                results.forEach(function(factor, index){
                                                        if(factor.profilePic == null || factor.profilePic == ""){
                                                                    profile_image = "";
                                                        }else{

                                                                    profile_image = profilePic_path + factor.profilePic;
                                                        }
                                                        votedUsersArray.push({
                                                                            user_id : factor.user_id,
                                                                            user_name : factor.name,
                                                                            user_pic : profile_image
                                                                            });
                                                });

                                                if(results[0].collageImage)
                                                {
                                                    var clgImgSrc                   =     collageImg_path_assets + results[0].collageImage;
                                                    fs.exists(clgImgSrc, function(exists) {
                                                         if (exists) {

                                                                console.log("collge Image exists");

                                                                var ext                         =     clgImgSrc.split('/');
                                                                ext                             =     ext[ext.length-1].split('.');
                                                                var imageDst                    =     collageImg_path_assets + ext[0] + "_50x50" + "." +ext[1];

                                                                ImgResizeService.isImageExist(clgImgSrc, imageDst, function(err, imageResizeResults) {
                                                                    if(err)
                                                                    {
                                                                        console.log(err)

                                                                    }
                                                                    else
                                                                    {
                                                                        //console.log(imageResizeResults)
                                                                        dither_image = collageImg_path + results[0].collageImage;
                                                                        return res.json(200, {status: 1, status_type: 'Success' , message: 'Single Dither Details',
                                                                                              single_image_url              :   collageImg_path + results[0].image,
                                                                                              dither_title                  :   results[0].imgTitle,
                                                                                              dither_image                  :   dither_image,
                                                                                              total_vote                    :   results[0].vote,
                                                                                              single_dither_id              :   results[0].single_image_id,
                                                                                              voted_users                   :   votedUsersArray,
                                                                                        });
                                                                    }
                                                                });

                                                            }
                                                            else
                                                            {
                                                                dither_image = collageImg_path + results[0].collageImage;
                                                                return res.json(200, {status: 1, status_type: 'Success' , message: 'Single Dither Details',
                                                                                      single_image_url              :   collageImg_path + results[0].image,
                                                                                      dither_title                  :   results[0].imgTitle,
                                                                                      dither_image                  :   dither_image,
                                                                                      total_vote                    :   results[0].vote,
                                                                                      single_dither_id              :   results[0].single_image_id,
                                                                                      voted_users                   :   votedUsersArray,
                                                                }               );
                                                            }
                                                    });
                                                }

                                        }
                                    }
                            });
                    }
        },
};
