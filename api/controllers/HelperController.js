/**
 * HelperController
 *
 * @description :: Server-side logic for managing helpers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
        server_baseUrl : function(req, res, next) {
                        if(!req.isSocket){
                            var protocol = req.connection.encrypted?'https':'http';
                            var baseUrl = protocol + '://' + req.headers.host + '/';
                            console.log(protocol);
                            console.log(baseUrl);
                            req.options.server_baseUrl = baseUrl;
                        }

                        next();
        },

        file_path : function(req, res, next) {

                        var profilePic_path                =     "images/profilePics/";
                        var collageImg_path                =     "images/collage/";
                        var commentImage_path              =     "images/comment/";

                        var profilePic_path_assets         =     "assets/images/profilePics/";
                        var collageImg_path_assets         =     "assets/images/collage/";
                        var commentImg_path_assets         =     "assets/images/comment/";

                        req.options.file_path = {
                                                    profilePic_path         :   profilePic_path,
                                                    collageImg_path         :   collageImg_path,
                                                    commentImage_path       :   commentImage_path,
                                                    profilePic_path_assets  :   profilePic_path_assets,
                                                    collageImg_path_assets  :   collageImg_path_assets,
                                                    commentImg_path_assets  :   commentImg_path_assets,
                                                };
                        next();
        },

        global : function(req, res, next) {

                        var data_view_limit         = 20;
                        req.options.global = {
                                                    data_view_limit     : data_view_limit,
                                             };
                        next();
        },


};

