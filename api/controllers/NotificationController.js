/**
 * Notification Controller
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var util 		= require('util');
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
                    var token           =   req.get('token');
                    console.log(token)
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

                                            sails.log(results.userId)

                                            var data     = {notifyOpinion:notifyOpinion, notifyVote:notifyVote,notifyComment:notifyComment,notifyContact:notifyContact};
                                            var criteria = {id: results.userId};

                                            User.update(criteria, data).exec(function(err, updatedUser) {
                                                if(err)
                                                {
                                                    console.log(err)
                                                    return res.json(200, {status: 2, status_type: 'Failure' ,msg: 'Some error occured in Updation', error_details: err});
                                                }
                                                else
                                                {
                                                    console.log(updatedUser[0])
                                                    return res.json(200, {status: 1, status_type: 'Success' ,msg: 'Settings updated Successfully',opinion:updatedUser[0].notifyOpinion,vote:updatedUser[0].notifyVote,comment:updatedUser[0].notifyComment,contact:updatedUser[0].notifyContact});

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
                console.log(req.options.file_path.profilePic_path)
                var tokenCheck             =     req.options.tokenCheck;
                var user_id                =     tokenCheck.tokenDetails.id;
               // var server_baseUrl       =     req.options.server_baseUrl;
                var server_baseUrl         =     req.options.server_baseUrl;
                var server_image_baseUrl   =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                var profilePic_path        =     server_baseUrl + req.options.file_path.profilePic_path;
                var collageImg_path        =     server_baseUrl + req.options.file_path.collageImg_path;
                var profilePic_path_assets =     req.options.file_path.profilePic_path_assets;
                var collageImg_path_assets =	 req.options.file_path.collageImg_path_assets;
                var device_id              =     tokenCheck.tokenDetails.deviceId;
                var device_type            =     req.get('device_type');

                notificationVoted          =     "";
                notificationCommented      =     "";
                notificationSignup         =     "";
                notifyVoteArray            =     [];
                notifyCmntArray            =     [];

                var page_type              =     req.param("page_type");
                var focus_Ntfn_id          =     req.param("focus_Ntfn_id");
                var data_view_limit        =     req.options.global.data_view_limit;

                /*if(!focus_Ntfn_id){
                        //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please Pass both page_type and focus_Notfn_id'});
                        var query   =   " SELECT"+
                                        " N.id,N.userId,N.ditherUserId,N.collage_id as ditherId,N.notificationTypeId,N.createdAt as createdDate,N.image_id,N.tagged_users,N.description,"+
                                        " U.name,U.profilePic as profile_image,"+
                                        " C.image as dither_image"+
                                        " FROM  notificationLog as N LEFT JOIN user as U ON U.id = N.userId"+
                                        " LEFT JOIN collage as C ON C.id = N.collage_id"+
                                        " WHERE"+
                                        " N.ditherUserId="+user_id+
                                        " AND(N.notificationTypeId=1 OR N.notificationTypeId=2 OR N.notificationTypeId=3 OR N.notificationTypeId=4)"+
                                        " OR "+
                                        " FIND_IN_SET("+user_id+", N.tagged_users) ORDER BY N.updatedAt DESC LIMIT 10";
                }
                else
                {*/


                  if(focus_Ntfn_id == 0||!focus_Ntfn_id){

                    var query   =   " SELECT"+
                                        " N.id,N.userId,N.ditherUserId,N.collage_id as ditherId,N.notificationTypeId,N.createdAt as createdDate,N.image_id,N.tagged_users,N.description,"+
                                        " U.name,U.profilePic as profile_image,"+
                                        " C.image as dither_image"+
                                        " FROM  notificationLog as N LEFT JOIN user as U ON U.id = N.userId"+
                                        " LEFT JOIN collage as C ON C.id = N.collage_id"+
                                        " WHERE"+
                                        " N.ditherUserId="+user_id+
                                        " AND(N.notificationTypeId=1 OR N.notificationTypeId=2 OR N.notificationTypeId=3 OR N.notificationTypeId=4 OR N.notificationTypeId=7)"+
                                        " OR "+
                                        " FIND_IN_SET("+user_id+", N.tagged_users) ORDER BY N.updatedAt DESC LIMIT 10";

                  }
                  else
                  {
                     var query  =   " SELECT"+
                                    " * FROM"+
                                    " ("+
                                    " SELECT"+
                                    " N.id,N.userId,N.ditherUserId,N.collage_id as ditherId,N.notificationTypeId,N.createdAt as createdDate,N.image_id,N.tagged_users,N.description,"+
                                    " U.name,U.profilePic as profile_image,C.image as dither_image"+
                                    " FROM notificationLog as N LEFT JOIN user as U ON U.id = N.userId"+
                                    " LEFT JOIN collage as C ON C.id = N.collage_id"+
                                    " WHERE"+
                                    " N.ditherUserId="+user_id+
                                    " OR"+
                                    " FIND_IN_SET("+user_id+", N.tagged_users) ORDER BY N.updatedAt DESC"+
                                    ") as temp"+
                                    " where temp.id <"+focus_Ntfn_id+
                                    " LIMIT 10";

                    //--------------------------------------------------------------------
                  }

                        console.log(query)
                        NotificationLog.query(query, function(err,results) {

                            if(err)
                            {
                                console.log(err)
                            }
                            else
                            {
								console.log("^^^^^^^^^^^^^^^^^^^^^^^^^Result^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
                                console.log(results)

                                if(typeof results != 'undefined' && results.length!=0)
                                {

									
                                    async.forEach(results, function (item, callback){
                                    if(item.notificationTypeId==1 || item.notificationTypeId==2 || item.notificationTypeId==3 || item.notificationTypeId==4 || item.notificationTypeId==7)
                                        {
                                          //----------Comment Notification---------------------------
										  
                                          if(item.notificationTypeId==3)
                                          {
                                            //  console.log(item.description)
                                              NotificationType.find({id:3 }).exec(function(err, ntfnTypeFound){

                                                    if(err)
                                                    {
                                                        console.log(err)
                                                        callback(true,ntfnTypeFound );
                                                    }
                                                    else
                                                    {
													
                                                            console.log(item)
                                                            notificationCommented = "No notification Found for comments";
                                                            var notification    = ntfnTypeFound[0].body;
                                                            item.description    = item.description - 1;
                                                            console.log(notification)
                                                            ntfn_body           =   util.format(notification,item.description);
                                                            item.ntfn_body      =   ntfn_body;
                                                            item.type           =   ntfnTypeFound[0].type;
                                                            var imageToResize	=   item.profile_image;
                                                            var clgImgToResize	=	item.dither_image;
                                                            item.profile_image  =   profilePic_path + item.profile_image;
                                                            item.dither_image   =   collageImg_path + item.dither_image;
                                                            if(item.description<=0)
															{
																console.log("commenteddd")
																notificationCommented = " commented on your Dither";
																item.ntfn_body        = notificationCommented;
															}
															else
															{
																	 console.log("77777777777777777777777777777777777777777777777")
																	 notificationCommented =  ntfn_body;
																	 notifyCmntArray       = [];
																	 notifyCmntArray.push({ditherId: item.collage_id, userId: item.ditherUserId,msg:notificationCommented});
																	 console.log(notifyCmntArray)
																	 console.log("PUSHH NOtiFiCationnnnnnnnnnnnnn")
															}
															
                                                             // ------------------------------Generate ThumbnailImage-----------------------------------------------
																var imageSrc                    =     profilePic_path_assets + imageToResize;
																var clgImgSrc					=	  collageImg_path_assets + clgImgToResize;
																console.log(clgImgSrc)
                                                                fs.exists(imageSrc, function(exists) {
																 if (exists) {

																		console.log("Image exists");

																		var ext                         =     imageSrc.split('/');
																		ext                             =     ext[ext.length-1].split('.');
																		var imageDst                    =     profilePic_path_assets + ext[0] + "_50x50" + "." +ext[1];
																		console.log(imageSrc)
																		console.log(imageDst)
																		ImgResizeService.isImageExist(imageSrc, imageDst, function(err, imageResizeResults) {
																			
																			if(err)
																			{
																				console.log(err)
																				callback();
																			}
																			else
																			{
																				console.log(imageResizeResults)
																				item.profile_image = profilePic_path + ext[0] + "_50x50" + "." +ext[1];
																				fs.exists(clgImgSrc, function(exists) {
																				 if (exists) {

																						console.log("collge Image exists");

																						var ext                         =     clgImgSrc.split('/');
																						ext                             =     ext[ext.length-1].split('.');
																						var imageDst                    =     collageImg_path_assets + ext[0] + "_50x50" + "." +ext[1];
																						console.log(imageSrc)
																						console.log(imageDst)
																						ImgResizeService.isImageExist(clgImgSrc, imageDst, function(err, imageResizeResults) {
																							if(err)
																							{
																								console.log(err)
																								callback();
																							}
																							else
																							{
																								console.log(imageResizeResults)
																								console.log("collge Image checkinggggg");
																								console.log(item.dither_image)
																								item.dither_image = collageImg_path + ext[0] + "_50x50" + "." +ext[1];
																								callback();
																							}
																						});
																						
																					}	
																					else
																					{
																						console.log("thumbnaillllllllllllll re callback()")
																						callback();
																					}
																				});
																				//callback();
																			}
																		});
																		
																	}	
																	else
																	{
																		callback();
																	}
																});
															
															
                                                             
                                                    }

                                                });
                                          }
                                          else if(item.notificationTypeId==2)
                                             {

                                                  console.log("vote?????????")
                                                  NotificationType.find({id:2 }).exec(function(err, ntfnTypeFound){

                                                        if(err)
                                                        {
                                                            console.log(err)
                                                            callback(true,ntfnTypeFound );
                                                        }
                                                        else
                                                        {

                                                            console.log(item.description)

                                                            console.log(ntfnTypeFound)
                                                            var notification    = ntfnTypeFound[0].body;
                                                            console.log(notification)
                                                            item.description    = item.description - 1;
                                                            ntfn_body           = util.format(notification,item.description);
                                                            item.ntfn_body      =   ntfn_body;
                                                            item.type           =   ntfnTypeFound[0].type;
                                                            var imageToResize	=   item.profile_image;
                                                            var clgImgToResize	=	item.dither_image;
                                                            item.profile_image  =   profilePic_path + item.profile_image;
                                                            item.dither_image   =   collageImg_path + item.dither_image;
                                                            if(item.description<=0)
															{
															  notificationVoted  = " voted on your Dither";
															  item.ntfn_body     = notificationVoted;
															  callback();
															}
															else
															{

																notificationVoted   =  ntfn_body;
																notifyVoteArray     = [];
																notifyVoteArray.push({ditherId: item.collage_id, userId: item.ditherUserId,msg:notificationVoted});
																console.log(notifyVoteArray)
																callback();
															}
                                                            
                                                            // ------------------------------Generate ThumbnailImage-----------------------------------------------
																var imageSrc                    =     profilePic_path_assets + imageToResize;
																var clgImgSrc					=	  collageImg_path_assets + clgImgToResize;
                                                                fs.exists(imageSrc, function(exists) {
																 if (exists) {

																		console.log("Image exists");

																		var ext                         =     imageSrc.split('/');
																		ext                             =     ext[ext.length-1].split('.');
																		var imageDst                    =     profilePic_path_assets + ext[0] + "_50x50" + "." +ext[1];
																		console.log(imageSrc)
																		console.log(imageDst)
																		ImgResizeService.isImageExist(imageSrc, imageDst, function(err, imageResizeResults) {
																			
																			if(err)
																			{
																				console.log(err)
																				callback();
																			}
																			else
																			{
																				console.log(imageResizeResults)
																				item.profile_image = profilePic_path + ext[0] + "_50x50" + "." +ext[1];
																				fs.exists(clgImgSrc, function(exists) {
																				 if (exists) {

																						console.log("collge Image exists");

																						var ext                         =     clgImgSrc.split('/');
																						ext                             =     ext[ext.length-1].split('.');
																						var imageDst                    =     collageImg_path_assets + ext[0] + "_50x50" + "." +ext[1];
																						console.log(imageSrc)
																						console.log(imageDst)
																						ImgResizeService.isImageExist(clgImgSrc, imageDst, function(err, imageResizeResults) {
																							
																							if(err)
																							{
																								console.log(err)
																								callback();
																							}
																							else
																							{
																								console.log(imageResizeResults)
																								item.dither_image = collageImg_path + ext[0] + "_50x50" + "." +ext[1];
																								callback();
																							}
																						});
																						
																					}	
																					else
																					{
																						callback();
																					}
																				});
																				//callback();
																			}
																		});
																		
																	}	
																	else
																	{
																		callback();
																	}
																});

                                                        }

                                                    });


                                              }
                                              else if(item.notificationTypeId==4)
                                              {
                                                  console.log("signuppp")
                                                  NotificationType.find({id:4 }).exec(function(err, ntfnTypeFound){

                                                        if(err)
                                                            {
                                                                console.log(err)
                                                                callback(true,ntfnTypeFound );
                                                            }
                                                        else
                                                            {
                                                                    console.log(ntfnTypeFound)
                                                                    var notification    = ntfnTypeFound[0].body;
                                                                    console.log(notification)
                                                                    ntfn_body           = util.format(notification);
                                                                    item.ntfn_body      =   ntfn_body;
                                                                    item.type           =   ntfnTypeFound[0].type;
                                                                    var imageToResize	=   item.profile_image;
                                                                    var clgImgToResize	=	item.dither_image;
                                                                    item.profile_image  =   profilePic_path + item.profile_image;
                                                                    item.dither_image   =   collageImg_path + item.dither_image;
                                                                    console.log(ntfn_body)
                                                                    notificationSignup  =  ntfn_body;
                                                                     // ------------------------------Generate ThumbnailImage-----------------------------------------------
																	var imageSrc                    =     profilePic_path_assets + imageToResize;
																	var clgImgSrc					=	  collageImg_path_assets + clgImgToResize;
																	fs.exists(imageSrc, function(exists) {
																	if (exists) {

																		console.log("Image exists");

																		var ext                         =     imageSrc.split('/');
																		ext                             =     ext[ext.length-1].split('.');
																		var imageDst                    =     profilePic_path_assets + ext[0] + "_50x50" + "." +ext[1];
																		console.log(imageSrc)
																		console.log(imageDst)
																		ImgResizeService.isImageExist(imageSrc, imageDst, function(err, imageResizeResults) {
																			
																			if(err)
																			{
																				console.log(err)
																				callback();
																			}
																			else
																			{
																				console.log(imageResizeResults)
																				item.profile_image = profilePic_path + ext[0] + "_50x50" + "." +ext[1];
																				fs.exists(clgImgSrc, function(exists) {
																				 if (exists) {

																						console.log("collge Image exists");

																						var ext                         =     clgImgSrc.split('/');
																						ext                             =     ext[ext.length-1].split('.');
																						var imageDst                    =     collageImg_path_assets + ext[0] + "_50x50" + "." +ext[1];
																						console.log(imageSrc)
																						console.log(imageDst)
																						ImgResizeService.isImageExist(clgImgSrc, imageDst, function(err, imageResizeResults) {
																							
																							if(err)
																							{
																								console.log(err)
																								callback();
																							}
																							else
																							{
																								console.log(imageResizeResults)
																								item.dither_image = collageImg_path + ext[0] + "_50x50" + "." +ext[1];
																								callback();
																							}
																						});
																						
																					}	
																					else
																					{
																						callback();
																					}
																				});
																				//callback();
																			}
																		});
																		
																	}	
																	else
																	{
																		callback();
																	}
																});

                                                            }

                                                    });


                                              }
                                              else if(item.notificationTypeId==1)
                                              {

                                                 NotificationType.find({id:1 }).exec(function(err, ntfnTypeFound){

                                                            if(err)
                                                            {
                                                                console.log(err)
                                                            }
                                                            else
                                                            {

                                                                console.log(item.description)
                                                                console.log(ntfnTypeFound)
                                                                var notification    = ntfnTypeFound[0].body;
                                                                console.log(notification)
                                                                var ntfn_body       = util.format(notification,item.name);
                                                                item.type           =   ntfnTypeFound[0].type;
                                                                item.ntfn_body      =   ntfn_body;
                                                                var imageToResize	=   item.profile_image;
                                                                var clgImgToResize	=	item.dither_image;
                                                                item.profile_image  =   profilePic_path + item.profile_image;
                                                                item.dither_image   =   collageImg_path + item.dither_image;
                                                                console.log(item.profile_image)
                                                                console.log(ntfn_body)
                                                                notificationTagged  =  ntfn_body;
                                                                
                                                                // ------------------------------Generate ThumbnailImage-----------------------------------------------
																var imageSrc                    =     profilePic_path_assets + imageToResize;
																var clgImgSrc					=	  collageImg_path_assets + clgImgToResize;
                                                                fs.exists(imageSrc, function(exists) {
																 if (exists) {

																		console.log("Image exists");

																		var ext                         =     imageSrc.split('/');
																		ext                             =     ext[ext.length-1].split('.');
																		var imageDst                    =     profilePic_path_assets + ext[0] + "_50x50" + "." +ext[1];
																		console.log(imageSrc)
																		console.log(imageDst)
																		ImgResizeService.isImageExist(imageSrc, imageDst, function(err, imageResizeResults) {
																			
																			if(err)
																			{
																				console.log(err)
																				callback();
																			}
																			else
																			{
																				console.log(imageResizeResults)
																				item.profile_image = profilePic_path + ext[0] + "_50x50" + "." +ext[1];
																				fs.exists(clgImgSrc, function(exists) {
																				 if (exists) {

																						console.log("collge Image exists");

																						var ext                         =     clgImgSrc.split('/');
																						ext                             =     ext[ext.length-1].split('.');
																						var imageDst                    =     collageImg_path_assets + ext[0] + "_50x50" + "." +ext[1];
																						console.log(imageSrc)
																						console.log(imageDst)
																						ImgResizeService.isImageExist(clgImgSrc, imageDst, function(err, imageResizeResults) {
																							
																							if(err)
																							{
																								console.log(err)
																								callback();
																							}
																							else
																							{
																								console.log(imageResizeResults)
																								item.dither_image = collageImg_path + ext[0] + "_50x50" + "." +ext[1];
																								callback();
																							}
																						});
																						
																					}	
																					else
																					{
																						callback();
																					}
																				});
																				//callback();
																			}
																		});
																		
																	}	
																	else
																	{
																		callback();
																	}
																});

                                                            }

                                                    });


                                                }
                                              else if(item.notificationTypeId==7)
                                              {
												console.log("Notification lOGGGG")

                                                 NotificationType.find({id:7 }).exec(function(err, ntfnTypeFound){

                                                            if(err)
                                                            {
																console.log("+++++++++++++++++++++++++NOTIFICATION ERR+++++++++++++++++++++++")
                                                                console.log(err)
                                                            }
                                                            else
                                                            {

                                                                
                                                                console.log("+++++++++++++++++++++++++NOTIFICATION+++++++++++++++++++++++")
                                                                console.log(ntfnTypeFound)
                                                                var notification    = ntfnTypeFound[0].body;
                                                                console.log(notification)
                                                                var ntfn_body       = util.format(notification,item.name);
                                                                item.type           =   ntfnTypeFound[0].type;
                                                                item.ntfn_body      =   ntfn_body;
                                                                var imageToResize	=   item.profile_image;
                                                                var clgImgToResize	=	item.dither_image;
                                                                item.profile_image  =   profilePic_path + item.profile_image;
                                                                item.dither_image   =   collageImg_path + item.dither_image;
                                                                console.log(item.profile_image)
                                                                console.log(ntfn_body)
                                                                notificationTagged  =  ntfn_body;
                                                                
                                                                // ------------------------------Generate ThumbnailImage-----------------------------------------------
																var imageSrc                    =     profilePic_path_assets + imageToResize;
																var clgImgSrc					=	  collageImg_path_assets + clgImgToResize;
                                                                fs.exists(imageSrc, function(exists) {
																 if (exists) {

																		console.log("Image exists");

																		var ext                         =     imageSrc.split('/');
																		ext                             =     ext[ext.length-1].split('.');
																		var imageDst                    =     profilePic_path_assets + ext[0] + "_50x50" + "." +ext[1];
																		console.log(imageSrc)
																		console.log(imageDst)
																		ImgResizeService.isImageExist(imageSrc, imageDst, function(err, imageResizeResults) {
																			
																			if(err)
																			{
																				console.log(err)
																				callback();
																			}
																			else
																			{
																				console.log(imageResizeResults)
																				item.profile_image = profilePic_path + ext[0] + "_50x50" + "." +ext[1];
																				fs.exists(clgImgSrc, function(exists) {
																				 if (exists) {

																						console.log("collge Image exists");

																						var ext                         =     clgImgSrc.split('/');
																						ext                             =     ext[ext.length-1].split('.');
																						var imageDst                    =     collageImg_path_assets + ext[0] + "_50x50" + "." +ext[1];
																						console.log(imageSrc)
																						console.log(imageDst)
																						ImgResizeService.isImageExist(clgImgSrc, imageDst, function(err, imageResizeResults) {
																							
																							if(err)
																							{
																								console.log(err)
																								callback();
																							}
																							else
																							{
																								console.log(imageResizeResults)
																								item.dither_image = collageImg_path + ext[0] + "_50x50" + "." +ext[1];
																								callback();
																							}
																						});
																						
																					}	
																					else
																					{
																						callback();
																					}
																				});
																				//callback();
																			}
																		});
																		
																	}	
																	else
																	{
																		callback();
																	}
																});

                                                            }

                                                    });


                                                }


                                        }
                                        else
                                        {
                                            callback();
                                        }

                                    }, function(err) {

                                       console.log("resulttt dataaa")
                                       console.log(results)
                                        return res.json(200, {status: 1,status_type:"Success", msg: 'success',notification_data:results});
                                    });

                            }
                            else
                                {
                                    return res.json(200, {status: 2,status_type:"Failure",msg: 'No notification found'});
                                }
                            }
                        });

                //}

        },

    /* ==================================================================================================================================
                Type Notification API
    ==================================================================================================================================== */


        typeNotification: function(req, res) {

                    var notificationTypeId          =   req.param("notification_type");
                    var notificationId              =   req.param("notification_id");
                    console.log(req.params.all());
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
                                    " INNER JOIN user usr ON usr.id = ntlg.ditherUserId"+
                                    " INNER JOIN collage clg ON clg.id = ntlg.collage_id"+
                                    " WHERE"+
                                    " ntlg.id = "+notificationId;

                            console.log(query);
                            NotificationLog.query(query, function(err,results) {
                                    if(err){
                                            console.log(err);
                                            return res.json(200, {status: 2, status_type:"Failure", msg: 'Some error occured in getting Socket typeNotification'});
                                    }
                                    else{
                                            console.log(results);
                                            if(results.length == 0){
                                                    return res.json(200, {status: 2, status_type:"Failure", msg: 'No notification Found'});
                                            }else{
                                                    NotificationType.findOne({id: notificationTypeId}).exec(function(err, ntfnFoundResults){
                                                            if(err){
                                                                    console.log(err);
                                                                    return res.json(200, {status: 2, status_type:"Failure", msg: 'Some error occured in getting Socket typeNotification body/msg'});

                                                            }else{
                                                                console.log(ntfnFoundResults);
                                                                user_id                 =   results[0].ditherUserId;
                                                                var tagged_users            =   [];
                                                                var switchKey = notificationTypeId;
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

                                                                if(results[0].description > 0 || !results[0].description){
                                                                    notification                =       ntfnFoundResults.body;
                                                                    results[0].description      =       results[0].description - 1;
                                                                    ntfn_body                   =       util.format(notification, results[0].description);
                                                                    console.log(notification);
                                                                }
                                                                console.log(ntfn_body);
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
