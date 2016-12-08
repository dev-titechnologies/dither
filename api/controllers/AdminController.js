
/**
 * AdminController
 *
 * @description :: Server-side logic for managing Admin
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var crypto = require('crypto');
 var fs          = require('fs');
 var request     = require('request');
 var path        = require('path');

 var  googleapis = require('googleapis');
 var  key        = require('service-account-credentials.json');
 const VIEW_ID   = 'ga:130989248';
 var todayISO           =   new Date().toISOString();

module.exports = {

    // Admin Login
         adminLogin: function (req, res) {
        console.log("userLogin  .....");
         var password = crypto.createHash('md5').update(req.body.password).digest("hex");
         console.log(password);
        //var password = req.body.password;
        var values = {
            username: req.body.email,
            password: password
        };
console.log(values);
        // Get Admin details
        Admin.findOne(values).exec(function (err, result) {
            if (err) {

                sails.log.debug('Some error occured ' + err);
                return res.json(200, {status: 2, message: 'some error occured', error: err});

            } else {

                if (typeof result == "undefined")
                {
                    sails.log.debug({message: 'No admin found'});
                    return res.json(200, {status: 2, message: 'No admin found', data: result});

                }
                else
                {

                        return res.json(200, {status: 1, message: 'success', data: result.id });


                }

            }
        });



    },
        //   List all users based on limit(12 rows per call)
     getCompleteUser: function(req, res){
                console.log("getCompleteUser ============== ADMIN");
                console.log(req.params.all());
                var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                var profile_image;
                var start                       =     req.body.start;
                var count                       =     req.body.count;
                var query = " SELECT id, name, email, profilePic as profileImage, phoneNumber, status, createdAt, "+
                            "(SELECT COUNT(user.id) from user) as length,"+
                            "(SELECT COUNT( clg.id ) FROM user usr INNER JOIN collage clg ON usr.id = clg.userId WHERE usr.id = user.id) as ditherCount"+
                            " FROM user ORDER BY createdAt DESC LIMIT "+start+","+count;
                console.log(query);
                User.query(query, function(err, result){
                    if(err){
                        // console.log(err);
                        return res.json(200, { status: 2, error_details: 'db error' });
                    }else{
                        //console.log(result);
                        result.forEach(function(factor, index){
                                if(factor.profileImage == null || factor.profileImage == ""){
                                        profile_image                   =     "";
                                }else{
                                        var imageSrc                    =     factor.profileImage;
                                        var ext                         =     imageSrc.split('.');
                                        profile_image                   =     profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                }
                                factor.profilePic       =    profile_image;
                        });
                        console.log(result);
                        return res.json(200, {status: 1, message: "success", data: result});
                    }
                });

    },
    // View Details of every single User
    getUserDetails: function(req, res){
                    console.log("getUserDetails ============== ADMIN");
                    var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                    var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                    var profile_image;
                    var userId                      =       req.body.userId;

                    var query = " SELECT"+
                                " usr.id, usr.name, usr.email, usr.profilePic as profileImage, usr.phoneNumber, usr.status, usr.createdAt, "+
                                " clg.id as collageId,"+
                                " (SELECT COUNT(id) FROM collage WHERE userId = "+userId+" AND expiryDate < '"+todayISO+"') as cdCount,"+
                                " (SELECT COUNT(id) FROM collage WHERE userId = "+userId+" AND expiryDate > '"+todayISO+"') as odCount,"+
                                " (SELECT COUNT(id) FROM collage WHERE userId = "+userId+") as tdCount"+
                                " FROM  user usr"+
                                " LEFT JOIN collage clg ON clg.userId = usr.id"+
                                " WHERE usr.id="+userId;
                    console.log(query);
                    User.query(query, function(err, result){
                        if(err){
                            // console.log(err);
                            return res.json(200, { status: 2, error_details: 'db error' });
                        }else{
                            //console.log(result);
                            result.forEach(function(factor, index){
                                    if(factor.profileImage == null || factor.profileImage == ""){
                                            profile_image                   =     "";
                                    }else{
                                            profile_image                   =     profilePic_path + factor.profileImage;
                                    }
                                    factor.profilePic       =    profile_image;
                            });
                            console.log(result);
                            return res.json(200, {status: 1, message: "success", data: result});
                        }
                    });

    },
    //Delete a particular User
    deleteUser: function(req, res){
                    criteria={id: req.body.userId};
                    data= {status: 'delete'};
                User.update(criteria, data).exec(function (err, result) {
                    if(err)
                    {
                        // console.log(err);
                        return res.json(200, { status: 2, error_details: 'db error' });
                    }
                    else
                    {

                        //console.log(result);
                        return res.json(200, {status: 1, message: "success", data: result});
                    }
                });

    },
    // Activate Deactivate User
    userStatus: function(req, res){
                    //key=req.body.key;
                    criteria={id: req.body.userId};
                    data= {status: req.body.status};

                User.update(criteria, data).exec(function (err, result) {
                    if(err)
                    {
                         console.log(err);
                        return res.json(200, { status: 2, error_details: 'db error' });
                    }
                    else
                    {

                        console.log(result);
                        return res.json(200, {status: 1, message: "success", data: result});
                    }
                });

    },

    // Get Reported User List
    getReportedUser: function(req, res){
                console.log("getReportedUser  ====> ADMIN");
                var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                var profile_image;
                var query = "SELECT u.id,u.profilePic as profileImage,u.status, u.name, COUNT( ru.userId ) AS RepUserCount FROM reportUser AS ru LEFT JOIN user AS u ON u.id = ru.userId GROUP BY ru.userId ORDER BY u.createdAt DESC ";
                User.query(query, function(err, result) {
                    if(err){
                        // console.log(err);
                        return res.json(200, { status: 2, error_details: 'db error' });
                    }else{
                        //console.log(result);
                        result.forEach(function(factor, index){
                                if(factor.profileImage == null || factor.profileImage == ""){
                                        profile_image                   =     "";
                                }else{
                                        var imageSrc                    =     factor.profileImage;
                                        var ext                         =     imageSrc.split('.');
                                        profile_image                   =     profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                }
                                factor.profilePic       =    profile_image;
                        });
                        //console.log(result);
                        return res.json(200, {status: 1, message: "success", data: result});
                    }
                });

    },

    // Get One User Reported List
    getReportList: function(req, res){
                console.log("getReportList  ====> ADMIN");
                var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                var profile_image;
                var query = " SELECT"+
                            " u.profilePic as profileImage, u.name,"+
                            " rt.description,"+
                            " ru.report, ru.createdAt"+
                            " FROM reportUser AS ru"+
                            " LEFT JOIN user AS u ON u.id = ru.reporterId"+
                            " LEFT JOIN reportType AS rt ON rt.id = ru.reportType"+
                            " WHERE"+
                            " ru.userId ="+req.body.userId;
                console.log(query);
                User.query(query, function(err, result){
                    if(err){
                        // console.log(err);
                        return res.json(200, { status: 2, error_details: 'db error' });
                    }else{
                        result.forEach(function(factor, index){
                                if(factor.profileImage == null || factor.profileImage == ""){
                                        profile_image                   =     "";
                                }else{
                                        var imageSrc                    =     factor.profileImage;
                                        var ext                         =     imageSrc.split('.');
                                        profile_image                   =     profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                }
                                factor.profilePic       =    profile_image;
                        });
                        //console.log(result);
                        return res.json(200, {status: 1, message: "success", data: result});
                    }
                });


    },


        /**  get all dither **/
    getAllDithers: function(req,res){
        console.log(req.params.all());
        var start = req.body.start;
        var count = req.body.count;
        // var itemsPerPage = req.body.itemsPerPage;
        //  console.log("pagenumber");
        // console.log(pagenumber);
        //  console.log("itemsPerPage");
        //  console.log(itemsPerPage);
        console.log("inside getAllDithers function");
        // var query = "SELECT COUNT(*) as length,c.*,c.id as cid,u.*  FROM collage as c INNER JOIN user as u ON u.id=c.userId ORDER BY c.createdAt DESC LIMIT 0,10";

        var query =" SELECT c. * , c.id AS cid, u. * ,c.status,c.totalVote,("+
                   " SELECT COUNT( c.id )"+
                   " FROM collage AS c"+
                   " INNER JOIN user AS u ON u.id = c.userId"+
                   " ) AS length,"+
                   " IF( (c.expiryDate > '"+todayISO+"') , 'open', 'close') AS ditherStatus"+
                   " FROM collage AS c"+
                   " INNER JOIN user AS u ON u.id = c.userId"+
                   " WHERE u.type != 1"+
                   " ORDER BY c.createdAt DESC"+
                   " LIMIT "+start+" , "+count+"";
        console.log(query);
                    Collage.query(query, function (err, result) {
                        if (err) {
                            return res.json(200, {status: 2, error_details: err});

                        } else {

                            return res.json(200, {status: 1, message: "success",

                                            result: result
                            });
                        }
                    });
    },

    /** Get each dither details **/
    getSingleDitherDetails: function(req,res){
         var ditherId=req.body.id;
         var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
         var collageImg_path             =     server_image_baseUrl + req.options.file_path.collageImg_path;

            // var ditherId = 507;
         console.log("inside getSingleDitherDetails function"+ditherId);
         var query = "SELECT c.*,u.*, cd.image as singImage,cd.vote as individualVote FROM collage as c LEFT JOIN user as u ON u.id=c.userId LEFT JOIN collageDetails as cd ON c.id=cd.collageId  where c.id="+ditherId+" ORDER BY c.id DESC";

        console.log(query);
                    Collage.query(query, function (err, result) {
                        if (err) {
                            return res.json(200, {status: 2, error_details: err});
                        } else {
                            console.log(result);
                            if(result)
                            {
                                result.forEach(function(factor, index){
                                if(factor.singImage == null || factor.singImage == "" ){
                                        singImage                   =     "";
                                        dither_image                =     "";
                                }else{
                                        dither_image                    =     collageImg_path + factor.image
                                        singImage                       =     collageImg_path + factor.singImage ;
                                }
                                 factor.singImage       =    singImage;
                                 factor.image           =   dither_image;
                                 console.log(factor.singImage)
                                 console.log(factor.image)

                                });
                            }
                            return res.json(200, {status: 1, message: "success", result: result});
                        }
                    });
    },

    /** get the tagged users for each dither **/
    getSingleDitherTaggedUsers: function(req,res){
       var ditherId=req.body.id;
        var query = "SELECT u.*, t.* from user as u LEFT JOIN tags as t ON t.userId=u.id where t.collageId="+ditherId+" ORDER BY u.id ASC";
        console.log(query);
                    Collage.query(query, function (err, result) {
                        if (err) {
                            return res.json(200, {status: 2, error_details: err});
                        } else {
                            console.log("hello");
                            console.log(result);
                            return res.json(200, {status: 1, message: "success", result: result});
                        }
                    });
    },

    //** get reported dither details **/
    getReportDither: function(req,res){
                // var query = "SELECT rd . *,u.name AS username,c.imgTitle,c.status FROM reportDither AS rd LEFT JOIN user AS u ON rd.reporterId = u.id LEFT JOIN collage AS c ON c.id = rd.collageId";
                var query = " SELECT DISTINCT rd.collageId,"+
                            " u.name AS postedBy,"+
                            " c.imgTitle,c.status,"+
                            " COUNT( rd.collageId ) AS RepDitherCount,"+
                            " IF( (c.expiryDate < NOW()) ,  'close',  'open') AS ditherStatus"+
                            " FROM reportDither AS rd"+
                            " INNER JOIN collage AS c ON c.id = rd.collageId"+
                            " INNER JOIN user AS u ON rd.reporterId = u.id"+
                            " GROUP BY rd.collageId";
                console.log(query);
                ReportDither.query(query, function (err, result){
                    if(err){
                        return res.json(200, {status: 2, error_details: err});
                    }else{
                        //console.log(result);
                        return res.json(200, {status: 1, message: "success", result: result});
                    }
                });
    },

    //** suspend a dither
    suspendDither: function(req,res){

        var suspendDitherId=req.body.collageId;
        var criteria = {id: suspendDitherId};

                    var data = {status: 'inactive'};

                    Collage.update(criteria, data).exec(function (err, updatedData) {

                        if (err) {
                            return res.json(200, {status: 2, message: 'some error has occured', error_details: updatedData});
                        } else {

                            console.log("success");
                             return res.json(200, {status: 1, message: 'successfully suspended'});
                        }
                    });
    },
    releaseDither: function(req,res){

        var releaseDitherId=req.body.collageId;
        var criteria = {id: releaseDitherId};

                    var data = {status: 'active'};

                    Collage.update(criteria, data).exec(function (err, updatedData) {

                        if (err) {
                            return res.json(200, {status: 2, message: 'some error has occured', error_details: updatedData});
                        } else {

                            console.log("success");
                             return res.json(200, {status: 1, message: 'successfully Released'});
                        }
                    });
    },
    getReportedBy: function(req,res){
        var ditherId=req.body.collageId;
        console.log("ghhhhhhh"+ditherId);
        var query="select rd.*, u.name,rt.description from reportDither as rd LEFT JOIN user as u on rd.reporterId=u.id LEFT JOIN reportType as rt on rd.reportType=rt.reportId where rd.collageId="+ditherId;
        console.log(query);
         ReportDither.query(query, function (err, result) {
                        if (err) {
                            return res.json(200, {status: 2, error_details: err});
                        } else {
                            console.log("hello");
                            console.log(result);
                            return res.json(200, {status: 1, message: "success", result: result});
                        }
                    });
    },
    getUsersNotification:function(req,res){
        console.log("go fast, u are on way");
           var user_id  = req.body.userId;
       // var user_id = 87;
        console.log(user_id);
        console.log(req.body);
        var query = " SELECT"+
                   " N.id,N.userId,N.ditherUserId,N.collage_id as ditherId,N.notificationTypeId,N.createdAt as createdDate,N.image_id,N.tagged_users,N.description,"+
                   " U.name,U.profilePic,"+
                   " C.image as dither_image,C.id as ditherID"+
                   " FROM notificationLog as N LEFT JOIN user as U ON U.id = N.userId"+
                   " LEFT JOIN collage as C ON C.id = N.collage_id"+
                   " WHERE"+
                   " N.ditherUserId="+user_id+
                   " AND(N.notificationTypeId=1 OR N.notificationTypeId=2 OR N.notificationTypeId=3 OR N.notificationTypeId=4 OR N.notificationTypeId=7)"+
                   " OR"+
                   " FIND_IN_SET("+user_id+", N.tagged_users) ORDER BY N.updatedAt DESC";
        Collage.query(query,function(err,result){
            if(err){
                console.log("small error..");
                 return res.json(200, {status: 2, error_details: err});
            }
            else{
                console.log("Success in notification",result);
                return res.json(200,{status:1,message:'success',data:result});
            }
        });
    },
    getAllDithersOfUser:function(req,res){

                        console.log("inside getUserAllDithers functin");
                        var user_id = req.body.userId;
                        // console.log(user_id);
                        // var user_id = 87;

                        var query = "SELECT c.*,c.id as cid,u.*  FROM collage as c INNER JOIN user as u ON u.id=c.userId WHERE c.userId = "+user_id+" AND u.type != 1 ORDER BY c.createdAt DESC ";
                        console.log(query);
                        Collage.query(query,function(err,result){
                            if(err)
                            {
                                  console.log("some error check query");
                                  return res.json(200, {status: 2, error_details: err});
                            }else
                            {
                                 // console.log(result);
                                 return res.json(200,{status:1,message:'success',result:result});
                            }
                        });

    },
    getComments:     function(req,res){
                        console.log("getComments   =================== ADMIN");
                        var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                        var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                        var profile_image;
                        var collageId                   =     req.body.id;
                        var query   = " SELECT"+
                                      " u.name as commentedPerson,u.id as commentedPersonId,u.profilePic as profileImage,"+
                                      " cc.comment,cc.createdAt as commentedDate"+
                                      " FROM collageComments as cc"+
                                      " INNER JOIN user as u ON cc.userId = u.id"+
                                      " WHERE cc.collageId = "+collageId+
                                      " ORDER BY cc.createdAt DESC";
                        CollageComments.query(query,function(err,result){
                            if(err){
                                console.log("errrRRRRRRRRR");
                                return res.json(200, {status: 2, error_details: err});
                            }else{
                                result.forEach(function(factor, index){
                                    if(factor.profileImage == null || factor.profileImage == ""){
                                            profile_image                   =     "";
                                    }else{
                                            var imageSrc                    =     factor.profileImage;
                                            var ext                         =     imageSrc.split('.');
                                            profile_image                   =     profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                    }
                                    factor.profilePic       =    profile_image;
                                });
                                return res.json(200,{status:1,message:'success',result:result});
                            }

                        });
    },
    getDoughnutData:  function(req,res){

                      var jwtClient = new googleapis.auth.JWT(
                      key.client_email, null, key.private_key,
                      ['https://www.googleapis.com/auth/analytics.readonly'], null);

                    jwtClient.authorize(function (err, tokens) {
                      if (err)
                       {
                        console.log(err);
                        return;
                      }
                      var analytics = googleapis.analytics('v3');
                      queryData(analytics);
                    });

                 function queryData(analytics) {
                  analytics.data.ga.get({
                    'auth': jwtClient,
                    'ids': VIEW_ID,
                    // 'metrics': 'ga:uniquePageviews',
                    // 'dimensions': 'ga:pagePath',
                    // 'start-date': '30daysAgo',
                    // 'end-date': 'yesterday',
                    // 'sort': '-ga:uniquePageviews',
                    // 'max-results': 10,
                    // 'filters': 'ga:pagePath=~/ch_[-a-z0-9]+[.]html$',
                    'start-date': 'today',
                    'end-date': 'today',
                    'dimensions':'ga:mobileDeviceInfo',
                    'metrics':'ga:sessions',
                    //'segment': 'mobile',
                  }, function (err, response) {
                    if (err)
                     {
                      console.log(err);
                      return res.json(200, {status: 2, error_details: err});
                    }
                    // console.log(JSON.stringify(response.rows, null, 4));
                    return res.json(200,{status:1,message:'success',result:response.rows});
                  });
                }
},
    getMapData:     function(req,res){

                    var jwtClient = new googleapis.auth.JWT(
                    key.client_email, null, key.private_key,
                    ['https://www.googleapis.com/auth/analytics.readonly'], null);

                    jwtClient.authorize(function (err, tokens) {
                      if (err)
                      {
                        console.log(err);
                        return;
                      }
                      var analytics = googleapis.analytics('v3');
                      queryData(analytics);
                    });

                  function queryData(analytics) {
                  analytics.data.ga.get({
                    'auth': jwtClient,
                    'ids': VIEW_ID,
                    'start-date': 'today',
                    'end-date': 'today',
                     'dimensions': 'ga:city,ga:latitude,ga:longitude',
                    'metrics': 'ga:sessions,ga:users',
                  }, function (err, response) {
                    if (err)
                    {
                      console.log(err);
                      return res.json(200, {status: 2, error_details: err});
                    }
                    console.log(response.rows);
                    return res.json(200,{status:1,message:'success',result:response.rows});
                  });
                }

},
getBrowserDetails:  function(req,res){

                    var jwtClient = new googleapis.auth.JWT(
                    key.client_email, null, key.private_key,
                    ['https://www.googleapis.com/auth/analytics.readonly'], null);

                    jwtClient.authorize(function (err, tokens) {
                      if (err)
                      {
                        console.log(err);
                        return;
                      }
                      var analytics = googleapis.analytics('v3');
                      queryData(analytics);
                    });

                  function queryData(analytics) {
                  analytics.data.ga.get({
                    'auth': jwtClient,
                    'ids': VIEW_ID,
                    'start-date': 'today',
                    'end-date': 'today',
                    'dimensions':'ga:browser',
                    'metrics':'ga:sessions',
                  }, function (err, response) {
                    if (err)
                     {
                          console.log(err);
                          return res.json(200, {status: 2, error_details: err});
                    }
                    // console.log(JSON.stringify(response.rows, null, 4));
                    return res.json(200,{status:1,message:'success',result:response.rows});
                  });
                }
},

