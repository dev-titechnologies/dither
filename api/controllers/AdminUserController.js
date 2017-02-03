/**
 * AdminUserController
 *
 * @description :: Server-side logic for managing adminusers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var todayISO           =   new Date().toISOString();
module.exports = {

    /* ==================================================================================================================================
               View Details of every single User
   ==================================================================================================================================== */
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
                                                                data: results[0]
                                                    });
                                }

                    });

    },

    /* ==================================================================================================================================
               Delete a particular User
   ==================================================================================================================================== */

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

    /* ==================================================================================================================================
               Activate Deactivate User
   ==================================================================================================================================== */

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
};

