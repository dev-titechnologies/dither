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
var today                       =   new Date().toISOString();
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
        socketTests:  function (req, res) {
                console.log("INSIDE -------------  >>>>>>>>>>>>>>>>>> socketTest");
                console.log(req);
                console.log("param only ======");
                console.log(req.params.all());
                console.log(req.param("data"));
                //console.log(req.param("ajay"));
                console.log("body only ======");
                console.log(req.body);
                console.log(req.body.name);
                //console.log(req.body.ajay);
                console.log("INSIDE -------------  >>>>>>>>>>>>>>>>>> ENDsocketTest");
                sails.sockets.join(req.socket, "Room-A");
                var roomName  = "socket_dither_43";
                sails.sockets.join(req.socket, roomName);
                var creator_roomName  = "socket_user_2";
                sails.sockets.join(req.socket, creator_roomName);
                //console.log(req.socket);
                //sails.sockets.blast('comment-dither', {msg: 'Hi! Comment ------11111111'});

                //sails.sockets.blast('like-dither', {msg: 'Hi! Like ------2222222'});
                //sails.sockets.blast('createInSignUp', {msg: 'Hi!'});
                //sails.sockets.blast('message', {msg: 'Hi! Message ------11111111'});

        },

        /*subscribeToFunRoom: function(req, res) {
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


                        console.log("thumbNail Image")
                        var fs      = require('fs');
                        var path    = require('path');
                        var image   = require('imagemagick-stream');
                        /*var read  = fs.createReadStream('imageNw.jpeg');
                        var write   = fs.createWriteStream('image-resized.jpeg');
                        var resize  = im().resize('40x40').quality(90);
                        read.pipe(resize).pipe(write);  */
                        image('imageNw.jpeg').resize('40x40').quality(90).to('image-resized.jpeg');

                        var gm = require ('gm');
                        var savedphoto = "imageNw.jpeg";
                        var testdir = "image-resized.jpeg";
                        gm(savedphoto)
                            .resize(100, 100)
                            .noProfile()
                            .write(testdir, function (err) {
                                console.error (err);
                            });


                          /* var allUsers =   [];
                           var phonecontacts      = [{name:'Melita Nora',number:'8281442870'},{name:'Rena Acosta',number:'+17689456489'},{name:'Jacklyn Simon',number:'917654789872)'},{name:'Jacklyn Simon',number:'+154564'},{name:'Elizabeth Evangeline',number:'09875421365'}];
                           var phoneContactsArray = [];
                            phonecontacts.forEach(function(factor, index){
                                phoneContactsArray.push({userId:127,ditherUserName:factor.name, ditherUserPhoneNumber:factor.number});
                            });

                           User.query("SELECT * FROM user", function(err, selectDContacts){
                                        if(err)
                                        {
                                            console.log(err)
                                            //callback();
                                        }
                                        else
                                        {
                                            //console.log(selectDContacts[0])

                                            selectDContacts.forEach(function(factor, index){

                                                allUsers.push({id:factor.id,name:factor.name,fbId:factor.fbId,phoneNumber:factor.phoneNumber});

                                            });




                                            async.forEach(phonecontacts, function (factor, callback){

                                                console.log("inside")
                                                var num = factor.number;
                                                allUsers.forEach(function(factor, index){

                                                      var validNo1      = factor.phoneNumber.replace('-','');
                                                      var validNo2      = factor.phoneNumber.split('-').pop();
                                                      var validNo3      = '0'+validNo2;
                                                      var validNo4      = validNo1.replace('+','');
                                                      if(num==validNo1 || num==validNo2 ||  num==validNo3 ||  num==validNo4)
                                                      {


                                                          var data     = {ditherUserId:factor.id};
                                                          var criteria = {ditherUserPhoneNumber: num};

                                                          AddressBook.update(criteria,data).exec(function(err, updatedRecords) {

                                                                if(!err)
                                                                {
                                                                    console.log("success")
                                                                }
                                                            });

                                                     }


                                                 });



                                            });

                                            //console.log(allUsers)
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

        findArrayTest : function (req, res) {

                var s_Array = [{notifyContact : 0}, {notifyContact : 1}];
                /*//User.find({notifyContact: [0,1]}).exec(function (err, results) {   //Possible
                //User.find({notifyContact: 1}).exec(function (err, results) {       //Possible
                User.find(s_Array).exec(function (err, results) {
                       console.log();
                    if(err){
                            console.log(err);
                    }else{
                            console.log("SSSSSSSSSSSSSSSSSSSSSSSSS");
                            console.log(results);
                            console.log(results.length);
                    }
                });*/

                User.findOne({notifyContact: 1}).exec(function (err, results) {
                        console.log();
                        if(err){
                                console.log(err);
                        }else{
                                console.log("SSSSSSSSSSSSSSSSSSSSSSSSS");
                                console.log(results);
                                console.log(results.length);
                        }
                });
        },




         /* ==================================================================================================================================
               TEST PUSH NOTIFICATION
        ==================================================================================================================================== */

        testTag: function (req, res) {
                    var taggedUserArray = ['145','127'];

                    deviceId_arr    = [];
                    ntfn_body       = "test push";
                    device_type     = req.get('device_Type');
                    User_token.find({userId: taggedUserArray})
                        .exec(function (err, response) {

                            response.forEach(function(factor, index){

                                    deviceId_arr.push(factor.deviceId);


                            });
                            console.log(JSON.stringify(deviceId_arr))
                            if(deviceId_arr.length!=0)
                            {
                                    var data      = {device_id:deviceId_arr,NtfnBody:ntfn_body};


                                    var switchKey   =  device_type;
                                    switch(switchKey){
                                            case 'ios' :
                                                        NotificationService.pushNtfnApn(data, function(err, ntfnSend) {
                                                            if(err)
                                                            {
                                                                console.log("Error in Push Notification Sending")
                                                                console.log(err)
                                                                //callback();
                                                            }
                                                            else
                                                            {
                                                                console.log("Push notification result")
                                                                console.log(ntfnSend)
                                                                console.log("Push Notification sended")
                                                                //callback();
                                                                return res.json(200, {status: 1 ,status_type: 'success', message: 'sended'});
                                                            }
                                                        });
                                            break;

                                            case 'android' :
                                                        NotificationService.pushNtfnGcm(data, function(err, ntfnSend) {
                                                            if(err)
                                                            {
                                                                console.log("Error in Push Notification Sending")
                                                                console.log(err)
                                                                //callback();
                                                            }
                                                            else
                                                            {
                                                                console.log("Push notification result")
                                                                console.log(ntfnSend)
                                                                console.log("Push Notification sended")
                                                                //callback();
                                                                return res.json(200, {status: 1 ,status_type: 'success', message: 'sended'});
                                                            }
                                                        });
                                            break;

                                            default:
                                                        return res.json(200, {status: 2 ,status_type: 'Failure', message: 'No deviceType'});
                                            break;


                                    }



                            }
                            else
                            {
                                return res.json(200, {status: 2 ,status_type: 'Failure', message: 'No deviceId'});
                            }

                        });






        },

        /* ==================================================================================================================================
               SEC-SOCKET TEST
        ==================================================================================================================================== */


        testSocket: function (req, res) {
            console.log("=============testsocket starttttttttt-====================")
            console.log(sails.sockets.getId(req));


                        console.log("=============testsocket endddddddddd-====================")


        console.log("==================blast================")
        //sails.sockets.broadcast('artsAndEntertainment', { greeting: 'Hola!' });
        sails.sockets.blast('aaaaaaaaaaaa', {
                  msg: 'User just logged in.'
                });
                /*sails.sockets.blast( {
                  msg: 'User message.'
                });*/
        console.log(req.isSocket)
        console.log("==================end blast================")

              console.log("------------request")
              //console.log(req)
              var roomName = 'socket_user_90';
             console.log("ggggggggggggggggggggggggggggggggggggg")
             sails.sockets.join(req, roomName, function(err) {
                  console.log(roomName)
              });
              console.log(sails.sockets.rooms());
            console.log(sails.sockets.subscribers(roomName))
            sails.sockets.broadcast(roomName, { greeting: 'haiiiiiiiiiiiiiiiiiiiii am hereeeeeeeeeeeeeee!' });
        },
        imageResizes: function (req, res) {
                    var im = require('imagemagick');
                    im.readMetadata('assets/images/collage/abc.jpg', function(err, metadata){
                      if (err) throw err;
                      //console.log('Shot at '+metadata.exif.dateTimeOriginal);
                      console.log(metadata);
                    });
        },
        testInsertion: function (req, res) {

            console.log("testing insertion")

            var contact_name = ' \'*533*2#';

            var formatted_name = contact_name.replace(/"/g, '\\"');
            //var formatted_name1 = contact_name.replace(/'/g, '\\"');
            var formatted_name1 = contact_name.replace(/'/g, "\\'");
            console.log(formatted_name)
            console.log(formatted_name1)

        },


        /* ==================================================================================================================================
               SEC-SOCKET TEST
        ==================================================================================================================================== */
        contactAddressInsert: function (req, res) {

                        var phonecontacts     = [
                                                    {name   :   'Thomas Jacob1',    number  :   '9745875212'},
                                                    {name   :   'Thomas Jacob2',    number  :   '9745875213'},
                                                    {name   :   'Thomas Jacob3',    number  :   '9745875214'},
                                                    {name   :   'Thomas Jacob4',    number  :   '9745875215'},
                                                    {name   :   'Thomas Jacob5',    number  :   '9745875216'},
                                                    {name   :   'Thomas Jacob6',    number  :   '9745875217'}
                                                ];


                        console.log("phonecontacts ========= Before parse");
                        console.log(phonecontacts);

                        phonecontacts  =  phonecontacts.toString();
                        console.log("phonecontacts ========= To String");
                        console.log(phonecontacts);

                        console.log("phonecontacts ========= After parse");
                        console.log(JSON.parse(phonecontacts));
                        var phoneContactsArray  =  [];
                        var userId              =  1;
                        phonecontacts.forEach(function(factor, index){
                                var contact_name = factor.name;
                                //var contact_name = zzzzz ajay"s / \ \ /ajay's ''
                                var formatted_name = contact_name.replace(/'/g, "\\'");

                                phoneContactsArray.push("("+userId+",'"+formatted_name+"', '"+factor.number+"', now(), now())");
                        });

                        console.log(phoneContactsArray);

        },

         /* ==================================================================================================================================
               Image Magick
        ==================================================================================================================================== */
        imagemagick: function (req, res) {
                console.log("contactAddressInsert  ====== mage magick");
                //var im = require('imagemagick');
                var profilePic_path_assets      =     req.options.file_path.profilePic_path_assets;
                var imageSrc                    =     profilePic_path_assets +'imageTest.png';
                var ext                         =     imageSrc.split('/');
                ext                             =     ext[ext.length-1].split('.');
                var imageDst                    =     profilePic_path_assets + ext[0] + "_50x50" + "." +ext[1];

                console.log(imageSrc);
                fs.exists(imageSrc, function(exists) {
                        if (exists) {
                                console.log("Image exists");
                                ImgResizeService.imageResize(imageSrc, imageDst, function(err, imageResizeResults) {
                                    if(err)
                                    {
                                            console.log(err);
                                            return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in image resize', error_details: err});

                                    }else{
                                            console.log(imageResizeResults);
                                            return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully Resized the image'});

                                    }
                                });
                        }else{
                                console.log("Image not exists");
                                return res.json(200, {status: 1, status_type: 'Success' , message: 'passed Image not exists'});
                        }
                });
        },

         /* ==================================================================================================================================
               Download
        ==================================================================================================================================== */
        download: function (req, res) {
                    console.log("SAILS DOWNLOAD ##################################");
                    //var bson = require('../build/Release/bson');
                    var blobAdapter = require('skipper-gridfs')({
                    uri: ''
                    });
                    console.log("before fd");
                    var fd = req.param('fd'); // value of fd comes here from get request
                    console.log("after fd");
                    /*blobAdapter.read(fd, function(error , file) {
                        if(error) {

                            console.log("Error ^^^^^^^^^^^^^");
                            console.log(error);
                            res.json(error);
                        } else {
                            console.log("Success ^^^^^^^^^^^^^");

                            res.contentType('image/png');
                            res.send(new Buffer(file));
                        }
                    });*/
                    //req.download('https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpa1/v/t1.0-1/p200x200/11692484_1584512915143266_7884115120613929813_n.jpg?oh=42b7eff448f63708c7f5eedf11a9402e&oe=58154D7A&__gda__=1479562104_5855c5a67913f66449272bf8f4b59dcf');
                    //res.download('https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpa1/v/t1.0-1/p200x200/11692484_1584512915143266_7884115120613929813_n.jpg?oh=42b7eff448f63708c7f5eedf11a9402e&oe=58154D7A&__gda__=1479562104_5855c5a67913f66449272bf8f4b59dcf');
         },

        /* ==================================================================================================================================
               E-mail
        ==================================================================================================================================== */
        email: function (req, res) {

                var global_settingsKeyValue     =   req.options.settingsKeyValue;
                //var email_to                    =   "titto.xavier@titechnologies.org";
                var email_to                    =   req.param("email_to");
                if(!email_to){
                                return res.json(200, {status: 2, status_type: 'Failure' , message: 'please pass email_to'});
                }else{
                        var email_subject               =   'Welcome to Dither';
                        var email_template              =   'email-test';
                        var email_context               =   {
                                                                receiverName    :   "Titto xavier",
                                                                pic             :   global_settingsKeyValue.CDN_IMAGE_URL + "images/profilePics/31db73cf-8305-4351-b075-ffe287dd7dab.jpg",
                                                                email_img_url   :   global_settingsKeyValue.CDN_IMAGE_URL + 'images/email/'
                                                            };
                        EmailService.sendEmail(global_settingsKeyValue, email_to,email_subject,email_template,email_context, function(err, sendEmailResults) {
                            if(err)
                            {
                                    console.log(err);
                                    console.log("async parallel in Mailpart Error");
                                    return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in Email Send on signup', error_details: sendEmailResults});

                            }else{
                                    //console.log(results);
                                    console.log(email_to);
                                    console.log(email_subject);
                                    console.log(email_template);
                                    console.log(email_context);
                                    console.log("async parallel in Mailpart Success");
                                    return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully completed the Dither email Test'});
                            }


                        });
                }
        },

        email_2: function (req, res) {

                var global_settingsKeyValue     =   req.options.settingsKeyValue;
                //var email_to                    =   "titto.xavier@titechnologies.org";
                var email_to                    =   req.param("email_to");
                if(!email_to){
                                return res.json(200, {status: 2, status_type: 'Failure' , message: 'please pass email_to'});
                }else{
                        var email_subject               =   'Welcome to Dither';
                        var email_template              =   'signup';
                        var email_context               =   {receiverName: "Titto xavier", pic: global_settingsKeyValue.CDN_IMAGE_URL + "images/profilePics/31db73cf-8305-4351-b075-ffe287dd7dab.jpg"};
                        EmailService.sendEmail(global_settingsKeyValue, email_to,email_subject,email_template,email_context, function(err, sendEmailResults) {
                            if(err)
                            {
                                    console.log(err);
                                    console.log("async parallel in Mailpart Error");
                                    return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in Email Send on signup', error_details: sendEmailResults});

                            }else{
                                    //console.log(results);
                                    console.log(email_to);
                                    console.log(email_subject);
                                    console.log(email_template);
                                    console.log(email_context);
                                    console.log("async parallel in Mailpart Success");
                                    return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully completed the Dither email Test'});
                            }


                        });
                }
        },

 /* ==================================================================================================================================
               E-mail
        ==================================================================================================================================== */
        select_dither : function (req, res) {
                        console.log("------------------------- SELECT DITHER -----------------");
                        console.log(req.params.all());
                        if(!req.param("id")){
                                    return res.json(200, {status: 2, status_type: 'FAILURE' , message: 'Please pass an id',

                                                });
                        }else{
                                var query = "SELECT * FROM collage where id = "+req.param("id");
                                Collage.query(query, function(err, results) {
                                        if(err){
                                            console.log(err);
                                            console.log("Error in select_dither");
                                            //callback();
                                        }else{
                                            console.log("Select dither success ++++++++++++");
                                            console.log(results);
                                            return res.json(200, {status: 1, status_type: 'SUCCESS' , message: 'Successfully got',
                                                          results: results,

                                            });

                                        }
                                });
                        }
        },

/* ==================================================================================================================================
              Write
  ==================================================================================================================================== */
    write_file : function (req, res) {
        console.log("testinggggg cron")
            /*fs.writeFile("test.txt", "Hey there!", function(err) {
                if(err){
                    return console.log(err);
                }
                console.log("The file was saved!");
            });*/
    },

/*  =================================================================================================================================
            checking userToken Expiry
    ================================================================================================================================== */
    checkExpiryToken: function (req, res) {
            console.log("user token >>>>>>>>>>");
            console.log(req.params.all());
            console.log(req.param("hours"));
            //Get token expiry time from datatbase
            //var param = 3600;
            //var expHours = param / 60;
            var expHours = req.param("hours");
            console.log("Before Expiry Date-------------------------");
            //Get expiry date
            var expiry_date = new Date();
            expiry_date.setHours(expiry_date.getHours() + expHours);
            console.log("Before Generate Token");
            //console.log("param -------------"+param);
            //console.log("expHours -------------"+param / 60);
            //console.log("setHours(24) -------------"+expiry_date.setHours(expiry_date.getHours() + expHours));
            //console.log("expiry_date -------------"+expiry_date);
            console.log("current date -------------"+new Date());
           // console.log("add Hours -------------"+expiry_date.setHours(expiry_date.getHours()+2));
            //console.log("add Hours "+new Date(expiry_date.setHours(expiry_date.getHours()+2)) );
            console.log("last date -------------"+new Date(new Date().getTime() + (expHours*1000*60*60)));

            //Generate token
            /*var token = crypto.randomBytes(12).toString('hex');
            var tokenValues = {userId: userId, token: token, deviceId: deviceId,device_IMEI:device_IMEI,device_Type:device_Type,expiryDate: expiry_date};
            console.log("tokenValues------------------------------------------" );
            console.log(tokenValues);
            User_token.create(tokenValues).exec(function (err, resultToken){
                if(err){
                        console.log("Error Create Token Response");
                        console.log(err);
                        callback(true, {status: 2, status_type: "Failure", message: 'Some error occured in create token service', error_details: err});
                }else{
                        console.log("Success Create Token Response");
                        callback(false, {status: 1, status_type: "Success", message: 'CreateToken service success', token: resultToken});
                }
            });*/
    },
    /*  =================================================================================================================================
            SELECT user for date check
    ================================================================================================================================== */
    usersList: function (req, res){
            console.log(req.param("user_id"));
            var user_id     =   req.param("user_id");
            if(!user_id){
                    return res.json(200, {status        : 2,
                                        status_type     : 'FAILURE' ,
                                        message         : 'please pass user_id',
                                });
            }else{
                var query       =   "SELECT * FROM user where id = "+user_id;
                User.query(query, function(err, results){
                //User.find({id: 2}).exec(function (err, results) {
                //User.find({}, function(err, results){
                    if(err){
                        console.log(err);
                        return res.json(200, {status        : 2,
                                            status_type     : 'FAILURE' ,
                                            message         : 'Some error occured',
                                            err_details     : err,
                        });
                    }else{
                        console.log("results query =============");
                        console.log(results);
                        User.find({id: user_id}).exec(function (err, results1) {
                            if(err){
                                console.log(err);
                                return res.json(200, {status        : 2,
                                                    status_type     : 'FAILURE' ,
                                                    message         : 'Some error occured',
                                                    err_details     : err,
                                });
                            }else{
                                console.log("results find ++++++++++++++++++++++++");
                                console.log(results1);
                                return res.json(200, {status        : 1,
                                                status_type         : 'SUCCESS' ,
                                                message             : 'Successfully got',
                                                results             : results,
                                });
                            }
                        });
                    }
                });
            }
    },
    getExpireDither: function (req, res){
        console.log("cronnnn")
    },

    array_test: function (req, res){

                /*function remove_duplicate_array(arg1, arg2){
                    //var arr = [1, 2, 3, 4, 5, 6, 7];
                    //var ar = [2, 4, 6, 8, 10];
                    //var newID = [];

                    for(var i = 0; i < arg1.length; i++){
                        for(var j = 0; j < arg2.length; j++){
                            if(arg1[i] == arg2[j]){
                                //newID.push(arr[i]);
                                arg1.splice(i, 1);
                                arg2.splice(j, 1);
                                break;
                            }
                        }
                    }
                    return arg1.concat(arg2);
                }*/
                function find_duplicate_in_array(arg1,arg2) {
                      var arg_push = [];
                      console.log(arg1);
                      console.log(arg2);
                    for(var i = 0; i < arg1.length; i++){
                        for(var j = 0; j < arg2.length; j++){
                            console.log("arg1[i] ------");
                            console.log(arg1[i]);
                            //console.log("arg2[i] ------");
                            //console.log(arg2[i]);
                            console.log("============================================== ------");
                            if(arg1[i] == arg2[j]){
                                    arg_push.push(arg1[i]);
                            }
                        }
                    }
                    console.log(arg_push);
                    //return arg_push;
                }
                var arr = [1, 2, 3, 4, 5, 6, 7];
                var ar = [2, 4, 6, 8, 10];

                //var array3 = ar.filter(function(obj) { return arr.indexOf(obj) == -1; });
                //console.log("ccccccccccccccccccccccc")
                //console.log(array3)


                //var combine_tagged_report_array         =   arr.concat(ar);
                //var duplicate_tagged_report_array       =   find_duplicate_in_array(combine_tagged_report_array);

                console.log(arr);
                console.log(ar);
                //var tt = remove_duplicate_array(arr, ar);
                //console.log("tt -------------------");
                //console.log(tt);

                console.log("duplicate_tagged_report_array  ====");
                //console.log(combine_tagged_report_array);
                var tt1 = find_duplicate_in_array(arr, ar);
                console.log(tt1);
            /*var arr = [1, 2, 3, 4, 5, 6, 7];
            var ar = [2, 4, 6, 8, 10];

            var x = [1, 2, 3, 4, 5, 6, 7];
            var y = [2, 4, 6, 8, 10];
            var newID = [];
            console.log(arr);
            console.log(ar);

            for(var i = 0; i < arr.length; i++){
                for(var j = 0; j < ar.length; j++){
                    if(arr[i] == ar[j]){
                        newID.push(arr[i]);
                        arr.splice(i, 1);
                        ar.splice(j, 1);
                        break;
                    }
                }
            }
            console.log(arr);
            console.log(ar);
            console.log(arr.concat(ar));*/
              /*var obj = {};
              for (var i = x.length-1; i >= 0; -- i)
                 obj[x[i]] = x[i];
              for (var i = y.length-1; i >= 0; -- i)
                 obj[y[i]] = y[i];
              var res = []
              for (var k in obj) {
                if (obj.hasOwnProperty(k))  // <-- optional
                  res.push(obj[k]);
              }
              console.log(res);*/
    },
    collage: function (req, res){
                console.log("collage");
                var expiryDate      =       new Date(new Date().setFullYear(2020));
                var values = {
                    imgTitle        : 'default title',
                    image           : 'default.png',
                    location        : '',
                    //latitude        : '',
                    //longitude       : '',
                    userId          : 2222,
                    expiryDate      : expiryDate,
                };
                console.log(values);
                Collage.create(values).exec(function(err, createCollage){
                    if(err){
                            console.log(err);
                            //callback();
                            //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage creation', error_details: err});
                    }else{
                        console.log(createCollage);
                        if(!createCollage){
                                //callback();
                        }else{
                            var values = {
                                image       : 'default.png',
                                position    : 1,
                                collageId   : createCollage.id,
                            }
                            console.log(values);
                            CollageDetails.create(values).exec(function(err, createdCollageDetails) {
                                if(err){
                                    console.log(err);
                                    //callback();
                                    //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage Detail creation', error_details: err});
                                }else{
                                        console.log(createdCollageDetails);
                                        //callback();
                                }
                            });
                        }
                    }
                });
    },
    testCommentImg: function (req, res){
        var key = [];
        var dataResultsKeys = [];
        var comment_arr = [];
        var comment_img_arr = [];
        console.log("testing comment Image upload")
        var query = " SELECT clgcmt.id, clgcmt.comment,cmntImg.image, usr.name,usr.mentionId, clgcmt.createdAt,usr.profilePic, usr.id userId"+
                    " FROM collageComments clgcmt"+
                    " LEFT JOIN commentImages as cmntImg ON cmntImg.commentId = clgcmt.id"+
                    " INNER JOIN user usr ON usr.id = clgcmt.userId"+
                    " WHERE clgcmt.collageId = 98"+
                    " AND cmntImg.image IS NOT NULL"+
                    " ORDER BY clgcmt.createdAt";
        CollageComments.query(query, function(err, rows) {
            if(err){
                console.log(err);
                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting the Collage Comments'});
            }else{

                var dataResults = rows;

                //var popular_dithers,
                //imgDetailsArrayOrder;
                for (var i = dataResults.length - 1; i >= 0; i--){
                    var dataResultsObj = new Object();
                    var commentId_val = dataResults[i]["id"];
                    if (dataResultsKeys.indexOf( commentId_val ) == -1){
                        //var imgDetailsArray = [];

                        for (var j = dataResults.length - 1; j >= 0; j--){
                            if(dataResults[j]["id"]==commentId_val){
                                console.log("1111111111111111111111111111111111111111");
                                console.log(dataResults[i]["id"]);
                                console.log(dataResults[j]["id"]);
                                var comment_arr = [];
                                //var image = commentImage_path + dataResults[j]["image"];
                                //comment_img_arr.push(image);
                                //console.log("inside all looooppp SRATRS ++++++");
                                console.log("888888888888888888888888888888888888");
                                console.log(dataResults[i]["image"]);
                                if(dataResults[i]["image"] == null || dataResults[i]["image"] == ""){
                                }else{
                                //console.log(dataResults[j]["image"]);
                                comment_img_arr.push(dataResults[j]["image"]);
                                }
                                //console.log(comment_img_arr);
                                //console.log("inside all comment_img_arr ENDS ++++++");
                            }
                        }
                        console.log("2222222222222222222222222222222222222");
                        dataResultsObj.comment_id = dataResults[i]["id"];
                        dataResultsObj.image = comment_img_arr;
                        comment_arr.push(dataResultsObj);
                        comment_img_arr = [];
                    }
                    console.log("comment_arr ))))))))))))))))))))")
                    console.log(comment_arr);
                    //comment_img_arr.push(comment_arr)

                    //console.log(comment_img_arr);
                /*function hash(o){
                return o.id;
                }

                var hashesFound = {};

                comment_arr.forEach(function(o){
                hashesFound[hash(o)] = o;
                });

                var results1 = Object.keys(hashesFound).map(function(k){
                return hashesFound[k];
                });
                console.log("results1 ===========");
                console.log(results1);*/
                }
            }

        });
    },
    sendSmsOTP: function (req, res){

            var plivo   = require('plivo');
            var p       = plivo.RestAPI({
                                            authId      : 'MAN2FINWE2NGRHMDIWNM',
                                            authToken   : 'NjM1NzkyOTE3ODdjMDI0YzI3N2Q3MWI2YWFhMjAy'
                                        });
            var num_arr =   ['+91-8281442870','+919947632638']
            var dest    =   '123';
            for(i=0;i<num_arr.length;i++)
            {
                if(dest=='')
                {
                    dest = num_arr[i];
                }
                else
                {
                    dest = dest+'<'+num_arr[i];
                }
            }
            console.log(dest)
            var params  = {
                'src': '+44 1629 304021', // Sender's phone number with country code
                'dst' : '+447441910872', // Receiver's phone Number with country code
                'text' : "Hi, text from Plivo", // Your SMS Text Message - English
                'url' : "http://example.com/report/", // The URL to which with the status of the message is sent
                'method' : "GET" // The method used to call the url
            };

            // Prints the complete response
            p.send_message(params, function (status, response) {
                console.log('Status: ', status);
                console.log('API Response:\n', response);
                console.log('Message UUID:\n', response['message_uuid']);
                console.log('Api ID:\n', response['api_id']);
                return res.json(200, {status: 1, status_type: 'Success' , message: 'OTP send Successfully'});
            });
    },
    /*  =================================================================================================================================
            Proportionate height and width
    ================================================================================================================================== */
    imageHeightWidth: function (req, res){
                var imageHeight         =  parseFloat(req.param("height"));
                var imageWidth          =  parseFloat(req.param("width"));

                var height         =   180/180;
                var width          =   parseFloat(imageWidth/180);
                height             =   parseFloat(width * 180);

                //ratio                   = imageWidth / imageHeight;

                return res.json(200, {status: 1, status_type: 'Success' , message: 'proportionate image size',
                                        result : {width : width, height : height}
                                        });



    },
    /*  =================================================================================================================================
             Proportionate height and width
    ================================================================================================================================== */
    insertTest: function (req, res){

                [1,2,3,4].forEach(function(factor, index){
                        var expiryDate      =       new Date(new Date().setFullYear(2020));
                        var imgTitle,
                            collageImage;
                        switch(index){
                            case 0 :
                                    imgTitle         = "Share your opinion";
                                    collageImage     = "default_collage_4.jpg";
                                    today            = new Date(new Date().setSeconds(11)).toISOString();
                            break;
                            case 1 :
                                    imgTitle         = "Share your opinion";
                                    collageImage     = "default_collage_3.jpg";
                                    today            = new Date(new Date().setSeconds(12)).toISOString();
                            break;
                            case 2 :
                                    imgTitle         = "Share your opinion";
                                    collageImage     = "default_collage_2.jpg";
                                    today            = new Date(new Date().setSeconds(13)).toISOString();
                            break;
                            case 3 :
                                    imgTitle         = "Share your opinion";
                                    collageImage     = "default_collage_1.jpg";
                                    today            = new Date(new Date().setSeconds(14)).toISOString();
                            break;
                        }
                        var values = {
                            imgTitle        : imgTitle,
                            image           : collageImage,
                            location        : '39,Albemarle Gate,Cheltenham,Cheltenham',
                            //latitude        : '',
                            //longitude       : '',
                            userId          : 1,
                            expiryDate      : expiryDate,
                            createdAt       : today
                        };

                        Collage.create(values).exec(function(err, createCollage){
                            if(err){
                                    console.log(err);
                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage creation', error_details: err});
                            }else{
                                /*if(!createCollage){
                                        return res.json(200, {status: 2, status_type: 'Failure' , message: 'Empty result',

                                                            });
                                }else{
                                    //return res.json(200, {status: 1, status_type: 'Success' , message: 'proportionate image size',
                                                            //result : createCollage
                                                           // });
                                }*/
                            }
                        });
                });



    },
};


