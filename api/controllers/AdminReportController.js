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

                var query = " SELECT temp.* FROM ("+
                            " SELECT"+
                            " rd.collageId,"+
                            " u.name AS postedBy,"+
                            " c.image, c.imgTitle, c.status,"+
                            " rd.report, rd.id as reportId, rd.createdAt as reportDate,"+
                            " ( SELECT COUNT(rd.collageId) FROM reportDither rd INNER JOIN collage clg ON clg.id = rd.collageId WHERE clg.id = c.id) AS RepDitherCount,"+
                            " (SELECT usr.name FROM collage clg INNER JOIN user usr ON usr.id = clg.userId WHERE clg.id = c.id) as createdBy,"+
                            " IF( (c.expiryDate < '"+todayISO+"') ,  'close',  'open') AS ditherStatus"+
                            " FROM reportDither AS rd"+
                            " INNER JOIN collage AS c ON c.id = rd.collageId"+
                            " INNER JOIN user AS u ON rd.reporterId = u.id"+
                            " ORDER BY rd.createdAt DESC) as temp"+
                            " GROUP BY temp.collageId"+
                            " ORDER BY temp.ditherStatus DESC, temp.RepDitherCount DESC, temp.reportDate DESC";
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
                        var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                        var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                        var profile_image;
                        var ditherId                    =     req.body.collageId;

                        var query   =   " SELECT"+
                                        " rd.report, rd.createdAt,"+
                                        " u.name, u.profilePic, rt.description"+
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
                                result.forEach(function(factor, index){
                                        if(factor.profilePic == null || factor.profilePic == ""){
                                                profile_image                   =     "";
                                        }else{
                                                var imageSrc                    =     factor.profilePic;
                                                var ext                         =     imageSrc.split('.');
                                                profile_image                   =     profilePic_path + ext[0] + "_50x50" + "." +ext[1];
                                        }
                                        factor.profilePic       =    profile_image;
                                });
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


/* ==================================================================================================================================
          Get all Report User List
==================================================================================================================================== */
    getReportUserList: function(req, res){
                console.log("getReportUserList  ====> ADMIN");
                var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                var profilePic_path             =     server_image_baseUrl + req.options.file_path.profilePic_path;
                var profile_image;
                var query = " SELECT temp.* FROM ("+
                            " SELECT"+
                            " u.id, u.profilePic as profileImage,u.status, u.name,"+
                            " ru.report, ru.id as reportId, ru.createdAt as reportDate,"+
                            " ( SELECT COUNT(cru.userId) FROM reportUser cru INNER JOIN user usr ON usr.id = cru.userId WHERE cru.userId = ru.userId) AS RepUserCount"+
                            " FROM reportUser AS ru"+
                            " INNER JOIN user AS u ON u.id = ru.userId"+
                            " ORDER BY ru.createdAt DESC) as temp"+
                            " GROUP BY temp.id"+
                            " ORDER BY temp.reportDate DESC, temp.RepUserCount DESC";
                console.log(query);
                User.query(query, function(err, result) {
                    if(err){
                        console.log(err);
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
                        return res.json(200, {status: 1, message: "success", data: result});
                    }
                });

    },

/* ==================================================================================================================================
          Get all Reports against a single dither
==================================================================================================================================== */
    getSingleUserReport: function(req, res){
                console.log("getSingleUserReport  ====> ADMIN");
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

};