getPieChartData:function(req,res){

                var jwtClient = new googleapis.auth.JWT(
                key.client_email, null, key.private_key,
                ['https://www.googleapis.com/auth/analytics.readonly'], null);

                jwtClient.authorize(function (err, tokens) {
                  if (err)
                  {
                    console.log(err);
                    return;
                  }
                  var analytics = googleapis.analytics('v3');
                  queryData(analytics);
                });

              function queryData(analytics) {
              analytics.data.ga.get({
                'auth': jwtClient,
                'ids': VIEW_ID,
                'start-date': 'today',
                'end-date': 'today',
                // 'dimensions':'ga:userType,ga:country',
                'metrics':'ga:users,ga:screenviews,ga:screenviewsPerSession,ga:avgSessionDuration',
              }, function (err, response) {
                if (err)
                {
                   console.log(err);
                   return res.json(200, {status: 2, error_details: err});
                }

                return res.json(200,{status:1,message:'success',result:response.rows});
              });
            }
},
getBarChartData:function(req,res){

                var jwtClient = new googleapis.auth.JWT(
                key.client_email, null, key.private_key,
                ['https://www.googleapis.com/auth/analytics.readonly'], null);

                jwtClient.authorize(function (err, tokens) {
                  if (err)
                  {
                    console.log(err);
                    return;
                  }
                  var analytics = googleapis.analytics('v3');
                  queryData(analytics);
                });

              function queryData(analytics) {

                var startDate = req.body.fromDate;
                var endDate = req.body.toDate;

              analytics.data.ga.get({
                'auth': jwtClient,
                'ids': VIEW_ID,
                'start-date': startDate,
                'end-date': endDate,
                'dimensions':'ga:date,ga:day,ga:yearMonth,ga:userType',
                'metrics':'ga:users',

              }, function (err, response) {
                if (err)
                {
                   console.log(err);
                   return res.json(200, {status: 2, error_details: err});
                }
                 console.log(JSON.stringify(response.rows, null, 4));


                return res.json(200,{status:1,message:'success',result:response.rows});
              });
            }
},
getSettingsData:function(req,res){

                      var query = "SELECT * FROM settings";
                      Settings.query(query,function(err,result){
                        if(err){
                              console.log("errrr",err);
                              return res.json(200, {status: 2, error_details: err});
                        }else{
                              console.log("success in settings", result);
                              return res.json(200,{status:1,message:'success',result:result});
                        }
                      });

},

