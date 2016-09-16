

module.exports = {

/*  =================================================================================================================================
            Function to Resize Image
    ================================================================================================================================== */
    imageResize: function (imagename,callback) {


								
					console.log("image resizinggggggggg")
					//------------------Testing Image Resize----------------------------------------------
					//var thumbImage        = 'thumb'+imagename;
					var ext    	   = imagename.split('/');
					console.log(ext)
					console.log(ext[3])
					//var thumbImage = imagename.split('.');
					
					var thumbnailsCreator = require('lwip-image-thumbnails-creator');
					var options 		  = {outputbasepath: 'assets/images/profilePics/thumb'+ext[3]};
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

					});
	}
};
