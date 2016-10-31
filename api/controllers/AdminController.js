
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
 // var  googleapis = require('googleapis');
 // var  key        = require('service-account-credentials.json');
 // const VIEW_ID   = 'ga:130989248';
  
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
    	//   List all users
     getCompleteUser: function(req, res){

		
			
                    query = "SELECT * FROM  `user` ORDER BY createdAt DESC ";
				
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
    // View Details of every single User
    getUserDetails: function(req, res){
					userId=req.body.userId;
                    query = "SELECT * FROM  `user` WHERE id="+userId;
				
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
		
			
                    query = "SELECT u.id,u.profilePic,u.status, u.name, COUNT( ru.userId ) AS RepUserCount FROM reportUser AS ru LEFT JOIN user AS u ON u.id = ru.userId GROUP BY ru.userId ORDER BY u.createdAt DESC ";
				
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
    
    // Get One User Reported List
    getReportList: function(req, res){
		
			console.log(req.body.userId);
                    query = "SELECT u.profilePic, u.name, rt.description, ru.report, ru.createdAt FROM reportUser AS ru LEFT JOIN user AS u ON u.id = ru.reporterId LEFT JOIN reportType AS rt ON rt.id = ru.reportType WHERE ru.userId ="+req.body.userId+" LIMIT 0 , 30";
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
    
    /************************************************************* SULTHAN AREA ******************************************************/
        /**  get all dither **/
    getAllDithers: function(req,res){
        console.log("inside getAllDithers function");
        var query = "SELECT c.*,c.id as cid,u.*  FROM collage as c LEFT JOIN user as u ON u.id=c.userId ORDER BY c.createdAt DESC ";
        console.log(query);
                    Collage.query(query, function (err, result) {
                        if (err) {
                            return res.json(200, {status: 2, error_details: err});
                        } else {
                            
                            return res.json(200, {status: 1, message: "success", result: result});
                        }
                    });
    },

    /** Get each dither details **/
    getSingleDitherDetails: function(req,res){
         var ditherId=req.body.id;
            // var ditherId = 507;
         console.log("inside getSingleDitherDetails function"+ditherId);
         var query = "SELECT c.*,u.*, cd.image as singImage,cd.vote as individualVote FROM collage as c LEFT JOIN user as u ON u.id=c.userId LEFT JOIN collageDetails as cd ON c.id=cd.collageId  where c.id="+ditherId+" ORDER BY c.id DESC";

        console.log(query);
                    Collage.query(query, function (err, result) {
                        if (err) {
                            return res.json(200, {status: 2, error_details: err});
                        } else {
                            console.log(result);
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
       var query = "SELECT DISTINCT rd.collageId,u.name AS postedBy,c.imgTitle,c.status, COUNT( rd.collageId ) AS RepDitherCount FROM reportDither AS rd INNER JOIN collage AS c ON c.id=rd.collageId INNER JOIN user AS u ON c.userId=u.id GROUP BY rd.collageId ORDER BY rd.createdAt";

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
                   " C.image as dither_image"+
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
        var query = "SELECT c.*,c.id as cid,u.*  FROM collage as c LEFT JOIN user as u ON u.id=c.userId WHERE c.userId = "+user_id+" ORDER BY c.createdAt DESC ";
        Collage.query(query,function(err,result){
            if(err){
                console.log("some error check query");
                  return res.json(200, {status: 2, error_details: err});
            }else{
                console.log(result);
                 return res.json(200,{status:1,message:'success',result:result});           
            }
        });

    },
    getComments:function(req,res){
     console.log("inside getcomment fnsssss");
     var collageId = req.body.id;
     // var collageId = 300;
     var query = "SELECT u.name as commentedPerson,u.id as commentedPersonId,u.profilePic,cc.comment,cc.createdAt as commentedDate FROM collageComments as cc JOIN user as u ON cc.userId = u.id WHERE cc.collageId = "+collageId+" ORDER BY cc.createdAt DESC ";
                  // "WHERE cc.collageId = "+collageId+" ORDER BY cc.createdAt DESC";
      CollageComments.query(query,function(err,result){
        if(err){
            console.log("errrRRRRRRRRR");
        }else{
            console.log(result);
            return res.json(200,{status:1,message:'success',result:result});
        }
      });           
    },  
//     getDoughnutData:function(req,res){
//            var jwtClient = new googleapis.auth.JWT(
//       key.client_email, null, key.private_key,
//       ['https://www.googleapis.com/auth/analytics.readonly'], null);
//     jwtClient.authorize(function (err, tokens) {
//       if (err) {
//         console.log(err);
//         return;
//       }
//       var analytics = googleapis.analytics('v3');
//       queryData(analytics);
//     });
//      function queryData(analytics) {
//       analytics.data.ga.get({
//         'auth': jwtClient,
//         'ids': VIEW_ID,
//         // 'metrics': 'ga:uniquePageviews',
//         // 'dimensions': 'ga:pagePath',
//         // 'start-date': '30daysAgo',
//         // 'end-date': 'yesterday',
//         // 'sort': '-ga:uniquePageviews',
//         // 'max-results': 10,
//         // 'filters': 'ga:pagePath=~/ch_[-a-z0-9]+[.]html$',
//         'start-date': '30daysAgo',
//         'end-date': 'yesterday',
//         'dimensions':'ga:mobileDeviceInfo',
//         'metrics':'ga:sessions',
//         //'segment': 'mobile',
//       }, function (err, response) {
//         if (err) {
//           console.log(err);
//           return;
//         }
//         // console.log(JSON.stringify(response.rows, null, 4));
//         return res.json(200,{status:1,message:'success',result:response.rows});
//       });  
//     }
// },
// getMapData:function(req,res){
//     var jwtClient = new googleapis.auth.JWT(
//     key.client_email, null, key.private_key,
//     ['https://www.googleapis.com/auth/analytics.readonly'], null);
//     jwtClient.authorize(function (err, tokens) {
//       if (err) {
//         console.log(err);
//         return;
//       }
//       var analytics = googleapis.analytics('v3');
//       queryData1(analytics);
//     });
//      function queryData1(analytics) {
//       analytics.data.ga.get({
//         'auth': jwtClient,
//         'ids': VIEW_ID,        
//         'start-date': 'today',
//         'end-date': 'today',
//         'dimensions':'ga:countryIsoCode,ga:country',        
//         'metrics':'ga:sessions,ga:users',
//       }, function (err, response) {
//         if (err) {
//           console.log(err);
//           return;
//         }
//         // console.log(JSON.stringify(response.rows, null, 4));
//         return res.json(200,{status:1,message:'success',result:response.rows});
//       });  
//     }
     
// }, 
// getBarChartData:function(req,res){
//       var jwtClient = new googleapis.auth.JWT(
//     key.client_email, null, key.private_key,
//     ['https://www.googleapis.com/auth/analytics.readonly'], null);
//     jwtClient.authorize(function (err, tokens) {
//       if (err) {
//         console.log(err);
//         return;
//       }
//       var analytics = googleapis.analytics('v3');
//       queryData1(analytics);
//     });
//       function queryData1(analytics) {
//       analytics.data.ga.get({
//         'auth': jwtClient,
//         'ids': VIEW_ID,        
//         'start-date': 'today',
//         'end-date': 'today',
//         'dimensions':'ga:browser',        
//         'metrics':'ga:sessions',        
//       }, function (err, response) {
//         if (err) {
//           console.log(err);
//           return;
//         }
//         // console.log(JSON.stringify(response.rows, null, 4));
//         return res.json(200,{status:1,message:'success',result:response.rows});
//       });  
//     }
// },
// getPieChartData:function(req,res){
//       var jwtClient = new googleapis.auth.JWT(
//     key.client_email, null, key.private_key,
//     ['https://www.googleapis.com/auth/analytics.readonly'], null);
//     jwtClient.authorize(function (err, tokens) {
//       if (err) {
//         console.log(err);
//         return;
//       }
//       var analytics = googleapis.analytics('v3');
//       queryData1(analytics);
//     });
//       function queryData1(analytics) {
//       analytics.data.ga.get({
//         'auth': jwtClient,
//         'ids': VIEW_ID,        
//         'start-date': 'today',
//         'end-date': 'today',
//         'dimensions':'ga:sessionCount,ga:date',   
//         'metrics':'ga:sessions,ga:avgSessionDuration,ga:users,ga:percentNewSessions',        
//       }, function (err, response) {
//         if (err) {
//           console.log(err);
//           return;
//         }
//         // console.log(JSON.stringify(response.rows, null, 4));
//         return res.json(200,{status:1,message:'success',result:response.rows});
//       });  
//     }
// }, 
// getLineChartData:function(req,res){
//       var jwtClient = new googleapis.auth.JWT(
//     key.client_email, null, key.private_key,
//     ['https://www.googleapis.com/auth/analytics.readonly'], null);
//     jwtClient.authorize(function (err, tokens) {
//       if (err) {
//         console.log(err);
//         return;
//       }
//       var analytics = googleapis.analytics('v3');
//       queryData1(analytics);
//     });
//       function queryData1(analytics) {
//       analytics.data.ga.get({
//         'auth': jwtClient,
//         'ids': VIEW_ID,        
//         'start-date': 'today',
//         'end-date': 'today',
//         'dimensions':'ga:sessionCount,ga:sessionDurationBucket,ga:yearMonth,ga:date',   
//         'metrics':'ga:sessions',
//         'sort':'ga:date',
//       }, function (err, response) {
//         if (err) {
//           console.log(err);
//           return;
//         }
//         console.log(JSON.stringify(response.rows, null, 4));
//         return res.json(200,{status:1,message:'success',result:response.rows});
//       });  
//     }
// },
// getSettingsData:function(req,res){
//   var query = "SELECT * FROM settings";

//   Settings.query(query,function(err,result){
//     if(err){
//       console.log("errrr",err);
//     }else{
//       console.log("success in settings");
//       return res.json(200,{status:1,message:'success',result:result});
//     }
//   });
// },



    
};

