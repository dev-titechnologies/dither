 /**
 * CollageCommentsController
 *
 * @description :: Server-side logic for managing collagecomments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

 /* ==================================================================================================================================
               To Comment a Dither
   ==================================================================================================================================== */
        commentDither:  function (req, res) {

                    console.log("Comment  Dithers ===== api");
                    console.log(req.param("dither_id"));
                    //console.log(req.param("user_id"));
                    console.log(req.param("comment_msg"));
                    var tokenCheck                  =     req.options.tokenCheck;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var collageId                   =     req.param("dither_id");
                    var comment                     =     req.param("comment_msg");

                    if(!collageId || !comment){
                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please pass the dither_id and comment_msg'});

                    }else{
                            var values = {
                                collageId       :       collageId,
                                userId          :       userId,
                                comment         :       comment,
                            };
                            CollageComments.create(values).exec(function(err, results){
                                    if(err){
                                            console.log(err);
                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Dither Comment Insertion', error_details: err});
                                    }
                                    else{
										
										
											//-----------Notification log Insertion----------------
											console.log("88888888888888888888888888888")
											Collage.find({id:collageId}).exec(function(err, userDetails){

											if(err)
											{		
												console.log(err)
											}	
											else
											{
											  
											  CollageComments.find({collageId:collageId}).exec(function(err, commentDetails){
												   if(err)
												   {
														console.log(err)
												   }
												   else
												   {
													       													   
														Collage.find({id:collageId}).exec(function(err, collageResult){	
													          
															   console.log(collageResult)
											  
																console.log("999999999999999999999999999999999")
																console.log(results)
																var values ={
										
																				notificationTypeId	:	3,
																				userId				:   userId,
																				ditherUserId		:	collageResult[0].userId,
																				collage_id			:	collageId,
																				description			:	commentDetails.length
																			}
															

																NotificationLog.create(values).exec(function(err, createdNotificationTags) {

																	if(err)
																	{
																		console.log(err);
																		return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in inserting collage commented users', error_details: err});
																	}
																	else
																	{
																		console.log(createdNotificationTags)
																	}
																});
							
															//-----------------------------End OF NotificationLog---------------------------------
													
										
															console.log("inserted comments");
															console.log(results);
															return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully commented against the dither',
																						comment_id                      :    results.id,
																						comment_msg                     :    results.msg,
																						comment_created_date_time       :    results.createdAt,
																				});
															});
														}
													});						
												 }
												}); 
										

                                    }
                            });
                    }
        }
};

