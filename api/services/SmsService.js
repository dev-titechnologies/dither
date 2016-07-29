module.exports = {
            sendSms: function (smsAccountSid, smsAuthToken, smsFrom, callback) {


                        var twilio = require('twilio');
                        var client = twilio(smsAccountSid, smsAuthToken);

                        //Twilio Test Account Credentials
                       
					   var verification_code	= "";
						for(var i=0;i<4;i++)
						{
							verification_code += possible.charAt(Math.floor(Math.random()*possible.length)); // usertocken generation
							sails.log()
						}
                        client.sendMessage({

								to:mobile, // Any number Twilio can deliver to
								from: smsFrom, // A number you bought from Twilio and can use for outbound communications
								body: 'Your Verification Code is'+ verification_code// body of the SMS message

							 }, function(err, message) {
                                if (err) {
                                    console.log(err);
                                    console.error('Text failed because: '+err.message);
                                    callback(false, {status: 2, status_type: 'Failure' , message: 'sms not reachable'});
                                } else {
                                    console.log(responseData.body)
											
											var OTPCode = verification_code;
											
											Sms.query("INSERT INTO smsDetails(OTPCode) values('"+OTPCode+"')",function(err, results){
												if(err)
													{
														sails.log("eror")
													}
												else
													{
														sails.log(results)
														callback(true, {status: 1, status_type: 'Success' , message: 'OTP send Successfully'});

														

													}
												});	
												
                                    //return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully send the sms'});
                                }
                        });
            },
};
