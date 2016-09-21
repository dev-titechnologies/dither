/**
 * AdminController
 *
 * @description :: Server-side logic for managing Admin
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var fs          = require('fs');
 var request     = require('request');
 var path        = require('path');

module.exports = {
	//   List all users
    getCompleteUser: function(req, res){
		
			
                    query = "SELECT * FROM  `user` ";
				
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
		
			
                    query = "SELECT u.id,u.profilePic,u.status, u.name, COUNT( ru.userId ) AS RepUserCount FROM reportUser AS ru LEFT JOIN user AS u ON u.id = ru.userId GROUP BY ru.userId LIMIT 0 , 30";
				
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
        var query = "SELECT c.*,c.id as cid,u.*  FROM collage as c LEFT JOIN user as u ON u.id=c.userId ORDER BY c.id ASC";
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
        
        var query = "SELECT rd . *,u.name AS username,c.imgTitle,c.status FROM reportDither AS rd LEFT JOIN user AS u ON rd.reporterId = u.id LEFT JOIN collage AS c ON c.id = rd.collageId";
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
        var criteria = {id: 200};
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
        var criteria = {id: 200};
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
    
};
    
