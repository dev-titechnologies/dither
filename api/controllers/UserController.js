/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

//var io = require('sails.io.js')( require('socket.io-client') );
module.exports = {

    signup: function (req, res) {
            var values = {
                        name        : 'joseph',
                        email       : '12344@gmail.com',
                        gender      : 'male',
                        birthdate   : '23-12-2015',
                        fbId        : ' ',
                        phoneNumber : 9745896421,
                };
            User.create(values).exec(function(err, result){
                    if(err){
                        console.log(err);
                    }
                    else{



                        // Create new access token on login
                    UsertokenService.createToken(result.id, function (err, details) {
                        if (err) {
                            return res.json(200, {status: 2, msg_type: 'Failure' ,message: 'Some error in token creation'});
                        } else {
                            console.log('signup Part');
                            console.log(result);
                            console.log(result.id);
                            console.log(req.socket.id);
                            //User.publishCreate(result);
                            //User.subscribe(req.socket,result);
                            //sails.sockets.broadcast('user', { msg: 'signup set ===========' });
                            //sails.sockets.emit(req.socket.id,'privateMessage', {msg: 'Hi!'});
                            sails.sockets.blast('createInSignUp', {msg: 'Hi!'});
                            // return res.json(200, {status: 1, message: 'Success'});
                            return res.json(200, {status: 1, msg_type: 'Success' , message: 'Successfully created the token', data: details});
                        }
                    });

                    }

            });
    },
    selectUser: function (req, res) {
            var query = "Select * from user";
            //console.log("select query ==============================");
            //console.log(req.options);
            User.query(query, function(err, result){
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

