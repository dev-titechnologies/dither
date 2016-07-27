var crypto = require('crypto');
//var userConstants = sails.config.constants.user;
module.exports = {
/*  =================================================================================================================================
            Function to create new token
    ================================================================================================================================== */
    createToken: function (userId, deviceId, callback) {
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
        var tokenValues = {userId: userId, token: token, deviceId: deviceId, expiryDate: expiry_date};

        User_token.create(tokenValues).exec(function (err, resultToken) {
            if (err) {
                console.log(err);
                //console.log("Token Error");
                //callback(true, err);
                callback(true, {status: 2, status_type: "Failure", message: 'Some error occured in craete token service', error_details: err});

            } else {
                //console.log("resultToken  --> STARTS");
                console.log(resultToken);

                callback(false, {status: 1, status_type: "Success", message: 'CreateToken service success', token: resultToken});
            }

        });

    },

/*  =================================================================================================================================
            Function to delete a token
    ================================================================================================================================== */
    deleteToken: function (token, deviceId, callback) {
        User_token.destroy({token: token}).exec(function (err, results) {

            if (err) {
                //callback(true, err);
                callback(true, {status: 2, status_type: "Failure", message: 'Some error occured in delete token query', error_details: err});
            } else {
                console.log("deleted Successfully");
                callback(false, {status: 1, status_type: "Success", message: 'DeleteToken service success'});
            }

        });
    },


/*  =================================================================================================================================
        Function to check whether a token is expired or not
    ================================================================================================================================== */
    checkToken: function (token, deviceId, callback) {
        var today = new Date();
        console.log("Before query");
        //var query = "SELECT * FROM userToken WHERE token = '"+token+"'";
        var query = " SELECT usr.id, usr.name, usr.email, usr.fbId, usrtkn.userId, usrtkn.token, usrtkn.deviceId, usrtkn.expiryDate"+
                    " FROM"+
                    " userToken usrtkn"+
                    " INNER JOIN user usr ON usr.id = usrtkn.userId"+
                    " WHERE token = '"+token+"' AND deviceId = "+deviceId+" AND usrtkn.expiryDate > NOW()";
        console.log(query);
        User_token.query(query, function (err, results) {
            if (err) {
                        console.log(err);
                        callback(true, {status: 2, status_type: "Failure", message: 'Some error occured in check token query', error_details: err});
            } else {
                   if(results.length == 0){
                            //console.log("Length ==== 0");
                            callback(false, {status: 2, status_type: "Failure", message: 'Token expired', error_details: err});
                   }else{
                            callback(false, {status: 1, status_type: "Success", message: 'Valid token', tokenDetails: results[0]});
                   }
            }

        });
    }
    
    
    
    

};
