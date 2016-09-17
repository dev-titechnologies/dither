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
           console.log("Auth '''''''''''''''''''''''''''''''----------_______________________________req.body__________________========");
            //console.log(req.body);
            //console.log(req.body.roomName);
            //console.log(req.body.options);
            //console.log(req.body.opts);
            //console.log("::::::::::::::::::::::::::::::::::::::::::::::::********************************************:::::::::::::::::::::::::::::::::::::::::::");
            //console.log(req.socket);
            //console.log(req.socket.handshake);
            //console.log(req.socket.handshake.query);
            //console.log(req.socket.handshake.query.param);
            //console.log("*************************************");
            //console.log(req.socket.options);
            //console.log("*************************************");
           // console.log(req.options);
            //console.log("*************************************");
            //console.log(socket-options);
            //console.log(req.get('currentSocketId'));
            //console.log(req.get('token'));
            /*console.log(req);
            console.log("end      -----222222222");
            console.log(req.socket.handshake);
            console.log(req.socket.handshake.query);*/
            //console.log(req.socket.handshake.query.token);
            console.log("end      -----tokennnnnnnnnnnnnnnnnnnn");
            /*console.log(req.query);
            console.log(req.query.token);
            var userToken = req.get('token');
            var userToken = "16c229ef11c6946708b6e987";*/
            console.log("userToken ;;;;;;;;;;;");
            console.log(req.get('token'));
            console.log(req.isSocket);
            var userToken;
            if(req.isSocket){
                    console.log("is Socket true");
                    userToken = req.socket.handshake.query.token;
            }else{
                    console.log("is Socket false");
                    userToken = req.get('token');
            }
            //var userToken = "a5f1d1c931f6ef1710ed18b2";
            console.log("Auth ========================================== ++++++++++++++++++++++++++++++++++++");
            console.log(userToken);
            if(userToken){
                    console.log("Inside token check  ha ha ha userToken==============");
                    console.log(userToken);
                    UsertokenService.checkToken(userToken, function(err, tokenCheck) {
                        if(err)
                        {
                            return res.json(200, { status: 2, status_type: 'Failure' , message: 'Some error occured in checkToken' , error_details: err});
                        }
                        else
                        {
                            console.log("BEFORE  -------  tokenCheck.status == 1");
                             if(tokenCheck.status == 1)
                            {
                                console.log("IF  -------  tokenCheck.status == 1");
                                console.log("tokenCheck.status == 1");
                                req.options.tokenCheck = tokenCheck;
                                next();
                            }
                            else
                            {
                                console.log("ELSE  -------  tokenCheck.status == 1");
                                if(tokenCheck.message == 'token'){

                                    /* TokenService.deleteToken(userToken, function(err, result) {
                                        if(err) {
                                             return res.json(200, {status: 2,  status_type: 'Failure' , message: 'some error occured', error_details: result});
                                        } else {

                                            return res.json(200, {status: 1,  status_type: 'Success' , message: 'success'});
                                        }
                                    });*/


                                    return res.json(200, {status: 3, status_type: 'Failure' , message: 'Token expired'});
                                }
                                else if(tokenCheck.message == 'status'){
                                    return res.json(200, {status: 2, status_type: 'Failure' , message: 'Not an active user'});
                                }

                            }
                        }
                    });
            }else{
                    return res.json(200, {status: 2, status_type: 'Failure' , message: 'Please pass a token'});
            }
    }
};
