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
                    var other_user_id               =     req.param('user_id');
                    console.log(reportType);
                    console.log(report);

                    if(!reportType || !report || !other_user_id){
                                return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Please pass the report_type and description and user_id'});

                    }else{
                            var values = {
                                    report                  :           report,
                                    reportType              :           reportType,
                                    reporterId              :           userId,
                                    userId                  :           other_user_id,
                            };
                            ReportUser.create(values).exec(function(err, results){
                                    if(err){
                                            console.log(err);
                                            return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in report user insertion', error_details: err});
                                    }
                                    else{
                                            console.log(results);
                                            return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully reported against the user'});
                                    }
                            });
                    }

        },

};

