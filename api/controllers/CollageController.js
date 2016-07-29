/**
 * CollageController
 *
 * @description :: Server-side logic for managing collages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /* ==================================================================================================================================
               To Upload Images
     ==================================================================================================================================== */
        upload: function (req, res) {

                /*req.file(fileList[0]).upload({dirname: '../../assets/images/test', maxBytes: 10000000},function (err, results) {
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
               To create Dither (collage)
     ==================================================================================================================================== */

        createDither:  function (req, res) {
                    //console.log(req.file('collageImages1'));
                    //console.log(req.file('collageImages1')._files);
                    //console.log(req.file('collageImages1')._files[0].stream.filename);
                    /*console.log(req.file('collageImages1')._files).length;
                    console.log(req.file('collage_image')._files[0]);
                    console.log(req.file('collage_image')._files.length);*/
                    console.log(req.body);
                    console.log(req.body.REQUEST);
                    console.log("create collage");
                    //console.log(req.body.tagged_user);
                    //console.log(req.params("tagged_user"));
                    var tokenCheck                  =     req.options.tokenCheck;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var imageUploadDirectoryPath   =     '../../assets/images/collage'
                    console.log(tokenCheck);
                    console.log(userId);
                    var concatUploadImgArray ;


                    var uploadedImgResult_1,
                        uploadedImgResult_2,
                        uploadedImgResult_3,
                        uploadedImgResult_4;



                    function commonCollageUpload(fileName,collageUploadResults, callback){
                            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                            console.log(fileName);
                            console.log(req.file(fileName)._files.length);
                            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                            if(req.file(fileName)._files.length != 0){
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
                                               console.log(fileName);
                                                /*if(fileName === "collageImages1"){
                                                    uploadedImgResult_1 =   collageUploadResults;
                                                    console.log(uploadedImgResult_1);
                                                    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
                                                }
                                                if(fileName === "collageImages2"){
                                                    uploadedImgResult_2 =   collageUploadResults;
                                                    console.log(uploadedImgResult_2);
                                                    console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb")
                                                }
                                                if(fileName === "collageImages3"){
                                                    uploadedImgResult_3 =   collageUploadResults;
                                                    console.log(uploadedImgResult_3);
                                                    console.log("ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc")
                                                }
                                                if(fileName === "collageImages4"){
                                                    uploadedImgResult_4 =   collageUploadResults;
                                                    console.log(uploadedImgResult_4);
                                                    console.log("ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd")
                                                }*/
                                               callback();
                                            }
                                });
                            }
                            else{
                                            callback();
                            }
                    }
            //if(req.file('collage_image') !== 'undefined'){

                //if(req.file('collageImages1') !== 'undefined'){
                    async.series([

                                function(callback) {

                                        async.parallel([
                                                        function(callback) {
                                                                //console.log(req.file("collageImages1")._files.length);
                                                                //console.log(req.file("collageImages1"));
                                                                /*if(req.file("collageImages1")._files.length != 0){
                                                                    var fileName = "collageImages1";
                                                                    var collageUploadResults = "uploadedCollageFiles_1";
                                                                    commonCollageUpload(fileName, collageUploadResults, callback);
                                                                    console.log("{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{");
                                                                    console.log(collageUploadResults);
                                                                    console.log("{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{");
                                                                }else{
                                                                    callback();

                                                                }*/



                                                                req.file("collageImages1").upload({dirname: '../../assets/images/collage', maxBytes: 10000000},function (err, collageUploadResults_1) {
                                                                                if (err)
                                                                                {
                                                                                    console.log(err);
                                                                                    callback();
                                                                                }
                                                                                else
                                                                                {
                                                                                   uploadedImgResult_1 = collageUploadResults_1;
                                                                                   //console.log(collageUploadResults_1);
                                                                                   callback();
                                                                                }
                                                                });
                                                        },
                                                        function(callback) {
                                                            //console.log(req.file("collageImages2")._files.length);
                                                            //console.log(req.file("collageImages2"));
                                                                /*if(req.file("collageImages2")._files.length != 0){
                                                                    var fileName = "collageImages2";
                                                                    var collageUploadResults = "uploadedCollageFiles_2";
                                                                    commonCollageUpload(fileName, collageUploadResults, callback);
                                                                    console.log("]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]");
                                                                    console.log(commonCollageUpload(fileName, collageUploadResults, callback));
                                                                     console.log("]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]");
                                                                }else{
                                                                    callback();
                                                                }*/

                                                                req.file("collageImages2").upload({dirname: '../../assets/images/collage', maxBytes: 10000000},function (err, collageUploadResults_2) {
                                                                                if (err)
                                                                                {
                                                                                    console.log(err);
                                                                                    callback();
                                                                                }
                                                                                else
                                                                                {
                                                                                   uploadedImgResult_2 = collageUploadResults_2;
                                                                                   //console.log(collageUploadResults_2);
                                                                                   callback();
                                                                                }
                                                                });

                                                        },
                                                        function(callback) {
                                                                /*if(req.file("collageImages3")._files.length != 0){
                                                                    var fileName = "collageImages3";
                                                                    var collageUploadResults = "uploadedCollageFiles_3";
                                                                    commonCollageUpload(fileName, collageUploadResults, callback);
                                                                }else{
                                                                   callback();
                                                                }*/
                                                                req.file("collageImages3").upload({dirname: '../../assets/images/collage', maxBytes: 10000000},function (err, collageUploadResults_3) {
                                                                                if (err)
                                                                                {
                                                                                    console.log(err);
                                                                                    callback();
                                                                                }
                                                                                else
                                                                                {
                                                                                   uploadedImgResult_3 = collageUploadResults_3;
                                                                                   //console.log(collageUploadResults_3);
                                                                                   callback();
                                                                                }
                                                                });
                                                        },
                                                        function(callback) {
                                                                /*if(req.file("collageImages4")._files.length != 0){
                                                                    var fileName = "collageImages4";
                                                                    var collageUploadResults = "uploadedCollageFiles_4";
                                                                    commonCollageUpload(fileName, collageUploadResults, callback);
                                                                }else{
                                                                    callback();
                                                                }*/
                                                                req.file("collageImages4").upload({dirname: '../../assets/images/collage', maxBytes: 10000000},function (err, collageUploadResults_4) {
                                                                                if (err)
                                                                                {
                                                                                    console.log(err);
                                                                                    callback();
                                                                                }
                                                                                else
                                                                                {
                                                                                   uploadedImgResult_4 = collageUploadResults_4;
                                                                                   //console.log(collageUploadResults_4);
                                                                                   callback();
                                                                                }
                                                                });
                                                        }
                                                   ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
                                                                    if (err) {
                                                                        console.log(err);
                                                                        callback();
                                                                    }else{
                                                                        console.log("111111111111111111111111111111111111111111111111111111");
                                                                        console.log(uploadedImgResult_1);
                                                                        console.log("22222222222222222222222222222222222222222222222222222222");
                                                                        console.log(uploadedImgResult_2);
                                                                        console.log("3333333333333333333333333333333333333333333333333333");
                                                                        console.log(uploadedImgResult_3);
                                                                        console.log("4444444444444444444444444444444444444444444444444444");
                                                                        console.log(uploadedImgResult_4);

                                                                        concatUploadImgArray = uploadedImgResult_1.concat(uploadedImgResult_2, uploadedImgResult_3, uploadedImgResult_4);
                                                                        console.log(concatUploadImgArray);

                                                                        callback();
                                                                    }

                                        });
                                },
                                function(callback) {
                                            req.file('collage_image').upload({dirname: imageUploadDirectoryPath, maxBytes: 10000000},function (err, files) {
                                                    if (err)
                                                    {
                                                        console.log(err);
                                                        return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in uploading collage image', error_details: err});
                                                    }
                                                    else
                                                    {
                                                        if(files.length != 0){
                                                                collage_imageName = files[0].fd.split('/');
                                                                collage_imageName = collage_imageName[collage_imageName.length-1];
                                                                console.log("collage_imageName =--------------------");
                                                                console.log(files);
                                                                console.log(collage_imageName);


                                                                var values = {
                                                                    imgTitle        : req.param('img_caption'),
                                                                    image           : collage_imageName,
                                                                    location        : req.param('location'),
                                                                    latitude        : req.param('latitude'),
                                                                    longitude       : req.param('longitude'),
                                                                    userId          : userId,
                                                                };
                                                            Collage.create(values).exec(function(err, results){
                                                                    if(err){
                                                                            console.log(err);
                                                                            //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in user creation', error_details: err});
                                                                            callback();
                                                                    }
                                                                    else{

                                                                                console.log("results ----------------------------------------------------");
                                                                                console.log(concatUploadImgArray);
                                                                                //console.log(results);
                                                                                var collageDetailImgArray = [];
                                                                                /*files.forEach(function(factor, index){
                                                                                     console.log(factor);
                                                                                     filename = factor.fd.split('/');
                                                                                     filename = filename[filename.length-1];
                                                                                     var position = "left";
                                                                                     console.log(index);
                                                                                     if(index != 0){
                                                                                            collageDetailImgArray.push("('"+filename+"','"+position+"',"+results.id+", now(), now())");
                                                                                     }
                                                                                });*/
                                                                                concatUploadImgArray.forEach(function(factor, index){
                                                                                     console.log("factor");
                                                                                     console.log(factor);
                                                                                     filename = factor.fd.split('/');
                                                                                     filename = filename[filename.length-1];
                                                                                     console.log(filename);

                                                                                     var switchKey = factor.field;
                                                                                     var position;
                                                                                     switch(switchKey){
                                                                                            case "collageImages1":    position = "image_one";
                                                                                            break;
                                                                                            case "collageImages2":    position = "image_two";
                                                                                            break;
                                                                                            case "collageImages3":    position = "image_three";
                                                                                            break;
                                                                                            case "collageImages4":    position = "image_four";
                                                                                            break;
                                                                                     }

                                                                                     collageDetailImgArray.push("('"+filename+"','"+position+"',"+results.id+", now(), now())");
                                                                                });
                                                                                console.log("uploadedCollageFiles_1 -------------------");
                                                                                //console.log(uploadedCollageFiles_1);
                                                                                var query = "INSERT INTO collageDetails"+
                                                                                            " (image, position, collageId, createdAt, updatedAt)"+
                                                                                            " VALUES"+collageDetailImgArray;
                                                                                            //" VALUES ('filename','position',"+results.id+", now(), now())";

                                                                                console.log("collage Details ------------------------------------ ===================================");
                                                                                console.log(query);
                                                                                CollageDetails.query(query, function(err, createdCollageDetails) {
                                                                                        if(err)
                                                                                        {
                                                                                            console.log(err);
                                                                                            //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage Detail creation', error_details: err});
                                                                                            callback();
                                                                                        }
                                                                                        else
                                                                                        {
                                                                                            var taggedUserArray = [{user_id: 3},{user_id: 6}];
                                                                                            console.log(taggedUserArray);
                                                                                            var tagCollageArray = [];
                                                                                            taggedUserArray.forEach(function(factor, index){
                                                                                                 console.log(factor);
                                                                                                 console.log(index);
                                                                                                 tagCollageArray.push("("+results.id+","+factor.user_id+", now(), now())");
                                                                                            });
                                                                                           var query = "INSERT INTO tags"+
                                                                                                        " (collageId, userId, createdAt, updatedAt)"+
                                                                                                        " VALUES"+tagCollageArray;

                                                                                            console.log("collage Details ------------------------------------ ===================================");
                                                                                            console.log(query);
                                                                                            Tags.query(query, function(err, createdCollageTags) {
                                                                                                    if(err)
                                                                                                    {
                                                                                                        //console.log(err);
                                                                                                        //return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in collage Detail creation', error_details: err});
                                                                                                        callback();
                                                                                                    }
                                                                                                    else
                                                                                                    {
                                                                                                        console.log(createdCollageTags);
                                                                                                        /*SmsService.sendSms(function(err, sendSmsResults) {
                                                                                                                if(err)
                                                                                                                {
                                                                                                                        console.log(err);
                                                                                                                        //return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in Sms Send on signup', error_details: sendSmsResults});
                                                                                                                        //callback();
                                                                                                                        callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Sms Send to invite', error_details: err});
                                                                                                                }else{
                                                                                                                    consol.log("-----------------");
                                                                                                                        return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully completed the signup'});
                                                                                                                        //callback();
                                                                                                                        //callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Sms Send to invite', error_details: err});
                                                                                                                }
                                                                                                        });*/
                                                                                                        callback();
                                                                                                    }
                                                                                            });





                                                                                            //return res.json(200, {status: 1, status_type: 'Success', message: 'Successfully created Collage'});
                                                                                        }
                                                                                });
                                                                    }
                                                            });

                                                        }
                                                        else{

                                                            //callback();
                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage Image found to add', error_details: err});
                                                        }
                                                }
                                            });
                                },


                    ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
                                            if (err) {
                                                console.log(err);
                                                return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in creating Dither', error_details: err}); //If an error occured, we let express/connect handle it by calling the "next" function
                                            }else{
                                                return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully created dither'});
                                            }

                });
              //}
             // else{
              //      return res.json(200, {status: 2, status_type: 'Failure' , message: 'Atleast 1 image needed'});
              //}
            //}
            //else{
            //        return res.json(200, {status: 2, status_type: 'Failure' , message: 'Collage image is missing'});
            //}

        },

 /* ==================================================================================================================================
               To get Dither (collage)
     ==================================================================================================================================== */
        getDither:  function (req, res) {

                    console.log("get--- Dither");
                    var tokenCheck                  =     req.options.tokenCheck;
                    var server_baseUrl              =     req.options.server_baseUrl;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var userName                    =     tokenCheck.tokenDetails.name;
                    var userProfilePic              =     server_baseUrl + req.options.file_path.profilePic_path + tokenCheck.tokenDetails.profilePic;
                    var query;
                    console.log("Get Feed  -------------------- ================================================");
                    //return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully get the feed'});
                        query = " SELECT clg.id FROM collage clg WHERE clg.userId = "+userId;
                                //" UNION"+
                                //" SELECT tg.collageId FROM tags tg WHERE tg.userId = "+userId;
                        console.log(query);
                        Collage.query(query, function(err, results) {
                                if(err)
                                {
                                    console.log(err);
                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in getting collages of logged user', error_details: err});
                                }
                                else
                                {
                                    console.log(results);
                                    console.log(results[0].id);
                                    console.log(results[1].id);
                                    console.log(results[2].id);
                                    console.log(results.length);
                                    var resultsPushArray = [];
                                    results.forEach(function(factor, index){
                                            console.log("factor");
                                            console.log(factor);
                                            resultsPushArray.push(factor.id);
                                    });
                                    console.log(resultsPushArray);
                                    query = " SELECT clgdt.collageId, clgdt.position, clgdt.vote, clg.userId, clg.image AS collage_image, clg.totalVote, clg.createdAt,"+
                                            " usr.profilePic, usr.name"+
                                            " FROM collage clg"+
                                            " INNER JOIN collageDetails clgdt ON clgdt.collageId = clg.id"+
                                            " INNER JOIN user usr ON usr.id = clg.userId"+
                                            " WHERE clg.id"+
                                            " IN ("+resultsPushArray+")"+
                                            " ORDER BY clg.createdAt";
                                    console.log(query);
                                    Collage.query(query, function(err, allCollageImgResults) {
                                            if(err)
                                            {
                                                console.log(err);
                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in grtting Images in collage of logged user', error_details: err});
                                            }
                                            else
                                            {
                                                console.log(allCollageImgResults);
                                                var dataResults = allCollageImgResults;
                                                var key = [];
                                                var dataResultsKeys = [];
                                                for (var i = dataResults.length - 1; i >= 0; i--) {
                                                    var dataResultsObj = new Object();
                                                    var collageId_val =dataResults[i]["collageId"];
                                                    //console.log(data[i]);
                                                    if ( dataResultsKeys.indexOf( collageId_val ) == -1 )
                                                    {
                                                        var imagesPositionArray =[];
                                                        var voteArray =[];
                                                        for (var j = dataResults.length - 1; j >= 0; j--)
                                                        {
                                                            if(dataResults[j]["collageId"]==collageId_val)
                                                            {
                                                                imagesPositionArray.push(dataResults[j]["position"]) ;
                                                                voteArray.push(dataResults[j]["vote"]) ;

                                                            }
                                                        }
                                                        //To combine images and vote into single Array (key - value pair)
                                                        var combineImgVoteArray = {};
                                                        for (var k = 0; k < imagesPositionArray.length; k++)
                                                        {
                                                             combineImgVoteArray[imagesPositionArray[k]] = voteArray[k];
                                                        }
                                                        //console.log("combine_array ========================================");
                                                        //console.log(combineImgVoteArray);
                                                        //console.log(imagesPositionArray);
                                                        dataResultsObj.date_time=dataResults[i]["createdAt"];
                                                        dataResultsObj.collage_id=collageId_val;
                                                        dataResultsObj.collage_image = server_baseUrl+"images/collage/"+dataResults[i]["collage_image"];
                                                        //dataResultsObj.image=imagesArray;
                                                        //dataResultsObj.vote=items2;
                                                        dataResultsObj.totalVote =dataResults[i]["totalVote"];
                                                        dataResultsObj.vote=combineImgVoteArray;

                                                        key.push(dataResultsObj);
                                                        dataResultsKeys.push(collageId_val);

                                                        var recent_dithers              =       key.reverse();
                                                        function predicatBy(prop){
                                                           return function(a,b){
                                                              if( a[prop] > b[prop]){
                                                                  return 1;
                                                              }else if( a[prop] < b[prop] ){
                                                                  return -1;
                                                              }
                                                              return 0;
                                                           }
                                                        }
                                                        var dithers_with_max_votes      =       key.reverse().sort( predicatBy("totalVote") );


                                                    }
                                                }
                                                //console.log(key);
                                                //console.log(key.reverse());
                                                console.log(JSON.stringify(key.reverse()));
                                                return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully get the Dithers', username: userName, user_profile_image: userProfilePic, recent_dithers: recent_dithers, dithers_with_max_votes: dithers_with_max_votes });
                                            }
                                    });


                                }
                        });
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
};

