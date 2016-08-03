var crypto = require('crypto');
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
        var tokenValues = {userId: userId, token: token, deviceId: deviceId, expiryDate: expiry_date};
        User_token.create(tokenValues).exec(function (err, resultToken) {
            if (err) {
				console.log("Error Create Token Response");
                console.log(err);
                callback(true, {status: 2, status_type: "Failure", message: 'Some error occured in create token service', error_details: err});

            } else {
				console.log("Success Create Token Response");
                callback(false, {status: 1, status_type: "Success", message: 'CreateToken service success', token: resultToken});
            }

        });

    },

/*  =================================================================================================================================
            Function to delete a token
    ================================================================================================================================== */
    deleteToken: function (token, callback) {
        User_token.destroy({token: token}).exec(function (err, results) {

            if (err) {
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
    checkToken: function (token, callback) {

        var query = " SELECT usr.id, usr.name, usr.profilePic, usr.email, usr.fbId, usrtkn.userId, usrtkn.token, usrtkn.deviceId, usrtkn.expiryDate"+
                    " FROM"+
                    " userToken usrtkn"+
                    " INNER JOIN user usr ON usr.id = usrtkn.userId"+
                    " WHERE usrtkn.token = '"+token+"' AND usrtkn.expiryDate > NOW()";

        User_token.query(query, function (err, results) {
            if (err) {
                        console.log(err);
                        callback(true, {status: 2, status_type: "Failure", message: 'Some error occured in check token query', error_details: err});
            } else {
                   if(results.length == 0){
                            callback(false, {status: 2, status_type: "Failure", message: 'token'});
                   }else{


                        User.findOne({id: results[0].userId}).exec(function (err, statusResults){
                                if (err) {
                                       console.log(err);
                                       callback(true, {status: 2, status_type: 'Failure' ,message: 'Some error occured in checking user status', error_details: err});
                                }
                                else{
                                        if(statusResults.status == 'active'){
                                                callback(false, {status: 1, status_type: "Success", message: 'Valid token and active user', tokenDetails: results[0]});
                                        }else{
                                                callback(false, {status: 2, status_type: "Failure", message: 'status'});
                                                //return res.json(200, {status: 1, status_type: "Success", message: 'Valid token and InActive user'});
                                        }

                                }
                        });

                   }
            }

        });
    }

};
