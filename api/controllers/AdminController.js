
/**
 * AdminController
 *
 * @description :: Server-side logic for managing Admin
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var crypto          =       require('crypto');
var todayISO           =   new Date().toISOString();


module.exports = {

    /* ==================================================================================================================================
               Admin Login
   ==================================================================================================================================== */
    adminLogin: function (req, res){
                        console.log("userLogin  .....");
                        var password = crypto.createHash('md5').update(req.body.password).digest("hex");
                        console.log(password);
                        //var password = req.body.password;
                        var values = {
                            username    : req.body.email,
                            password    : password
                        };
                        console.log(values);
                        // Get Admin details
                        Admin.findOne(values).exec(function (err, result){
                            if(err){
                                sails.log.debug('Some error occured ' + err);
                                return res.json(200, {status: 2, message: 'some error occured', error: err});
                            }else{
                                if(typeof result == "undefined"){
                                        sails.log.debug({message: 'No admin found'});
                                        return res.json(200, {status: 2, message: 'No admin found', data: result});
                                }else{
                                        return res.json(200, {status: 1, message: 'success', data: result.id });
                                }
                            }
                        });
    },
    
    
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
                                                                data: results
                                                    });
                                }

                    });

    },
    
/* ==================================================================================================================================
              Edit Details of every single User
   ==================================================================================================================================== */

   
	saveUserDetail		:	function(req,res){
		console.log(req.params.all());
		var name		=	req.param("name");
		var email		=	req.param("email");
		var phoneNumber	=	req.param("phoneNumber");
		var id			=	req.param("userId");
		var criteria;
		var Query;

		criteria		=	{
								id		:	id
							}

		var data		=	{
								name	:	name,
								email	:	email,
								phoneNumber:phoneNumber
							}

		User.update(criteria,data).exec(function(err,updatedData){
				if(err){
					 console.log("can not update user details",err);
					 return res.json(200, {status: 2, error_details: err});
				}else{
					console.log("updated user details");
					//console.log(updatedData);
					return res.json(200, {status: 1,message:'success', data: updatedData});
				}

		})
	},


}