updateDitherCloseTime:function(req,res){

                      data =    {
                                   value:req.body.value
                                 };

                      criteria = {
                                    id:req.body.id
                                  };


                     Settings.update(criteria,data).exec(function(err,updatedData){
                        if(err)
                        {
                             console.log("update dither close time fail");
                             return res.json(200, {status: 2, error_details: err});
                        }
                        else
                        {
                            console.log("dither closing time updated");
                            return res.json(200,{status:1,message:'success',result:updatedData});
                        }
                    });
},

updateTokenExpiryTime:function(req,res){

                    data =    {
                                 value:req.body.value
                               };
                    criteria = {
                                    id:req.body.id
                                };


                 Settings.update(criteria,data).exec(function(err,updatedData){
                    if(err)
                    {
                         console.log("update token expiry time fail");
                         return res.json(200, {status: 2, error_details: err});
                    }
                    else
                    {
                        console.log("token expiry time updated");
                        return res.json(200,{status:1,message:'success',result:updatedData});
                    }
                });
},
 getDitherUsers: function(req, res){


                    query = "SELECT * FROM  `user` ORDER BY createdAt DESC";

                User.query(query, function(err, result) {
                    if(err)
                    {
                        // console.log(err);
                        return res.json(200, { status: 2, error_details: 'db error' });
                    }
                    else
                    {

                        //console.log(result);
                        return res.json(200, {status: 1, message: "success", data: result});
                    }
                });

    },
 getUsersBySearchName: function(req,res){
                    console.log("getUsersBySearchName ============== ADMIN");
                    var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                    var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                    var profile_image;
                    var name                        =     req.body.name;
                    var start                       =     req.body.start;
                    var count                       =     req.body.count;
                    var query;

                    /*var query   =   " SELECT id, name, email, profilePic as profileImage, phoneNumber, status, createdAt"+
                                    " FROM user WHERE name LIKE '"+name+"%'";*/
                    if((name == null)||(name =="")){
                        query = " SELECT id, name, email, profilePic as profileImage, phoneNumber, status, createdAt, "+
                                "(SELECT COUNT(user.id) from user) as length,"+
                                "(SELECT COUNT( clg.id ) FROM user usr INNER JOIN collage clg ON usr.id = clg.userId WHERE usr.id = user.id) as ditherCount"+
                                " FROM user ORDER BY createdAt DESC LIMIT "+start+","+count;
                    }else{
                        query = " SELECT id, name, email, profilePic as profileImage, phoneNumber, status, createdAt, "+
                                "(SELECT COUNT(user.id) from user WHERE name LIKE '"+name+"%') as length,"+
                                "(SELECT COUNT( clg.id ) FROM user usr INNER JOIN collage clg ON usr.id = clg.userId WHERE usr.id = user.id) as ditherCount"+
                                " FROM user WHERE name LIKE '"+name+"%' LIMIT "+start+","+count;
                    }
                    console.log(query);
                    User.query(query,function(err,result){
                        if(err){
                             console.log(err);
                             return res.json(200, {status: 2, error_details: err});
                        }else{
                           // console.log(result);
                            result.forEach(function(factor, index){
                                    if(factor.profileImage == null || factor.profileImage == ""){
                                            profile_image                   =     "";
                                    }else{
                                        var imageSrc                    =     factor.profileImage;
                                        var ext                         =     imageSrc.split('.');
                                        profile_image                   =     profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                    }
                                    factor.profilePic       =    profile_image;
                            });
                            return res.json(200, {status: 1, message: "success", data: result});
                        }
                    });

        },
 getUsersBySearchEmail: function(req,res){

                     var email = req.body.email;
                     var start = req.body.start;
                     var count = req.body.count;
                     var query;
                     if((email == null)||(email ==""))
                     {

                        query = "SELECT *,(SELECT COUNT(*) FROM user) as length FROM `user` ORDER BY createdAt DESC LIMIT "+start+","+count+"";

                     }
                     else
                     {

                        query = "SELECT *,(SELECT COUNT(*) FROM user WHERE email LIKE'"+email+"%') as length FROM user WHERE email LIKE '"+email+"%' ORDER BY createdAt DESC LIMIT "+start+","+count+"";

                     }

                     // console.log(query);
                     User.query(query,function(err,result){
                        if(err)
                        {
                            return res.json(200, {status: 2, error_details: err});
                        }
                        else
                        {
                            // console.log(result);
                            return res.json(200, {status: 1,message:"success", data:result});
                        }
                     });
        },
 getUsersBySearchMobile: function(req,res){

                      var mobile = req.body.mobile;
                      var start = req.body.start;
                      var count = req.body.count;
                      var query;
                      if((mobile ==null)||(mobile==""))
                      {

                        query = "SELECT *,(SELECT COUNT(*) FROM user) as length FROM `user` ORDER BY createdAt DESC LIMIT "+start+","+count+"";
                      }
                      else
                      {
                        query = "SELECT *,(SELECT COUNT(user.id) FROM user WHERE (phoneNumber LIKE '"+mobile+"%' OR phoneNumber LIKE '%"+mobile+"%')) as length FROM user WHERE (phoneNumber LIKE '"+mobile+"%' OR phoneNumber LIKE '%"+mobile+"%') ORDER BY createdAt DESC LIMIT "+start+","+count+"";
                      }

                        // console.log(query);
                      User.query(query,function(err,result){
                        if(err)
                        {
                            return res.json(200, {status: 2, error_details: err});
                        }
                        else
                        {
                            // console.log(result);
                            return res.json(200, {status: 1, message:"success", data:result});
                        }
                      });
        },
 checkMentionName:  function(req,res){
                    console.log(req.params.all());
                    var mentionId = req.body.mentionId;
                    console.log(mentionId);
                    var query = "SELECT u.id,u.name FROM user as u WHERE mentionId = '"+mentionId+"'";

                    User.query(query,function(err,result){
                        if(err)
                        {
                            return res.json(200,{status:2,error_details:err});
                        }
                        else
                        {
                            // console.log(result);
                            return res.json(200,{status:1,message:"success",data:result});
                        }
                    });

        },

