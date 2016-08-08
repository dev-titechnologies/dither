/**
 * CollageCommentsController
 *
 * @description :: Server-side logic for managing collagecomments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

 /* ==================================================================================================================================
               To Comment a Dither
   ==================================================================================================================================== */
        commentDither:  function (req, res) {

                    console.log("Comment  Dithers ===== api");
                    console.log(req.param("dither_id"));
                    //console.log(req.param("user_id"));
                    console.log(req.param("comment_msg"));
                    var tokenCheck                  =     req.options.tokenCheck;
                    var userId                      =     tokenCheck.tokenDetails.userId;
                    var collageId                   =     req.param("dither_id");
                    var comment                     =     req.param("comment_msg");

                    var values = {
                        collageId       :       collageId,
                        userId          :       userId,
                        comment         :       comment,
                    };
                    CollageComments.create(values).exec(function(err, results){
                            if(err){
                                    console.log(err);
                                    return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Dither Comment Insertion', error_details: err});
                            }
                            else{
                                    console.log("inserted comments");
                                    console.log(results);
                                    return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully commented against the dither'});
                            }
                    });
        }
};

