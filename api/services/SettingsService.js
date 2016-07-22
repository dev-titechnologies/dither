
module.exports = {

            settingsKeyValue: function (param,callback) {

                 /* Settings.findOne(param).exec(function(err, result){

                    if (err) {

                        callback(true, err);
                    } else {
                        console.log("result >>>>>> service");
                        console.log(result);
                        var value = (result) ? result.value : undefined;
                        callback(false, value);
                    }

                });*/

                var query = "SELECT * FROM settings";
                Settings.query(query, function (err, results) {
                    if (err) {
                        callback(true, err);
                    }
                    else {
                        var count = 0;
                        var keyArray = [];
                        var valueArray = [];
                        results.forEach(function (factor, index) {

                            count++;
                            keyArray.push(factor.key);
                            valueArray.push(factor.value);
                        });

                        var keyValue = [],
                                i,
                                keys = keyArray,
                                values = valueArray;
                        //Merge 2 arrays
                        for (i = 0; i < keys.length; i++) {
                            keyValue[keys[i]] = values[i];
                        }
                        //console.log("Key Value");
                        console.log(keyValue);
                        //callback(false, keyValue);
                    }

                });
            }

};
