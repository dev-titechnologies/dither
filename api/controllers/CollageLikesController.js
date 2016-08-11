/**
 * CollageLikesController
 *
 * @description :: Server-side logic for managing collagelikes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /* ==================================================================================================================================
               To Vote or Like a Dither
     ==================================================================================================================================== */
        voteDither:  function (req, res) {

                    console.log("Like  Dithers ===== api");
                    console.log(req.param("dither_id"));
                    //console.log(req.param("user_id"));
                    console.log(req.param("dither_like_image_id"));
                    var tokenCheck                  =     req.options.tokenCheck;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var collageId                   =     req.param("dither_id");
                    //var likedUserId               =     req.param("user_id");
                    var likedImageId                =     req.param("dither_like_image_id");
                    var imgPosition                 =     req.param("image_position");

                    if(!collageId || !likedImageId || !imgPosition){
                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please pass the dither_id and dither_like_image_id and position'});
                    }else{
                                var values = {
                                    collageId       :       collageId,
                                    imageId         :       likedImageId,
                                    userId          :       userId,
                                    likeStatus      :       1,
                                    likePosition    :       imgPosition,
                                };
                                CollageLikes.create(values).exec(function(err, results){
                                        if(err){
                                                console.log(err);
                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Dither Vote Creation', error_details: err});
                                        }
                                        else{
                                            console.log("results ======================");
                                            console.log(results);
                                            console.log(results.collageId);
                                            console.log(results.imageId);
                                            CollageDetails.findOne({id: results.imageId, collageId: results.collageId}).exec(function (err, foundImgResults){
                                                    if(err){
                                                        console.log(err);
                                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding image from Image Details', error_details: err});
                                                    }else{
                                                        console.log(foundImgResults);
                                                            if(!foundImgResults){
                                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No Image of the Dither Found by this id'});
                                                            }else{
                                                                    var criteria = {id: foundImgResults.id};
                                                                    var values   = {vote: parseInt(foundImgResults.vote) + 1};
                                                                    CollageDetails.update(criteria, values).exec(function(err, updatedVoteCount) {
                                                                        if(err)
                                                                        {
                                                                            console.log(err);
                                                                            return res.json(200, {status: 2, status_type: 'Failure', message: 'Some error has occured in Updating vote count of a single image'});
                                                                        }
                                                                        else
                                                                        {
                                                                           //-----------Notification log Insertion----------------
                                                                              console.log("88888888888888888888888888888")
                                                                              Collage.find({id:collageId}).exec(function(err, userDetails){
									
																				if(err)
																				{		
																					console.log(err)
																				}	
																				else
																				{
																			      
																			      CollageLikes.find({collageId:collageId}).exec(function(err, likeDetails){
																					   if(err)
																					   {
																							console.log(err)
																					   }
																					   else
																					   {
																			                       console.log(likeDetails.length)
																			      
																									console.log("999999999999999999999999999999999")
																									console.log(results)
																									var values ={
																			
																													notificationTypeId	:	2,
																													userId				:   userId,
																													ditherUserId		:	userDetails[0].userId,
																													collage_id			:	collageId,
																													image_id			:	results.imageId,
																													description			:	likeDetails.length
																												}
																								
						
																									NotificationLog.create(values).exec(function(err, createdNotificationTags) {

																										if(err)
																										{
																											console.log(err);
																											return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in inserting collage tagged users', error_details: err});
																										}
																										else
																										{
																											console.log(createdNotificationTags)
																										}
																									});
																
                                                                                     //-----------------------------End OF NotificationLog---------------------------------
                                                                                                   
																											/*console.log(foundImgResults);
																											console.log(foundImgResults.vote);
																											console.log("Success");
																											console.log(updatedVoteCount[0]);*/
																											//console.log(updatedVoteCount);
																										return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully voted the Image',
																											total_like_count       :  updatedVoteCount[0].vote,
																										});
                                                                                  
																				}
																				});            
                                                                              }
																		  });                  
                                                                        }
                                                                    });
                                                            }

                                                    }

                                            });

                                        }
                                });
                    }

    },
};
