/**
 * SocketSettingsController
 *
 * @description :: Server-side logic for managing socketsettings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

// solution:
//function to remove a value from the json array
function removeItem(obj, prop, val) {
    var c, found=false;
    for(c in obj) {
        if(obj[c][prop] == val) {
            found=true;
            break;
        }
    }
    if(found){
        delete obj[c];
    }
}

module.exports = {
        socketConnection  : function (req, res) {

                if(req.isSocket){
                    console.log("--------------------------------------    Socket_connection     --------------------------------");
                    var tokenCheck                  =     req.options.tokenCheck;
                    var userId                      =     tokenCheck.tokenDetails.userId;

                    console.log(sails.sockets.getId(req));
                    console.log(sails.sockets.rooms());

                    console.log(userId);
                    var user_roomName = "socket_user_"+userId;
                    console.log(user_roomName);
                    sails.sockets.join(req.socket, user_roomName);
                    console.log(sails.sockets.rooms());

                    //var get_collage_id = req.param("dither_id");
                    //console.log(sails.sockets.socketRooms(req.socket));
                    //console.log(sails.sockets.socketRooms());
                    /*socket_user_id_Array            =     [];
                    var tokenCheck                  =     req.options.tokenCheck;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    socket_user_id_Array.push({user_id : tokenCheck.tokenDetails.userId, socket_id : sails.sockets.getId(req)});
                    console.log("--------------------------------------    Socket_connection   Rooms  --------------------------------");
                    req.options.available_sockets = socket_user_id_Array;
                    next();
                    //return res.json(200, {status: 1, message: 'Success Socket Connenction', data: socket_user_id_Array});*/
                    //var ditherIdArray = [1,2,3,4];
                    console.log("0000000000000000000000000000000000000000000000000000000000000000000000000");
                    console.log(req.param("dither_id_array"));
                    console.log("0000000000000000000000000000000000000000000000000000000000000000000000000");
                    var ditherIdArray  = req.param("dither_id_array");
                    if(ditherIdArray.length != 0){
                            ditherIdArray.forEach(function(factor, index){
                                    console.log(factor);
                                    var roomName = "socket_dither_"+factor;
                                    console.log(roomName);
                                    sails.sockets.join(req.socket, roomName);
                                    console.log(sails.sockets.subscribers(roomName));
                                    //console.log(sails.sockets.subscribers(socket_dither_3));
                                    //sails.sockets.broadcast(roomName,{type: update, id: , message: "========== socketConnection Room Broadcast --------", roomName: roomName, subscribers: sails.sockets.subscribers(roomName), socket: sails.sockets.rooms()});
                            });
                    }
                    console.log(sails.sockets.rooms());


                     //console.log(req.body);
                     //console.log(req.params.all());
                     //console.log(req);

                    //console.log(get_collage_id);
                    /*var roomName = "socket_dither_"+get_collage_id;
                    console.log(roomName);
                    sails.sockets.join(req.socket, roomName);*/
                }else{
                        console.log("--------------------------------------    Socket_connection Else Socket Disconnected    --------------------------------");

                }


        },

        socketDitherDetail  : function (req, res) {

                if(req.isSocket){

                            console.log("--------------------------------------    socketDitherDetail     --------------------------------");
                            var tokenCheck                  =     req.options.tokenCheck;
                            var userId                      =     tokenCheck.tokenDetails.userId;

                            console.log(sails.sockets.getId(req));
                            console.log(sails.sockets.rooms());

                            console.log(req.param("dither_id"));
                            var collageId           =   req.param("dither_id");
                            var dither_roomName     =   "socket_dither_"+collageId;
                            console.log(dither_roomName);
                            sails.sockets.join(req.socket, dither_roomName);
                            console.log(sails.sockets.rooms());
                }else{
                        console.log("--------------------------------------    socketDitherDetail Else Socket Disconnected    --------------------------------");

                }
        },

        Socket_disconnection  : function (req, res) {
                /*console.log("--------------------------------------    Socket_disconnection     --------------------------------");
                console.log(sails.sockets.getId(req));
                console.log(sails.sockets.socketRooms(req.socket));
                //console.log(sails.sockets.socketRooms());
                socket_user_id_Array            =     [];
                var tokenCheck                  =     req.options.tokenCheck;
                var userId                      =     tokenCheck.tokenDetails.userId;
                socket_user_id_Array.push({user_id : tokenCheck.tokenDetails.userId, socket_id : sails.sockets.getId(req)});
                console.log("--------------------------------------    Socket_disconnection   Rooms  --------------------------------");

                var socket_user_id_Arrays = {};

                socket_user_id_Arrays.results = socket_user_id_Array;

                //example: call the 'remove' function to remove an item by id.
                removeItem(socket_user_id_Arrays.results,'socket_id',sails.sockets.getId(req));

                //example2: call the 'remove' function to remove an item by name.
                //removeItem(socket_user_id_Arrays.results,'name','Albania');

                // print our result to console to check it works !
                console.log(socket_user_id_Arrays.results);
                for(sock in socket_user_id_Arrays.results) {
                    console.log(socket_user_id_Arrays.results[sock].socket_id);
                }*/


                //return res.json(200, {status: 1, message: 'Success Socket Dis_Connenction', data_1: countries.results});

        },
};

