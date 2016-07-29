/**
 * HelperController
 *
 * @description :: Server-side logic for managing helpers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
        server_baseUrl : function(req, res, next) {
                        var protocol = req.connection.encrypted?'https':'http';
                        var baseUrl = protocol + '://' + req.headers.host + '/';
                        console.log(protocol);
                        console.log(baseUrl);
                        req.options.server_baseUrl = baseUrl;
                        next();
        },

        file_path : function(req, res, next) {

                        var profilePic_path         = "images/profilePics/";
                        var collageImg_path         = "images/collage/";
                        req.options.file_path = {
                                                    profilePic_path     : profilePic_path,
                                                    collageImg_path     : collageImg_path,
                                                };
                        next();
        },


};