getUsersByNameAndEmail :function(req,res){
                        console.log(req.params.all());
                        var name = req.body.name;
                        var email = req.body.email;
                        var start = req.body.start;
                        var count = req.body.count;console.log("inside name---->email");

                        var query ="SELECT *,(SELECT COUNT(*) FROM user WHERE name LIKE '"+name+"%' AND email LIKE '"+email+"%') as length FROM user WHERE name LIKE '"+name+"%' AND email LIKE '"+email+"%' ORDER BY createdAt LIMIT "+start+","+count+" ";
                        // console.log(query);
                        User.query(query,function(err,result){
                            if(err)
                            {
                                return res.json(200,{status:2,error_details:err});
                            }
                            else
                            {
                                 // console.log(result);
                                return res.json(200,{status:1,message:"success",data:result});
                            }
                        });

        },
getUsersByNameAndMob :function(req,res){
                        console.log(req.params.all());
                        var name = req.body.name;
                        var mobile = req.body.mobile;
                        var start = req.body.start;
                        var count = req.body.count;console.log("inside name---->mob");
                        var query;
                        if(!mobile){

                            query = "SELECT *,(SELECT COUNT(*) FROM user WHERE name LIKE '"+name+"%' ) as length FROM user WHERE name LIKE '"+name+"%'  ORDER BY createdAt LIMIT "+start+","+count+" ";

                        }else{

                            query ="SELECT *,(SELECT COUNT(*) FROM user WHERE name LIKE '"+name+"%' AND (phoneNumber LIKE '"+mobile+"%' OR phoneNumber LIKE '%"+mobile+"%')) as length FROM user WHERE name LIKE '"+name+"%' AND (phoneNumber LIKE '"+mobile+"%' OR phoneNumber LIKE '%"+mobile+"%') ORDER BY createdAt LIMIT "+start+","+count+" ";
                        }
                         console.log(query);
                        User.query(query,function(err,result){
                            if(err)
                            {
                                return res.json(200,{status:2,error_details:err});
                            }
                            else
                            {
                                  console.log(result);
                                return res.json(200,{status:1,message:"success",data:result});
                            }
                        });

        },
