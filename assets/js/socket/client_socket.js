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
io.socket.on('message', function messageReceived(messages){
    console.log(messages);
     jQuery("#response").append('<h3>'+messages.msg+'</h3><br>');
});

io.socket.get('/test/subscribeToFunRoom', {roomName:'Two'}, function (resData, jwres){
  // ...

  console.log('Sails responded with: ', resData);
  console.log('with headers: ', jwres.headers);
  console.log('and with status code: ', jwres.statusCode);
});

