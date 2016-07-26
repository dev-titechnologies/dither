/**
 * AddressBookController
 *
 * @description :: Server-side logic for managing addressbooks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
/* ==================================================================================================================================
               To Upload Images
     ==================================================================================================================================== */
        addUserContacts: function (req, res) {

                var tokenCheck                  =     req.options.tokenCheck;
                var userId                      =     tokenCheck.tokenDetails.userId;
                console.log("addUserContacts=-=============");
var fbUser = [
        {ditherUserName: req.param('user_name'),ditherPhoneNumber: req.param('fb_id')},
        {ditherUserName: req.param('user_name'),ditherPhoneNumber: req.param('fb_id')},
        {ditherUserName: req.param('user_name'),ditherPhoneNumber: req.param('fb_id')},
        ];
var phonecontacts = [
        {ditherUserName: req.param('user_name'),ditherPhoneNumber: req.param('phone_number')},
        {ditherUserName: req.param('user_name'),ditherPhoneNumber: req.param('phone_number')},
        {ditherUserName: req.param('user_name'),ditherPhoneNumber: req.param('phone_number')},
        ];
        phonecontacts.forEach(function(factor, index){
             console.log("factor");
             console.log(factor);
        });

        fbUser.forEach(function(factor, index){
             console.log("factor");
             console.log(factor);
        });

               /* var values = {
                        userId              : userId,
                        ditherId            : ,
                        ditherUserName      : req.param('user_name'),
                        ditherPhoneNumber   : req.param('phone_number'),
                };
            AddressBook.create(values).exec(function(err, results){
                    if(err){
                            console.log(err);
                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in addressBook creation', error_details: err});
                    }
                    else{

                    }
            });*/

        },
};

