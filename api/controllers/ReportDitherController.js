/**
 * ReportDitherController
 *
 * @description :: Server-side logic for managing reportdithers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

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

                    if(!reportType || !report || !collageId){
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
                                                    }
                                                    else{
                                                            console.log(results);
                                                            return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully reported against the Dither'});
                                                    }
                                            });
                                    }
                                }
                            });
                    }

        },

};

