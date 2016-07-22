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

