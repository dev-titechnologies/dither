/**
 * AdminUserSearchController
 *
 * @description :: Server-side logic for managing adminusersearches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

     /* ==================================================================================================================================
               Search in user list(name,email,mobile)
     ==================================================================================================================================== */


          //   List all users based on limit(12 rows per call)
     getCompleteUser: function(req, res){

                        console.log("getCompleteUser ============== AdminUserSearchController");
                        console.log(req.params.all());
                        var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                        var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                        var profilePic_path_assets      =     server_image_baseUrl + req.options.file_path.profilePic_path_assets;
                        var profile_image, profile_image_70x70;
                        var start                       =     req.param("start");
                        var count                       =     req.param("count");
                        var query;
                        var name                        =      req.param("name");
                        var email                       =      req.param("email");
                        var mobile                      =      req.param("mobile");
                        var outerSelect                 =      " SELECT id, name, email, profilePic as profileImage, phoneNumber, status, createdAt, ";
                        var outerOrderBy                =      " ORDER BY createdAt DESC LIMIT "+start+","+count;

                        if(!name && !email && !mobile){
                              console.log("!name && !email && !mobile");
                              query         =       outerSelect+
                                                    " (SELECT COUNT(user.id) from user) as length,"+
                                                    " (SELECT COUNT( clg.id ) FROM user usr INNER JOIN collage clg ON usr.id = clg.userId WHERE usr.id = user.id) as ditherCount"+
                                                    " FROM user"+
                                                    outerOrderBy;

                        }else if(name && email && mobile){
                              console.log("name && email && mobile");
                              query         =       outerSelect+
                                                    " (SELECT COUNT(user.id) FROM user WHERE name LIKE '"+name+"%' AND email LIKE '"+email+"%' AND (phoneNumber LIKE '"+mobile+"%' OR phoneNumber LIKE '%"+mobile+"%')) as length"+
                                                    " FROM user"+
                                                    " WHERE name LIKE '"+name+"%' AND email LIKE '"+email+"%' AND (phoneNumber LIKE '"+mobile+"%' OR phoneNumber LIKE '%"+mobile+"%')"+
                                                    outerOrderBy;

                        }else if(name && email && !mobile){
                              console.log("name && email && !mobile");
                              query         =       outerSelect+
                                                    " (SELECT COUNT(user.id) FROM user WHERE name LIKE '"+name+"%' AND email LIKE '"+email+"%') as length"+
                                                    " FROM user"+
                                                    " WHERE name LIKE '"+name+"%' AND email LIKE '"+email+"%'"+
                                                    outerOrderBy;

                        }else if(name && !email && mobile){
                              console.log("name && !email && mobile");
                              query         =       outerSelect+
                                                    " (SELECT COUNT(user.id) FROM user WHERE name LIKE '"+name+"%' AND (phoneNumber LIKE '"+mobile+"%' OR phoneNumber LIKE '%"+mobile+"%')) as length"+
                                                    " FROM user"+
                                                    " WHERE name LIKE '"+name+"%' AND (phoneNumber LIKE '"+mobile+"%' OR phoneNumber LIKE '%"+mobile+"%')"+
                                                    outerOrderBy;

                        }else if(!name && email && mobile){
                              console.log("!name && email && mobile");
                              query         =       outerSelect+
                                                    " (SELECT COUNT(user.id) FROM user WHERE email LIKE '"+email+"%' AND (phoneNumber LIKE '"+mobile+"%' OR phoneNumber LIKE '%"+mobile+"%')) as length"+
                                                    " FROM user"+
                                                    " WHERE email LIKE '"+email+"%' AND (phoneNumber LIKE '"+mobile+"%' OR phoneNumber LIKE '%"+mobile+"%') "+
                                                    outerOrderBy;

                        }else if(name && !email && !mobile){
                              console.log("name && !email && !mobile");
                              query         =       outerSelect+
                                                    " (SELECT COUNT(user.id) FROM user WHERE name LIKE '"+name+"%') as length"+
                                                    " FROM user"+
                                                    " WHERE name LIKE '"+name+"%'"+
                                                    outerOrderBy;

                        }else if(email && !name && !mobile){
                              console.log("!name && email && !mobile");
                              query         =       outerSelect+
                                                    "(SELECT COUNT(user.id) FROM user WHERE email LIKE '"+email+"%') as length"+
                                                    " FROM user"+
                                                    " WHERE email LIKE '"+email+"%'"+
                                                    outerOrderBy;

                        }else if(mobile && !name && !email){
                              console.log("!name && !email && mobile");
                              query         =       outerSelect+
                                                    "(SELECT COUNT(user.id) FROM user WHERE phoneNumber LIKE '"+mobile+"%' OR phoneNumber LIKE '%"+mobile+"%') as length"+
                                                    " FROM user"+
                                                    " WHERE phoneNumber LIKE '"+mobile+"%' OR phoneNumber LIKE '%"+mobile+"%'"+
                                                    outerOrderBy;

                        }

                        console.log(query);
                        /*User.query(query, function(err, result){
                            if(err){
                                 console.log(err);
                                return res.json(200, { status: 2, error_details: 'db error' });
                            }else{
                                //console.log(result);
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
                                //console.log(result);
                                return res.json(200, {status: 1, message: "success", data: result});
                            }
                        });*/

                        /* ############################################################### */

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
                                                                            console.log(factor.profilePic_70x70);
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

                        /* ############################################################### */

    },

};

