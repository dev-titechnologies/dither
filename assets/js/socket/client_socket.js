//var SERVER_BASE_URL  = "http://192.168.1.57:5000/";
//io.sails.url = SERVER_BASE_URL;
/*io.socket.on('connect', function socketConnected(){
        console.log("socket --- connected");
        //io.socket.get('/user/signup', function (resData, jwres){
                    //console.log(resData);
        //});
});

io.socket.on('createInSignUp', function (event){
    console.log("User table created ----------------");
    console.log(event);
});*/

/*io.socket.on('testing', function (event){
    console.log("Test --------------");
    console.log(event);
});*/

io.sails.url = "http://192.168.1.57:5000";
io.socket.on('connect', function socketConnected(){
        console.log("socket --- connected");
        //io.socket.get('/user/signup', function (resData, jwres){
                    //console.log(resData);
        //});
});
//io.socket.on('message', function messageReceived(messages){
    //console.log(messages);
     //jQuery("#response").append('<h3>'+messages.msg+'</h3><br>');
//});

/*io.socket.get('/test/subscribeToFunRoom', {roomName:'Two'}, function (resData, jwres){
  // ...

  console.log('Sails responded with: ', resData);
  console.log('with headers: ', jwres.headers);
  console.log('and with status code: ', jwres.statusCode);
});*/


/*io.socket.on('createIncheck', function (event){
    console.log("User table created ----------------");
    console.log(event);
});*/
//sails.sockets.emit(friendId, 'privateMessage', {from: req.session.userId, msg: 'Hi!'});
//sails.sockets.emit('privateMessage');
//For call an event
//io.socket.emit('logoffchat');
io.socket.on('message', function (event){
        console.log("createInCheck ----------------");
        console.log(event);
        console.log("!!!! event  <-->  Message !!!!");
});
io.socket.on('createIncheck', function (event){
        console.log("createInCheck ----------------");
        console.log(event);
        console.log(event.device_id);
        console.log("event |||||||||||| Ha ha ha ha ha ha ha ha ha ha ");
});
/*io.socket.on('createIncheck', function newMessageFromSails ( message ) {
        //typeof console !== 'undefined' &&
        console.log('New message received from Sails ::\n', message);
});*/