getUsersEmailAndMob :function(req,res){
                            console.log(req.params.all());
                            var email = req.body.email;
                            var mobile = req.body.mobile;
                            var start = req.body.start;
                            var count = req.body.count;console.log("inside email---->mob");
                            var query;

                            if(!mobile){

                                query = "SELECT *,(SELECT COUNT(*) FROM user WHERE email LIKE '"+email+"%') as length FROM user WHERE email LIKE '"+email+"%' ORDER BY createdAt LIMIT "+start+","+count+" ";

                            }else{
                                query ="SELECT *,(SELECT COUNT(*) FROM user WHERE email LIKE '"+email+"%' AND (phoneNumber LIKE '"+mobile+"%' OR phoneNumber LIKE '%"+mobile+"%')) as length FROM user WHERE email LIKE '"+email+"%' AND (phoneNumber LIKE '"+mobile+"%' OR phoneNumber LIKE '%"+mobile+"%') ORDER BY createdAt LIMIT "+start+","+count+" ";
                            }


                            // console.log(query);
                            User.query(query,function(err,result){
                                if(err)
                                {
                                    return res.json(200,{status:2,error_details:err});
                                }
                                else
                                {
                                     // console.log(result);
                                    return res.json(200,{status:1,message:"success",data:result});
                                }
                            });
        },

