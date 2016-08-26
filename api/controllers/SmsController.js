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
					console.log("in sms controller");
					console.log(req.options)
					var smsAccountSid   = req.options.settingsKeyValue.SMS_ACCOUNT_SID;
					var smsAuthToken    = req.options.settingsKeyValue.SMS_AUTH_TOKEN;
					var smsFrom         = req.options.settingsKeyValue.SMS_FROM;
					console.log(smsAccountSid)
					console.log(smsAuthToken)                      
					//var client            = require('twilio')(smsAccountSid, smsAuthToken); //API_KEY and TOCKEN from TWILIO
					var mobile  = req.param("mobile");
					
					User.findOne({phoneNumber: req.param('mobile')}).exec(function (err, findUser)
					{
						if(err)
						{
							console.log(err);
							return res.json(200, {status: 2, status_type: 'Failure' , message: 'error occured in Mobile Number checking!'});

						}
						else
						{
							
						  if(typeof(findUser) == 'undefined')
						  {
					
								//---------SMS SENDING-------------
								var possible ="0123456789";
								var verification_code    = "";
								for(var i=0;i<4;i++)
									{
										verification_code += possible.charAt(Math.floor(Math.random()*possible.length)); // usertocken generation
									}         

								//Send an SMS text message
								SmsService.sendSmsOTP(smsAccountSid, smsAuthToken, smsFrom,mobile,verification_code, function(err,sendSmsResults)  {
											if(!err){
													console.log(err);
												return res.json(200, {status: 2, status_type: 'Failure' , message: 'mobile number is not valid', error_details: sendSmsResults});

											}else{
													sails.log(req.param("mobile"))
													var values = {
														OTPCode       	 : verification_code,
														mobile_no        : req.param("mobile")									
													};	 								
													Sms.create(values).exec(function(err, results){
														if(err)
															{
																sails.log("eror");
																return res.json(200, {status: 2, status_type: 'Failure' , message: 'Error occured in sending OTP'});
															}
														else
															{
																sails.log("result"+results)
																return res.json(200, {status: 1, status_type: 'Success' , message: 'OTP send Successfully',otp:verification_code});
															}
													});
											}
								});
						  }	
						  else
						  {
							  return res.json(200, {status: 2, status_type: 'Failure' , message: 'Mobile Number Already Exist!'});
						  }
					
						}
					});		
					
	    }



};
