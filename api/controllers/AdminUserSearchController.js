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
						var profile_image;
						var start                       =     req.param("start");
						var count                       =     req.param("count");
						var query;
						var name                        =      req.param("name");
						var email                       =      req.param("email");
						var mobile                      =      req.param("mobile");
						var order						=		req.param("order");
						var outerSelect                 =      " SELECT id, name, email, profilePic as profileImage, phoneNumber, status, createdAt, ";
						var innerOrderBy;
						if(order == 1){
							innerOrderBy				=		" DESC";
						}else{
							innerOrderBy				=		" ASC";
						}
						var outerOrderBy                =      " ORDER BY createdAt"+innerOrderBy+" LIMIT "+start+","+count;

						if(!name && !email && !mobile){
							  console.log("!name && !email && !mobile");
							  query			 =		outerSelect+
													" (SELECT COUNT(user.id) from user) as length,"+
													" (SELECT COUNT( clg.id ) FROM user usr INNER JOIN collage clg ON usr.id = clg.userId WHERE usr.id = user.id) as ditherCount"+
													" FROM user"+
													outerOrderBy;

						}else if(name && email && mobile){
							  console.log("name && email && mobile");
							  query			= 		outerSelect+
													" (SELECT COUNT(user.id) FROM user WHERE name LIKE '"+name+"%' AND email LIKE '"+email+"%' AND (phoneNumber LIKE '"+mobile+"%' OR phoneNumber LIKE '%"+mobile+"%')) as length"+
													" FROM user"+
													" WHERE name LIKE '"+name+"%' AND email LIKE '"+email+"%' AND (phoneNumber LIKE '"+mobile+"%' OR phoneNumber LIKE '%"+mobile+"%')"+
													outerOrderBy;

						}else if(name && email && !mobile){
							  console.log("name && email && !mobile");
							  query 		= 		 outerSelect+
													" (SELECT COUNT(user.id) FROM user WHERE name LIKE '"+name+"%' AND email LIKE '"+email+"%') as length"+
													" FROM user"+
													" WHERE name LIKE '"+name+"%' AND email LIKE '"+email+"%'"+
													outerOrderBy;

						}else if(name && !email && mobile){
							  console.log("name && !email && mobile");
							  query			=		outerSelect+
													" (SELECT COUNT(user.id) FROM user WHERE name LIKE '"+name+"%' AND (phoneNumber LIKE '"+mobile+"%' OR phoneNumber LIKE '%"+mobile+"%')) as length"+
													" FROM user"+
													" WHERE name LIKE '"+name+"%' AND (phoneNumber LIKE '"+mobile+"%' OR phoneNumber LIKE '%"+mobile+"%')"+
													outerOrderBy;

						}else if(!name && email && mobile){
							  console.log("!name && email && mobile");
							  query			= 		outerSelect+
													" (SELECT COUNT(user.id) FROM user WHERE email LIKE '"+email+"%' AND (phoneNumber LIKE '"+mobile+"%' OR phoneNumber LIKE '%"+mobile+"%')) as length"+
													" FROM user"+
													" WHERE email LIKE '"+email+"%' AND (phoneNumber LIKE '"+mobile+"%' OR phoneNumber LIKE '%"+mobile+"%') "+
													outerOrderBy;

						}else if(name && !email && !mobile){
							  console.log("name && !email && !mobile");
							  query		 	= 			outerSelect+
													" (SELECT COUNT(user.id) FROM user WHERE name LIKE '"+name+"%') as length"+
													" FROM user"+
													" WHERE name LIKE '"+name+"%'"+
													outerOrderBy;

						}else if(email && !name && !mobile){
							  console.log("!name && email && !mobile");
							  query 		=		outerSelect+
													"(SELECT COUNT(user.id) FROM user WHERE email LIKE '"+email+"%') as length"+
													" FROM user"+
													" WHERE email LIKE '"+email+"%'"+
													outerOrderBy;

						}else if(mobile && !name && !email){
							  console.log("!name && !email && mobile");
							  query			=		outerSelect+
													"(SELECT COUNT(user.id) FROM user WHERE phoneNumber LIKE '"+mobile+"%' OR phoneNumber LIKE '%"+mobile+"%') as length"+
													" FROM user"+
													" WHERE phoneNumber LIKE '"+mobile+"%' OR phoneNumber LIKE '%"+mobile+"%'"+
													outerOrderBy;

						}

						//console.log(query);
						User.query(query, function(err, result){
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
						});

    },

};

