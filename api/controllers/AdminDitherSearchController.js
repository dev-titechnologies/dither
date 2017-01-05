/**
 * AdminDitherSearchController
 *
 * @description :: Server-side logic for managing admindithersearches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var todayISO           =   new Date().toISOString();
module.exports = {

     /* ==================================================================================================================================
               Search in dither list(name,type(open,close))
     ==================================================================================================================================== */

    getAllDithers   : function(req,res){

                        console.log("=======AdminditherControllerr===========");
                        console.log(req.params.all());
                        var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                        var collageImg_path             =     server_image_baseUrl + req.options.file_path.collageImg_path;
                        var collageImg_path_assets      =     req.options.file_path.collageImg_path_assets;
                        var collage_image, collage_image_242x242;
                        var start                       =   req.body.start;
                        var count                       =   req.body.count;
                        var name                        =   req.body.name;
                        var ditherStatus                =   req.body.ditherStatus;
                        var received_userId             =   req.body.userId;
                        var query;
                        var userIdCheck;
                        var outerOrderBy                =    " ORDER BY ditherStatus DESC, c.createdAt DESC LIMIT "+start+" , "+count;
                        if(received_userId){
                            userIdCheck = " AND u.id = "+received_userId;
                        }else{
                            userIdCheck = "";
                        }

                        if(!ditherStatus && !name){ // search by null status name cleared
                            console.log("status null and name cleared");
                            query =   " SELECT c.id, c.imgTitle,c.totalVote,c.createdAt,c.image, u.name,"+
                                       " (SELECT COUNT( c.id ) FROM collage AS c INNER JOIN user AS u ON u.id = c.userId AND u.type != 1 "+userIdCheck+
                                       " ) AS length,"+
                                       " IF( (c.expiryDate > '"+todayISO+"') , 'open', 'close') AS ditherStatus"+
                                       " FROM collage AS c"+
                                       " INNER JOIN user AS u ON u.id = c.userId"+
                                       " WHERE u.type != 1"+userIdCheck+
                                       outerOrderBy;


                        }else if(!ditherStatus && name){ //search by name
                            console.log("inside getDitherByName by name");
                            query =    " SELECT c.id, c.imgTitle,c.totalVote,c.createdAt,c.image, u.name,"+
                                       " (SELECT COUNT( c.id ) FROM collage AS c INNER JOIN user AS u ON u.id = c.userId WHERE u.name LIKE '"+name+"%'  AND u.type != 1 "+userIdCheck+
                                       " ) AS length,"+
                                       " IF( (c.expiryDate < '"+todayISO+"') , 'close', 'open') AS ditherStatus"+
                                       " FROM collage AS c"+
                                       " INNER JOIN user AS u ON u.id = c.userId"+
                                       " WHERE u.name LIKE '"+name+"%' AND u.type != 1"+userIdCheck+
                                       outerOrderBy;

                        }else if(ditherStatus =="active" && name){ // search by status == active  and name
                            console.log("status  active and name ");
                            query   = " SELECT c.id, c.imgTitle,c.totalVote,c.createdAt,c.image, u.name,"+
                                       " (SELECT COUNT( c.id ) FROM collage AS c INNER JOIN user AS u ON u.id = c.userId WHERE c.expiryDate > '"+todayISO+"' AND u.name LIKE '"+name+"%'  AND u.type != 1 "+userIdCheck+
                                       " ) AS length,"+
                                       " IF( (c.expiryDate < '"+todayISO+"') , 'close', 'open') AS ditherStatus"+
                                       " FROM collage AS c"+
                                       " INNER JOIN user AS u ON u.id = c.userId"+
                                       " WHERE c.expiryDate > '"+todayISO+"'"+
                                       " AND u.name LIKE '"+name+"%' AND u.type != 1"+userIdCheck+
                                       outerOrderBy;


                        }else if(ditherStatus =="inactive" && name){ // search by status == inactive  and name
                            console.log("status inactive and name ");
                            query   =  " SELECT c.id, c.imgTitle,c.totalVote,c.createdAt,c.image, u.name,"+
                                       " (SELECT COUNT( c.id ) FROM collage AS c INNER JOIN user AS u ON u.id = c.userId WHERE c.expiryDate < '"+todayISO+"' AND u.name LIKE '"+name+"%'  AND u.type != 1 "+userIdCheck+
                                       " ) AS length,"+
                                       " IF( (c.expiryDate < '"+todayISO+"') , 'close', 'open') AS ditherStatus"+
                                       " FROM collage AS c"+
                                       " INNER JOIN user AS u ON u.id = c.userId"+
                                       " WHERE c.expiryDate < '"+todayISO+"'"+
                                       " AND u.name LIKE '"+name+"%'  AND u.type != 1"+userIdCheck+
                                       outerOrderBy;

                        }else if(ditherStatus =="active" && !name){ // search by status active name cleared
                            console.log("status active and name cleared");
                            query =    " SELECT c.id, c.imgTitle,c.totalVote,c.createdAt,c.image, u.name,"+
                                       " (SELECT COUNT( c.id ) FROM collage AS c INNER JOIN user AS u ON u.id = c.userId WHERE c.expiryDate > '"+todayISO+"' AND u.type != 1 "+userIdCheck+
                                       " ) AS length,"+
                                       " IF( (c.expiryDate < '"+todayISO+"') , 'close', 'open') AS ditherStatus"+
                                       " FROM collage AS c"+
                                       " INNER JOIN user AS u ON u.id = c.userId"+
                                       " WHERE u.name LIKE '"+name+"%' AND c.expiryDate > '"+todayISO+"'  AND u.type != 1"+userIdCheck+
                                       outerOrderBy;

                        }else if(ditherStatus =="inactive" && !name){ // search by status inactive name cleared
                            console.log("status inactive and name cleared");
                            query =    " SELECT c.id, c.imgTitle,c.totalVote,c.createdAt,c.image, u.name,"+
                                       " (SELECT COUNT( c.id ) FROM collage AS c INNER JOIN user AS u ON u.id = c.userId WHERE  c.expiryDate < '"+todayISO+"'  AND u.type != 1 "+userIdCheck+
                                       " ) AS length,"+
                                       " IF( (c.expiryDate < '"+todayISO+"') , 'close', 'open') AS ditherStatus"+
                                       " FROM collage AS c"+
                                       " INNER JOIN user AS u ON u.id = c.userId"+
                                       " WHERE u.name LIKE '"+name+"%' AND c.expiryDate <'"+todayISO+"'  AND u.type != 1"+userIdCheck+
                                       outerOrderBy;

                        }
                        console.log(query);
                        var results             =       [];
                        async.series([
                                    function(callback) {
                                                Collage.query(query, function (err, result){
                                                    if(err){
                                                        //return res.json(200, {status: 2, error_details: err});
                                                        callback();
                                                    }else{
                                                            results  = result;
                                                            callback();
                                                    }
                                                });
                                    },
                                    function(callback){
                                                console.log("INSIDE foreach callback........");
                                                var count = 0;
                                                results.forEach(function(factor, index){
                                                        count++;
                                                        var imageSrc                    =     collageImg_path_assets + factor.image;
                                                        var ext                         =     imageSrc.split('/');
                                                        ext                             =     ext[ext.length-1].split('.');
                                                        var imgWidth,
                                                            imgHeight,
                                                            imageDst;

                                                        async.series([
                                                                function(callback) {
                                                                            imgWidth                    =    242;
                                                                            imgHeight                   =    242;
                                                                            imageDst                    =     collageImg_path_assets + ext[0] + "_"+imgWidth+"x"+imgHeight+"." +ext[1];
                                                                            ImgResizeService.imageResizeWH(imgWidth, imgHeight, imageSrc, imageDst, function(err, imageResizeResults) {
                                                                                    if(err){
                                                                                            console.log(err);
                                                                                            console.log("Error in image resize 160 in collagedetails!!!!");
                                                                                            callback();
                                                                                    }else{
                                                                                            callback();
                                                                                    }
                                                                            });
                                                                            //callback();

                                                                },
                                                        ],function(err){
                                                                    if(err){
                                                                        console.log(err);
                                                                        //callback();
                                                                    }else{
                                                                        console.log("Loop success");
                                                                        //collage-Details images
                                                                        if(factor.image == null || factor.image == ""){
                                                                                collage_image           =     "";
                                                                                collage_image_242x242   =     "";
                                                                        }else{
                                                                                var imageSrc                    =     collageImg_path_assets + factor.image;
                                                                                var ext                         =     imageSrc.split('/');
                                                                                ext                             =     ext[ext.length-1].split('.');
                                                                                collage_image                   =     collageImg_path + factor.image;
                                                                                collage_image_242x242           =     collageImg_path + ext[0] + "_242x242." +ext[1];
                                                                        }
                                                                        factor.image            =     collage_image;
                                                                        factor.image_242x242    =     collage_image_242x242;
                                                                        console.log(factor.image_242x242);
                                                                        if(count == results.length){
                                                                                callback();
                                                                        }
                                                                    }
                                                        });

                                                });

                                    },
                        ],function(err){
                                    if(err){
                                        console.log(err);
                                        //callback();
                                        return res.json(200, {status: 2, message: "Failure"
                                                        });
                                    }else{
                                            //console.log("Results ---------- >>>>>>>>>");
                                            //console.log(results);
                                             return res.json(200, {status: 1, message: "success",
                                                                    result: results
                                                        });
                                    }
                        });

    },

};

