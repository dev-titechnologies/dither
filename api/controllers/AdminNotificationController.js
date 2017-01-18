/**
 * AdminNotificationController
 *
 * @description :: Server-side logic for managing Adminnotificationcontroller.js
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	getUsersNotification:function(req,res){
		
		console.log("--------------------AdminNotification Api------------------------");
		var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
        var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
		var collageImg_path             =     server_image_baseUrl + req.options.file_path.collageImg_path;
		var profile_image;
		var collage_image;
        var user_id  					= 	  req.body.userId;
        console.log(user_id);
        console.log(req.body);
        var query = " SELECT"+
                   " N.id,N.userId,N.ditherUserId,N.collage_id as ditherId,N.notificationTypeId,N.createdAt as createdDate,N.image_id,N.tagged_users,N.description,"+
                   " U.name,U.profilePic,"+
                   " C.image as dither_image,C.id as ditherID"+
                   " FROM notificationLog as N INNER JOIN user as U ON U.id = N.userId"+
                   " LEFT JOIN collage as C ON C.id = N.collage_id"+
                   " WHERE"+
                   " N.ditherUserId="+user_id+
                   " AND(N.notificationTypeId=1 OR N.notificationTypeId=2 OR N.notificationTypeId=3 OR N.notificationTypeId=4 OR N.notificationTypeId=5 OR N.notificationTypeId=7 OR N.notificationTypeId=8 OR N.notificationTypeId=9)"+
                   " OR"+
                   " FIND_IN_SET("+user_id+", N.tagged_users) ORDER BY N.updatedAt DESC";
        console.log(query)
        Collage.query(query,function(err,result){
            if(err){
                console.log("small error..");
                 return res.json(200, {status: 2, error_details: err});
            }
            else{
                //console.log("Success in notification",result);
                 result.forEach(function(factor, index){
					if(factor.profilePic == null || factor.profilePic == ""){
							profile_image                   =     "";
					}else{
							var imageSrc                    =     factor.profilePic;
							var ext                         =     imageSrc.split('.');
							profile_image                   =     ext[0] + "_70x70" + "." +ext[1];
					}
					
					if(factor.dither_image == null || factor.dither_image == ""){
							collage_image           =     "";
					}else{
							var imageSrc                    =     factor.dither_image;
							var ext                         =     imageSrc.split('.');
							collage_image           		=     ext[0] + "_70x70." +ext[1];
					}

					factor.profilePic       	=    profilePic_path + profile_image;
					factor.dither_image       	=    collageImg_path + collage_image;
				});
				console.log("-----------------Notification Result--------------------------")
                console.log(result)
                return res.json(200,{status:1,message:'success',data:result});
            }
        });
    },
	
};

