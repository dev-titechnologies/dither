/**
 * SmsController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

//var io = require('sails.io.js')( require('socket.io-client') );

 

 module.exports = {

	/* ==================================================================================================================================
               To send OTP-Mobile verifictaion
     ==================================================================================================================================== */

      sendOTP:  function (req, res) {
           console.log("guytguyguy");
		    var smsAccountSid	= req.options.settingsKeyValue.SMS_ACCOUNT_SID;
			var smsAuthToken 	= req.options.settingsKeyValue.SMS_AUTH_TOKEN;
			var smsFrom 		= req.options.settingsKeyValue.SMS_FROM;
			var client 		    = require('twilio')(smsAccountSid, smsAuthToken); //API_KEY and TOCKEN from TWILIO
			

			
			var mobile	= req.param("mobile");
			
			//---------SMS SENDING-------------
			
			
			
			//Send an SMS text message
			
			SmsService.sendSms(smsAccountSid, smsAuthToken, smsFrom, function(err,sendSmsResults)  {
                                       if(err)
                                        {
                                                console.log(err);
                                               return res.json(200, {status: 2, status_type: 'Failure' , message: 'sms not reachable', error_details: sendSmsResults});

                                        }else{
                                                return res.json(200, {status: 1, status_type: 'Success' , message: 'OTP send Successfully'});
                                               
                                             }
                                      });
                                    
                                                  
			
	
			 }
			
			
			
};							
