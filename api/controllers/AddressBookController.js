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
			    
			    console.log(req.options.tokenCheck)
			    console.log(req.options.tokenCheck.tokenDetails.userId)
                var tokenCheck                  =     req.options.tokenCheck;
                var userId                      =     tokenCheck.tokenDetails.userId;
                console.log(tokenCheck)
                console.log("addUserContacts=-=============");
                var query,
                    ditherUserInAddressBook,
                    ditherUserInFbFriends;
                var phoneContactsArray      = [];
                var fbUserArray             = [];
                var fbUser                  = [
                                                {ditherUserName: 'fb_sasi 1',fbId: 'trweewtew'},
                                                {ditherUserName: 'fb_sasi 2',fbId: 'eeeeeeeeeee'},
                                                {ditherUserName: 'fb_sasi 3',fbId: 'ggggggggggg'},
                                              ];
                var phonecontacts           = [
                        {ditherUserName: 'sasi 1',ditherUserPhoneNumber: 98455454},
                        {ditherUserName: 'sasi 2',ditherUserPhoneNumber: 98455454},
                        {ditherUserName: 'sasi 3',ditherUserPhoneNumber: 98455454},
                        ];


                phonecontacts.forEach(function(factor, index){
                     console.log("factor");
                     console.log(factor);
                     phoneContactsArray.push("("+userId+",'"+factor.ditherUserName+"', "+factor.ditherUserPhoneNumber+", now(), now())");
                });

                fbUser.forEach(function(factor, index){
                     console.log("factor");
                     console.log(factor);
                     fbUserArray.push("("+userId+",'"+factor.ditherUserName+"', '"+factor.fbId+"', now(), now())");
                });


                console.log(phoneContactsArray);

            async.series([

                      function(callback) {

                            //Parallel for insert users in addressBook and in fbFriends simultaneously
                            async.parallel([
                                    function(callback) {
                                                if(phonecontacts.length != 0){
                                                        var query = "INSERT INTO addressBook"+
                                                                    " (userId,  ditherUserName, ditherUserPhoneNumber, createdAt, updatedAt)"+
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

                                                                    console.log(createdAddressBook);
                                                                    console.log("createdAddressBook ?????????????????????????????????????????????");
                                                                    callback();
                                                                }
                                                        });
                                                }else{
                                                            callback();
                                                }
                                    },
                                    function(callback) {
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


                                    console.log("Series  -- 2nd ");
                                    //Parallel for insert users in addressBook and in fbFriends simultaneously
                                    async.parallel([
                                            function(callback) {

                                                        query = " SELECT adb.id, usr.id, usr.name, usr.profilePic, usr.phoneNumber"+
                                                                    " FROM addressBook adb"+
                                                                    " INNER JOIN user usr ON usr.id = adb.ditherUserId"+
                                                                    " WHERE adb.userId = "+userId+
                                                                    " AND adb.ditherUserId IS NOT NULL";
                                                        AddressBook.query(query, function(err, selectedDitherAdb) {
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
                                                                        callback();
                                                                }
                                                        });
                                            },
                                            function(callback) {
                                                    query = " SELECT fbf.id, usr.id, usr.name, usr.profilePic, usr.phoneNumber"+
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

        },

   /* ==================================================================================================================================
         To get addressbook Contacts
     ==================================================================================================================================== */








};

