/**
 * AdminDitherController
 *
 * @description :: Server-side logic for managing admindithers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
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
                             " cd.image as single_image, cd.vote as individualVote, cd.id,"+
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
                    var ditherId                    =       req.param("id");
                    var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                    var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                    var profilePic_path_assets      =     req.options.file_path.profilePic_path_assets;
                    var profile_image, profile_image_70x70;
                    var query = " SELECT"+
                                " u.name, u.id AS userId,u.profilePic as profileImage"+
                                " FROM tags as t"+
                                " INNER JOIN user as u ON t.userId = u.id"+
                                " WHERE t.collageId = "+ditherId+
                                " ORDER BY u.name";
                    console.log(query);
                    /*Collage.query(query, function (err, result) {
                        if(err){
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
                                    factor.profileImage       =    profile_image;
                                });
                                //console.log(result);
                            return res.json(200, {status: 1, message: "success", result: result});
                        }
                    });*/
                    var results             =       [];
                    async.series([
                                function(callback) {
                                            ReportUser.query(query, function (err, result){
                                                if(err){
                                                    return res.json(200, {status: 2, error_details: err});
                                                    callback();
                                                }else{
                                                        results  = result;
                                                        //console.log(result);
                                                        callback();
                                                }
                                            });
                                },
                                function(callback){
                                            console.log("INSIDE foreach callback........");
                                           if(results.length){
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
                                                                                    profile_image_70x70             =     "";
                                                                            }else{
                                                                                    var imageSrc                    =     profilePic_path_assets + factor.profileImage;
                                                                                    var ext                         =     imageSrc.split('/');
                                                                                    ext                             =     ext[ext.length-1].split('.');
                                                                                    profile_image                   =     profilePic_path + factor.profileImage;
                                                                                    profile_image_70x70             =     profilePic_path + ext[0] + "_70x70." +ext[1];
                                                                            }
                                                                            factor.profilePic                       =     profile_image;
                                                                            factor.profilePic_70x70                 =     profile_image_70x70;

                                                                            if(count == results.length){
                                                                                    callback();
                                                                            }
                                                                    }
                                                        });


                                                });
                                            }else{
                                                callback();
                                            }
                                },
                    ],function(err){
                                if(err){
                                    console.log(err);
                                    //callback();
                                    return res.json(200, {status: 2, message: "Failure"
                                                    });
                                }else{
                                        console.log("Results ---------- >>>>>>>>>");
                                        //console.log(results);
                                         return res.json(200, {status: 1, message: "success",
                                                                result: results
                                                    });
                                }

                    });
    },

/* ==================================================================================================================================
               Get the list of users like Dither
   ==================================================================================================================================== */
    getDitherLikeUsers:     function(req,res){

                            console.log("getDitherLikeUsers   =================== ADMIN");
                            console.log(req.params.all());
                            var imageId                =     req.param("imageId");
                            if(!imageId){
                                    return res.json(200,{status:2,message:"Please pass imageId"});
                            }else{
                                    var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                                    var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                                    var profilePic_path_assets      =     req.options.file_path.profilePic_path_assets;
                                    var profile_image, profile_image_70x70;

                                    var query   =   " SELECT"+
                                                    " usr.id as likedUserId, usr.name, usr.profilePic as profileImage"+
                                                    " FROM collageLikes clglk"+
                                                    " INNER JOIN user usr ON usr.id = clglk.userId"+
                                                    " WHERE clglk.imageId = "+imageId;
                                    console.log(query);
                                    var results             =       [];
                                    async.series([
                                                function(callback) {
                                                            CollageLikes.query(query, function (err, result){
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
                                                                                                profile_image_70x70             =     "";
                                                                                        }else{
                                                                                                var imageSrc                    =     profilePic_path_assets + factor.profileImage;
                                                                                                var ext                         =     imageSrc.split('/');
                                                                                                ext                             =     ext[ext.length-1].split('.');
                                                                                                profile_image                   =     profilePic_path + factor.profileImage;
                                                                                                profile_image_70x70             =     profilePic_path + ext[0] + "_70x70." +ext[1];
                                                                                        }
                                                                                        factor.profilePic                       =     profile_image;
                                                                                        factor.profilePic_70x70                 =     profile_image_70x70;
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
                                                                                result: results
                                                                    });
                                                }

                                    });
                            }
    },


};

