/**
 * AdminCommentDitherController
 *
 * @description :: Server-side logic for managing admincommentdithers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /* ==================================================================================================================================
               Get the comments against the dither
   ==================================================================================================================================== */
    getComments:     function(req,res){
                        console.log("getComments   =================== ADMIN");
                        var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                        var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                        var profilePic_path_assets      =     req.options.file_path.profilePic_path_assets;
                        var profile_image, profile_image_70x70;
                        var collageId                   =     req.body.id;
                        if(req.param("count")==0){
                            var query   = " SELECT"+
                                          " u.name as commentedPerson, u.id as commentedPersonId, u.profilePic as profileImage,"+
                                          " cc.id AS commentId, cc.comment, cc.createdAt as commentedDate, cc.likeCount"+
                                          " FROM collageComments as cc"+
                                          " INNER JOIN user as u ON cc.userId = u.id"+
                                          " WHERE cc.collageId = "+collageId+
                                          " ORDER BY cc.createdAt DESC";
                        }else{
                            var query   = " SELECT"+
                                          " u.name as commentedPerson, u.id as commentedPersonId, u.profilePic as profileImage,"+
                                          " cc.id AS commentId, cc.comment, cc.createdAt as commentedDate, cc.likeCount"+
                                          " FROM collageComments as cc"+
                                          " INNER JOIN user as u ON cc.userId = u.id"+
                                          " WHERE cc.collageId = "+collageId+
                                          " ORDER BY cc.createdAt DESC LIMIT 5";


                        }
                        /*CollageComments.query(query,function(err,result){
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

                        });*/

                        var results             =       [];
                        async.series([
                                    function(callback) {
                                                CollageComments.query(query, function (err, result){
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
    },

/* ==================================================================================================================================
               Check mention name in comments
   ==================================================================================================================================== */
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

/* ==================================================================================================================================
               Get the list of users like the dither comment
   ==================================================================================================================================== */
    getCommentLikeUsers:     function(req,res){

                            console.log("getCommentLikeUsers   =================== ADMIN");
                            console.log(req.params.all());
                            var commentId                =     req.param("commentId");
                            if(!commentId){
                                    return res.json(200,{status:2,message:"Please pass commentId"});
                            }else{
                                    var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                                    var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                                    var profilePic_path_assets      =     req.options.file_path.profilePic_path_assets;
                                    var profile_image, profile_image_70x70;

                                    var query   =   " SELECT"+
                                                    " usr.id as likedUserId, usr.name, usr.profilePic as profileImage"+
                                                    " FROM commentLikes cmtlk"+
                                                    " INNER JOIN user usr ON usr.id = cmtlk.userId"+
                                                    " WHERE cmtlk.commentId = "+commentId;
                                    console.log(query);
                                    var results             =       [];
                                    async.series([
                                                function(callback) {
                                                            CommentLikes.query(query, function (err, result){
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

