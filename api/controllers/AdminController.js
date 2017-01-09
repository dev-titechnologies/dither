
/**
 * AdminController
 *
 * @description :: Server-side logic for managing Admin
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var crypto = require('crypto');
 var fs          = require('fs');
 var request     = require('request');
 var path        = require('path');

 var  googleapis = require('googleapis');
 var  key        = require('service-account-credentials.json');
 const VIEW_ID   = 'ga:130989248';
 var todayISO           =   new Date().toISOString();

module.exports = {

    // Admin Login
         adminLogin: function (req, res) {
        console.log("userLogin  .....");
         var password = crypto.createHash('md5').update(req.body.password).digest("hex");
         console.log(password);
        //var password = req.body.password;
        var values = {
            username: req.body.email,
            password: password
        };
console.log(values);
        // Get Admin details
        Admin.findOne(values).exec(function (err, result) {
            if (err) {

                sails.log.debug('Some error occured ' + err);
                return res.json(200, {status: 2, message: 'some error occured', error: err});

            } else {

                if (typeof result == "undefined")
                {
                    sails.log.debug({message: 'No admin found'});
                    return res.json(200, {status: 2, message: 'No admin found', data: result});

                }
                else
                {

                        return res.json(200, {status: 1, message: 'success', data: result.id });


                }

            }
        });



    },

    // View Details of every single User
    getUserDetails: function(req, res){
                    console.log("getUserDetails ============== ADMIN");
                    var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                    var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                    var profilePic_path_assets      =     req.options.file_path.profilePic_path_assets;
                    var profile_image, profile_image_200x200;
                    var userId                      =       req.body.userId;

                    var query = " SELECT"+
                                " usr.id, usr.name, usr.email, usr.profilePic as profileImage, usr.phoneNumber, usr.status, usr.createdAt, "+
                                " clg.id as collageId,"+
                                " (SELECT COUNT(id) FROM collage WHERE userId = "+userId+" AND expiryDate < '"+todayISO+"') as cdCount,"+
                                " (SELECT COUNT(id) FROM collage WHERE userId = "+userId+" AND expiryDate > '"+todayISO+"') as odCount,"+
                                " (SELECT COUNT(id) FROM collage WHERE userId = "+userId+") as tdCount,"+
                                " (SELECT COUNT(id) FROM collage WHERE userId = "+userId+" AND status = 'inactive') as bdCount"+
                                " FROM  user usr"+
                                " LEFT JOIN collage clg ON clg.userId = usr.id"+
                                " WHERE usr.id="+userId;
                    console.log(query);
                    /*User.query(query, function(err, result){
                        if(err){
                            // console.log(err);
                            return res.json(200, { status: 2, error_details: 'db error' });
                        }else{
                            //console.log(result);
                            result.forEach(function(factor, index){
                                    if(factor.profileImage == null || factor.profileImage == ""){
                                            profile_image                   =     "";
                                    }else{
                                            profile_image                   =     profilePic_path + factor.profileImage;
                                    }
                                    factor.profilePic       =    profile_image;
                            });
                            console.log(result);
                            return res.json(200, {status: 1, message: "success", data: result});
                        }
                    });*/

                    var results             =       [];
                    async.series([
                                function(callback) {
                                            User.query(query, function (err, result){
                                                if(err){
                                                    //return res.json(200, {status: 2, error_details: err});
                                                    callback();
                                                }else{
                                                        results  = result;
                                                        callback();
                                                }
                                            });
                                },
                                function(callback){
                                            console.log("INSIDE user foreach callback........");
                                            var count = 0;
                                            results.forEach(function(factor, index){
                                                    count++;
                                                    var imageSrc                    =     profilePic_path_assets + factor.profileImage;
                                                    var ext                         =     imageSrc.split('/');
                                                    ext                             =     ext[ext.length-1].split('.');
                                                    var imgWidth,
                                                        imgHeight,
                                                        imageDst;

                                                    async.series([
                                                            function(callback) {
                                                                        /*imgWidth                    =    242;
                                                                        imgHeight                   =    242;
                                                                        imageDst                    =     collageImg_path_assets + ext[0] + "_"+imgWidth+"x"+imgHeight+"." +ext[1];
                                                                        ImgResizeService.imageResizeWH(imgWidth, imgHeight, imageSrc, imageDst, function(err, imageResizeResults) {
                                                                                if(err){
                                                                                        console.log(err);
                                                                                        console.log("Error in image resize 160 in collagedetails!!!!");
                                                                                        //callback();
                                                                                }else{
                                                                                       // callback();
                                                                                        console.log("Loop success");
                                                                                        //collage-Details images

                                                                                }
                                                                        });*/
                                                                        callback();

                                                            },
                                                    ],function(err){
                                                                if(err){
                                                                    console.log(err);
                                                                    //callback();
                                                                }else{
                                                                        if(factor.profileImage == null || factor.profileImage == ""){
                                                                                profile_image                   =     "";
                                                                                profile_image_200x200           =     "";
                                                                        }else{
                                                                                var imageSrc                    =     profilePic_path_assets + factor.profileImage;
                                                                                var ext                         =     imageSrc.split('/');
                                                                                ext                             =     ext[ext.length-1].split('.');
                                                                                profile_image                   =     profilePic_path + factor.profileImage;
                                                                                profile_image_200x200           =     profilePic_path + ext[0] + "_200x200." +ext[1];
                                                                        }
                                                                        factor.profilePic                       =     profile_image;
                                                                        factor.profilePic_200x200               =     profile_image_200x200;
                                                                        //console.log(factor.profilePic_70x70);
                                                                        if(count == results.length){
                                                                                callback();
                                                                        }
                                                                }
                                                    });


                                            });

                                },
                    ],function(err){
                                if(err){
                                    console.log(err);
                                    //callback();
                                    return res.json(200, {status: 2, message: "Failure"
                                                    });
                                }else{
                                        //console.log("Results ---------- >>>>>>>>>");
                                        //console.log(results);
                                         return res.json(200, {status: 1, message: "success",
                                                                data: results
                                                    });
                                }

                    });

    },
    //Delete a particular User
    deleteUser: function(req, res){
                    criteria={id: req.body.userId};
                    data= {status: 'delete'};
                User.update(criteria, data).exec(function (err, result) {
                    if(err)
                    {
                        // console.log(err);
                        return res.json(200, { status: 2, error_details: 'db error' });
                    }
                    else
                    {

                        //console.log(result);
                        return res.json(200, {status: 1, message: "success", data: result});
                    }
                });

    },
    // Activate Deactivate User
    userStatus: function(req, res){
                    //key=req.body.key;
                    criteria={id: req.body.userId};
                    data= {status: req.body.status};

                User.update(criteria, data).exec(function (err, result) {
                    if(err)
                    {
                         console.log(err);
                        return res.json(200, { status: 2, error_details: 'db error' });
                    }
                    else
                    {

                        console.log(result);
                        return res.json(200, {status: 1, message: "success", data: result});
                    }
                });

    },

    /* ==================================================================================================================================
               Get each dither details
   ==================================================================================================================================== */
    getSingleDitherDetails: function(req,res){
                console.log("getSingleDitherDetails ===>>>>");
                var ditherId                    =     req.param("id");
                var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                var collageImg_path             =     server_image_baseUrl + req.options.file_path.collageImg_path;
                var collageImg_path_assets      =     req.options.file_path.collageImg_path_assets;
                var single_image, single_image_160x160, single_image_70x70, collage_image, collage_image_350x350;
                // var ditherId = 507;
                console.log("inside getSingleDitherDetails function"+ditherId);
                var query = " SELECT"+
                             " c.createdAt, c.imgTitle, c.location, c.totalVote, c.image,"+
                             " cd.image as single_image, cd.vote as individualVote,"+
                             " u.name"+
                             " FROM collage as c"+
                             " INNER JOIN collageDetails as cd ON c.id = cd.collageId"+
                             " INNER JOIN  user as u ON u.id = c.userId"+
                             " where c.id = "+ditherId+
                             " ORDER BY cd.createdAt DESC";
                console.log(query);
                /*Collage.query(query, function(err, result){
                    if(err){
                        return res.json(200, {status: 2, error_details: err});
                    }else{
                        console.log(result);
                        if(result){
                            result.forEach(function(factor, index){
                                    if(factor.singImage == null || factor.singImage == "" ){
                                            singImage                   =     "";
                                            dither_image                =     "";
                                    }else{
                                            dither_image                    =     collageImg_path + factor.image
                                            singImage                       =     collageImg_path + factor.singImage ;
                                    }
                                     factor.singImage       =    singImage;
                                     factor.image           =   dither_image;
                                     console.log(factor.singImage)
                                     console.log(factor.image)
                            });
                        }
                        return res.json(200, {status: 1, message: "success", result: result});
                    }
                });*/
                var results             =       [];
                async.series([
                            function(callback) {
                                        Collage.query(query, function (err, result){
                                            if(err){
                                                //return res.json(200, {status: 2, error_details: err});
                                                console.log(err);
                                                callback();
                                            }else{
                                                    results  = result;
                                                    callback();
                                            }
                                        });
                            },
                            function(callback){
                                        console.log("INSIDE foreach callback........");
                                        var count = 0;
                                        results.forEach(function(factor, index){
                                                count++;
                                                var imageSrc                    =     collageImg_path_assets + factor.single_image;
                                                var ext                         =     imageSrc.split('/');
                                                ext                             =     ext[ext.length-1].split('.');
                                                var imgWidth,
                                                    imgHeight,
                                                    imageDst;

                                                async.series([
                                                        function(callback) {
                                                                    /*imgWidth                    =    242;
                                                                    imgHeight                   =    242;
                                                                    imageDst                    =     collageImg_path_assets + ext[0] + "_"+imgWidth+"x"+imgHeight+"." +ext[1];
                                                                    ImgResizeService.imageResizeWH(imgWidth, imgHeight, imageSrc, imageDst, function(err, imageResizeResults) {
                                                                            if(err){
                                                                                    console.log(err);
                                                                                    console.log("Error in image resize 160 in collagedetails!!!!");
                                                                                    //callback();
                                                                            }else{
                                                                                   // callback();
                                                                                    console.log("Loop success");
                                                                                    //collage-Details images

                                                                            }
                                                                    });*/
                                                                    callback();

                                                        },
                                                ],function(err){
                                                            if(err){
                                                                console.log(err);
                                                                //callback();
                                                            }else{
                                                                    if(factor.single_image == null || factor.single_image == ""){
                                                                            single_image           =     "";
                                                                            single_image_160x160   =     "";
                                                                            single_image_70x70     =     "";
                                                                    }else{
                                                                            var imageSrc                    =     collageImg_path_assets + factor.single_image;
                                                                            var ext                         =     imageSrc.split('/');
                                                                            ext                             =     ext[ext.length-1].split('.');
                                                                            single_image                    =     collageImg_path + factor.single_image;
                                                                            single_image_160x160            =     collageImg_path + ext[0] + "_160x160." +ext[1];
                                                                            single_image_70x70              =     collageImg_path + ext[0] + "_70x70." +ext[1];
                                                                    }

                                                                    if(factor.image == null || factor.image == ""){
                                                                            collage_image           =     "";
                                                                            collage_image_350x350   =     "";
                                                                    }else{
                                                                            var imageSrc                    =     collageImg_path_assets + factor.image;
                                                                            var ext                         =     imageSrc.split('/');
                                                                            ext                             =     ext[ext.length-1].split('.');
                                                                            collage_image                   =     collageImg_path + factor.image;
                                                                            collage_image_350x350           =     collageImg_path + ext[0] + "_350x350." +ext[1];
                                                                    }

                                                                    factor.collage_image                    =     collage_image;
                                                                    factor.collage_image_350x350            =     collage_image_350x350;
                                                                    factor.single_image                     =     single_image;
                                                                    factor.single_image_160x160             =     single_image_160x160;
                                                                    factor.single_image_70x70               =     single_image_70x70;
                                                                    console.log(factor.single_image_160x160);
                                                                    console.log(factor.single_image_70x70);
                                                                    console.log(factor.collage_image_350x350);


                                                                    if(count == results.length){
                                                                            callback();
                                                                    }
                                                            }
                                                });


                                        });

                            },
                ],function(err){
                            if(err){
                                console.log(err);
                                //callback();
                                return res.json(200, {status: 2, message: "Failure"
                                                });
                            }else{
                                    console.log("Results ---------- >>>>>>>>>");
                                    console.log(results);
                                     return res.json(200, {status: 1, message: "success",
                                                            result: results
                                                });
                            }
                });
    },

 /* ==================================================================================================================================
               Get the tagged users for each dither
   ==================================================================================================================================== */
    getSingleDitherTaggedUsers: function(req,res){
                    var ditherId                =       req.param("id");
                    var query = " SELECT"+
                                " u.name, u.id AS userId"+
                                " FROM tags as t"+
                                " INNER JOIN user as u ON t.userId = u.id"+
                                " WHERE t.collageId = "+ditherId+
                                " ORDER BY u.name";
                    console.log(query);
                    Collage.query(query, function (err, result) {
                        if(err){
                            return res.json(200, {status: 2, error_details: err});
                        }else{
                            return res.json(200, {status: 1, message: "success", result: result});
                        }
                    });
    },

    //** get reported dither details **/
    getReportDither: function(req,res){
                // var query = "SELECT rd . *,u.name AS username,c.imgTitle,c.status FROM reportDither AS rd LEFT JOIN user AS u ON rd.reporterId = u.id LEFT JOIN collage AS c ON c.id = rd.collageId";
                var query = " SELECT DISTINCT rd.collageId,"+
                            " u.name AS postedBy,"+
                            " c.imgTitle,c.status,"+
                            " COUNT( rd.collageId ) AS RepDitherCount,"+
                            " IF( (c.expiryDate < NOW()) ,  'close',  'open') AS ditherStatus"+
                            " FROM reportDither AS rd"+
                            " INNER JOIN collage AS c ON c.id = rd.collageId"+
                            " INNER JOIN user AS u ON rd.reporterId = u.id"+
                            " GROUP BY rd.collageId";
                console.log(query);
                ReportDither.query(query, function (err, result){
                    if(err){
                        return res.json(200, {status: 2, error_details: err});
                    }else{
                        //console.log(result);
                        return res.json(200, {status: 1, message: "success", result: result});
                    }
                });
    },

    //** suspend a dither
    suspendDither: function(req,res){

        var suspendDitherId=req.body.collageId;
        var criteria = {id: suspendDitherId};

                    var data = {status: 'inactive'};

                    Collage.update(criteria, data).exec(function (err, updatedData) {

                        if (err) {
                            return res.json(200, {status: 2, message: 'some error has occured', error_details: updatedData});
                        } else {

                            console.log("success");
                             return res.json(200, {status: 1, message: 'successfully suspended'});
                        }
                    });
    },
    releaseDither: function(req,res){

        var releaseDitherId=req.body.collageId;
        var criteria = {id: releaseDitherId};

                    var data = {status: 'active'};

                    Collage.update(criteria, data).exec(function (err, updatedData) {

                        if (err) {
                            return res.json(200, {status: 2, message: 'some error has occured', error_details: updatedData});
                        } else {

                            console.log("success");
                             return res.json(200, {status: 1, message: 'successfully Released'});
                        }
                    });
    },
    getReportedBy: function(req,res){
        var ditherId=req.body.collageId;
        console.log("ghhhhhhh"+ditherId);
        var query="select rd.*, u.name,rt.description from reportDither as rd LEFT JOIN user as u on rd.reporterId=u.id LEFT JOIN reportType as rt on rd.reportType=rt.reportId where rd.collageId="+ditherId;
        console.log(query);
         ReportDither.query(query, function (err, result) {
                        if (err) {
                            return res.json(200, {status: 2, error_details: err});
                        } else {
                            console.log("hello");
                            console.log(result);
                            return res.json(200, {status: 1, message: "success", result: result});
                        }
                    });
    },
    getUsersNotification:function(req,res){
        console.log("go fast, u are on way");
           var user_id  = req.body.userId;
       // var user_id = 87;
        console.log(user_id);
        console.log(req.body);
        var query = " SELECT"+
                   " N.id,N.userId,N.ditherUserId,N.collage_id as ditherId,N.notificationTypeId,N.createdAt as createdDate,N.image_id,N.tagged_users,N.description,"+
                   " U.name,U.profilePic,"+
                   " C.image as dither_image,C.id as ditherID"+
                   " FROM notificationLog as N LEFT JOIN user as U ON U.id = N.userId"+
                   " LEFT JOIN collage as C ON C.id = N.collage_id"+
                   " WHERE"+
                   " N.ditherUserId="+user_id+
                   " AND(N.notificationTypeId=1 OR N.notificationTypeId=2 OR N.notificationTypeId=3 OR N.notificationTypeId=4 OR N.notificationTypeId=7)"+
                   " OR"+
                   " FIND_IN_SET("+user_id+", N.tagged_users) ORDER BY N.updatedAt DESC";
        Collage.query(query,function(err,result){
            if(err){
                console.log("small error..");
                 return res.json(200, {status: 2, error_details: err});
            }
            else{
                console.log("Success in notification",result);
                return res.json(200,{status:1,message:'success',data:result});
            }
        });
    },

    getComments:     function(req,res){
                        console.log("getComments   =================== ADMIN");
                        var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                        var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                        var profile_image;
                        var collageId                   =     req.body.id;
                        if(req.param("count")==0){
							var query   = " SELECT"+
										  " u.name as commentedPerson,u.id as commentedPersonId,u.profilePic as profileImage,"+
										  " cc.comment,cc.createdAt as commentedDate"+
										  " FROM collageComments as cc"+
										  " INNER JOIN user as u ON cc.userId = u.id"+
										  " WHERE cc.collageId = "+collageId+
										  " ORDER BY cc.createdAt DESC";
						}else{
							var query   = " SELECT"+
										  " u.name as commentedPerson,u.id as commentedPersonId,u.profilePic as profileImage,"+
										  " cc.comment,cc.createdAt as commentedDate"+
										  " FROM collageComments as cc"+
										  " INNER JOIN user as u ON cc.userId = u.id"+
										  " WHERE cc.collageId = "+collageId+
										  " ORDER BY cc.createdAt DESC LIMIT 5";
							
							
						}
                        CollageComments.query(query,function(err,result){
                            if(err){
                                console.log("errrRRRRRRRRR");
                                return res.json(200, {status: 2, error_details: err});
                            }else{
                                result.forEach(function(factor, index){
                                    if(factor.profileImage == null || factor.profileImage == ""){
                                            profile_image                   =     "";
                                    }else{
                                            var imageSrc                    =     factor.profileImage;
                                            var ext                         =     imageSrc.split('.');
                                            profile_image                   =     profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                    }
                                    factor.profilePic       =    profile_image;
                                });
                                return res.json(200,{status:1,message:'success',result:result});
                            }

                        });
    },

