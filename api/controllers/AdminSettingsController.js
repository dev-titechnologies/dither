/**
 * AdminSettingsController
 *
 * @description :: Server-side logic for managing Adminsettings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /* ==================================================================================================================================
               Get settings table details
   ==================================================================================================================================== */
    getSettingsData:        function(req,res){
                                console.log("Inside AdminSETTINGS CONTROLLER");
                                var query = "SELECT * FROM settings";
                                Settings.query(query,function(err,result){
                                    if(err){
                                          console.log("errrr",err);
                                          return res.json(200, {status: 2, error_details: err});
                                    }else{
                                          //console.log("success in settings", result);
                                          return res.json(200,{status:1,message:'success',result:result});
                                    }
                                });
                                /*var TOKEN_EXPIRY_HOUR           =     req.options.settingsKeyValue.TOKEN_EXPIRY_HOUR;
                                var DITHER_EXPIRY_HOUR          =     req.options.settingsKeyValue.DITHER_EXPIRY_HOUR;
                                return res.json(200,{status:1,message:'success',
                                                        token_expiry_hour       :   TOKEN_EXPIRY_HOUR,
                                                        dither_expiry_hour      :   DITHER_EXPIRY_HOUR,
                                                        });*/
    },


 /* ==================================================================================================================================
               Get default Dither array
   ==================================================================================================================================== */
    getDefaultDitherData:  function(req,res){
                                console.log(req.options.settingsKeyValue);
                                var server_image_baseUrl        =     req.options.settingsKeyValue.CDN_IMAGE_URL;
                                var collageImg_path             =     server_image_baseUrl + req.options.file_path.collageImg_path;
                                var collageImg_path_assets      =     req.options.file_path.collageImg_path_assets;
                                var TOKEN_EXPIRY_HOUR           =     req.options.settingsKeyValue.TOKEN_EXPIRY_HOUR;
                                var DITHER_EXPIRY_HOUR          =     req.options.settingsKeyValue.DITHER_EXPIRY_HOUR;
                                var default_collage_Array       =     JSON.parse(req.options.settingsKeyValue.DEFAULT_DITHER);
                                var image, collage_image;

                                console.log("default_collage_Array length");
                                console.log(default_collage_Array.length);
                                default_collage_Array.forEach(function(factor, index){
                                    for(var i = 0;  i < default_collage_Array[index].length;   i++){
                                        image                                      =   collageImg_path+default_collage_Array[index][i].image;
                                        default_collage_Array[index][i].image      =   image;
                                    }
                                });
                                return res.json(200,{status:1,message:'success',
                                                        //token_expiry_hour       :   TOKEN_EXPIRY_HOUR,
                                                        //dither_expiry_hour      :   DITHER_EXPIRY_HOUR,
                                                        default_collage_Array   :   default_collage_Array
                                                        });

    },


    /* ==================================================================================================================================
               Update Settings table
   ==================================================================================================================================== */
    updateSettingsValue:  function(req,res){
                console.log(req.params.all());
                console.log("req.params.all() +++++++++++++++++++++++++++++");
                var data = req.param("data");
                if(!data.length){
                        return res.json(200,{status:2,message:'Please pass the values',
                                                    result      :   []
                                            });
                }else{
                        var updateArray   =  [];
                        data.forEach(function(factor, index){
                            updateArray.push("("+factor.id+",'"+factor.value+"', NOW(), NOW())");
                        });

                        var query = "INSERT INTO settings (id,value,createdAt,updatedAt) VALUES"+updateArray+
                                    " ON"+
                                    " DUPLICATE KEY"+
                                    " UPDATE value=VALUES(value)";
                        console.log(query);
                        Settings.query(query, function(err, updatedData){
                                if(err){
                                    console.log(err);
                                    return res.json(200, {status: 2, error_details: err});
                                }else{
                                    return res.json(200,{status:1,message:'success',
                                                result      :   updatedData
                                        });
                                }
                        });
                }
    },

   /* //Update dither close time
    updateDitherCloseTime:function(req,res){

                    var data    =    {
                                   value    :   req.body.value
                                 };

                    var criteria = {
                                    id      :   req.body.id
                                  };

                    Settings.update(criteria,data).exec(function(err,updatedData){
                        if(err){
                             console.log("update dither close time fail");
                             return res.json(200, {status: 2, error_details: err});
                        }else{
                            console.log("dither closing time updated");
                            return res.json(200,{status:1,message:'success',result:updatedData});
                        }
                    });
    },*/

 /* ==================================================================================================================================
              Change and Save default dithers
   ==================================================================================================================================== */

    changeDefaultDither :   function(req,res){
                                console.log(req.params.all());
                                var imageUploadDirectoryPath    =  '../../assets/images/collage';
                                var SubmitIdentity              = req.param("SubmitIdentity");
                                var collageArray                =   [];
                                var value                       = [];
                                var criteria, image, position;
                                console.log("inside change default dither=============");
                                req.file('Multiplefile').upload({dirname:imageUploadDirectoryPath, maxBytes: 100000000},function (err, files) {
                                    if (err){
                                        console.log("cannot upload not"+err);
                                        //callback();
                                    }else{
                                        var default_collage_Array               =       JSON.parse(req.options.settingsKeyValue.DEFAULT_DITHER);
                                        console.log("default_collage_Array length");
                                        console.log(default_collage_Array.length);
                                        console.log("default_collage_Array");
                                        console.log(default_collage_Array);
                                        files.forEach(function(factor, index){
                                             var uploadedfilename                   =    factor.fd.split('/');
                                             uploadedfilename                       =    uploadedfilename[uploadedfilename.length-1];
                                             collageArray.push({
                                                                    image       :   uploadedfilename,
                                                                    position    :   index

                                                                    });
                                        });
                                        var criteria        =   {
                                                                    key :   "DEFAULT_DITHER"
                                                                }
                                        var stringifiedData;
                                        switch(SubmitIdentity){
                                                    case "1":
                                                                default_collage_Array.splice(0, 1,collageArray);
                                                                console.log("inside case 1******************")
                                                                stringifiedData         =   JSON.stringify(default_collage_Array);
                                                                break;
                                                    case "2":
                                                                default_collage_Array.splice(1, 1,collageArray);
                                                                console.log("inside case 2******************")
                                                                stringifiedData         =   JSON.stringify(default_collage_Array);
                                                                break;
                                                    case "3":
                                                                default_collage_Array.splice(2, 1,collageArray);
                                                                console.log("inside case 3******************")
                                                                stringifiedData         =   JSON.stringify(default_collage_Array);
                                                                break;
                                                    case "4":
                                                                default_collage_Array.splice(3, 1,collageArray);
                                                                console.log("inside case 4******************")
                                                                stringifiedData         =   JSON.stringify(default_collage_Array);
                                                                break;
                                        }
                                        var data            =   {
                                                                    value:  stringifiedData
                                                                }
                                        console.log("SubmitIdentity")
                                        console.log(SubmitIdentity)
                                        console.log("SubmitIdentity")
                                        Settings.update(criteria,data).exec(function(err,updatedData){
                                            if(err){
                                                 console.log("collage Images can not inserted into table");
                                                 return res.json(200, {status: 2, error_details: err});
                                            }else{
                                                console.log("collage Images inserted into table");
                                                console.log(updatedData);
                                                return res.json(200,{status:1,message:'success',result:updatedData});
                                            }
                                        });
                                    }
                                });
    },

};

