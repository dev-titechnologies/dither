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
                var tokenCheck                  =     req.options.tokenCheck;
                var userId                      =     tokenCheck.tokenDetails.userId;
                var userPhoneNumber             =     tokenCheck.tokenDetails.phoneNumber;
                var userFbId                    =     tokenCheck.tokenDetails.fbId;
                var phoneContactsArray          =     [];
                var fbUserArray                 =     [];
                var query,
                    ditherUserInAddressBook,
                    ditherUserInFbFriends;
                var phonecontacts               =     req.param('contact_array');

                var fbUser                      =     req.param('fb_array');
                var data_check1                 =     "";

                console.log("contact_array ---------------------->>>>>>>>>>>>>>>>>>>");
                console.log(req.param('contact_array'));

                console.log("fb_array ---------------------->>>>>>>>>>>>>>>>>>>");
                console.log(req.param('fb_array'));

                async.series([
                            function(callback) {
                                            console.log("----------------PARALLEL addressBook - I ----------------------");
                                            if(phonecontacts.length){
                                                    phonecontacts.forEach(function(factor, index){
                                                        if(index){
                                                            var contact_name = factor.name;
                                                            var formatted_name = contact_name.replace(/'/g, "\\'");
                                                            phoneContactsArray.push("("+userId+",'"+formatted_name+"', '"+factor.number+"', now(), now())");

                                                        }
                                                    });
                                                    console.log("----------------PARALLEL 1 ----------------------")
                                                    AddressBook.destroy({userId: userId}).exec(function (err, deleteAddressBook) {
                                                            if(err){
                                                                console.log("delete address"+err);
                                                                callback();
                                                            }else{
                                                                console.log("----------------PARALLEL 1 Succes----------------------")
                                                                //console.log(phoneContactsArray)
                                                                    console.log("------------------- PARALLEL 2 ----------------------------------");
                                                                    var query = "INSERT INTO addressBook"+
                                                                                " (userId,ditherUserName, ditherUserPhoneNumber, createdAt, updatedAt)"+
                                                                                " VALUES"+phoneContactsArray;
                                                                    //console.log(query)
                                                                    AddressBook.query(query,function(err, createdAddressBook){
                                                                            if(err){
                                                                                console.log(err);
                                                                                callback();
                                                                            }else{
                                                                                data_check1 = createdAddressBook;
                                                                                console.log("----------------PARALLEL 2 Success ----------------------");
                                                                                console.log("-------------------------------- PARALLEL-3 -----------------------------")
                                                                                console.log("Address book updation")
                                                                                async.forEach(phonecontacts, function (factor, callback){
                                                                                var count = 0;
                                                                                //phonecontacts.forEach(function(factor, index){
                                                                                    count++;
                                                                                    if(factor.number){
                                                                                        var query = "SELECT *"+
                                                                                                    " FROM user"+
                                                                                                    " WHERE phoneNumber =  '"+factor.number+"'"+
                                                                                                    " AND phoneNumber !=  '"+userPhoneNumber+"'";
                                                                                         //console.log(query)
                                                                                        User.query(query, function(err, selectDContacts) {
                                                                                                if(err){
                                                                                                        console.log(err)
                                                                                                        //callback();
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
                                                                                                                                console.log("----------------SERIES 3 Success ----------------------");
                                                                                                                                //if(count === phonecontacts.length){
                                                                                                                                    //callback();
                                                                                                                                //}
                                                                                                                        }
                                                                                                                });

                                                                                                        //}else{
                                                                                                                //if(count === phonecontacts.length){
                                                                                                                   // callback();
                                                                                                                //}
                                                                                                        }
                                                                                                }
                                                                                        });
                                                                                    }
                                                                                }, callback());
                                                                                //});
                                                                            }
                                                                    });
                                                            }
                                                    });
                                            }else{
                                                callback();
                                            }

                            },
                            function(callback) {
                                            console.log("----------------PARALLEL fbContacts - II ----------------------");
                                            if(fbUser.length){
                                                    fbUser.forEach(function(factor, index){
                                                                    var contact_name = factor.fb_name;
                                                                    var formatted_name = contact_name.replace(/'/g, "\\'");
                                                                    fbUserArray.push("("+userId+",'"+formatted_name+"', '"+factor.fb_userid+"', now(), now())");
                                                            //}
                                                    });

                                                    console.log("-------------------------- PARALLEL-4 --------------------------");
                                                    FbFriends.destroy({userId: userId}).exec(function (err, deleteFBFriends) {
                                                            if(err){
                                                                console.log("fb friends deletion"+err);
                                                                callback();
                                                            }else{
                                                                console.log("----------------PARALLEL 4 Success ----------------------");

                                                                    console.log("-------------------------- PARALLEL-5 --------------------------");
                                                                    var query = "INSERT INTO fbFriends"+
                                                                                " (userId,ditherUserName, fbId, createdAt, updatedAt)"+
                                                                                " VALUES"+fbUserArray;
                                                                    FbFriends.query(query,function(err, createdFbFriends){

                                                                            if(err){
                                                                                console.log("insertion fbfriends error"+err);
                                                                                callback();
                                                                            }else{
                                                                                    console.log("----------------PARALLEL 5 Success ----------------------");
                                                                                    console.log("-------------------------- PARALLEL-6 --------------------------");
                                                                                    async.forEach(fbUser, function (factor, callback){
                                                                                    var count = 0;
                                                                                    //fbUser.forEach(function(factor, index){
                                                                                        count++;
                                                                                        var query = "SELECT *"+
                                                                                                    " FROM user"+
                                                                                                    " WHERE fbId =  '"+factor.fb_userid+"'"+
                                                                                                    " AND fbId !=  '"+userFbId+"'";
                                                                                         //console.log(query)
                                                                                        User.query(query, function(err, selectFBContacts) {
                                                                                        //User.find({fbId:factor.fb_userid}).exec(function (err, selectFBContacts){
                                                                                            if(err){
                                                                                                console.log("insertion fbfriends error"+err);
                                                                                                //callback();
                                                                                            }else{
                                                                                                    if(selectFBContacts.length){
                                                                                                        var data     = {ditherUserId:selectFBContacts[0].id};
                                                                                                        var criteria = {fbId:factor.fb_userid};
                                                                                                        FbFriends.update(criteria,data).exec(function(err, updatedRecords) {
                                                                                                            if(err){
                                                                                                                console.log(err);
                                                                                                                //callback();
                                                                                                            }else{
                                                                                                                console.log("update recordsssss in fbbbbb");
                                                                                                                //console.log("----------------SERIES 6 Success ----------------------");
                                                                                                                //if(count === selectFBContacts.length){
                                                                                                                        //callback();
                                                                                                                //}
                                                                                                            }
                                                                                                        });
                                                                                                    //}else{
                                                                                                           // if(count === selectFBContacts.length){
                                                                                                                //       callback();
                                                                                                            //}
                                                                                                    }
                                                                                            }
                                                                                        });
                                                                                    },callback());
                                                                                    //});
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

                                            setTimeout(function () {
                                                    console.log("Entered to TIME OUT *********************************************");
                                                    return res.json(200, {status: 1, status_type: 'Success' , message: 'Successfully added phone contact list to addressBook and fbcontacts to fbFriends',
                                                                          //ditherPhoneContact: ditherUserInAddressBook,
                                                                          //ditherFBuser: ditherUserInFbFriends
                                                                          });
                                            }, 5000);
                                        }
                        });



        },

/* ==================================================================================================================================
               To Select Contacts
     ==================================================================================================================================== */
        selectUserContacts: function (req, res) {

                    console.log("==========================  selectUserContacts  Api =-=============");

                    var tokenCheck                  =     req.options.tokenCheck;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var server_baseUrl              =     req.options.server_baseUrl;
                    var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                    var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                    var query,
                    ditherUserInAddressBook,
                    ditherUserInFbFriends;
                    async.parallel([
                            function(callback) {
                                        //console.log("-------------------------- SERIES-7 --------------------------");
                                        query = "SELECT adb.id, usr.id, usr.name, usr.profilePic, usr.phoneNumber"+
                                                " FROM addressBook adb"+
                                                " INNER JOIN user usr ON usr.id = adb.ditherUserId"+
                                                " WHERE adb.userId = "+userId+
                                                " AND adb.ditherUserId IS NOT NULL"+
                                                " GROUP BY usr.id"+
                                                " ORDER BY usr.name";
                                        console.log(query);
                                        AddressBook.query(query, function(err, selectedDitherAdb) {
                                                if(err){
                                                        console.log("selecetion errorr"+err);
                                                        callback();
                                                }else{
                                                        //console.log(selectedDitherAdb);
                                                        ditherUserInAddressBook = selectedDitherAdb;
                                                        async.forEach(ditherUserInAddressBook, function (factor, callback){
                                                            if(factor.profilePic==''){
                                                                    factor.profilePic='';
                                                            }else{
                                                                    factor.profilePic = profilePic_path + factor.profilePic;
                                                            }
                                                        }, callback());

                                                }
                                        });
                            },
                            function(callback) {

                                        console.log("-------------------------- SERIES -><- 8 --------------------------");
                                        query = " SELECT fbf.id, usr.id, usr.name, usr.fbId,usr.profilePic, usr.phoneNumber"+
                                                    " FROM fbFriends fbf"+
                                                    " INNER JOIN user usr ON usr.id = fbf.ditherUserId"+
                                                    " WHERE fbf.userId = "+userId+
                                                    " AND fbf.ditherUserId IS NOT NULL"+
                                                    " GROUP BY usr.id"+
                                                    " ORDER BY usr.name";
                                        console.log(query);
                                        FbFriends.query(query, function(err, selectedDitherFbf) {
                                                if(err){
                                                        console.log("fb friends selection"+err);
                                                        callback();
                                                }else{
                                                        ditherUserInFbFriends = selectedDitherFbf;
                                                        async.forEach(ditherUserInFbFriends, function (factor, callback){
                                                                if(factor.profilePic==''){
                                                                    factor.profilePic='';
                                                                }else{
                                                                    factor.profilePic = profilePic_path + factor.profilePic;
                                                                }
                                                        }, callback());


                                                }
                                        });
                            },
                    ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
                                        if(err){
                                            console.log(err);
                                            return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in address book creation or in fbFriend creation or getting fbfriends or grtting contacts', error_details: err}); //If an error occured, we let express/connect handle it by calling the "next" function
                                        }else{
                                            console.log("=====================ditherUserInAddressBook===============");
                                            console.log(ditherUserInAddressBook);
                                            console.log("=====================ditherUserInFbFriends===============");
                                            console.log(ditherUserInFbFriends);
                                            return res.json(200, {status: 1, status_type: 'Success' , message: 'Successfully selected phone contact list from addressBook and fbcontacts from fbFriends',
                                                                  ditherPhoneContact: ditherUserInAddressBook,
                                                                  ditherFBuser: ditherUserInFbFriends
                                                                  });
                                        }
                    });
        },


       /* ==================================================================================================================================
               To Select Contacts
       ==================================================================================================================================== */
        getFbFriends: function (req, res) {

            console.log("==========================  Fetching FbFriends Api =-=============");
            var tokenCheck                  =     req.options.tokenCheck;
            var userId                      =     tokenCheck.tokenDetails.userId;
            var fbId                        =     tokenCheck.tokenDetails.fbId;
            var frnd_arr                    =     [];

            var query = "SELECT T.userId,U.name,U.fbId from TempFbFriends T LEFT JOIN user U ON T.userId = U.id where T.fbId = '"+fbId+"'";
            TempFbFriends.query(query, function(err,getNewFbfrnds){

           // TempFbFriends.find({fbId:fbId}).exec(function (err, getNewFbfrnds){
                if(err){
                    console.log(err)
                    return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in fetching FB Friends'});
                }
                else{
                    console.log(getNewFbfrnds)

                    if(!getNewFbfrnds.length){
                        return res.json(200, {status: 2, status_type: 'Failure' , message: 'No Friends Found!'});
                    }
                    else{
                            console.log(getNewFbfrnds)
                            getNewFbfrnds.forEach(function(factor, index){
                                frnd_arr.push({
                                                                id   : factor.userId,
                                                                name   : factor.name,
                                                                fbId   : factor.fbId
                                                });

                            });
                            console.log(frnd_arr)

                            var query   = "DELETE FROM TempFbFriends where fbId = '"+fbId+"'";
                            TempFbFriends.query(query, function(err,deleteNewFrnds){

                                if(err){
                                    console.log(err)
                                    return res.json(200, {status: 2, status_type: 'Failure' , message: 'error!'});

                                }else{

                                    console.log(deleteNewFrnds)
                                    return res.json(200, {status: 1, status_type: 'Success' , message: 'successfully completed',frndList:frnd_arr});
                                }

                            });

                    }

                }
            });
        }

};

