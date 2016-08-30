/**
 * TestController
 *
 * @description :: Server-side logic for managing tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs          = require('fs');
//var fs                          =     require('file-system');
// solution:
//function to remove a value from the json array
function removeItem(obj, prop, val) {
    var c, found=false;
    for(c in obj) {
        if(obj[c][prop] == val) {
            found=true;
            break;
        }
    }
    if(found){
        delete obj[c];
    }
}
module.exports = {

     /* ==================================================================================================================================
               To Upload Images
     ==================================================================================================================================== */

        unlink     :   function (req, res) {
                console.log("Entered UnLink....................");
                var imgName = "08a81ea5-389e-48ce-8798-29cc7209e51e.jpg";
                fs.unlink("assets/images/collage_test/"+imgName);
                return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully unlinked'});
        },
        collage_image: function (req, res) {
                var imageUploadDirectoryPath =  '../../assets/images/collage_test';
                //var imageUploadDirectoryPath =  'http://assets/images/collage';
                req.file('collage_image').upload({dirname: imageUploadDirectoryPath,maxBytes: 100 * 1000 * 1000},function (err, files) {
                if (err)
                return res.serverError(err);



                return res.json({
                message: files.length + ' file(s) uploaded successfully!',
                files: files
                });
                });
        },
        test: function (req, res) {
                console.log("22222222222222");
                console.log(req.param('array'));


        },
        upload: function (req, res) {

                /*req.file('image').upload({dirname: '../../assets/images/test', maxBytes: 10000000},function (err, results) {
                            if (err)
                            {
                                console.log(err);
                                callback();
                            }
                            else
                            {

                               console.log(results);
                               //callback();
                            }
                });*/
                /*var fs = require('file-system');
                fs.unlink("assets/images/test/4aff474e-1577-4780-b46e-d031afccdf68.jpg");*/
                /*adapter:require('skipper-s3'),
                key: 'thekyehthethaeiaghadkthtekey'
                secret: 'AB2g1939eaGAdesoccertournament'
                bucket: 'my_stuff'
                req.file('avatar')*/


                            req.file('image').upload({
                                          adapter: require('skipper-s3'),
                                          key: 'thekyehthethaeiaghadkthtekey',
                                          secret: 'AB2g1939eaGAdesoccertournament',
                                          bucket: 'my_stuff'
                                        }, function whenDone(err, uploadedFiles) {
                                          if (err) {
                                              //return res.negotiate(err);
                                              console.log(err);
                                              }
                                          else return res.ok({
                                            files: uploadedFiles,
                                            textParams: req.params.all()
                                          });
                                        });
        },


        uploadimage: function (req, res) {
                console.log("upload ---------- Image");
                var tokenCheck                  =     req.options.tokenCheck;
                var userId                      =     tokenCheck.tokenDetails.userId;
                var fullName                    =     tokenCheck.tokenDetails.name;
                var fbId                        =     tokenCheck.tokenDetails.fbId;
                var imageUploadDirectoryPath    =     '../../assets/images/collage';

                console.log(tokenCheck);
                //console.log(req.file('collageImages1'));
               // console.log(req.file('collageImages2'));
                //console.log(req.file('collageImages3'));

                //console.log(req.file('collageImages')._files);
                console.log("collage Images 0th =====================================.");
               // console.log(req.file('collageImages')._files[0]);
                console.log(req.file('collageImages1')._files[0].stream.filename);
                //console.log(req.file('collageImages2')._files[0].stream.filename);
                //console.log(req.file('collageImages3')._files[0].stream.filename);

                function commonCollageUpload(fileName,collageUploadResults, callback){
                        if(req.file(fileName)){
                            req.file(fileName).upload({dirname: '../../assets/images/collage', maxBytes: 10000000},function (err, collageUploadResults) {
                                        if (err)
                                        {
                                            console.log(err);
                                            callback();
                                        }
                                        else
                                        {
                                           console.log(fileName+"collageImages   ------->>> Uploaded");
                                           console.log(collageUploadResults);
                                           callback();
                                        }
                            });
                        }
                        else{
                                        callback();
                        }
                }
                async.parallel([
                                function(callback) {
                                        var fileName = "collageImages1";
                                        var collageUploadResults = "uploadedCollageFiles_1";
                                        commonCollageUpload(fileName, collageUploadResults, callback);
                                },
                                function(callback) {
                                        var fileName = "collageImages2";
                                        var collageUploadResults = "uploadedCollageFiles_2";
                                        commonCollageUpload(fileName, collageUploadResults, callback);
                                },
                                function(callback) {
                                        var fileName = "collageImages3";
                                        var collageUploadResults = "uploadedCollageFiles_3";
                                        commonCollageUpload(fileName, collageUploadResults, callback);
                                },
                                function(callback) {
                                        var fileName = "collageImages4";
                                        var collageUploadResults = "uploadedCollageFiles_4";
                                        commonCollageUpload(fileName, collageUploadResults, callback);
                                }
                           ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
                                            if (err) {
                                                console.log(err);
                                                return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in uploading collage', error_details: err}); //If an error occured, we let express/connect handle it by calling the "next" function
                                            }else{
                                                return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully uploaded collage'});
                                            }

                });
               /* req.file('collageImages1').upload({dirname: '../../assets/images/collage/collageImages1', maxBytes: 10000000},function (err, files1) {
                        if (err)
                        {
                            console.log(err);
                            return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in uploading collage image', error_details: err});
                        }
                        else
                        {
                           console.log("After upload -------------------");
                           console.log(files1);
                           return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully completed the collage Upload'});
                        }
                });
                req.file('collageImages2').upload({dirname: '../../assets/images/collage/collageImages2', maxBytes: 10000000},function (err, files2) {
                        if (err)
                        {
                            console.log(err);
                            return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in uploading collage image', error_details: err});
                        }
                        else
                        {
                           console.log("After upload -------------------");
                           console.log(files2);
                           return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully completed the collage Upload'});
                        }
                });*/
               /* req.file('collageImages3').upload({dirname: '../../assets/images/collage/collageImages3', maxBytes: 10000000},function (err, files3) {
                        if (err)
                        {
                            console.log(err);
                            return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in uploading collage image', error_details: err});
                        }
                        else
                        {
                           console.log("After upload -------------------");
                           console.log(files);
                           return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully completed the collage Upload'});
                        }
                });*/

                /*req.file('collageImages').upload({
                        // don't allow the total upload size to exceed ~10MB
                        maxBytes: 10000000
                    },function whenDone(err, uploadedFiles) {
                        if (err) {
                          //return res.negotiate(err);
                          console.log(err);
                        }else{
                            console.log(uploadedFiles);
                        }
                    });*/


        },
