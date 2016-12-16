module.exports = {


            emailSend: function(data,callback)
            {
                //============================DITHER EXPIRE SERVICE==================================================

                var query = "SELECT * FROM settings";
                Settings.query(query, function (err, results) {
                        if (err) {
                            callback(true, err);
                            callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in select Settings values'});
                        }
                        else {
                                //console.log(results);
                                if(results.length == 0){
                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No settings Found', error_details: err});
                                }else{
                                        var count = 0;
                                        var keyArray = [];
                                        var valueArray = [];
                                        results.forEach(function (factor, index) {
                                            count++;
                                            keyArray.push(factor.key);
                                            valueArray.push(factor.value);
                                        });

                                        var keyValue = {},
                                                i,
                                                keys = keyArray,
                                                values = valueArray;
                                        //Merge 2 arrays
                                        for (i = 0; i < keys.length; i++) {
                                            keyValue[keys[i]] = values[i];
                                        }
                                        //console.log("Key Value");
                                        //console.log(keyValue);

                                        //req.options.settingsKeyValue = keyValue;
                                        var global_settingsKeyValue = keyValue;
                                        if(global_settingsKeyValue)
                                        {
                                            console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee")
                                            console.log(keyValue)
                                            console.log(keyValue.CDN_IMAGE_URL)
                                            var collageImg_path = "images/collage/";
                                            var img_url         = keyValue.CDN_IMAGE_URL + collageImg_path;
                                            console.log(img_url)
                                            var collageImage    = img_url + data.ditherImage;
                                            var email_to        = data.email;
                                            var email_subject   = 'Dither Expired!';
                                            var email_template  = 'expired';
                                            var email_context   = {
                                                                    receiverName    :   data.name,
                                                                    ditherImage     :   collageImage,
                                                                    Vote            :   data.Vote,
                                                                    email_img_url   :   global_settingsKeyValue.CDN_IMAGE_URL + 'images/email/'
                                                                    };
                                            EmailService.sendEmail(global_settingsKeyValue, email_to,email_subject,email_template,email_context, function(err, sendEmailResults) {
                                                if(err){
                                                        console.log(err);
                                                        console.log("async parallel in Mailpart Error");
                                                        callback();

                                                }else{
                                                        console.log("sucess")
                                                        callback();
                                                }
                                            });
                                        }

                                }
                        }

                });


            },



};
