/**
 * Notification Controller
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var util        = require('util');
var fs          = require('fs');

module.exports = {

      /* ==================================================================================================================================
                Edit Notification Settings
       ==================================================================================================================================== */

          notificationSettings: function(req, res) {

                    console.log("Notification Settingssssssssssss")
                    var notifyOpinion   =   req.param('opinion');
                    var notifyVote      =   req.param('vote');
                    var notifyComment   =   req.param('comment');
                    var notifyContact   =   req.param('contact');
                    var notifyMention   =   req.param('mention');
                    var token           =   req.get('token');
                    console.log(req.param('opinion'))
                    console.log(req.param('vote'))
                    console.log(req.param('comment'))
                    console.log(req.param('contact'))

                    if(token!=undefined)
                    {
                        User_token.findOne({token: token}).exec(function (err, results){
                            if (err) {
                                        sails.log("jguguu"+err);
                                        return res.json(200, {status: 2, status_type: 'Failure' ,msg: 'Some error occured in finding userId', error_details: err});
                                    }
                                    else{
                                            var data     = {notifyOpinion:notifyOpinion, notifyVote:notifyVote,notifyComment:notifyComment,notifyContact:notifyContact,notifyMention:notifyMention};
                                            var criteria = {id: results.userId};

                                            User.update(criteria, data).exec(function(err, updatedUser) {
                                                if(err)
                                                {
                                                    console.log(err)
                                                    return res.json(200, {status: 2, status_type: 'Failure' ,msg: 'Some error occured in Updation', error_details: err});
                                                }
                                                else
                                                {
                                                    return res.json(200, {status: 1, status_type: 'Success' ,msg: 'Settings updated Successfully',opinion:updatedUser[0].notifyOpinion,vote:updatedUser[0].notifyVote,comment:updatedUser[0].notifyComment,contact:updatedUser[0].notifyContact,mention:updatedUser[0].notifyMention});

                                                }
                                            });


                                    }
                        });
                    }
                    else
                    {
                        console.log("token required")
                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Token Missing in Request'});
                    }



          },

     /* ==================================================================================================================================
                Notification API
       ==================================================================================================================================== */


        notification: function(req, res) {
                console.log("Notification API")
                var tokenCheck             =     req.options.tokenCheck;
                var user_id                =     tokenCheck.tokenDetails.id;
                var server_baseUrl         =     req.options.server_baseUrl;
                var server_image_baseUrl   =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                var profilePic_path        =     server_image_baseUrl + req.options.file_path.profilePic_path;
                var collageImg_path        =     server_image_baseUrl + req.options.file_path.collageImg_path;
                var profilePic_path_assets =     req.options.file_path.profilePic_path_assets;
                var collageImg_path_assets =     req.options.file_path.collageImg_path_assets;
                var device_id              =     tokenCheck.tokenDetails.deviceId;
                notificationVoted          =     "";
                notificationCommented      =     "";
                notificationSignup         =     "";
                notifyVoteArray            =     [];
                notifyCmntArray            =     [];
                var focus_Ntfn_id          =     req.param("focus_Ntfn_id");
                var data_view_limit        =     req.options.global.data_view_limit;
                if(!focus_Ntfn_id){
                            return res.json(200, {status: 2,status_type:"Failure", msg: 'Please Pass focus_Ntfn_id'});
                }else{
                        if(focus_Ntfn_id == 0){
                            var query   =   " SELECT"+
                                                " N.id,N.userId,N.ditherUserId,N.collage_id as ditherId,N.notificationTypeId,N.createdAt as createdDate,N.image_id,N.tagged_users,N.description,"+
                                                " U.name,U.profilePic as profile_image,"+
                                                " C.image as dither_image,C.expiryDate"+
                                                " FROM  notificationLog as N INNER JOIN user as U ON U.id = N.userId"+
                                                " LEFT JOIN collage as C ON C.id = N.collage_id"+
                                                " WHERE"+
                                                //" U.status = 'active'"+
                                                " N.ditherUserId="+user_id+
                                                " AND(N.notificationTypeId=1 OR N.notificationTypeId=2 OR N.notificationTypeId=3 OR N.notificationTypeId=4 OR N.notificationTypeId=7 OR N.notificationTypeId=8)"+
                                                " OR "+
                                                " FIND_IN_SET("+user_id+", N.tagged_users) ORDER BY N.updatedAt DESC LIMIT "+data_view_limit;

                        }else{
                            var query  =   " SELECT"+
                                            " * FROM"+
                                            " ("+
                                            " SELECT"+
                                            " N.id,N.userId,N.ditherUserId,N.collage_id as ditherId,N.notificationTypeId,N.createdAt as createdDate,N.image_id,N.tagged_users,N.description,"+
                                            " U.name,U.profilePic as profile_image,C.image as dither_image,C.expiryDate"+
                                            " FROM notificationLog as N INNER JOIN user as U ON U.id = N.userId"+
                                            " LEFT JOIN collage as C ON C.id = N.collage_id"+
                                            " WHERE"+
                                            //" U.status = 'active'"+
                                            " N.ditherUserId="+user_id+
                                            " OR"+
                                            " FIND_IN_SET("+user_id+", N.tagged_users) ORDER BY N.updatedAt DESC"+
                                            ") as temp"+
                                            " where temp.id <"+focus_Ntfn_id+
                                            " LIMIT "+data_view_limit;

                            //--------------------------------------------------------------------
                        }
                        console.log(query)
                        NotificationLog.query(query, function(err,results){
                            if(err){
                                console.log(err)
                            }else{
                                console.log(results.length)
                                if(!results.length){
                                      return res.json(200, {status: 1,status_type:"Success",msg: 'No notification found',notification_data:[]});
                                }else{
                                    async.forEach(results, function (item, callback){
                                        //console.log(results)
                                        if(item.notificationTypeId == 1 || item.notificationTypeId == 2 || item.notificationTypeId == 3 || item.notificationTypeId == 4 || item.notificationTypeId == 7 || item.notificationTypeId == 8){
                                            //----------Comment Notification---------------------------
                                            if(item.notificationTypeId == 3){
                                                console.log("Notification Comment")
                                                NotificationType.find({id:3 }).exec(function(err, ntfnTypeFound){
                                                    if(err){
                                                        console.log(err)
                                                        callback();
                                                    }else{
                                                            notificationCommented   =   "No notification Found for comments";
                                                            var notification        =   ntfnTypeFound[0].body;
                                                            item.type               =   ntfnTypeFound[0].type;
                                                            var imageToResize       =   item.profile_image;
                                                            var clgImgToResize      =   item.dither_image;
                                                            item.profile_image      =   profilePic_path + item.profile_image;
                                                            item.dither_image       =   collageImg_path + item.dither_image;
                                                            if(item.description<=1){
                                                                    notificationCommented = " commented on your Dither";
                                                                    item.ntfn_body        = notificationCommented;
                                                            }else if(item.description==2)
                                                            {
                                                                    notificationCommented =  " and 1 other commented on your Dither";
                                                                    item.ntfn_body        =  notificationCommented;
                                                            }
                                                            else
                                                            {

                                                                    item.description        =   item.description - 1;
                                                                    ntfn_body               =   util.format(notification,item.description);
                                                                    notificationCommented   =   ntfn_body;
                                                                    item.ntfn_body          =   ntfn_body;
                                                                    notifyCmntArray         =   [];
                                                                    notifyCmntArray.push({ditherId: item.collage_id, userId: item.ditherUserId,msg:notificationCommented});
                                                            }
                                                             // ------------------------------Generate ThumbnailImage-----------------------------------------------
                                                            if(imageToResize)
                                                            {
                                                                var imageSrc                    =     imageToResize;
                                                                var ext                         =     imageSrc.split('.');
                                                                item.profile_image              =     profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                                            }

                                                            var clgImgSrc                       =     collageImg_path_assets + clgImgToResize;

                                                                fs.exists(clgImgSrc, function(exists){
                                                                        if(exists){
                                                                            var ext                         =     clgImgSrc.split('/');
                                                                            ext                             =     ext[ext.length-1].split('.');
                                                                            var imageDst                    =     collageImg_path_assets + ext[0] + "_50x50" + "." +ext[1];
                                                                            ImgResizeService.isImageExist(clgImgSrc, imageDst, function(err, imageResizeResults) {
                                                                                if(err){
                                                                                    console.log(err)
                                                                                    callback();
                                                                                }else{
                                                                                    item.dither_image = collageImg_path + ext[0] + "_50x50" + "." +ext[1];
                                                                                    callback();
                                                                                }
                                                                            });
                                                                        }else{
                                                                            callback();
                                                                        }
                                                                });

                                                    }
                                                });
                                            }else if(item.notificationTypeId==2){
                                                  console.log("Notification Vote")
                                                  NotificationType.find({id:2 }).exec(function(err, ntfnTypeFound){
                                                        if(err){
                                                            console.log(err)
                                                            callback();
                                                        }else{
                                                            var notification        =   ntfnTypeFound[0].body;
                                                            item.type               =   ntfnTypeFound[0].type;
                                                            var imageToResize       =   item.profile_image;
                                                            var clgImgToResize      =   item.dither_image;
                                                            item.dither_image       =   collageImg_path + item.dither_image;
                                                            if(item.description<=1){
                                                                notificationVoted   =   " voted on your Dither";
                                                                item.ntfn_body      =   notificationVoted;
                                                            }else if(item.description==2)
                                                            {
                                                                    notificationCommented =  " and 1 other voted on your Dither";
                                                                    item.ntfn_body        = notificationCommented;
                                                            }
                                                            else{
                                                                item.description    =   item.description - 1;
                                                                ntfn_body           =   util.format(notification,item.description);
                                                                notificationVoted   =   ntfn_body;
                                                                item.ntfn_body      =   ntfn_body;
                                                                notifyVoteArray     =   [];
                                                                notifyVoteArray.push({
                                                                                    ditherId    :   item.collage_id,
                                                                                    userId      :   item.ditherUserId,
                                                                                    msg         :   notificationVoted
                                                                                    });
                                                            }
                                                            // ------------------------------Generate ThumbnailImage-----------------------------------------------
                                                            if(imageToResize)
                                                            {
                                                                var imageSrc                    =     imageToResize;
                                                                var ext                         =     imageSrc.split('.');
                                                                item.profile_image              =     profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                                            }
                                                                var clgImgSrc                   =     collageImg_path_assets + clgImgToResize;

                                                                    fs.exists(clgImgSrc, function(exists) {
                                                                        if (exists) {
                                                                                var ext                         =     clgImgSrc.split('/');
                                                                                ext                             =     ext[ext.length-1].split('.');
                                                                                var imageDst                    =     collageImg_path_assets + ext[0] + "_50x50" + "." +ext[1];
                                                                                ImgResizeService.isImageExist(clgImgSrc, imageDst, function(err, imageResizeResults) {
                                                                                    if(err){
                                                                                        console.log(err)
                                                                                        callback();
                                                                                    }else{
                                                                                        item.dither_image = collageImg_path + ext[0] + "_50x50" + "." +ext[1];
                                                                                        callback();
                                                                                    }
                                                                                });
                                                                        }else{
                                                                                callback();
                                                                        }
                                                                    });
                                                        }
                                                    });
                                            }else if(item.notificationTypeId==4){
                                                    console.log("signuppp ")
                                                    NotificationType.find({id:4 }).exec(function(err, ntfnTypeFound){
                                                        if(err){
                                                                console.log(err)
                                                                callback();
                                                        }else{
                                                                var notification    =   ntfnTypeFound[0].body;

                                                                ntfn_body           =   util.format(notification, item.name);

                                                                item.ntfn_body      =   ntfn_body;
                                                                item.type           =   ntfnTypeFound[0].type;
                                                                var imageToResize   =   item.profile_image;
                                                                var clgImgToResize  =   item.dither_image;
                                                                item.dither_image   =   collageImg_path + item.dither_image;
                                                                notificationSignup  =   ntfn_body;
                                                                // ------------------------------Generate ThumbnailImage-----------------------------------------------
                                                                if(imageToResize)
                                                                {
                                                                var imageSrc                    =     imageToResize;
                                                                var ext                         =     imageSrc.split('.');
                                                                item.profile_image              =     profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                                                }
                                                                var clgImgSrc                   =     collageImg_path_assets + clgImgToResize;

                                                                    fs.exists(clgImgSrc, function(exists){
                                                                        if(exists){
                                                                                var ext                         =     clgImgSrc.split('/');
                                                                                ext                             =     ext[ext.length-1].split('.');
                                                                                var imageDst                    =     collageImg_path_assets + ext[0] + "_50x50" + "." +ext[1];
                                                                                ImgResizeService.isImageExist(clgImgSrc, imageDst, function(err, imageResizeResults) {

                                                                                    if(err)
                                                                                    {
                                                                                        console.log(err)
                                                                                        callback();
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        item.dither_image = collageImg_path + ext[0] + "_50x50" + "." +ext[1];
                                                                                        callback();
                                                                                    }
                                                                                });
                                                                        }else{
                                                                            callback();
                                                                        }
                                                                    });
                                                        }
                                                    });
                                            }else if(item.notificationTypeId == 1){
                                                NotificationType.find({id:1 }).exec(function(err, ntfnTypeFound){
                                                    if(err){
                                                        console.log(err)
                                                        callback();
                                                    }else{
                                                        var notification        =   ntfnTypeFound[0].body;
                                                        var ntfn_body           =   util.format(notification);
                                                        item.type               =   ntfnTypeFound[0].type;
                                                        item.ntfn_body          =   ntfn_body;
                                                        var imageToResize       =   item.profile_image;
                                                        var clgImgToResize      =   item.dither_image;
                                                        item.dither_image       =   collageImg_path + item.dither_image;
                                                        notificationTagged      =   ntfn_body;

                                                        // ------------------------------Generate ThumbnailImage-----------------------------------------------
                                                        if(imageToResize){
                                                            var imageSrc                    =     imageToResize;
                                                            var ext                         =     imageSrc.split('.');
                                                            item.profile_image              =     profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                                        }
                                                        var clgImgSrc                   =     collageImg_path_assets + clgImgToResize;
                                                        fs.exists(clgImgSrc, function(exists) {
                                                            if(exists){
                                                                var ext                         =     clgImgSrc.split('/');
                                                                ext                             =     ext[ext.length-1].split('.');
                                                                var imageDst                    =     collageImg_path_assets + ext[0] + "_50x50" + "." +ext[1];
                                                                ImgResizeService.isImageExist(clgImgSrc, imageDst, function(err, imageResizeResults){
                                                                    if(err){
                                                                        console.log(err)
                                                                        callback();
                                                                    }else{
                                                                        item.dither_image = collageImg_path + ext[0] + "_50x50" + "." +ext[1];
                                                                        callback();
                                                                    }
                                                                });
                                                            }else{
                                                                callback();
                                                            }
                                                        });

                                                    }
                                                });
                                            }else if(item.notificationTypeId==7){
                                                console.log("Notification Mention")
                                                NotificationType.find({id:7 }).exec(function(err, ntfnTypeFound){
                                                        if(err){
                                                            console.log(err)
                                                            callback();
                                                        }else{
                                                            var notification    = ntfnTypeFound[0].body;
                                                            var ntfn_body       = util.format(notification);
                                                            item.type           =   ntfnTypeFound[0].type;
                                                            item.ntfn_body      =   ntfn_body;
                                                            var imageToResize   =   item.profile_image;
                                                            var clgImgToResize  =   item.dither_image;
                                                            item.dither_image   =   collageImg_path + item.dither_image;
                                                            notificationTagged  =  ntfn_body;

                                                            // ------------------------------Generate ThumbnailImage-----------------------------------------------
                                                            if(imageToResize)
                                                            {
                                                                var imageSrc                    =     imageToResize;
                                                                var ext                         =     imageSrc.split('.');
                                                                item.profile_image              =     profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                                            }
                                                                var clgImgSrc                   =     collageImg_path_assets + clgImgToResize;

                                                                    fs.exists(clgImgSrc, function(exists) {
                                                                        if(exists){
                                                                            var ext                         =     clgImgSrc.split('/');
                                                                            ext                             =     ext[ext.length-1].split('.');
                                                                            var imageDst                    =     collageImg_path_assets + ext[0] + "_50x50" + "." +ext[1];
                                                                            ImgResizeService.isImageExist(clgImgSrc, imageDst, function(err, imageResizeResults){
                                                                                if(err){
                                                                                    console.log(err)
                                                                                    callback();
                                                                                }else{
                                                                                    item.dither_image = collageImg_path + ext[0] + "_50x50" + "." +ext[1];
                                                                                    callback();
                                                                                }
                                                                            });
                                                                        }else{
                                                                            callback();
                                                                        }
                                                                    });
                                                        }
                                                });
                                            }else if(item.notificationTypeId==8){
                                                console.log("Notification for dither Expire")
                                                NotificationType.find({id:8 }).exec(function(err, ntfnTypeFound){
                                                    if(err)
                                                    {
                                                        console.log(err)
                                                        callback();
                                                    }
                                                    else
                                                    {
                                                        var notification    =   ntfnTypeFound[0].body;
                                                        var ntfn_body       =   util.format(notification);
                                                        item.type           =   ntfnTypeFound[0].type;
                                                        item.ntfn_body      =   ntfn_body;
                                                        var clgImgToResize  =   item.dither_image;
                                                        item.dither_image   =   collageImg_path + item.dither_image;
                                                        notificationTagged  =   ntfn_body;

                                                        var imageToResize   =   item.profile_image;
                                                        // ------------------------------Generate ThumbnailImage-----------------------------------------------
                                                        if(imageToResize){
                                                            var imageSrc                    =     imageToResize;
                                                            var ext                         =     imageSrc.split('.');
                                                            item.profile_image              =     profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                                        }
                                                        var clgImgSrc       =   collageImg_path_assets + clgImgToResize;
                                                        fs.exists(clgImgSrc, function(exists) {
                                                            if(exists){
                                                                var ext                         =     clgImgSrc.split('/');
                                                                ext                             =     ext[ext.length-1].split('.');
                                                                var imageDst                    =     collageImg_path_assets + ext[0] + "_50x50" + "." +ext[1];
                                                                ImgResizeService.isImageExist(clgImgSrc, imageDst, function(err, imageResizeResults){
                                                                    if(err){
                                                                        console.log(err)
                                                                        callback();
                                                                    }else{
                                                                        item.dither_image = collageImg_path + ext[0] + "_50x50" + "." +ext[1];
                                                                        callback();
                                                                    }
                                                                });
                                                            }else{
                                                                callback();
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        }else{
                                            callback();
                                        }
                                    }, function(err) {
                                          if(err)
                                          {
                                            return res.json(200, {status: 2,status_type:"Failure", msg: 'Error occured in Notification Fetching'});
                                          }
                                          else
                                          {
                                            return res.json(200, {status: 1,status_type:"Success", msg: 'success',notification_data:results});
                                          }
                                    });
                                }
                            }
                        });
                }
                //}
        },

    /* ==================================================================================================================================
                Type Notification API
    ==================================================================================================================================== */


        typeNotification: function(req, res) {

                    var notificationTypeId          =   req.param("notification_type");
                    var notificationId              =   req.param("notification_id");
                    var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                    var collageImg_path             =     server_image_baseUrl + req.options.file_path.collageImg_path;
                    var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                    var query, notification, ntfn_body;
                    if(!notificationTypeId && !notificationId){
                           return res.json(200, {status: 2, status_type:"Failure", msg: 'Please pass notification_type and notification_id'});
                    }else{

                            query = "SELECT ntlg.id, ntlg.notificationTypeId, ntlg.collage_id, ntlg.userId, ntlg.ditherUserId, ntlg.description, ntlg.createdAt,"+
                                    " usr.name, usr.profilePic,"+
                                    " clg.image as collageImage"+
                                    " FROM notificationLog ntlg"+
                                    " INNER JOIN user usr ON usr.id = ntlg.userId"+
                                    " INNER JOIN collage clg ON clg.id = ntlg.collage_id"+
                                    " WHERE"+
                                    " ntlg.id = "+notificationId;

                            NotificationLog.query(query, function(err,results) {
                                    if(err){
                                            console.log(err);
                                            return res.json(200, {status: 2, status_type:"Failure", msg: 'Some error occured in getting Socket typeNotification'});
                                    }
                                    else{
                                            if(results.length == 0){
                                                    return res.json(200, {status: 2, status_type:"Failure", msg: 'No notification Found'});
                                            }else{
                                                    NotificationType.findOne({id: notificationTypeId}).exec(function(err, ntfnFoundResults){
                                                            if(err){
                                                                    console.log(err);
                                                                    return res.json(200, {status: 2, status_type:"Failure", msg: 'Some error occured in getting Socket typeNotification body/msg'});

                                                            }else{
                                                                user_id                 =   results[0].ditherUserId;
                                                                var tagged_users            =   [];
                                                                var switchKey = results[0].notificationTypeId;
                                                                switch(switchKey){

                                                                    case 1:
                                                                            tagged_users            =   results[0].tagged_users;

                                                                    break;

                                                                    case 2:

                                                                            notification            =   " voted on your Dither";

                                                                    break;

                                                                    case 3:
                                                                            notification            =   " commented on your Dither";

                                                                    break;

                                                                    default:
                                                                            notification            =   ntfnFoundResults.body;

                                                                    break;
                                                                }

                                                                ntfn_body               =   notification;
                                                                if(results[0].description > 1 ){
                                                                    notification                =       ntfnFoundResults.body;
                                                                    results[0].description      =       results[0].description - 1;
                                                                    ntfn_body                   =       util.format(notification, results[0].description);
                                                                }
                                                                return res.json(200, {status: 1, status_type: 'Success' , message: 'Type Notification api success',
                                                                                      id                    :   notificationId,
                                                                                      userId                :   results[0].userId,
                                                                                      ditherUserId          :   results[0].ditherUserId,
                                                                                      ditherId              :   results[0].collage_id,
                                                                                      notificationTypeId    :   notificationTypeId,
                                                                                      createdDate           :   results[0].createdAt,
                                                                                      image_id              :   results[0].image_id,
                                                                                      tagged_users          :   tagged_users,
                                                                                      description           :   results[0].description,
                                                                                      name                  :   results[0].name,
                                                                                      profile_image         :   profilePic_path + results[0].profilePic,
                                                                                      dither_image          :   collageImg_path + results[0].collageImage,
                                                                                      ntfn_body             :   ntfn_body,
                                                                                      type                  :   ntfnFoundResults.type,
                                                                                });

                                                            }
                                                    });
                                            }

                                    }
                            });
                    }
        }



};
