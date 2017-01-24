/**
 * AdminSettingsController
 *
 * @description :: Server-side logic for managing Adminsettings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	getSettingsData:		function(req,res){
								console.log("Inside AdminSETTINGS CONTROLLER");

								var query = "SELECT * FROM settings";
								Settings.query(query,function(err,result){
									if(err){
										  console.log("errrr",err);
										  return res.json(200, {status: 2, error_details: err});
									}else{
										  //console.log("success in settings", result);
										  return res.json(200,{status:1,message:'success',result:result});
									}
							  });
	},

	getSettingsDitherData:	function(req,res){
								console.log(req.options.settingsKeyValue);
								var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
								var collageImg_path             =     server_image_baseUrl + req.options.file_path.collageImg_path;
								var collageImg_path_assets      =     req.options.file_path.collageImg_path_assets;
								var collage_image;
								var default_collage1_Array				=		JSON.parse(req.options.settingsKeyValue.DEFAULT_DITHER_ONE);
								var default_collage2_Array       		= 		JSON.parse(req.options.settingsKeyValue.DEFAULT_DITHER_TWO);
								var default_collage3_Array				=		JSON.parse(req.options.settingsKeyValue.DEFAULT_DITHER_THREE);
								var default_collage4_Array				=		JSON.parse(req.options.settingsKeyValue.DEFAULT_DITHER_FOUR);
								var TOKEN_EXPIRY_HOUR					=		req.options.settingsKeyValue.TOKEN_EXPIRY_HOUR;
								var DITHER_EXPIRY_HOUR					=		req.options.settingsKeyValue.DITHER_EXPIRY_HOUR;
								var image;
								//console.log(TOKEN_EXPIRY_HOUR);
								//console.log(DITHER_EXPIRY_HOUR);
								console.log(default_collage1_Array);
								console.log(default_collage2_Array);
								console.log(default_collage3_Array);
								console.log(default_collage4_Array);
								default_collage1_Array.forEach(function(factor, index){
									image				=	collageImg_path+factor.image;
									factor.image		=	image;
								});
								default_collage2_Array.forEach(function(factor, index){
									image				=	collageImg_path+factor.image;
									factor.image		=	image;
								});
								default_collage3_Array.forEach(function(factor, index){
									image				=	collageImg_path+factor.image;
									factor.image		=	image;
								});
								default_collage4_Array.forEach(function(factor, index){
									image				=	collageImg_path+factor.image;
									factor.image		=	image;
								});
								 return res.json(200,{status:1,message:'success',
														result1		:	default_collage1_Array,
														result2		:	default_collage2_Array,
														result3		:	default_collage3_Array,
														result4		:	default_collage4_Array,
														result5		:	TOKEN_EXPIRY_HOUR,
														result6		:	DITHER_EXPIRY_HOUR
														});

	},
	updateTokenExpiryTime:	function(req,res){

								data =    {
											 value:req.body.value
										   };
								criteria = {
												id:req.body.id
											};

							 Settings.update(criteria,data).exec(function(err,updatedData){
								if(err)
								{
									 console.log("update token expiry time fail");
									 return res.json(200, {status: 2, error_details: err});
								}
								else
								{
									console.log("token expiry time updated");
									return res.json(200,{status:1,message:'success',result:updatedData});
								}
							});
	},
	changeDefaultDither	:	function(req,res){
								var imageUploadDirectoryPath =  '../../assets/images/collage';
								//console.log(req);
								console.log(req.params.all());
								//console.log(req.params.SubmitIdentity);
								var SubmitIdentity = req.param("SubmitIdentity");
								
								//console.log(req.file('Multiplefile')._files[0].stream);
								//console.log(req.body.file2);
								var collageArray 	=	[];
								var image;
								var position;
								var value =	[];
								var criteria;
								console.log("inside change default dither=============");
								req.file('Multiplefile').upload({dirname:imageUploadDirectoryPath, maxBytes: 100000000},function (err, files) {
									if (err){
										console.log("cannot upload not"+err);
										//callback();
									}
									else{
										//console.log("file1111111111111111111111111111111");
										console.log(files);
										//console.log(JSON.parse(file1));
										//console.log("file10000000000000000000000000000000");

										files.forEach(function(factor, index){
											 var uploadedfilename                   =    factor.fd.split('/');
                                             uploadedfilename                       =    uploadedfilename[uploadedfilename.length-1];
                                             collageArray.push({       
																	image       : 	uploadedfilename,
																	position	:	index
																	
																	});
											});
											//console.log(collageArray);
											var data		=	JSON.stringify(collageArray);
											//console.log(data);
										//if()
										/*var criteria		=	{
																	key	:	"DEFAULT_DITHER_FOUR"
																}*/
										  switch(SubmitIdentity){
																		case "1":  criteria = {		key	:	"DEFAULT_DITHER_FOUR"	}
																					console.log("inside case 1******************")
																					break;
																		case "2":
																					criteria = {		key	:	"DEFAULT_DITHER_THREE"	}
																					console.log("inside case 2******************")
																					break;
																		case "3":   criteria = {		key	:	"DEFAULT_DITHER_TWO"	}
																					console.log("inside case 3******************")
																					break;
																		case "4":  criteria = {	key	:	"DEFAULT_DITHER_ONE"	}
																					console.log("inside case 4******************")
																					break;
																}
										var data            =   {
																	value:	data
																}
											//console.log("criteria")
											//console.log(criteria)
											console.log("SubmitIdentity")
											console.log(SubmitIdentity)
											console.log("SubmitIdentity")
											//console.log("data")
											//console.log(data)
											Settings.update(criteria,data).exec(function(err,updatedData){
												if(err)
												{
													 console.log("collage Images can not inserted into table");
													 return res.json(200, {status: 2, error_details: err});
												}
												else
												{
													console.log("collage Images inserted into table");
													console.log(updatedData);
													return res.json(200,{status:1,message:'success',result:updatedData});
												}
											});
										//return res.json(200,{status:1,message:'success',result:1});
										}
		

								});
	},
	
updateDitherCloseTime:function(req,res){

                      data =    {
                                   value:req.body.value
                                 };

                      criteria = {
                                    id:req.body.id
                                  };


                     Settings.update(criteria,data).exec(function(err,updatedData){
                        if(err)
                        {
                             console.log("update dither close time fail");
                             return res.json(200, {status: 2, error_details: err});
                        }
                        else
                        {
                            console.log("dither closing time updated");
                            return res.json(200,{status:1,message:'success',result:updatedData});
                        }
                    });
},
};

