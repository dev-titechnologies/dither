
/**
 * AdminController
 *
 * @description :: Server-side logic for managing Admin
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var crypto          =       require('crypto');

module.exports = {

    /* ==================================================================================================================================
               Admin Login
   ==================================================================================================================================== */
    adminLogin: function (req, res){
                        console.log("userLogin  .....");
                        var password = crypto.createHash('md5').update(req.body.password).digest("hex");
                        console.log(password);
                        //var password = req.body.password;
                        var values = {
                            username    : req.body.email,
                            password    : password
                        };
                        console.log(values);
                        // Get Admin details
                        Admin.findOne(values).exec(function (err, result){
                            if(err){
                                sails.log.debug('Some error occured ' + err);
                                return res.json(200, {status: 2, message: 'some error occured', error: err});
                            }else{
                                if(typeof result == "undefined"){
                                        sails.log.debug({message: 'No admin found'});
                                        return res.json(200, {status: 2, message: 'No admin found', data: result});
                                }else{
                                        return res.json(200, {status: 1, message: 'success', data: result.id });
                                }
                            }
                        });
    },

}



