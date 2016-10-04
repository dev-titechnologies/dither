

var fs          = require('fs');

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
    },
    
    isImageExist: function (imageSrc,imageDst,callback) {
		
	 fs.exists(imageDst, function(exists) {
		if (exists) {
			console.log("Resized Image Exists")	
			callback();	
		}
		else
		{

			ImgResizeService.imageResize(imageSrc, imageDst, function(err, imageResizeResults) {
				if(err)
				{
						console.log(err);
						
				}else{
						 console.log(imageResizeResults);
						 console.log("8888888888888888888888"+item.resized_image)
						 callback();


				}
			});
		}
		
	  });	
	},
    
    
    
};