getUsersByNameEmailAndMob :function(req,res){
                            console.log(req.params.all());
                            var name = req.body.name;
                            var email = req.body.email;
                            var mobile = req.body.mobile;
                            var start = req.body.start;
                            var count = req.body.count;console.log("inside name-email-mob");

                            var query ="SELECT *,(SELECT COUNT(*) FROM user WHERE name LIKE '"+name+"%' AND email LIKE '"+email+"%' AND (phoneNumber LIKE '"+mobile+"%' OR phoneNumber LIKE '%"+mobile+"%')) as length FROM user WHERE name LIKE '"+name+"%' AND email LIKE '"+email+"%' AND (phoneNumber LIKE '"+mobile+"%' OR phoneNumber LIKE '%"+mobile+"%') ORDER BY createdAt LIMIT "+start+","+count+" ";

                            User.query(query,function(err,result){
                                if(err)
                                {
                                    return res.json(200,{status:2,error_details:err});
                                }
                                else
                                {
                                     // console.log(result);
                                    return res.json(200,{status:1,message:"success",data:result});
                                }
                            });

        },


         getDitherByName   : function(req,res){
                                console.log(req.params.all());
                                var start           =   req.body.start;
                                var count           =   req.body.count;
                                var name            =   req.body.name;
                                var ditherStatus    =   req.body.ditherStatus;
                                var query;
                                if(!ditherStatus && !name){ // search by null status name cleared
                                    console.log("status null and name cleared");
                                    // var query = "SELECT COUNT(*) as length,c.*,c.id as cid,u.*  FROM collage as c INNER JOIN user as u ON u.id=c.userId ORDER BY c.createdAt DESC LIMIT 0,10";
                                    query =    " SELECT c. * , c.id AS cid, u. * ,("+
                                               " SELECT COUNT( c.id )"+
                                               " FROM collage AS c"+
                                               " INNER JOIN user AS u ON u.id = c.userId"+
                                               " WHERE u.name LIKE '"+name+"%') AS length,"+
                                               " IF( (c.expiryDate < '"+todayISO+"') , 'close', 'open') AS ditherStatus"+
                                               " FROM collage AS c"+
                                               " INNER JOIN user AS u ON u.id = c.userId"+
                                               " WHERE u.name LIKE '"+name+"%'"+
                                               " ORDER BY c.createdAt DESC"+
                                               " LIMIT "+start+" , "+count+"";

                                }else if(!ditherStatus && name){ //search by name
                                    console.log("inside getDitherByName by name");
                                    // var query = "SELECT COUNT(*) as length,c.*,c.id as cid,u.*  FROM collage as c INNER JOIN user as u ON u.id=c.userId ORDER BY c.createdAt DESC LIMIT 0,10";
                                    query =    " SELECT c. * , c.id AS cid, u. * ,("+
                                               " SELECT COUNT( c.id )"+
                                               " FROM collage AS c"+
                                               " INNER JOIN user AS u ON u.id = c.userId"+
                                               " WHERE u.name LIKE '"+name+"%') AS length,"+
                                               " IF( (c.expiryDate < '"+todayISO+"') , 'close', 'open') AS ditherStatus"+
                                               " FROM collage AS c"+
                                               " INNER JOIN user AS u ON u.id = c.userId"+
                                               " WHERE u.name LIKE '"+name+"%'"+
                                               " ORDER BY c.createdAt DESC"+
                                               " LIMIT "+start+" , "+count+"";

                                }else if(ditherStatus =="active" && name){ // search by status == active  and name
                                    console.log("status  active and name ");
                                    query   =  " SELECT c. * , c.id AS cid, u. * ,("+
                                               " SELECT COUNT( c.id )"+
                                               " FROM collage AS c"+
                                               " INNER JOIN user AS u ON u.id = c.userId"+
                                               " WHERE c.expiryDate > '"+todayISO+"' AND u.name LIKE '"+name+"%') AS length,"+
                                               " IF( (c.expiryDate < '"+todayISO+"') , 'close', 'open') AS ditherStatus"+
                                               " FROM collage AS c"+
                                               " INNER JOIN user AS u ON u.id = c.userId"+
                                               " WHERE c.expiryDate > '"+todayISO+"'"+
                                               " AND u.name LIKE '"+name+"%'"+
                                               " ORDER BY c.createdAt DESC"+
                                               " LIMIT "+start+" , "+count+"";


                                }else if(ditherStatus =="inactive" && name){ // search by status == inactive  and name
                                    console.log("status inactive and name ");
                                    query   =  " SELECT c. * , c.id AS cid, u. * ,("+
                                               " SELECT COUNT( c.id )"+
                                               " FROM collage AS c"+
                                               " INNER JOIN user AS u ON u.id = c.userId"+
                                               " WHERE c.expiryDate < '"+todayISO+"' AND u.name LIKE '"+name+"%') AS length,"+
                                               " IF( (c.expiryDate < '"+todayISO+"') , 'close', 'open') AS ditherStatus"+
                                               " FROM collage AS c"+
                                               " INNER JOIN user AS u ON u.id = c.userId"+
                                               " WHERE c.expiryDate < '"+todayISO+"'"+
                                               " AND u.name LIKE '"+name+"%'"+
                                               " ORDER BY c.createdAt DESC"+
                                               " LIMIT "+start+" , "+count+"";


                                }else if(ditherStatus =="active" && !name){ // search by status active name cleared
                                    console.log("status active and name cleared");
                                    // var query = "SELECT COUNT(*) as length,c.*,c.id as cid,u.*  FROM collage as c INNER JOIN user as u ON u.id=c.userId ORDER BY c.createdAt DESC LIMIT 0,10";
                                    query =    " SELECT c. * , c.id AS cid, u. * ,"+
                                               " (SELECT COUNT( c.id ) FROM collage AS c INNER JOIN user AS u ON u.id = c.userId WHERE u.name LIKE '"+name+"%' AND c.expiryDate <'"+todayISO+"') AS length,"+
                                               " IF( (c.expiryDate < '"+todayISO+"') , 'close', 'open') AS ditherStatus"+
                                               " FROM collage AS c"+
                                               " INNER JOIN user AS u ON u.id = c.userId"+
                                               " WHERE u.name LIKE '"+name+"%' AND c.expiryDate > '"+todayISO+"'"+
                                               " ORDER BY c.createdAt DESC"+
                                               " LIMIT "+start+" , "+count+"";

                                }else if(ditherStatus =="inactive" && !name){ // search by status inactive name cleared
                                    console.log("status inactive and name cleared");
                                    // var query = "SELECT COUNT(*) as length,c.*,c.id as cid,u.*  FROM collage as c INNER JOIN user as u ON u.id=c.userId ORDER BY c.createdAt DESC LIMIT 0,10";
                                    query =    " SELECT c. * , c.id AS cid, u. * ,"+
                                               " (SELECT COUNT( c.id ) FROM collage AS c INNER JOIN user AS u ON u.id = c.userId WHERE u.name LIKE '"+name+"%' AND c.expiryDate <'"+todayISO+"') AS length,"+
                                               " IF( (c.expiryDate < '"+todayISO+"') , 'close', 'open') AS ditherStatus"+
                                               " FROM collage AS c"+
                                               " INNER JOIN user AS u ON u.id = c.userId"+
                                               " WHERE u.name LIKE '"+name+"%' AND c.expiryDate <'"+todayISO+"'"+
                                               " ORDER BY c.createdAt DESC"+
                                               " LIMIT "+start+" , "+count+"";

                                }


                            console.log(query);
                            Collage.query(query, function (err, result) {
                                if (err) {
                                    return res.json(200, {status: 2, error_details: err});
                                } else {
                                     console.log(result);
                                    return res.json(200, {status: 1, message: "success",
                                                    result: result
                                    });
                                }
                            });
    },
    getDitherByStatus    : function(req,res){

                            console.log(req.params.all());
                            var name            =   req.body.name;
                            var ditherStatus    =   req.body.ditherStatus;
                            var start           =   req.body.start;
                            var count           =   req.body.count;
                            var query;
                            if(ditherStatus){
                                console.log("ditherStatus --yes");
                            }
                            if(!ditherStatus){
                                console.log("ditherStatus --No");
                            }
                            console.log(req.body.status);


                            if(!name && !ditherStatus){ //search with name null and null dither status
                                    query = " SELECT c. * , c.id AS cid, u. * , ("+
                                               " SELECT COUNT( c.id )"+
                                               " FROM collage AS c"+
                                               " INNER JOIN user AS u ON u.id = c.userId"+
                                               " WHERE u.name LIKE '"+name+"%') AS length,"+
                                               " IF( (c.expiryDate < '"+todayISO+"') , 'close', 'open') AS ditherStatus"+
                                               " FROM collage AS c"+
                                               " INNER JOIN user AS u ON u.id = c.userId"+
                                               " WHERE u.name LIKE '"+name+"%'"+
                                               " ORDER BY c.createdAt DESC"+
                                               " LIMIT "+start+" , "+count+"";
                                    console.log("!name && !ditherStatus")
                            }else if(name && !ditherStatus){ //search with name and null dither status
                                    query = " SELECT c. * , c.id AS cid, u. * ,("+
                                               " SELECT COUNT( c.id )"+
                                               " FROM collage AS c"+
                                               " INNER JOIN user AS u ON u.id = c.userId"+
                                               " WHERE u.name LIKE '"+name+"%' ) AS length,"+
                                               " IF( (c.expiryDate < '"+todayISO+"') , 'close', 'open') AS ditherStatus"+
                                               " FROM collage AS c"+
                                               " INNER JOIN user AS u ON u.id = c.userId"+
                                               " WHERE u.name LIKE '"+name+"%'"+
                                               " ORDER BY c.createdAt DESC"+
                                               " LIMIT "+start+" , "+count+"";
                                    console.log("name && !ditherStatus")
                            }else if(name && ditherStatus =="active"){ //search by name ,status == active
                                    query   =  " SELECT c. * , c.id AS cid, u. * , ("+
                                               " SELECT COUNT( c.id )"+
                                               " FROM collage AS c"+
                                               " INNER JOIN user AS u ON u.id = c.userId"+
                                               " WHERE c.expiryDate > '"+todayISO+"' AND u.name LIKE '"+name+"%') AS length,"+
                                               " IF( (c.expiryDate > '"+todayISO+"') , 'open', 'close') AS ditherStatus"+
                                               " FROM collage AS c"+
                                               " INNER JOIN user AS u ON u.id = c.userId"+
                                               " WHERE c.expiryDate > '"+todayISO+"'"+
                                               " AND u.name LIKE '"+name+"%'"+
                                               " ORDER BY c.createdAt DESC"+
                                               " LIMIT "+start+" , "+count+"";

                                    console.log("name && ditherStatus == active");
                            }else if(name && ditherStatus =="inactive"){ //search by name ,status == inactive
                                    query   =  " SELECT c. * , c.id AS cid, u. * , ("+
                                               " SELECT COUNT( c.id )"+
                                               " FROM collage AS c"+
                                               " INNER JOIN user AS u ON u.id = c.userId"+
                                               " WHERE c.expiryDate < '"+todayISO+"' AND u.name LIKE '"+name+"%') AS length,"+
                                               " IF( (c.expiryDate < '"+todayISO+"') , 'close', 'open') AS ditherStatus"+
                                               " FROM collage AS c"+
                                               " INNER JOIN user AS u ON u.id = c.userId"+
                                               " WHERE c.expiryDate < '"+todayISO+"'"+
                                               " AND u.name LIKE '"+name+"%'"+
                                               " ORDER BY c.createdAt DESC"+
                                               " LIMIT "+start+" , "+count+"";

                                    console.log("name && ditherStatus == inactive");
                            }else if(!name && ditherStatus =="active"){ //search null name and dither status == active
                                    query   =  " SELECT c. * , c.id AS cid, u. * , ("+
                                               " SELECT COUNT( c.id )"+
                                               " FROM collage AS c"+
                                               " INNER JOIN user AS u ON u.id = c.userId"+
                                               " WHERE c.expiryDate > '"+todayISO+"') AS length,"+
                                               " IF( (c.expiryDate > '"+todayISO+"') , 'open', 'close') AS ditherStatus"+
                                               " FROM collage AS c"+
                                               " INNER JOIN user AS u ON u.id = c.userId"+
                                               " WHERE c.expiryDate > '"+todayISO+"'"+
                                               " ORDER BY c.createdAt DESC"+
                                               " LIMIT "+start+" , "+count+"";
                                    console.log("!name && ditherStatus == active")
                            }else if(!name && ditherStatus =="inactive"){ //search null name and dither status == inactive
                                    query   =  " SELECT c. * , c.id AS cid, u. * , ("+
                                               " SELECT COUNT( c.id )"+
                                               " FROM collage AS c"+
                                               " INNER JOIN user AS u ON u.id = c.userId"+
                                               " WHERE c.expiryDate < '"+todayISO+"') AS length,"+
                                               " IF( (c.expiryDate < '"+todayISO+"') , 'close', 'open') AS ditherStatus"+
                                               " FROM collage AS c"+
                                               " INNER JOIN user AS u ON u.id = c.userId"+
                                               " WHERE c.expiryDate < '"+todayISO+"'"+
                                               " ORDER BY c.createdAt DESC"+
                                               " LIMIT "+start+" , "+count+"";
                                    console.log("!name && ditherStatus == inactive")
                            }
                            console.log(query);
                            Collage.query(query, function (err, result) {
                                if (err){
                                    return res.json(200, {status: 2, error_details: err});
                                }else{
                                    //console.log(result);
                                    return res.json(200, {status: 1, message: "success",result: result});
                                }
                            });



    },

};

