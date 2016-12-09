/**
 * DitherConfigController
 *
 * @description :: Server-side logic for managing ditherconfigs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    getConfigValue: function (req, res) {
                console.log("Dither config controller ========================")
                var query = "SELECT * FROM settings";
                Settings.query(query, function (err, results){
                        if(err){
                            console.log(err);
                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in select Settings values', error_details: err});
                        }else{
                                //console.log(results);
                                if(!results.length){
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
                                        var dither_expiry_hour          =     parseInt(keyValue.DITHER_EXPIRY_HOUR);
                                        var data_view_limit             =     req.options.global.data_view_limit;
                                        var app_invite_image            =     keyValue.APP_INVITE_IMAGE;

                                        return res.json(200, {status: 1, status_type: 'Success' ,message: 'Successfully get the config values',
                                                                dither_expiry_hour          :     dither_expiry_hour,
                                                                data_view_limit             :     data_view_limit,
                                                                app_invite_image            :     app_invite_image,
                                                            });

                                }
                        }

                });
    }

};

