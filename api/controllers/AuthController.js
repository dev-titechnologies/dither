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
            UsertokenService.checkToken(req.body.token, function(err, tokenCheck) {
                if(err)
                {
                    return res.json(200, { status: false, message: 'some error occured' });
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
                        return res.json(200, {status: false, message: 'token expired'});
                    }
                }
            });
    }
};
