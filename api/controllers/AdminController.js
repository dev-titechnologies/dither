
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
         console.log("inside getSingleDitherDetails function"+ditherId);
        var query = "SELECT c.*,u.*, cd.image as singImage,cd.vote as individualVote  FROM collage as c LEFT JOIN user as u ON u.id=c.userId LEFT JOIN collageDetails as cd ON c.id=cd.collageId  where c.id="+ditherId+" ORDER BY c.id ASC";
        console.log(query);
                    Collage.query(query, function (err, result) {
                        if (err) {
                            return res.json(200, {status: 2, error_details: err});
                        } else {
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
        //var user_id = 27;
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
    
};

