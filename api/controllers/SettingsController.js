/**
 * SettingsController
 *
 * @description :: Server-side logic for managing settings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    settingsKeyValue: function (req, res, next) {
                console.log("Settings Controller ===>>> settingsKeyValue")
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

                                        req.options.settingsKeyValue = keyValue;
                                        next();
                                }
                        }

                });
    }

};

