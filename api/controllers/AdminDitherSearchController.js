/**
 * AdminDitherSearchController
 *
 * @description :: Server-side logic for managing admindithersearches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var todayISO           =   new Date().toISOString();
module.exports = {

     /* ==================================================================================================================================
               Search in dither list(name,type(open,close))
     ==================================================================================================================================== */

    getAllDithers   : function(req,res){

                        console.log("=======AdminditherControllerr===========");
                        console.log(req.params.all());
                        var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                        var collageImg_path             =     server_image_baseUrl + req.options.file_path.collageImg_path;
                        var collage_image;
                        var start                       =   req.body.start;
                        var count                       =   req.body.count;
                        var name                        =   req.body.name;
                        var ditherStatus                =   req.body.ditherStatus;
                        var received_userId             =   req.body.userId;
                        var orderby						 =	 req.body.order;
                        var query;
                        var userIdCheck;
                        var innerOrderBy;
                        if(orderby == 1){
								innerOrderBy			=	" DESC ";
						}else{
								innerOrderBy			=	" ASC ";
						}
                        var outerOrderBy                =    " ORDER BY c.createdAt" +innerOrderBy+ "LIMIT "+start+" , "+count;
                        if(received_userId){
                            userIdCheck = " AND u.id = "+received_userId;
                        }else{
                            userIdCheck = "";
                        }

                        if(!ditherStatus && !name){ // search by null status name cleared
                            console.log("status null and name cleared");
                            query =   " SELECT c.id, c.imgTitle,c.totalVote,c.createdAt,c.image, u.name,"+
                                       " (SELECT COUNT( c.id ) FROM collage AS c INNER JOIN user AS u ON u.id = c.userId AND u.type != 1 "+userIdCheck+
                                       " ) AS length,"+
                                       " IF( (c.expiryDate > '"+todayISO+"') , 'open', 'close') AS ditherStatus"+
                                       " FROM collage AS c"+
                                       " INNER JOIN user AS u ON u.id = c.userId"+
                                       " WHERE u.type != 1"+userIdCheck+
                                       outerOrderBy;


                        }else if(!ditherStatus && name){ //search by name
                            console.log("inside getDitherByName by name");
                            query =    " SELECT c.id, c.imgTitle,c.totalVote,c.createdAt,c.image, u.name,"+
                                       " (SELECT COUNT( c.id ) FROM collage AS c INNER JOIN user AS u ON u.id = c.userId WHERE u.name LIKE '"+name+"%'  AND u.type != 1 "+userIdCheck+
                                       " ) AS length,"+
                                       " IF( (c.expiryDate < '"+todayISO+"') , 'close', 'open') AS ditherStatus"+
                                       " FROM collage AS c"+
                                       " INNER JOIN user AS u ON u.id = c.userId"+
                                       " WHERE u.name LIKE '"+name+"%' AND u.type != 1"+userIdCheck+
                                       outerOrderBy;

                        }else if(ditherStatus =="active" && name){ // search by status == active  and name
                            console.log("status  active and name ");
                            query   = " SELECT c.id, c.imgTitle,c.totalVote,c.createdAt,c.image, u.name,"+
                                       " (SELECT COUNT( c.id ) FROM collage AS c INNER JOIN user AS u ON u.id = c.userId WHERE c.expiryDate > '"+todayISO+"' AND u.name LIKE '"+name+"%'  AND u.type != 1 "+userIdCheck+
                                       " ) AS length,"+
                                       " IF( (c.expiryDate < '"+todayISO+"') , 'close', 'open') AS ditherStatus"+
                                       " FROM collage AS c"+
                                       " INNER JOIN user AS u ON u.id = c.userId"+
                                       " WHERE c.expiryDate > '"+todayISO+"'"+
                                       " AND u.name LIKE '"+name+"%' AND u.type != 1"+userIdCheck+
                                       outerOrderBy;


                        }else if(ditherStatus =="inactive" && name){ // search by status == inactive  and name
                            console.log("status inactive and name ");
                            query   =  " SELECT c.id, c.imgTitle,c.totalVote,c.createdAt,c.image, u.name,"+
                                       " (SELECT COUNT( c.id ) FROM collage AS c INNER JOIN user AS u ON u.id = c.userId WHERE c.expiryDate < '"+todayISO+"' AND u.name LIKE '"+name+"%'  AND u.type != 1 "+userIdCheck+
                                       " ) AS length,"+
                                       " IF( (c.expiryDate < '"+todayISO+"') , 'close', 'open') AS ditherStatus"+
                                       " FROM collage AS c"+
                                       " INNER JOIN user AS u ON u.id = c.userId"+
                                       " WHERE c.expiryDate < '"+todayISO+"'"+
                                       " AND u.name LIKE '"+name+"%'  AND u.type != 1"+userIdCheck+
                                       outerOrderBy;

                        }else if(ditherStatus =="active" && !name){ // search by status active name cleared
                            console.log("status active and name cleared");
                            query =    " SELECT c.id, c.imgTitle,c.totalVote,c.createdAt,c.image, u.name,"+
                                       " (SELECT COUNT( c.id ) FROM collage AS c INNER JOIN user AS u ON u.id = c.userId WHERE c.expiryDate > '"+todayISO+"' AND u.type != 1 "+userIdCheck+
                                       " ) AS length,"+
                                       " IF( (c.expiryDate < '"+todayISO+"') , 'close', 'open') AS ditherStatus"+
                                       " FROM collage AS c"+
                                       " INNER JOIN user AS u ON u.id = c.userId"+
                                       " WHERE u.name LIKE '"+name+"%' AND c.expiryDate > '"+todayISO+"'  AND u.type != 1"+userIdCheck+
                                       outerOrderBy;

                        }else if(ditherStatus =="inactive" && !name){ // search by status inactive name cleared
                            console.log("status inactive and name cleared");
                            query =    " SELECT c.id, c.imgTitle,c.totalVote,c.createdAt,c.image, u.name,"+
                                       " (SELECT COUNT( c.id ) FROM collage AS c INNER JOIN user AS u ON u.id = c.userId WHERE  c.expiryDate < '"+todayISO+"'  AND u.type != 1 "+userIdCheck+
                                       " ) AS length,"+
                                       " IF( (c.expiryDate < '"+todayISO+"') , 'close', 'open') AS ditherStatus"+
                                       " FROM collage AS c"+
                                       " INNER JOIN user AS u ON u.id = c.userId"+
                                       " WHERE u.name LIKE '"+name+"%' AND c.expiryDate <'"+todayISO+"'  AND u.type != 1"+userIdCheck+
                                       outerOrderBy;

                        }
                        console.log(query);
                        Collage.query(query, function (err, result){
                            if(err){
                                return res.json(200, {status: 2, error_details: err});
                            }else{
                                    result.forEach(function(factor, index){
                                            if(factor.image == null || factor.image == ""){
                                                    collage_image   =     "";
                                            }else{
                                                    collage_image   =     collageImg_path + factor.image;
                                            }
                                            factor.image            =     collage_image;
                                    });
                                    //console.log(result);
                                     console.log(result.length);
                                     console.log(start,count);
                                    return res.json(200, {status: 1, message: "success",
                                                result: result
                                    });
                            }
                        });

    },
  insertMultipleDither:	function(req,res){
								console.log("inside insertMultipleDither");
								var limit 	= 	13;
								/*var values 	= 	{
													imgTitle	:	'testScroll',
													image		:	'8803c3c5-844e-491b-baf6-16f8755cc2ff.jpg',
													location	:	'Carnival Phase IV Exit Road Infopark Campus Kakka...',
													latitude	:	0,
													longitude	:	0,
													userId		:	106,
													totalVote	:	1,
													likePosition:	0,
													status		:	'active',
													expiryDate	:	'2016-12-09 09:26:39',
													createdAt	:	'2016-12-07 09:26:39',
													updatedAt	:	'2016-12-07 09:26:53',
									};
									*/
							for(var i= 0;i<limit; i++){
								Collage.create({
													imgTitle	:	'testScroll'+i+'',
													image		:	'8803c3c5-844e-491b-baf6-16f8755cc2ff.jpg',
													location	:	'Carnival Phase IV Exit Road Infopark Campus Kakka...',
													latitude	:	0,
													longitude	:	0,
													userId		:	90,
													totalVote	:	1,
													likePosition:	0,
													status		:	'active',
													expiryDate	:	'2016-12-09 09:26:39',
													createdAt	:	'2016-12-07 09:26:39',
													updatedAt	:	'2016-12-07 09:26:53',
									}).exec(function (err, records) {
									if(err){
										console.log("inside insertMultipleDither   errrr");
										//return res.json(200,{status: 2, error_details: err});
									}
									else{
										console.log("inside insertMultipleDither      success");
										//return res.json(200,{status: 1, result: records});
									}
									
								});
							}

	},
	
};

