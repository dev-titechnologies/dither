/**
 * TestController
 *
 * @description :: Server-side logic for managing tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

     /* ==================================================================================================================================
               To Upload Images
     ==================================================================================================================================== */
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
        socketTest:  function (req, res) {
                sails.sockets.blast('createInSignUp', {msg: 'Hi!'});
        },


};

