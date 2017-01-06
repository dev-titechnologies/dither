var fs          =   require('fs');
var im          =   require('imagemagick');

module.exports = {

/*  =================================================================================================================================
            Function to Resize Image
    ================================================================================================================================== */
    imageResize: function (imageSrc,imageDst,callback) {

                    var im = require('imagemagick');
                    console.log("Image service Api  ====== image magick");
                    im.resize({
                      //srcData: fs.readFileSync('assets/images/abc.jpg', 'binary'),
                      srcData: fs.readFileSync(imageSrc, 'binary'),
                      width:   70
                    }, function(err, stdout, stderr){
                              if (err)
                              {
                                    //throw err;
                                      console.log(err);
                                      callback(true, {status: 2, status_type: "Failure", message: 'Some error occured resizing image', error_details: err});

                              }else{
                                      fs.writeFileSync(imageDst, stdout, 'binary');

                                      callback(false, {status: 1, status_type: "Success", message: 'Successfully resized the image'});
                              }
                    });
    },

    isImageExist: function (imageSrc,imageDst,callback) {

        fs.exists(imageDst, function(exists) {
            if(exists){
                callback();
            }else{
                ImgResizeService.imageResize(imageSrc, imageDst, function(err, imageResizeResults) {
                    if(err){
                            console.log(err);
                            console.log("is image exist error");
                            callback();
                    }else{
                             callback();
                    }
                });
            }

        });
    },
/*  =================================================================================================================================
            Function to Resize Image with both Height and Width
    ================================================================================================================================== */
    imageResizeWH: function (imgWidth, imgHeight, imageSrc,imageDst,callback) {

                    console.log("imageResizeWH Service >>>>>>>");
                    im.resize({
                      //srcData: fs.readFileSync('assets/images/abc.jpg', 'binary'),
                      srcData: fs.readFileSync(imageSrc, 'binary'),
                      width:   imgWidth,
                      width:   imgHeight
                    }, function(err, stdout, stderr){
                              if (err)
                              {
                                    //throw err;
                                      console.log(err);
                                      callback(true, {status: 2, status_type: "Failure", message: 'Some error occured resizing image', error_details: err});
                                      callback();

                              }else{
                                      fs.writeFileSync(imageDst, stdout, 'binary');
                                      callback(false, {status: 1, status_type: "Success", message: 'Successfully resized the image'});
                                      //callback();
                              }
                    });
    },



};
