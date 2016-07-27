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
            UsertokenService.checkToken(req.param("token"), req.param("device_id"), function(err, tokenCheck) {
                if(err)
                {
                    return res.json(200, { status: false, status_type: 'Failure' , message: 'Some error occured in checkToken' , error_details: err});
                }
                else
                {
                    console.log("authenticate");
                    console.log(req.body.token);
                    if(tokenCheck.status == 1)
                    {
                        req.options.tokenCheck = tokenCheck;
                        next();
                    }
                    else
                    {
                        return res.json(200, {status: false, status_type: 'Failure' , message: 'Token expired'});
                    }
                }
            });
    }
};
