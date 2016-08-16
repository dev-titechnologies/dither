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
                        
                        
                        
               console.log(req.param('contact_array'))  
               
               var device_type		=	req.get('device_type');
               var phonecontacts	= [];
               var fbUser			= [];
                 
               if(req.param('contact_array')== undefined || req.param('contact_array')== '')  
                {
					return res.json(200, {status: 2, status_type: 'Failure' , message: 'Request Data Missing'}); //If an error occured, we let express/connect handle it by calling the "next" function
				}
				else
				{
					
						if(device_type=='android')
						{
							 console.log("android contacts")
							 phonecontacts           = req.param('contact_array');
							 //fbUser 				 = req.param('fb_array');
						}
						else
						{	
							 console.log("iosss contacts")
							 phonecontacts           = JSON.parse(req.param('contact_array'));
							 //fbUser 				 = JSON.parse(req.param('fb_array'));
						}	
						//var phonecontacts           = [{name:'Melita Nora',number:'(8281442870)'},{name:'Rena Acosta',number:'(7689-4564-89)'},{name:'Jacklyn Simon',number:'(7689-8679-89)'},{name:'Jacklyn Simon',number:'(7689-8679-89)'},{name:'Elizabeth Evangeline',number:'(9887-8989-89)'},{name:'Kris Hardine',number:'(9889-8989-89)'}];
						var fbUser                  = [ { fb_name: 'malu', fb_userid: 'malutest123' } ] ;
								
								
						console.log(phonecontacts)
						var data_check1 = "";
						phonecontacts.forEach(function(factor, index){
							 console.log("factor");
							 console.log(factor);
							 phoneContactsArray.push("("+userId+",'"+factor.name+"', '"+factor.number+"', now(), now())");
						});

						console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
						console.log(phoneContactsArray)
						
						fbUser.forEach(function(factor, index){
							 console.log("factor");
							 console.log(factor);
							 fbUserArray.push("("+userId+",'"+factor.fb_name+"', '"+factor.fb_userid+"', now(), now())");
						});


						console.log(phoneContactsArray);

					async.series([
					
							  function(callback) {
								  console.log("deletion**************************************************")
								 

									//Parallel for insert users in addressBook and in fbFriends simultaneously
									async.parallel([
											 // Clear the old details
											function(callback) {
														if(phonecontacts.length != 0){
																var query = "DELETE FROM addressBook where userId = '"+userId+"'";
																
																var criteria	=	{userId:userId}
															   

																console.log(query);
																AddressBook.query(query, function(err, deleteAddressBook) {
																		if(err)
																		{
																			console.log(err);
																			//return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage Detail creation', error_details: err});
																			//callback();
																			callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in contact address creation', error_details: err});
																		}
																		else
																		{
																			 
																			console.log("deleteAddressBook ?????????????????????????????????????????????");
																			callback();
																		}
																});
														}else{
																	callback();
														}
											},
											function(callback) {
														if(fbUser.length != 0){
																var query = "DELETE FROM fbFriends where userId = '"+userId+"'";
																var criteria	=	{userId:userId}
																
																 
																
																console.log(query);
																FbFriends.query(query, function(err, deleteFBFriends) {
																		if(err)
																		{
																			console.log(err);
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
														}else{
																	callback();
															 }
											}
								
								  
								  ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
												if (err) {
														console.log(err);
														//return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in add User contact', error_details: err});
														callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in address book creation or in fbFriend creation', error_details: err});
												}else{
														//return res.json(200, {status: 1, status_type: 'Success' ,message: 'Successfully added phone contact list to addressBook and fbcontacts to fbFriends'});
														callback();
												}

									});
								  
							  },function(callback) {

		 
											console.log("Series  -- 3rd ");
											//Parallel  select users in addressBook and in fbFriends simultaneously
											async.parallel([
		 
											function(callback) {
														if(phonecontacts.length != 0){
																var query = "INSERT INTO addressBook"+
																			" (userId,ditherUserName, ditherUserPhoneNumber, createdAt, updatedAt)"+
																			" VALUES"+phoneContactsArray;

																console.log(query);
																AddressBook.query(query, function(err, createdAddressBook) {
																		if(err)
																		{
																			console.log(err);
																			//return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage Detail creation', error_details: err});
																			//callback();
																			callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in contact address creation', error_details: err});
																		}
																		else
																		{
																			data_check1 = createdAddressBook;
																			console.log(createdAddressBook.insertId);
																			 //Notification Log Insertion
																			

																			console.log("createdAddressBook ?????????????????????????????????????????????");
																			callback();
																		}
																});
														}else{
																	callback();
														}
											},
											function(callback) {
												console.log("data_check1 -------------------------------------------------------");
												console.log(data_check1);
												
														if(fbUser.length != 0){
																var query = "INSERT INTO fbFriends"+
																			" (userId,  ditherUserName, fbId, createdAt, updatedAt)"+
																			" VALUES"+fbUserArray;

																console.log(query);
																FbFriends.query(query, function(err, createdFbFriends) {
																		if(err)
																		{
																			console.log(err);
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
														}
														else{

															callback();
														}


											},
											
											function(callback) {
												 console.log("Series  -- 2nd ");
												 //Parallel update ditherUsers in addressBook and in fbFriends simultaneously
												 if(phonecontacts.length != 0){
													 
														phonecontacts.forEach(function(factor, index){
																
																		var values={
																						userId		: userId,
																						phoneNumber	: factor.number,
																					  }	
																					  
																					  console.log(values)
																			
																						/*invitation.create(values).exec(function(err, createdInvitation) {
																							if(err)
																							{
																								console.log("[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[")
																								console.log(err)
																							}
																							else
																							{
																								console.log("[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[")
																								console.log(createdInvitation)
																							}
																						});*/
																
																User.find({phoneNumber:factor.number}).exec(function (err, selectDContacts){
																	
																	console.log("#########################################")
																	console.log(selectDContacts)
																	if(selectDContacts.length!=0)
																	{
																		
																		//updation 
																		
																		 var data     = {ditherUserId:selectDContacts[0].id};
																		 var criteria = {ditherUserPhoneNumber: factor.number};
																		
																		 AddressBook.update(criteria,data).exec(function(err, updatedRecords) {
																									
																				if(!err)
																				{
																					
																				}					
																				
																										
																		  });
																		
																		 //invitation table Insertion
																			
																			
																		
																	 }
																	
																	
																  });    
																
														});
														
													 callback();	
												  }
													
											},
											function(callback) {
												 console.log("Series  -- 2nd 2nd ");
												 //Parallel update ditherUsers in addressBook and in fbFriends simultaneously
												 if(fbUser.length != 0){
													 
														fbUser.forEach(function(factor, index){
							 
																
																User.find({fbId:factor.fb_userid}).exec(function (err, selectFBContacts){
																	console.log()
																	if(selectFBContacts.length!=0)
																	{
																		
																		var data     = {ditherUserId:selectFBContacts[0].id};
																		var criteria = {fbId:factor.fb_userid};
																		console.log("fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb")
																		console.log(data)
																			FbFriends.update(criteria,data).exec(function(err, updatedRecords) {
																				if(err)
																				{
																					console.log("fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb")
																					console.log(err)
																				}
																				else
																				{
																					console.log(updatedRecords)
																				}
																				
																			});
																			
																			
																			
																		
																	 }
																	
																	
																  });    
																
														});
														callback();	
													 
												  }
													
											}
											
											
											
											
									   ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
												if (err) {
														console.log(err);
														//return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in add User contact', error_details: err});
														callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in address book creation or in fbFriend creation', error_details: err});
												}else{
														//return res.json(200, {status: 1, status_type: 'Success' ,message: 'Successfully added phone contact list to addressBook and fbcontacts to fbFriends'});
														callback();
												}

									});
							},			
												
							function(callback) {

		 
											console.log("Series  -- 3rd ");
											//Parallel  select users in addressBook and in fbFriends simultaneously
											async.parallel([
													function(callback) {
																console.log(userId)
																query = "SELECT adb.id, usr.id, usr.name, usr.profilePic, usr.phoneNumber"+
																			" FROM addressBook adb"+
																			" INNER JOIN user usr ON usr.id = adb.ditherUserId"+
																			" WHERE adb.userId = "+userId+
																			" AND adb.ditherUserId IS NOT NULL";
																	  console.log(query);

																AddressBook.query(query, function(err, selectedDitherAdb) {
																	console.log("ttttttttttttttttttttttttttttttttttttttttttttttttttt")
																	console.log(selectedDitherAdb)
																		if(err)
																		{
																				console.log(err);
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
															query = " SELECT fbf.id, usr.id, usr.name, usr.fbId,usr.profilePic, usr.phoneNumber"+
																	" FROM fbFriends fbf"+
																	" INNER JOIN user usr ON usr.id = fbf.ditherUserId"+
																	" WHERE fbf.userId = "+userId+
																	" AND fbf.ditherUserId IS NOT NULL";
															console.log(query);
															FbFriends.query(query, function(err, selectedDitherFbf) {
																	if(err)
																	{
																			console.log(err);
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
																						console.log(factor.profilePic)
																					}
																					
																				});
																		   
																		   console.log("selectedDitherFbf ++++++++++++++++++++++++++++++++++++++++++++++++");
																		   callback();
																	}
															});
													}
											 ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
												if (err) {
														console.log(err);
														//return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in add User contact', error_details: err});
														callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in selecting dither users from fbFriend list or from address book list', error_details: err});
												}else{
														//return res.json(200, {status: 1, status_type: 'Success' ,message: 'Successfully added phone contact list to addressBook and fbcontacts to fbFriends'});
														console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
														callback();
												}

									});

							},

							], function(err) { //This function gets called after the two tasks have called their "task callbacks"
													if (err) {
														console.log(err);
														return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in address book creation or in fbFriend creation or getting fbfriends or grtting contacts', error_details: err}); //If an error occured, we let express/connect handle it by calling the "next" function
													}else{
														console.log("Success -----------------------------------------");
														return res.json(200, {status: 1, status_type: 'Success' , message: 'Successfully added phone contact list to addressBook and fbcontacts to fbFriends', ditherPhoneContact: ditherUserInAddressBook, ditherFBuser: ditherUserInFbFriends});
													}

						});
            }    
        },

   







};

