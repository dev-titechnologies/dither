var crypto = require('crypto');
//var userConstants = sails.config.constants.user;
module.exports = {
    // Function to create new token
    createToken: function (userId, callback) {
        console.log("user token >>>>>>>>>>");
        //Get token expiry time from datatbase
        var param = 3600;

        var expHours = param / 60;

        //Get expiry date
        var expiry_date = new Date();
        expiry_date.setHours(expiry_date.getHours() + expHours);

        //Generate token
        var token = crypto.randomBytes(12).toString('hex');

        //console.log("Token Starts ====>");
        //console.log(token);
        //console.log("Token Ends ====>");
        var tokenValues = {userId: userId, token: token, expiryDate: expiry_date};


        User_token.create(tokenValues).exec(function (err, resultToken) {
            if (err) {
                //console.log(err);
                //console.log("Token Error");
                callback(true, err);

            } else {
                //console.log("resultToken  --> STARTS");
                console.log(resultToken);

                callback(false, {status: 1, message: 'success', token: resultToken});
            }

        });

    },
    // Function to delete a token
    deleteToken: function (token, callback) {
        User_token.destroy({token: token}).exec(function (err, result) {

            if (err) {

                callback(true, err);

            } else {
                console.log("deleted Successfully");
                callback(false, {message: 'success'});
            }

        });
    },


    // Function to check whether a token is expired or not
    checkToken: function (token, callback) {
        var today = new Date();
        console.log("Before query");
        var query = "SELECT * FROM userToken WHERE token = '"+token+"'";
        console.log(query);
        User_token.query(query, function (err, results) {
            if (err) {
                        console.log(err);
                        callback(true, err);
            } else {
                   if(results.length == 0){
                            //console.log("Length ==== 0");
                            callback(false, {status: 2, message: 'Token expired'});
                   }else{
                            callback(false, {status: 1, message: 'Valid token', tokenDetails: results[0]});
                   }
            }

        });
    }

};
