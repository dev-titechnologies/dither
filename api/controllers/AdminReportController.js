/**
 * AdminReportController
 *
 * @description :: Server-side logic for managing adminreports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var todayISO           =   new Date().toISOString();
module.exports = {


/* ==================================================================================================================================
          Get all Report dither List
==================================================================================================================================== */
    getReportDitherList: function(req,res){
                console.log("getReportDitherList ===================== ADMIN");
                var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                var collageImg_path             =     server_image_baseUrl + req.options.file_path.collageImg_path;
                var collage_image;

                var query = " SELECT DISTINCT rd.collageId,"+
                            " u.name AS postedBy,"+
                            " c.image, c.imgTitle, c.status,"+
                            " COUNT( rd.collageId ) AS RepDitherCount,"+
                            " (SELECT usr.name FROM collage clg INNER JOIN user usr ON usr.id = clg.userId WHERE clg.id = c.id) as createdBy,"+
                            " IF( (c.expiryDate < '"+todayISO+"') ,  'close',  'open') AS ditherStatus"+
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
                        result.forEach(function(factor, index){
                                if(factor.image == null || factor.image == ""){
                                        collage_image                   =     "";
                                }else{
                                        var imageSrc                    =     factor.image;
                                        var ext                         =     imageSrc.split('.');
                                        collage_image                   =     collageImg_path + ext[0] + "_50x50" + "." +ext[1];
                                }
                                factor.image       =    collage_image;
                        });
                        return res.json(200, {status: 1, message: "success", result: result});
                    }
                });
    },
/* ==================================================================================================================================
          Get all Reports against a single dither
==================================================================================================================================== */
    getSingleDitherReport: function(req,res){
                        console.log("getSingleDitherReport ===================== ADMIN");
                        var ditherId            =           req.body.collageId;
                        var query   =   " SELECT"+
                                        " rd.report, rd.createdAt,"+
                                        " u.name, rt.description"+
                                        " FROM reportDither as rd"+
                                        " INNER JOIN user as u ON rd.reporterId = u.id"+
                                        " INNER JOIN reportType as rt ON rd.reportType = rt.reportId"+
                                        " WHERE"+
                                        " rd.collageId="+ditherId;
                        console.log(query);
                        ReportDither.query(query, function (err, result){
                            if(err){
                                return res.json(200, {status: 2, error_details: err});
                            }else{
                                return res.json(200, {status: 1, message: "success", result: result});
                            }
                        });
    },
/* ==================================================================================================================================
          To suspend a dither
==================================================================================================================================== */
    suspendDither: function(req,res){
                    console.log("suspendDither ===================== ADMIN");
                    var suspendDitherId         =       req.body.collageId;

                    var criteria                =       {id: suspendDitherId};
                    var data                    =       {status: 'inactive'};
                    Collage.update(criteria, data).exec(function (err, updatedData){
                        if(err){
                            return res.json(200, {status: 2, message: 'some error has occured', error_details: updatedData});
                        }else{
                            console.log("success");
                            return res.json(200, {status: 1, message: 'successfully suspended'});
                        }
                    });
    },
/* ==================================================================================================================================
          To release a dither
==================================================================================================================================== */
    releaseDither: function(req,res){
                    console.log("releaseDither ===================== ADMIN");
                    var releaseDitherId         =       req.body.collageId;

                    var criteria                =       {id: releaseDitherId};
                    var data                    =       {status: 'active'};
                    Collage.update(criteria, data).exec(function (err, updatedData){
                        if(err){
                            return res.json(200, {status: 2, message: 'some error has occured', error_details: updatedData});
                        }else{
                            console.log("success");
                            return res.json(200, {status: 1, message: 'successfully Released'});
                        }
                    });
    },


};

