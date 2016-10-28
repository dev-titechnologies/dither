/**
 * AddressBookController
 *
 * @description :: Server-side logic for managing addressbooks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs');
module.exports = {
/* ==================================================================================================================================
               To Upload Contacts
     ==================================================================================================================================== */
        addUserContacts: function (req, res) {

                console.log("==========================  addUserContacts  Api =-=============");
                //console.log(req.params.all());
                //console.log(req.options.tokenCheck.tokenDetails.userId)
                var tokenCheck                  =     req.options.tokenCheck;
                var userId                      =     tokenCheck.tokenDetails.userId;
                var server_baseUrl              =     req.options.server_baseUrl;
                //console.log(tokenCheck);
                var phoneContactsArray          =     [];
                var fbUserArray                 =     [];
                //var phoneContactsArray1         =     [];
                //var device_type                 =     req.get('device_type');
                //var phonecontacts               =     [];
                //var fbUser                      =     [];
                var query,
                    ditherUserInAddressBook,
                    ditherUserInFbFriends;
                var phonecontacts                   =     req.param('contact_array');
                //var phonecontacts               =     [{name:'Melita Nora',number:'(8281442870)'},{name:'Rena Acosta',number:'(7689-4564-89)'},{name:'Jacklyn Simon',number:'(7689-8679-89)'},{name:'Jacklyn Simon',number:'(7689-8679-89)'},{name:'Elizabeth Evangeline',number:'(9887-8989-89)'},{name:'Kris Hardine',number:'(9889-8989-89)'}];
                //var fbUser                      =     JSON.parse(req.param('fb_array'));
                var fbUser                      =     req.param('fb_array');
                var data_check1                 =     "";

                async.series([
                            function(callback) {
                                            console.log("----------------SERIES MAIN - I ----------------------");
                                            if(phonecontacts.length){
                                                    phonecontacts.forEach(function(factor, index){
                                                            var contact_name = factor.name;
                                                            //var contact_name = zzzzz ajay"s / \ \ /ajay's ''
                                                            var formatted_name = contact_name.replace(/'/g, "\\'");
                                                            //console.log(contact_name);
                                                            //console.log("111111111111111111111111111111111111111111111111111111111111111111111111");
                                                            //console.log(formatted_name);
                                                            //phoneContactsArray.push({userId:userId,ditherUserName:formatted_name, ditherUserPhoneNumber:factor.number});
                                                            phoneContactsArray.push("("+userId+",'"+formatted_name+"', '"+factor.number+"', now(), now())");
                                                            //phoneContactsArray1.push("INSERT INTO addressBook (userId,ditherUserName, ditherUserPhoneNumber, createdAt, updatedAt) VALUES ("+userId+",'"+factor.name+"', "+factor.number+", now(), now())");
                                                            //console.log("("+userId+",'"+formatted_name+"', "+factor.number+", now(), now())");
                                                    });
                                                    console.log("----------------SERIES 1 ----------------------")
                                                    AddressBook.destroy({userId: userId}).exec(function (err, deleteAddressBook) {
                                                    //AddressBook.query(query, function(err, deleteAddressBook) {
                                                            if(err){
                                                                console.log("delete address"+err);
                                                                //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage Detail creation', error_details: err});
                                                                callback();
                                                                //callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in contact address creation', error_details: err});
                                                            }else{
                                                                console.log("----------------SERIES 1 Succes----------------------")
                                                                //callback();
                                                                console.log("------------------- SERIES 2 ----------------------------------");
                                                                var query = "INSERT INTO addressBook"+
                                                                            " (userId,ditherUserName, ditherUserPhoneNumber, createdAt, updatedAt)"+
                                                                            " VALUES"+phoneContactsArray;
                                                                //console.log(query)
                                                                //var query = "INSERT INTO `addressBook`(`userId`, `ditherUserName`, `ditherUserPhoneNumber`, `createdAt`, `updatedAt`) VALUES"
                                                                AddressBook.query(query,function(err, createdAddressBook){
                                                                //AddressBook.create(phoneContactsArray).exec(function(err, createdAddressBook) {
                                                                        if(err){
                                                                            console.log(err);
                                                                            //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage Detail creation', error_details: err});
                                                                            callback();
                                                                            //callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in contact address creation', error_details: err});
                                                                        }else{
                                                                            data_check1 = createdAddressBook;
                                                                            console.log("----------------SERIES 2 Success ----------------------");
                                                                            //callback();
                                                                            console.log("-------------------------------- SERIES-3 -----------------------------")
                                                                            // console.log(phoneContactsArray1)
                                                                            console.log("Address book updation")
                                                                            //console.log(phonecontacts.length)
                                                                            async.forEach(phonecontacts, function (factor, callback){
                                                                                //phonecontacts.forEach(function(factor, index){
                                                                                //var query   = "SELECT id,phoneNumber FROM user where RIGHT(phoneNumber,10) = '"+factor.number+"'";
                                                                                //User.query(query, function(err, selectDContacts) {
                                                                                //console.log(factor.number)
                                                                                if(factor.number){
                                                                                    User.find({phoneNumber:factor.number}).exec(function (err, selectDContacts){
                                                                                            if(err){
                                                                                                    console.log(err)
                                                                                                    callback();
                                                                                            }else{
                                                                                                    if(selectDContacts.length){
                                                                                                            //updation
                                                                                                            var data     = {ditherUserId:selectDContacts[0].id};
                                                                                                            var criteria = {ditherUserPhoneNumber: factor.number};
                                                                                                            AddressBook.update(criteria,data).exec(function(err, updatedRecords) {
                                                                                                                    if(err){
                                                                                                                            console.log("phone")
                                                                                                                            console.log(err)
                                                                                                                    }else{
                                                                                                                            console.log("update recordsssss in contacts")
                                                                                                                            //console.log(updatedRecords)
                                                                                                                            //callback();
                                                                                                                            //console.log("----------------SERIES 3 Success ----------------------");
                                                                                                                    }
                                                                                                            });
                                                                                                            //invitation table Insertion
                                                                                                    }
                                                                                            }
                                                                                    });
                                                                                }
                                                                            }, callback());
                                                                            //callback();


                                                                            console.log("-------------------------- SERIES-7 --------------------------");
                                                                            query = "SELECT DISTINCT adb.id, usr.id, usr.name, usr.profilePic, usr.phoneNumber"+
                                                                                    " FROM addressBook adb"+
                                                                                    " INNER JOIN user usr ON usr.id = adb.ditherUserId"+
                                                                                    " WHERE adb.userId = "+userId+
                                                                                    " AND adb.ditherUserId IS NOT NULL";
                                                                            console.log(query);
                                                                            AddressBook.query(query, function(err, selectedDitherAdb) {
                                                                                    if(err){
                                                                                            console.log("selecetion errorr"+err);
                                                                                            //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage Detail creation', error_details: err});
                                                                                            callback();
                                                                                            //callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Selecting dither users from Address Book', error_details: err});
                                                                                    }else{
                                                                                            //console.log(selectedDitherAdb);
                                                                                            ditherUserInAddressBook = selectedDitherAdb;
                                                                                            //async.forEach(ditherUserInAddressBook, function (factor, callback){
                                                                                            ditherUserInAddressBook.forEach(function(factor, index){
                                                                                                if(factor.profilePic==''){
                                                                                                        factor.profilePic='';
                                                                                                }else{
                                                                                                        factor.profilePic = server_baseUrl + "images/ProfilePics/"+factor.profilePic;
                                                                                                        //console.log(factor.profilePic)
                                                                                                        //console.log("----------------SERIES 7 Success ----------------------");
                                                                                                }
                                                                                            });
                                                                                            callback();
                                                                                    }
                                                                            });
                                                                        }
                                                                });
                                                            }
                                                    });
                                            }else{
                                                callback();
                                            }
                            },
                            function(callback) {
                                            console.log("----------------SERIES MAIN - II ----------------------");
                                            if(fbUser.length){
                                                    fbUser.forEach(function(factor, index){
                                                            var contact_name = factor.fb_name;
                                                            //var contact_name = zzzzz ajay"s / \ \ /ajay's ''
                                                            var formatted_name = contact_name.replace(/'/g, "\\'");
                                                            // fbUserArray.push({userId:userId,ditherUserName:factor.fb_name,fbId:factor.fb_userid});
                                                            //fbUserArray.push("("+userId+",'"+factor.fb_name+"', "+factor.fb_userid+", now(), now())");
                                                            fbUserArray.push("("+userId+",'"+formatted_name+"', '"+factor.fb_userid+"', now(), now())");
                                                    });

                                                    console.log("-------------------------- SERIES-4 --------------------------");
                                                    FbFriends.destroy({userId: userId}).exec(function (err, deleteFBFriends) {
                                                    //FbFriends.query(query, function(err, deleteFBFriends) {
                                                            if(err){
                                                                console.log("fb friends deletion"+err);
                                                                //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage Detail creation', error_details: err});
                                                                callback();
                                                                //callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in contact address creation', error_details: err});
                                                            }else{
                                                                console.log("----------------SERIES 4 Success ----------------------");
                                                                //callback();
                                                                console.log("-------------------------- SERIES-5 --------------------------");
                                                                var query = "INSERT INTO fbFriends"+
                                                                            " (userId,ditherUserName, fbId, createdAt, updatedAt)"+
                                                                            " VALUES"+fbUserArray;
                                                                FbFriends.query(query,function(err, createdFbFriends){
                                                                //FbFriends.create(fbUserArray).exec(function(err, createdFbFriends){
                                                                //FbFriends.create(query, function(err, createdFbFriends) {
                                                                        if(err){
                                                                            console.log("insertion fbfriends error"+err);
                                                                            //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage Detail creation', error_details: err});
                                                                            callback();
                                                                            //callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in fbFriend creation', error_details: err});
                                                                        }else{
                                                                                //console.log(createdFbFriends);
                                                                                console.log("----------------SERIES 5 Success ----------------------");
                                                                                //callback();
                                                                                console.log("-------------------------- SERIES-6 --------------------------");
                                                                                async.forEach(fbUser, function (factor, callback){
                                                                                //fbUser.forEach(function(factor, index){
                                                                                    User.find({fbId:factor.fb_userid}).exec(function (err, selectFBContacts){
                                                                                        //console.log()
                                                                                        if(err){
                                                                                            console.log("insertion fbfriends error"+err);
                                                                                            //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage Detail creation', error_details: err});
                                                                                            callback();
                                                                                            //callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in fbFriend creation', error_details: err});
                                                                                        }else{
                                                                                                if(selectFBContacts.length){
                                                                                                    var data     = {ditherUserId:selectFBContacts[0].id};
                                                                                                    var criteria = {fbId:factor.fb_userid};
                                                                                                    //console.log("fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb")
                                                                                                    //console.log(data)
                                                                                                    FbFriends.update(criteria,data).exec(function(err, updatedRecords) {
                                                                                                        if(err){
                                                                                                            console.log(err);
                                                                                                            callback();
                                                                                                        }else{
                                                                                                            //console.log("update recordsssss in fbbbbb");
                                                                                                            //console.log("----------------SERIES 6 Success ----------------------");
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                        }
                                                                                    });
                                                                                },callback());
                                                                                //callback();


                                                                                console.log("-------------------------- SERIES -><- 8 --------------------------");
                                                                                query = " SELECT DISTINCT fbf.id, usr.id, usr.name, usr.fbId,usr.profilePic, usr.phoneNumber"+
                                                                                            " FROM fbFriends fbf"+
                                                                                            " INNER JOIN user usr ON usr.id = fbf.ditherUserId"+
                                                                                            " WHERE fbf.userId = "+userId+
                                                                                            " AND fbf.ditherUserId IS NOT NULL";
                                                                                console.log(query);
                                                                                FbFriends.query(query, function(err, selectedDitherFbf) {
                                                                                        if(err){
                                                                                                console.log("fb friends selection"+err);
                                                                                                //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage Detail creation', error_details: err});
                                                                                                callback();
                                                                                                //callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Selecting dither users from Fb Friends', error_details: err});
                                                                                        }else{
                                                                                                //console.log("selectedDitherFbf >>>>>>>>>>>>///////////");
                                                                                                //console.log(selectedDitherFbf);
                                                                                                ditherUserInFbFriends = selectedDitherFbf;
                                                                                                //async.forEach(ditherUserInFbFriends, function (factor, callback){
                                                                                                ditherUserInFbFriends.forEach(function(factor, index){
                                                                                                        if(factor.profilePic==''){
                                                                                                            factor.profilePic='';
                                                                                                        }else{
                                                                                                           // console.log("----------------SERIES 8 Success ----------------------");
                                                                                                            factor.profilePic = server_baseUrl + "images/ProfilePics/"+factor.profilePic;
                                                                                                            //console.log(factor.profilePic)
                                                                                                        }
                                                                                                });
                                                                                                callback();
                                                                                                //console.log("selectedDitherFbf ++++++++++++++++++++++++++++++++++++++++++++++++");

                                                                                        }
                                                                                });
                                                                        }
                                                                });
                                                            }
                                                    });
                                            }else{
                                                callback();
                                            }
                            },
                        ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
                                        if (err) {
                                            console.log(err);
                                            return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in address book creation or in fbFriend creation or getting fbfriends or grtting contacts', error_details: err}); //If an error occured, we let express/connect handle it by calling the "next" function
                                        }else{
                                            //console.log("Success -----------------------in contacts------------------");
                                            //console.log(ditherUserInAddressBook)
                                            //console.log("Success -------------in fbbbbb----------------------------");
                                            //console.log(ditherUserInFbFriends)
                                            return res.json(200, {status: 1, status_type: 'Success' , message: 'Successfully added phone contact list to addressBook and fbcontacts to fbFriends',
                                                                  ditherPhoneContact: ditherUserInAddressBook,
                                                                  ditherFBuser: ditherUserInFbFriends
                                                                  });
                                        }
                        });



        },


};

