/**
 * Notification Controller
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var util = require('util');

module.exports = {
	
	 /* ==================================================================================================================================
                Notification API
	   ==================================================================================================================================== */
		
		notification: function(req, res) {
			
			
				console.log("Notification API")
				console.log(req.get('token'))
				UsertokenService.checkToken(req.get('token'), function(err, tokenCheck) {
			
					if(err) 
					{	
						return res.json(200, {status: 2, msg: 'some error occured', error_details: tokenCheck});
					}
					else
					{ 
						
						
						
					}
					
					
				 //-----------Notification For Tagged In Users----------------------------------
				 
					
				 
				 
				 	
					
				});	
			
		},



};
