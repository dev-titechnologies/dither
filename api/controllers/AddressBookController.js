/**
 * AddressBookController
 *
 * @description :: Server-side logic for managing addressbooks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
/* ==================================================================================================================================
               To Upload Contacts
     ==================================================================================================================================== */
        addUserContacts: function (req, res) {
			

			    console.log(req.options.tokenCheck.tokenDetails.userId)

				var tokenCheck                  =     req.options.tokenCheck;
                var userId                      =     tokenCheck.tokenDetails.userId;
                var server_baseUrl              =     req.options.server_baseUrl;

                console.log(tokenCheck)
                console.log("addUserContacts=-=============");
                var query,
                    ditherUserInAddressBook,
                    ditherUserInFbFriends;
                var phoneContactsArray      = [];
                var fbUserArray             = [];
                
                
                
                
                /*var fbUser                  = [
                                                {ditherUserName: 'malu',fbId: 'malutest123'},
                                                {ditherUserName: 'Testers TiTech',fbId: '172318546464606058'},
                                                {ditherUserName: 'fb_sasi 3',fbId: 'ggggggggggg'},
                                              ];
                var phonecontacts           = [
                        {ditherUserName: 'gayu',ditherUserPhoneNumber: 7897979799},
                        {ditherUserName: 'sasi 2',ditherUserPhoneNumber: 98455454},
                        {ditherUserName: 'sasi 3',ditherUserPhoneNumber: 98455454},
                 
                      ];*/
                        
                        
                        
              // console.log(req.param('contact_array'))  
               
               var device_type		=	req.get('device_type');
               var phonecontacts	= [];
               var fbUser			= [];
                 
              
				//if(!req.param('contact_array') || !req.param('fb_array'))	
					//{	
						 console.log("iosss contacts")
						 
						 console.log(req.param('contact_array'))
						 
						phonecontacts           = JSON.parse(req.param('contact_array'));
						 //fbUser 				 = JSON.parse(req.param('fb_array'));
					
						//var phonecontacts      = [{name:'Melita Nora',number:'(8281442870)'},{name:'Rena Acosta',number:'(7689-4564-89)'},{name:'Jacklyn Simon',number:'(7689-8679-89)'},{name:'Jacklyn Simon',number:'(7689-8679-89)'},{name:'Elizabeth Evangeline',number:'(9887-8989-89)'},{name:'Kris Hardine',number:'(9889-8989-89)'}];
						var fbUser               = JSON.parse(req.param('fb_array'));
								
							
						var data_check1 = "";
						phonecontacts.forEach(function(factor, index){
							 //console.log("factor");
							// phoneContactsArray.push("("+userId+",'"+factor.name+"', '"+factor.number+"', now(), now())");
							phoneContactsArray.push({userId:userId,ditherUserName:factor.name, ditherUserPhoneNumber:factor.number});
						});

						console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
						//console.log(phoneContactsArray)
						
						fbUser.forEach(function(factor, index){
							 //console.log("factor");
							// console.log(factor);
							// fbUserArray.push("("+userId+",'"+factor.fb_name+"', '"+factor.fb_userid+"', now(), now())");
							 fbUserArray.push({userId:userId,ditherUserName:factor.fb_name,fbId:factor.fb_userid});
						});

					async.series([
					
							  function(callback) {
											  console.log("deletion**************************************************")

												
														
															AddressBook.destroy({userId: userId}).exec(function (err, deleteAddressBook) {
				
															//AddressBook.query(query, function(err, deleteAddressBook) {
																	if(err)
																	{
																		console.log("delete address"+err);
																		//return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage Detail creation', error_details: err});
																		callback();
																		//callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in contact address creation', error_details: err});
																	}
																	else
																	{
																		 
																		console.log("deleteAddressBook ?????????????????????????????????????????????");
																		callback();
																	}
															});			
								},
											
								 function(callback) {							
															/*var query = "INSERT INTO addressBook"+
																			" (userId,ditherUserName, ditherUserPhoneNumber, createdAt, updatedAt)"+
																			" VALUES"+phoneContactsArray;

																console.log(query);*/
																console.log("----------insertion------------------")
																AddressBook.create(phoneContactsArray).exec(function(err, createdAddressBook){
																
																
																//AddressBook.query(query, function(err, createdAddressBook) {
																		if(err)
																		{
																			console.log(err);
																			//return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage Detail creation', error_details: err});
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
													},		
								function(callback) {
																 
																 console.log("Address book updation")
																 console.log(phonecontacts.length)
																async.forEach(phonecontacts, function (factor, callback){ 
																//phonecontacts.forEach(function(factor, index){
																					
																				var values={
																								userId		: userId,
																								phoneNumber	: factor.number,
																							  }	
																							  
																							 // console.log(values)

																					
																				User.find({phoneNumber:factor.number}).exec(function (err, selectDContacts){
																				if(err)
																				{
																						console.log(err)
																						//callback();
																				}		
																				else
																				{
																						console.log("#########contactsssss resultttt################################")
																						console.log(selectDContacts.length)
																						if(selectDContacts.length!=0)
																						{
																							
																							//updation 
																							
																							 var data     = {ditherUserId:selectDContacts[0].id};
																							 var criteria = {ditherUserPhoneNumber: factor.number};
																							
																							 AddressBook.update(criteria,data).exec(function(err, updatedRecords) {
																														
																									//console.log("update record")
																									//console.log(updatedRecords)
																									//callback();
																															
																							  });
																							
																							 //invitation table Insertion
																								
																								
																							
																						 }
																				}
																						
																			});    
																				
																				
																	},callback());
																	
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
											   async.forEach(fbUser, function (factor, callback){
											   //fbUser.forEach(function(factor, index){

								
													User.find({fbId:factor.fb_userid}).exec(function (err, selectFBContacts){
														//console.log()
														if(selectFBContacts.length!=0)
														{
															
															var data     = {ditherUserId:selectFBContacts[0].id};
															var criteria = {fbId:factor.fb_userid};
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
																		console.log(updatedRecords)
																		//callback();
																	}
																	
																});
																
																
																
															
														 }
														
														
													  });    
								
												},callback());
												//callback();
								},
									
								function(callback) {	
																			 
																console.log("address book updated")		
																
																console.log("address book selectionnnnnnnnnnnnnnnn")
																			
																			
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
																						console.log(factor.profilePic)
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
																			 
																console.log("address book updated")		
																
																console.log("address book selectionnnnnnnnnnnnnnnn")
																			
																			
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

																				console.log(selectedDitherAdb);                                                                   
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
																						console.log(factor.profilePic)
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

																	   console.log(selectedDitherFbf);
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
							    
							/* ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
													if (err) {
														console.log(err);
														callback();
														//return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in address book creation or in fbFriend creation or getting fbfriends or grtting contacts', error_details: err}); //If an error occured, we let express/connect handle it by calling the "next" function
													}else{
														callback();
														//return res.json(200, {status: 1, status_type: 'Success' , message: 'Successfully added phone contact list to addressBook and fbcontacts to fbFriends', ditherPhoneContact: ditherUserInAddressBook, ditherFBuser: ditherUserInFbFriends});
													}

												});	*/
							//}
						
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
								
						
            
        },


};