/* ==================================================================================================================================
               SMS TEST
     ==================================================================================================================================== */
        smsda:  function (req, res) {
                var smsAccountSid     = req.options.settingsKeyValue.SMS_ACCOUNT_SID;
                var smsAuthToken      = req.options.settingsKeyValue.SMS_AUTH_TOKEN;
                var smsFrom           = req.options.settingsKeyValue.SMS_FROM;
                console.log(req.options.settingsKeyValue);

                SmsService.sendSms(smsAccountSid, smsAuthToken, smsFrom, function(err, sendSmsResults) {
                        if(err)
                        {
                                console.log(err);
                                return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in Sms Send on signup', error_details: sendSmsResults});
                                //callback();
                        }else{
                                return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully completed the signup'});
                                //callback();
                        }
                    });
        },


    /* ==================================================================================================================================
               SOCKET
     ==================================================================================================================================== */
        /*socketTest:  function (req, res) {
                //sails.sockets.join(req.socket, "1");
                //console.log(req.socket);
                sails.sockets.blast('createInSignUp', {msg: 'Hi!'});
                sails.sockets.blast('message', {msg: 'Hi! Message ------11111111'});

        },

        subscribeToFunRoom: function(req, res) {
              //r roomName = req.param('roomName');
              //console.log(req);
              var roomName = "pppp";
              var socketId = sails.sockets.getId(req);
              if (!req.isSocket) {
                    console.log("req.isSocket ++++++--------------)))))))))))'''''''''''''''");
              }
              console.log(sails.sockets);
              console.log("socketId ==============================================");
              console.log(socketId);

              console.log("sails.sockets.rooms ==============================================");
              console.log(sails.sockets.rooms());

            console.log("sails.sockets.socketRooms ==============================================");
              console.log(sails.sockets.socketRooms(req.socket));
            console.log("sails.sockets.socketRooms ==============================================");
             console.log(sails.sockets.socketRooms());
              //sails.sockets.join(req.socket, roomName);
              //sails.sockets.broadcast(roomName, { msg: 'Hi there!' });
              //res.json({
               //         messages: 'Subscribed to a fun room called '+roomName+'!'
              //});
              //sails.sockets.emit(friendId, 'privateMessage', {from: req.session.userId, msg: 'Hi!'});
              //sails.sockets.broadcast(1, { msg: 'Hi there!' });
        },*/

        invite: function (req, res) {
                console.log("Request-1 >>>>>>>>>>>>>>>>>>>> in Test");
                console.log(req.param("request1"));


                console.log("Request-2 >>>>>>>>>>>>>>>>>>>> in Test");
                console.log(req.param("request2"));


                console.log("Request Json parse>>>>>>>>>>>>>>>>>>>> in Test");
                console.log(JSON.parse(req.param("request1")));

                console.log("Request Json parse>>>>>>>>>>>>>>>>>>>> in Test");
                console.log(JSON.parse(req.param("request2")));

                console.log("Request Length>>>>>>>>>>>>>>>>>>>> in Test");
                console.log(JSON.parse(req.param("request1").length));
                console.log(JSON.parse(req.param("request2").length));
        },

            selectUser: function (req, res) {

            var commonSettings = req.options.settingsKeyValue;
            //console.log(commonSettings.EMAIL_HOST);
            //console.log(req.options.settingsKeyValue[0]);
            //console.log(req.options.settingsKeyValue.EMAIL_HOST);

            er.query(query, function(err, results){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log('Select USer');
                        var d = new Date();
                        var n = d.getTime();
                        console.log(new Date().getTime());
                         console.log(parseInt(new Date().getTime()));
                        //console.log(result);
                        return res.json(200, {status: 1, message: 'Success'});
                    }

            });

    },


       /* ==================================================================================================================================
               TEST FILE ULLOAD
     ==================================================================================================================================== */

       addUserContacts: function (req, res) {
        var jsonfile = require('jsonfile');
        console.log(req.file('file'))
        req.file('file').upload({dirname: '',maxBytes: 100 * 1000 * 1000},function (err, profileUploadResults)
                                    {
                                            console.log(profileUploadResults)
                                            imageName = profileUploadResults[0].fd.split('/');
                                            imageName = imageName[imageName.length-1];

                                            jsonFilePath = '.tmp/uploads/'+imageName;
                                            console.log(jsonFilePath)
                                            jsonfile.readFile(jsonFilePath, function(err, obj)
                                            {
                                                    if(err)
                                                    {
                                                        console.log(err);
                                                        return res.json(200, {status: 2,status_type: 'Failure', message: 'File Not Found'});
                                                    }
                                                    else
                                                    {
                                                        console.log("success --------");

                                                        console.log(obj);
                                                        phoneContactsArray = obj;
                                                    }
                                             });

                                    });


     },

      /* ==================================================================================================================================
               TEST GENERATE THUMBNAIL IMAGE
        ==================================================================================================================================== */

     testThumbnail: function (req, res) {

                            console.log("thumbnail image")
                     
                           /* require('lwip').open('img2.jpeg', function(err, image) {
							if(err)
							  {
								  console.log("Error")
								  return res.json(200, {status: 2,status_type: 'Failure', message: 'Image Not Found'});
							  }
							  else
							  {
								// lanczos
								image.resize(50, 50, function(err, rzdImg) {
									rzdImg.writeFile('testThumb/output.jpg', function(err) {
										if(err)
										  {
											  console.log("Error")
											  return res.json(200, {status: 2,status_type: 'Failure', message: 'Image Not Found'});
										  }
										  else
										  {
											  return res.json(200, {status: 1,status_type: 'Success', message: 'Image Resizing Success'});
										  }
										});
								});
							  }	
							});*/
                            
                           


        },


        /* ==================================================================================================================================
               To Upload Images
        ==================================================================================================================================== */
        file_upload: function (req, res) {
                console.log("file_upload  ----- test controller");
                var fileUploadDirectoryPath =  '../../assets/images/file_test';
                //var imageUploadDirectoryPath =  'http://assets/images/collage';
                //console.log(req.file('file_1'));
                console.log(req.file('contact_array'));
                req.file('contact_array').upload({dirname: fileUploadDirectoryPath,maxBytes: 100 * 1000 * 1000},function (err, files) {
                        if (err){
                            console.log(err);
                            //return res.serverError(err);
                            return res.json(200, {status: 1, message: 'Failure', error_details: err});
                        }else{
                            console.log(files);
                            /*return res.json({
                            message: files.length + ' file(s) uploaded successfully!',
                            files: files
                            });*/
                            return res.json(200, {status: 1, message: 'Success'});
                        }
                });
        },

        file_read: function (req, res) {
                console.log("file_upload  ----- test controller");
                var jsonfile = require('jsonfile')
                var file = 'test.json'
                //var file = '/tmp/data.json'
                console.log(file);

                jsonfile.readFile(file, function(err, obj) {
                    if(err){
                        console.log(err);
                        return res.json(200, {status: 2, message: 'Failure', error_details: err});

                    }else{
                        console.log("success --------");
                        console.dir(obj);
                        console.log(obj);
                        obj.forEach(function(factor, index){
                                //console.log(factor.name);
                        });
                        return res.json(200, {status: 1, message: 'Success'});
                        }
                })

                //var fileUploadDirectoryPath =  '../../assets/images/file_test';
                //var imageUploadDirectoryPath =  'http://assets/images/collage';
                //console.log(req.file('file_1'));
                //console.log(req.file('contact_array'));
                /*req.file('file_1').upload({dirname: fileUploadDirectoryPath,maxBytes: 100 * 1000 * 1000},function (err, files) {
                        if (err){
                            return res.serverError(err);
                        }else{
                            console.log(files);

                        }
                });*/
        },

        delete_record : function (req, res) {
                        console.log("Bulk -delete ========= >>>>>>>>>>>>>>");
                        var deleteTagCollageArray = //[
                                                        {collageId: 1, userId: 3};
                                                        //{collageId: 3, userId: 3},
                                                        //{collageId: 4443, userId: 3},
                                                    //];
                        Tags.destroy(deleteTagCollageArray).exec(function(err, deleteCollageTags){
                                if(err)
                                {
                                    console.log(err);
                                    console.log("Error in Deleting Collage Tags");
                                    //callback();
                                }else{
                                    console.log("Bulk delete success ++++++++++++");
                                    console.log(deleteCollageTags);

                                }
                        });
        },

        delete_Socket : function (req, res) {
                console.log(req.options.available_sockets);
                var countries = {};

                countries.results = [
                    {id:'AF',name:'Afghanistan'},
                    {id:'AL',name:'Albania'},
                    {id:'DZ',name:'Algeria'}
                ];
                //example: call the 'remove' function to remove an item by id.
                removeItem(countries.results,'id','AF');

                //example2: call the 'remove' function to remove an item by name.
                removeItem(countries.results,'name','Albania');

                // print our result to console to check it works !
                console.log(countries.results);
                for(c in countries.results) {
                    console.log(countries.results[c].id);
                }
        },




         /* ==================================================================================================================================
               TEST PUSH NOTIFICATION
        ==================================================================================================================================== */



};

