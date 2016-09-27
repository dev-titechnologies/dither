

module.exports = {

/*  =================================================================================================================================
            Function to Resize Image
    ================================================================================================================================== */
    imageResize: function (imageSrc,imageDst,callback) {

                    var im = require('imagemagick');
                    console.log("Image service Api  ====== image magick");
                    var fs = require('fs');
                    im.resize({
                      //srcData: fs.readFileSync('assets/images/abc.jpg', 'binary'),
                      srcData: fs.readFileSync(imageSrc, 'binary'),
                      width:   50
                    }, function(err, stdout, stderr){
                              if (err)
                              {
                                    //throw err;
                                      console.log(err);
                                      callback(true, {status: 2, status_type: "Failure", message: 'Some error occured resizing image', error_details: err});

                              }else{
                                      console.log("|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||");
                                      console.log(imageSrc);
                                      console.log(imageDst);
                                      console.log("|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||");
                                      //fs.writeFileSync('assets/images/profilePics/abc123.jpg', stdout, 'binary');
                                      fs.writeFileSync(imageDst, stdout, 'binary');

                                      callback(false, {status: 1, status_type: "Success", message: 'Successfully resized the image'});
                              }
                    });




                    //im.convert([imagename, '-resize', '50x50',imageThumb],
                    /*im.resize({
                          srcPath: 'http://192.168.1.62:5000/images/abc.jpg',
                          //srcPath: '/assets/images/abc.jpg',
                          dstPath: 'resized123.png',
                          //dstPath: 'http://192.168.1.62:5000/images/resized123.png',

                          width:   256
                        },
                    function(err, stdout, stderr){
                        if (err)
                        {
                            console.log(err)
                            callback(false, {status: 2, status_type: 'Failure' , message: 'Error in ThumbnailCreation'});
                        }
                        else
                        {


                            console.log('stderr:' + stderr);
                             console.log('stdout:'+stdout);
                             //callback(false, {status: 1, status_type: 'Success' , message: 'Thumbnail Creation success',imageResized:imageThumb});
                        }

                    });*/




                    /*console.log("image resizinggggggggg")
                    //------------------Testing Image Resize----------------------------------------------
                    //var thumbImage        = 'thumb'+imagename;
                    var ext        = imagename.split('/');
                    console.log(ext)
                    console.log(ext[3])
                    //var thumbImage = imagename.split('.');

                    var thumbnailsCreator = require('lwip-image-thumbnails-creator');
                    var options           = {outputbasepath: 'assets/images/profilePics/thumb'+ext[3]};
                    thumbnailsCreator.createThumbnail(imagename, {
                        maxWidth: 50,
                        maxHeight: 50
                    }, options).then(function (res) {
                        // ok
                        console.log(res.thumbnail.outputpath);
                        callback(false, {status: 1, status_type: 'Success' , message: 'Thumbnail Creation success',thumbImage:res.thumbnail.outputpath});

                    }, function (err) {
                        console.log(err)
                        callback(false, {status: 2, status_type: 'Failure' , message: 'Error in ThumbnailCreation'});

                    });*/
    }
};