getSettingsData:function(req,res){

                      var query = "SELECT * FROM settings";
                      Settings.query(query,function(err,result){
                        if(err){
                              console.log("errrr",err);
                              return res.json(200, {status: 2, error_details: err});
                        }else{
                              console.log("success in settings", result);
                              return res.json(200,{status:1,message:'success',result:result});
                        }
                      });

},

updateDitherCloseTime:function(req,res){

                      data =    {
                                   value:req.body.value
                                 };

                      criteria = {
                                    id:req.body.id
                                  };


                     Settings.update(criteria,data).exec(function(err,updatedData){
                        if(err)
                        {
                             console.log("update dither close time fail");
                             return res.json(200, {status: 2, error_details: err});
                        }
                        else
                        {
                            console.log("dither closing time updated");
                            return res.json(200,{status:1,message:'success',result:updatedData});
                        }
                    });
},

updateTokenExpiryTime:function(req,res){

                    data =    {
                                 value:req.body.value
                               };
                    criteria = {
                                    id:req.body.id
                                };


                 Settings.update(criteria,data).exec(function(err,updatedData){
                    if(err)
                    {
                         console.log("update token expiry time fail");
                         return res.json(200, {status: 2, error_details: err});
                    }
                    else
                    {
                        console.log("token expiry time updated");
                        return res.json(200,{status:1,message:'success',result:updatedData});
                    }
                });
},

 checkMentionName:  function(req,res){
                    console.log(req.params.all());
                    var mentionId = req.body.mentionId;
                    console.log(mentionId);
                    var query = "SELECT u.id,u.name FROM user as u WHERE mentionId = '"+mentionId+"'";

                    User.query(query,function(err,result){
                        if(err)
                        {
                            return res.json(200,{status:2,error_details:err});
                        }
                        else
                        {
                            // console.log(result);
                            return res.json(200,{status:1,message:"success",data:result});
                        }
                    });

        },



};

