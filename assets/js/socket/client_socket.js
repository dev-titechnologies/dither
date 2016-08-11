var SERVER_BASE_URL  = "http://192.168.1.57:5000/";
io.sails.url = SERVER_BASE_URL;
io.socket.on('connect', function socketConnected(){
        console.log("socket --- connected");
        /*io.socket.get('/user/signup', function (resData, jwres){
                    console.log(resData);
        });*/
});

io.socket.on('createInSignUp', function (event){
    console.log("User table created ----------------");
    console.log(event);
});

/*io.socket.on('testing', function (event){
    console.log("Test --------------");
    console.log(event);
});*/

