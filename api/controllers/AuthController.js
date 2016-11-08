/**
 * UserpollController
 *
 * @description :: Server-side logic for managing Userpolls
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


/*===================================================================================================================================
                                                Authenticate the request
 ====================================================================================================================================*/

    authenticate : function(req, res, next) {
            var userToken;
            if(req.isSocket){
                    //console.log(req.socket.handshake);
                    //console.log("is Socket true");
                    //console.log(req.socket);
                    userToken = req.socket.handshake.query.token;
            }else{
                    //console.log("is Socket false");
                    userToken = req.get('token');
            }
            //console.log(userToken);
            if(userToken){
                    UsertokenService.checkToken(userToken, function(err, tokenCheck) {
                        if(err)
                        {
                            return res.json(200, { status: 2, status_type: 'Failure' , message: 'Some error occured in checkToken' , error_details: err});
                        }
                        else
                        {
                             if(tokenCheck.status == 1)
                            {
                                req.options.tokenCheck = tokenCheck;
                                next();
                            }
                            else
                            {
                                if(tokenCheck.message == 'token'){

                                    /* TokenService.deleteToken(userToken, function(err, result) {
                                        if(err) {
                                             return res.json(200, {status: 2,  status_type: 'Failure' , message: 'some error occured', error_details: result});
                                        } else {

                                            return res.json(200, {status: 1,  status_type: 'Success' , message: 'success'});
                                        }
                                    });*/

                                    console.log("Token expired");
                                    return res.json(200, {status: 3, status_type: 'Failure' , message: 'Token expired'});
                                }
                                else if(tokenCheck.message == 'status'){
                                    console.log("Not an active user");
                                    return res.json(200, {status: 2, status_type: 'Failure' , message: 'Not an active user'});
                                }

                            }
                        }
                    });
            }else{
                    console.log("Please pass a token");
                    return res.json(200, {status: 2, status_type: 'Failure' , message: 'Please pass a token'});
            }
    }
};
