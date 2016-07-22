/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

//var io = require('sails.io.js')( require('socket.io-client') );
module.exports = {

    signup: function (req, res) {
            //console.log(req.param('name'));

            var values = {
                        name        : req.param('name'),
                        email       : req.param('email'),
                        fbId        : req.param('fbId'),
                        phoneNumber : req.param('phoneNumber'),
                        profilePic  : req.param('profilePic'),
                };
            User.create(values).exec(function(err, results){
                    if(err){
                            console.log(err);
                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in user creation'});
                    }
                    else{
                            // Create new access token on login
                            UsertokenService.createToken(results.id, function (err, userTokenDetails) {
                                if (err) {
                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in token creation'});
                                } else {
                                        //User.publishCreate(result);
                                        //User.subscribe(req.socket,result);
                                        //sails.sockets.broadcast('user', { msg: 'signup set ===========' });
                                        //sails.sockets.emit(req.socket.id,'privateMessage', {msg: 'Hi!'});
                                        sails.sockets.blast('createInSignUp', {msg: 'Hi!'});

                                            // Send Email and Sms  Simultaneously
                                            async.parallel([
                                                        function(callback) {
                                                                    var global_settingsKeyValue = req.options.settingsKeyValue;
                                                                    var email_to        = results.email;
                                                                    var email_subject   = 'Dither - Signup';
                                                                    var email_template  = 'signup';
                                                                    var email_context   = {receiverName: results.name};
                                                                    EmailService.sendEmail(global_settingsKeyValue, email_to,email_subject,email_template,email_context, function(err, sendEmailResults) {
                                                                        if(err)
                                                                        {
                                                                                console.log(err);
                                                                                //return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in Email Send on signup', error_details: sendEmailResults});
                                                                                 callback();
                                                                        }else{
                                                                                //console.log(results);
                                                                                console.log(email_to);
                                                                                console.log(email_subject);
                                                                                console.log(email_template);
                                                                                console.log(email_context);
                                                                                callback();
                                                                                //return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully completed the signup'});
                                                                        }


                                                                    });

                                                        },
                                                        function(callback) {
                                                                    /*SmsService.sendSms(function(err, sendSmsResults) {
                                                                        if(err)
                                                                        {
                                                                                console.log(err);
                                                                                //return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in Sms Send on signup', error_details: sendSmsResults});
                                                                                callback();
                                                                        }else{
                                                                                //return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully completed the signup'});
                                                                                callback();
                                                                        }
                                                                    });*/
                                                                    callback();
                                                        }


                                                   ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
                                                                    if (err) {
                                                                        console.log(err);
                                                                        return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in Sms Send OR i Emai Send on signup'}); //If an error occured, we let express/connect handle it by calling the "next" function
                                                                    }else{
                                                                        return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully completed the signup'});
                                                                    }

                                            });

                                }
                            });
                    }
            });
    },

    checkForNewUser:  function (req, res) {

            console.log(req.options.settingKeyValue);
            console.log(req.param('fbId'));
            User.findOne({fbId: req.param('fbId')}).exec(function (err, results){
                    if (err) {
                           console.log(err);
                           return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in finding fbId'});
                    }
                    else{

                            if(typeof(results) == 'undefined'){
                                  return res.json(200, {status: 1, status_type: 'Success' ,  isNewUser: true});
                            }else{
                                  return res.json(200, {status: 1, status_type: 'Success' ,  email: results.email, full_name: results.name, fb_uid: results.fbId, isNewUser: false});
                            }
                          //console.log(results);
                    }

            });

    },




    selectUser: function (req, res) {

            console.log(req.options.tokenCheck);
            console.log("selectUser ---------------------------------");
            console.log(req.options.settingsKeyValue);
            var commonSettings = req.options.settingsKeyValue;
            console.log(commonSettings.EMAIL_HOST);
            //console.log(req.options.settingsKeyValue[0]);
            //console.log(req.options.settingsKeyValue.EMAIL_HOST);

            var query = "Select * from user";
            User.query(query, function(err, results){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log('signup Part');
                        //console.log(result);
                        return res.json(200, {status: 1, message: 'Success'});
                    }

            });
    }


};

