

module.exports = {

/*  =================================================================================================================================
            Function to Resize Image
    ================================================================================================================================== */
    imageResize: function (imagename,userId,callback) {


			require('lwip').open('assets/images/profilePics/'+imagename, function(err, image) {
						if(err)
						  {
							  console.log(err)
							  console.log("Errorrrrrrrrrrrrrrrrrrr")
							  //return res.json(200, {status: 2,status_type: 'Failure', message: 'Image Not Found'});
						  }
						  else
						  {
									var ext    	   = imagename.split('.').pop();
									var thumbImage = imagename.split('.');
									console.log(ext)
									thumbImage 	  = thumbImage[thumbImage.length-2];
									thumbImage	  = thumbImage + '_50*50';
									thumbImage	  =	thumbImage + '.'+ext;
									console.log("888888888888888888888888888888888888888888")
									console.log(thumbImage)
									image.resize(50, 50, function(err, rzdImg) {
										rzdImg.writeFile('assets/images/profilePics/'+thumbImage, function(err) {
											if(err)
											  {
												  console.log("Error")
												  callback(false, {status: 2, status_type: 'Failure' , message: 'Error in ThumbnailCreation'});
											  }
											  else
											  {
												  console.log(rzdImg)
												  console.log("success")
												  
												    var data     = {thumbImage:thumbImage};
                                                    var criteria = {id: userId};
                                                    User.update(criteria,data).exec(function(err, data) {
                                                        if(err)
                                                        {
                                                            sails.log(err)
                                                            callback();
                                                        }
                                                        else
                                                        {
                                                           console.log("record updated")
                                                           callback(false, {status: 1, status_type: 'Success' , message: 'Thumbnail Creation success',image:thumbImage});
                                                        }


                                                    });
			  
											  }
											});
									});
						  }	
			});
	}
};
