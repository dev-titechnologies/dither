/**
 * WebSocket Server Settings
 * (sails.config.sockets)
 *
 * These settings provide transparent access to the options for Sails'
 * encapsulated WebSocket server, as well as some additional Sails-specific
 * configuration layered on top.
 *
 * For more information on sockets configuration, including advanced config options, see:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.sockets.html
 */

module.exports.sockets = {


  /***************************************************************************
  *                                                                          *
  * Node.js (and consequently Sails.js) apps scale horizontally. It's a      *
  * powerful, efficient approach, but it involves a tiny bit of planning. At *
  * scale, you'll want to be able to copy your app onto multiple Sails.js    *
  * servers and throw them behind a load balancer.                           *
  *                                                                          *
  * One of the big challenges of scaling an application is that these sorts  *
  * of clustered deployments cannot share memory, since they are on          *
  * physically different machines. On top of that, there is no guarantee     *
  * that a user will "stick" with the same server between requests (whether  *
  * HTTP or sockets), since the load balancer will route each request to the *
  * Sails server with the most available resources. However that means that  *
  * all room/pubsub/socket processing and shared memory has to be offloaded  *
  * to a shared, remote messaging queue (usually Redis)                      *
  *                                                                          *
  * Luckily, Socket.io (and consequently Sails.js) apps support Redis for    *
  * sockets by default. To enable a remote redis pubsub server, uncomment    *
  * the config below.                                                        *
  *                                                                          *
  * Worth mentioning is that, if `adapter` config is `redis`, but host/port  *
  * is left unset, Sails will try to connect to redis running on localhost   *
  * via port 6379                                                            *
  *                                                                          *
  ***************************************************************************/
  // adapter: 'memory',

  //
  // -OR-
  //

  // adapter: 'redis',
  // host: '127.0.0.1',
  // port: 6379,
  // db: 'sails',
  // pass: '<redis auth password>',



 /***************************************************************************
  *                                                                          *
  * Whether to expose a 'get /__getcookie' route with CORS support that sets *
  * a cookie (this is used by the sails.io.js socket client to get access to *
  * a 3rd party cookie and to enable sessions).                              *
  *                                                                          *
  * Warning: Currently in this scenario, CORS settings apply to interpreted  *
  * requests sent via a socket.io connection that used this cookie to        *
  * connect, even for non-browser clients! (e.g. iOS apps, toasters, node.js *
  * unit tests)                                                              *
  *                                                                          *
  ***************************************************************************/

  // grant3rdPartyCookie: true,



  /***************************************************************************
  *                                                                          *
  * `beforeConnect`                                                          *
  *                                                                          *
  * This custom beforeConnect function will be run each time BEFORE a new    *
  * socket is allowed to connect, when the initial socket.io handshake is    *
  * performed with the server.                                               *
  *                                                                          *
  * By default, when a socket tries to connect, Sails allows it, every time. *
  * (much in the same way any HTTP request is allowed to reach your routes.  *
  * If no valid cookie was sent, a temporary session will be created for the *
  * connecting socket.                                                       *
  *                                                                          *
  * If the cookie sent as part of the connection request doesn't match any   *
  * known user session, a new user session is created for it.                *
  *                                                                          *
  * In most cases, the user would already have a cookie since they loaded    *
  * the socket.io client and the initial HTML page you're building.         *
  *                                                                          *
  * However, in the case of cross-domain requests, it is possible to receive *
  * a connection upgrade request WITHOUT A COOKIE (for certain transports)   *
  * In this case, there is no way to keep track of the requesting user       *
  * between requests, since there is no identifying information to link      *
  * him/her with a session. The sails.io.js client solves this by connecting *
  * to a CORS/jsonp endpoint first to get a 3rd party cookie(fortunately this*
  * works, even in Safari), then opening the connection.                     *
  *                                                                          *
  * You can also pass along a ?cookie query parameter to the upgrade url,    *
  * which Sails will use in the absence of a proper cookie e.g. (when        *
  * connecting from the client):                                             *
  * io.sails.connect('http://localhost:1337?cookie=smokeybear')              *
  *                                                                          *
  * Finally note that the user's cookie is NOT (and will never be) accessible*
  * from client-side javascript. Using HTTP-only cookies is crucial for your *
  * app's security.                                                          *
  *                                                                          *
  ***************************************************************************/
  /* beforeConnect: function(handshake, cb) {
          //   // `true` allows the connection
          //   return cb(null, true);
          //
          //   // (`false` would reject the connection)
          console.log("beforeConnect Connect +++++++++++++++");
          var id = '/#'+handshake.headers.cookie.split(';')[0].replace(/^io=/,'');
          console.log(id);
            // `true` allows the connection
            return cb(null, true);
   },

    onConnect: function(socket, cb) {
         // By default: do nothing.
         //return cb();
         console.log("On Connect  ");
         //console.log(session);

         //console.log(socket);
    },*/

    //onConnect: function (socket, session, req) {
    /*onConnect: function (handshake, socket, cb) {
            //var currentSocketId;
            console.log("On connect entered  =====>>>>>   ");
            //console.log(socket.getId());
            //console.log(handshake);
            //console.log(socket);
            //console.log(socket.nsp);
            // --console.log(socket.nsp.sockets);
            //console.log(socket.nsp.sockets.Socket.id);
            //console.log(socket.sockets);
            //console.log(socket.sockets.conn.Socket.id);
            //console.log(handshake.conn);
             //console.log(handshake.conn.Socket.conn.Socket.id);
            console.log(sails.sockets.getId(socket));
            console.log("socket Rooms");
            console.log(sails.sockets.rooms(socket));
            //var currentSocketId = sails.sockets.getId(socket);
            console.log("||||||||||||||||||||||||||");
            //console.log(currentSocketId);
            console.log(sails.sockets.getId(socket));
            console.log("===================||||||||||||||||||||||||||=================");


            //var currentSocketId  = socket.currentSocketId;
            //req.session.socket_id = sails.sockets.getId(socket);
            //socket.on('some_event', function(data) {
                // handle event here
            //});
    },*/

  /***************************************************************************
  *                                                                          *
  * `afterDisconnect`                                                        *
  *                                                                          *
  * This custom afterDisconnect function will be run each time a socket      *
  * disconnects                                                              *
  *                                                                          *
  ***************************************************************************/
   /*afterDisconnect: function(session, socket, cb) {

            //afterDisconnect: function(session, socket, cb) {
                 // By default: do nothing.
                // return cb();
           // },

            console.log("After DisConnect");
            //console.log(session);
            console.log(sails.sockets.getId(socket));
            console.log("socket Rooms");
            //console.log(sails.sockets.rooms(socket));
            //console.log(socket);
   },*/

  /* onDisconnect: function (session, socket, cb) {
            console.log("On connect entered  =====>>>>>   ");
            //console.log(socket.nsp.sockets);
            //console.log(sails.sockets.getId(socket));
            //console.log("socket Rooms");
            //console.log(sails.sockets.rooms(socket));
    }*/

  /***************************************************************************
  *                                                                          *
  * `transports`                                                             *
  *                                                                          *
  * A array of allowed transport methods which the clients will try to use.  *
  * On server environments that don't support sticky sessions, the "polling" *
  * transport should be disabled.                                            *
  *                                                                          *
  ***************************************************************************/
   //transports: ["polling", "websocket"]

};
