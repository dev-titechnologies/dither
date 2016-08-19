/**
 * TestFileContactsController
 *
 * @description :: Server-side logic for managing Testfilecontacts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

//var jsonfile = require('jsonfile');
module.exports = {
	
				
	
	
				/* ==================================================================================================================================
								To Upload Contacts
				==================================================================================================================================== */
						/*	addUserContacts: function (req, res) {
								
									//console.log(req.file('file')._files)
									var tokenCheck                  =     req.options.tokenCheck;
									var userId                      =     tokenCheck.tokenDetails.userId;
									var server_baseUrl              =     req.options.server_baseUrl;
									var phoneContactsArray			=	  [];
									var fbUserArray					=	  [];
									  
									var	ditherUserInAddressBook;
									var	ditherUserInFbFriends;
									//userId = 48;
									
								
									
									//--------------contacts filtering---------------------------------------------------------------
											   
													
											async.series([
											
												 function(callback) {
													 
													 
													 //--------------------Phone Contact Arrayy-----------------------------------
													 
														req.file('contact_array').upload({dirname: '',maxBytes: 100 * 1000 * 1000},function (err, phonecontacts) 
														{
																console.log(phonecontacts)
																imageName = phonecontacts[0].fd.split('/');
																imageName = imageName[imageName.length-1];
																
																jsonFilePath = '.tmp/uploads/'+imageName;
																console.log(jsonFilePath)
																jsonfile.readFile(jsonFilePath, function(err, obj) 
																{
																		if(err)
																		{
																			console.log(err);
																			callback();
																			//return res.json(200, {status: 2,status_type: 'Failure', message: 'File Not Found'});
																		}
																		else
																		{
																			console.log("success --------");
																			
																			//console.log(obj);
																			phoneContactsArray 	= 	obj;
																			callback();
																			//console.log(phoneContactsArray)
																			
																		}	
																 });			
																			
													});
													 
													 
												 },
										         function(callback) {
													 
													 //--------------------FB Contact Arrayy-------------------------------------------------------
								    
																	req.file('fb_array').upload({dirname: '',maxBytes: 100 * 1000 * 1000},function (err, phonecontacts) 
																	{
																			console.log(phonecontacts)
																			imageName = phonecontacts[0].fd.split('/');
																			imageName = imageName[imageName.length-1];
																			
																			jsonFilePath = '.tmp/uploads/'+imageName;
																			console.log(jsonFilePath)
																			jsonfile.readFile(jsonFilePath, function(err, obj) 
																			{
																					if(err)
																					{
																						console.log(err);
																						callback();
																						//return res.json(200, {status: 2,status_type: 'Failure', message: 'File Not Found'});
																					}
																					else
																					{
																						console.log("success --------");
																						fbUserArray = obj;
																						callback();
																						//console.log(fbUserArray)
																					}	
																			 });			
																						
																	});
												 },
												  function(callback) {
																  console.log("deletion**************************************************")
																					
																 				
																
																				console.log(userId)
																				AddressBook.destroy({userId: userId}).exec(function (err, deleteAddressBook) {
									
																				
																						if(err)
																						{
																							console.log("delete address"+err);
																							 callback();
																							//callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in contact address creation', error_details: err});
																						}
																						else
																						{
																							// console.log(deleteAddressBook)
																							console.log("deleteAddressBook ?????????????????????????????????????????????");
																							callback();
																						}
																				});			
													},
																
													function(callback) {							

																				console.log("----------insertion------------------")
																				//console.log(phoneContactsArray)
																				if(phoneContactsArray)
																				{
																					console.log("insideeee")
																					AddressBook.create(phoneContactsArray).exec(function(err, createdAddressBook){

																							if(err)
																							{
																								console.log(err);
																								callback();
																								//callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in contact address creation', error_details: err});
																							}
																							else
																							{
																								data_check1 = createdAddressBook;
																								//console.log(createdAddressBook.insertId);
																								 console.log("createdAddressBook ?????????????????????????????????????????????");
																								 callback();
																								 
																							}
																					});		
																				}
																				else
																				{
																					 callback();
																				}
																		},		
													function(callback) {
																					 
																					console.log("Address book updation")
																					console.log(phoneContactsArray.length)
																				if(phoneContactsArray)	
																				{
																					console.log("phone updation")
																					async.forEach(phoneContactsArray, function (factor, callback){ 
																					//phonecontacts.forEach(function(factor, index){
																										
																						var values={
																										userId		: userId,
																										phoneNumber	: factor.ditherUserPhoneNumber,
																									  }	
																									  
																									 // console.log(values)

																							
																						User.find({phoneNumber:factor.ditherUserPhoneNumber}).exec(function (err, selectDContacts){
																						//console.log(factor.number)	
																						if(err)
																						{
																								console.log(err)
																								//callback();
																						}		
																						else
																						{
																								//console.log("#########contactsssss resultttt################################")
																								//console.log(selectDContacts)
																								if(selectDContacts.length!=0)
																								{
																									
																									//updation 
																									
																									 var data     = {ditherUserId:selectDContacts[0].id};
																									 var criteria = {ditherUserPhoneNumber: factor.ditherUserPhoneNumber};
																									
																									 AddressBook.update(criteria,data).exec(function(err, updatedRecords) {
																																
																											console.log("update record")
																											console.log(updatedRecords)
																											//callback();
																																	
																									  });
																									
																									 //invitation table Insertion
																										
																										
																									
																								 }
																						}
																								
																					});    
																						
																						
																			},callback());
																		}
																		else
																		{
																			callback();
																		}	
																			
																				//callback();			
																		},			
																			
																
													function(callback) {			
																
										
																		FbFriends.destroy({userId: userId}).exec(function (err, deleteFBFriends) {
																		
																		//FbFriends.query(query, function(err, deleteFBFriends) {
																				if(err)
																				{
																					console.log("fb friends deletion"+err);
																					//return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage Detail creation', error_details: err});
																					//callback();
																					callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in contact address creation', error_details: err});
																				}
																				else
																				{
																					 
																					console.log("deleteFBfriends ?????????????????????????????????????????????");
																					callback();
																					
																				}
																		});		
																			
																		
													},
																 
													function(callback) {			 
																 
																		
																	console.log("insertion fb friendssssssssssssssssssssss")
																		
																		
																					FbFriends.create(fbUserArray).exec(function(err, createdFbFriends){
																					//FbFriends.create(query, function(err, createdFbFriends) {
																							if(err)
																							{
																								console.log("insertion fbfriends error"+err);
																								//return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage Detail creation', error_details: err});
																								//callback();
																								callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in fbFriend creation', error_details: err});
																							}
																							else
																							{

																								   console.log(createdFbFriends);
																								   console.log("createdFbFriends ?????????????????????????????????????????????");
																								   callback();
																								   
																							}
																					});
													},		
													function(callback) {					
																						   
																   console.log("updationnnnn fb friendsssssssssssssssssssssss")
																 if(fbUserArray)	
																 {  
																   async.forEach(fbUserArray, function (factor, callback){
																   //fbUser.forEach(function(factor, index){

													
																		User.find({fbId:factor.fbId}).exec(function (err, selectFBContacts){
																			//console.log()
																			//console.log(selectFBContacts)
																			if(selectFBContacts.length!=0)
																			{
																				
																				var data     = {ditherUserId:selectFBContacts[0].id};
																				var criteria = {fbId:factor.fbId};
																				//console.log("fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb")
																				//console.log(data)
																					FbFriends.update(criteria,data).exec(function(err, updatedRecords) {
																						if(err)
																						{
																							console.log("fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb")
																							console.log(err)
																						}
																						else
																						{
																							console.log("update recordsssss in fbbbbb")
																							//console.log(updatedRecords)
																							//callback();
																						}
																						
																					});
																					
																					
																					
																				
																			 }
																			
																			
																		  });    
													
																	},callback());
																}
																else
																{
																	callback();
																}	//callback();
													},
														
													function(callback) {	
																				
																								
																					query = "SELECT adb.id, usr.id, usr.name, usr.profilePic, usr.phoneNumber"+
																							" FROM addressBook adb"+
																							" INNER JOIN user usr ON usr.id = adb.ditherUserId"+
																							" WHERE adb.userId = "+userId+
																							" AND adb.ditherUserId IS NOT NULL";
																					console.log(query);
																					//console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
																					AddressBook.query(query, function(err, selectedDitherAdb) {
																						//console.log("ttttttttttttttttttttttttttttttttttttttttttttttttttt")
																						//console.log(selectedDitherAdb)
																							if(err)
																							{
																									console.log("selecetion errorr"+err);
																									//return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage Detail creation', error_details: err});
																									//callback();
																									callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Selecting dither users from Address Book', error_details: err});
																							}
																							else
																							{

																									//console.log(selectedDitherAdb);                                                                   
																									ditherUserInAddressBook = selectedDitherAdb;
																									ditherUserInAddressBook.forEach(function(factor, index){
																									  if(factor.profilePic=='')	
																										{
																											factor.profilePic='';
																										}
																										else
																										{
																											console.log("dddddddddddddddddddddddddddddd")
																											factor.profilePic = server_baseUrl + "images/ProfilePics/"+factor.profilePic;
																											//console.log(factor.profilePic)
																										}
																									});
																									
																									callback();
																							}
																						});
																						
														},								
						
														
																
													function(callback) {					
																								   
																			console.log("fb friends updatedddddd")
																			   
																			query = " SELECT fbf.id, usr.id, usr.name, usr.fbId,usr.profilePic, usr.phoneNumber"+
																						" FROM fbFriends fbf"+
																						" INNER JOIN user usr ON usr.id = fbf.ditherUserId"+
																						" WHERE fbf.userId = "+userId+
																						" AND fbf.ditherUserId IS NOT NULL";
																			console.log(query);
																			FbFriends.query(query, function(err, selectedDitherFbf) {
																					if(err)
																					{
																							console.log("fb friends selection"+err);
																							//return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage Detail creation', error_details: err});
																							//callback();
																							callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Selecting dither users from Fb Friends', error_details: err});
																					}
																					else
																					{

																						   //console.log(selectedDitherFbf);
																						   ditherUserInFbFriends = selectedDitherFbf;
																						   
																						   ditherUserInFbFriends.forEach(function(factor, index){
																									
																									if(factor.profilePic=='')	
																									{
																										factor.profilePic='';
																									}
																									else
																									{
																										console.log("dddddddddddddddddddddddddddddd")
																										factor.profilePic = server_baseUrl + "images/ProfilePics/"+factor.profilePic;
																										//console.log(factor.profilePic)
																									}
																									
																								});
																						   
																						   console.log("selectedDitherFbf ++++++++++++++++++++++++++++++++++++++++++++++++");
																						   callback();
																					}
																			});

													},
													
													
													function(callback) {	
																				
																								
																					query = "SELECT adb.id, usr.id, usr.name, usr.profilePic, usr.phoneNumber"+
																							" FROM addressBook adb"+
																							" INNER JOIN user usr ON usr.id = adb.ditherUserId"+
																							" WHERE adb.userId = "+userId+
																							" AND adb.ditherUserId IS NOT NULL";
																					console.log(query);
																					console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
																					AddressBook.query(query, function(err, selectedDitherAdb) {
																						console.log("ttttttttttttttttttttttttttttttttttttttttttttttttttt")
																						console.log(selectedDitherAdb)
																							if(err)
																							{
																									console.log("selecetion errorr"+err);
																									//return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage Detail creation', error_details: err});
																									//callback();
																									callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Selecting dither users from Address Book', error_details: err});
																							}
																							else
																							{

																									//console.log(selectedDitherAdb);                                                                   
																									ditherUserInAddressBook = selectedDitherAdb;
																									ditherUserInAddressBook.forEach(function(factor, index){
																									  if(factor.profilePic=='')	
																										{
																											factor.profilePic='';
																										}
																										else
																										{
																											console.log("dddddddddddddddddddddddddddddd")
																											factor.profilePic = server_baseUrl + "images/ProfilePics/"+factor.profilePic;
																											//console.log(factor.profilePic)
																										}
																									});
																									
																									callback();
																							}
																						});
																						
														},						
														
																
												
														function(callback) {					
																								   
																			console.log("fb friends updatedddddd")
																			   
																			query = " SELECT fbf.id, usr.id, usr.name, usr.fbId,usr.profilePic, usr.phoneNumber"+
																						" FROM fbFriends fbf"+
																						" INNER JOIN user usr ON usr.id = fbf.ditherUserId"+
																						" WHERE fbf.userId = "+userId+
																						" AND fbf.ditherUserId IS NOT NULL";
																			console.log(query);
																			FbFriends.query(query, function(err, selectedDitherFbf) {
																					if(err)
																					{
																							console.log("fb friends selection"+err);
																							//return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage Detail creation', error_details: err});
																							//callback();
																							callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Selecting dither users from Fb Friends', error_details: err});
																					}
																					else
																					{

																						   //console.log(selectedDitherFbf);
																						   ditherUserInFbFriends = selectedDitherFbf;
																						   
																						   ditherUserInFbFriends.forEach(function(factor, index){
																									
																									if(factor.profilePic=='')	
																									{
																										factor.profilePic='';
																									}
																									else
																									{
																										console.log("dddddddddddddddddddddddddddddd")
																										factor.profilePic = server_baseUrl + "images/ProfilePics/"+factor.profilePic;
																										//console.log(factor.profilePic)
																									}
																									
																								});
																						   
																						   console.log("selectedDitherFbf ++++++++++++++++++++++++++++++++++++++++++++++++");
																						   callback();
																					}
																			});

													},
													
													
											
												], function(err) { //This function gets called after the two tasks have called their "task callbacks"
																		if (err) {
																			console.log(err);
																			return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in address book creation or in fbFriend creation or getting fbfriends or grtting contacts', error_details: err}); //If an error occured, we let express/connect handle it by calling the "next" function
																		}else{
																			console.log("Success -----------------------in contacts------------------");
																			console.log(ditherUserInAddressBook)
																			console.log("Success -------------in fbbbbb----------------------------");

																			console.log(ditherUserInFbFriends)
																			return res.json(200, {status: 1, status_type: 'Success' , message: 'Successfully added phone contact list to addressBook and fbcontacts to fbFriends', ditherPhoneContact: ditherUserInAddressBook, ditherFBuser: ditherUserInFbFriends});
																		}
													});
							
							
							
							
							
							
							//--------------------------endddddd------------------------------------------------------------------
							
						//}
				//})

						
			
		}*/
			
	
	
};

