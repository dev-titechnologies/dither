/**
 * ReportUserController
 *
 * @description :: Server-side logic for managing reportusers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


/* ==================================================================================================================================
         To report against a User
==================================================================================================================================== */
        reportUser:  function (req, res) {

                    console.log("report  User ===== api");
                    var tokenCheck                  =     req.options.tokenCheck;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var reportType                  =     req.param('report_type');
                    var report                      =     req.param('description');
                    var received_userId             =     req.param('user_id');
                    console.log(reportType);
                    console.log(report);

                    if(!reportType || !received_userId){
                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please pass the report_type and description and user_id'});
                    }else{
                        ReportUser.findOne({reporterId: userId, userId: received_userId}).exec(function (err, foundReport){
                            if(err){
                                        console.log(err);
                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding user already reported or not ', error_details: err});
                            }else{
                                if(foundReport){
                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'You have already reported this User'});
                                }else{
                                    var values = {
                                            report                  :           report,
                                            reportType              :           reportType,
                                            reporterId              :           userId,
                                            userId                  :           received_userId,
                                    };
                                    ReportUser.create(values).exec(function(err, results){
                                        if(err){
                                                console.log(err);
                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in report user insertion', error_details: err});
                                        }else{
                                            console.log(results);
                                            return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully reported against the user'});
                                        }
                                    });
                                }
                            }
                        });
                    }
        },


/* ==================================================================================================================================
         To report against a Dither
==================================================================================================================================== */
        reportDither:  function (req, res) {

                    console.log("report  Dither ===== api");
                    var tokenCheck                  =     req.options.tokenCheck;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var reportType                  =     req.param('report_type');
                    var report                      =     req.param('description');
                    var collageId                   =     req.param('dither_id');
                    console.log(reportType);
                    console.log(report);

                    if(!reportType || !collageId){
                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please pass the report_type and description and dither_id'});

                    }else{
                        //To check the user already voted for this image or not
                        Collage.findOne({id: collageId}).exec(function (err, found){
                            if(err){
                                        console.log(err);
                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding collage is existing or not', error_details: err});
                            }else{
                                if(!found){
                                        return res.json(200, {status: 2, status_type: 'Failure' ,message: 'No collage Found'});
                                }else{
                                    ReportDither.findOne({reporterId: userId, collageId: collageId}).exec(function (err, foundReport){
                                        if(err){
                                                console.log(err);
                                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Finding user already reported or not ', error_details: err});
                                        }else{
                                            if(foundReport){
                                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'You have already reported this Dither'});
                                            }else{
                                                var values = {
                                                        report                  :           report,
                                                        reportType              :           reportType,
                                                        reporterId              :           userId,
                                                        collageId               :           collageId,
                                                };
                                                ReportDither.create(values).exec(function(err, results){
                                                    if(err){
                                                            console.log(err);
                                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in report Dither insertion', error_details: err});
                                                    }else{
                                                            console.log(results);
                                                            return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully reported against the Dither'});
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
        },
        /* ==================================================================================================================================
                        To Get ReportedUser List
        ==================================================================================================================================== */
        reportedUserList:  function (req, res) {

                    console.log("Reported Users List========api")
                    var tokenCheck                  =     req.options.tokenCheck;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var reportUserArray             =     [];
                    var query   =  " SELECT R.reporterId,U.name"+
                                   " FROM reportUser as R INNER JOIN user as U ON R.reporterId = U.id"+
                                   " where R.userId = '"+userId+"'";
                    console.log(query);
                    ReportUser.query(query, function(err, results) {
                        if(err){
                            console.log(err)
                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in get Reported User List', error_details: err});
                        }else{
                            if(!results.length){
                                    return res.json(200, {status: 2 ,status_type: 'Failure', message: 'No reportees found',
                                                        reportedUsers:reportUserArray
                                                        });
                            }else{
                                    results.forEach(function(factor, index){
                                            reportUserArray.push({
                                                                    userId      :   factor.reporterId,
                                                                    name        :   factor.name
                                                                });
                                    });
                                    console.log(reportUserArray)
                                    return res.json(200, {status: 1 ,status_type: 'Success', message: 'Successfully get Reportees',
                                                        reportedUsers:reportUserArray
                                                        });
                            }
                        }

                    });
        },


};

