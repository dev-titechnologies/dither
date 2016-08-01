module.exports = {

            sendSms: function (smsAccountSid, smsAuthToken, smsFrom,mobile, callback) {

						sails.log("In sms Service");
						sails.log(smsAccountSid);
						sails.log(smsAuthToken);

                        var twilio = require('twilio');


                        //Twilio Test Account Credentials
                        var accountSid = smsAccountSid;
                        var authToken  = smsAuthToken;
                        //var smsFrom    = '+15005550006';
                        var smsFrom    = smsFrom;
                        //var smsFrom    = '+12403564607';
                        var smsTo      = '+919746354170'; //Airtel
                        //var smsTo      = '+918281442870'; //Anumol
                        //var smsTo      = '+919746354170'; Bsnl
                        //var smsTo      = '+919809502603'; Vodafone
                        //var smsTo      = '+919526132793'; Idea

                        var client = twilio(accountSid, authToken);
                        //var client = require('twilio')('AC834e9d9c31bd1e8a5965f7f25f2b1250', '29f2e106b68b5aa5b7f2c2e9dcf935e5'); //API_KEY and TOCKEN from TWILIO
                        client.sendMessage({
                            to          :   mobile,
                            from        :   smsFrom,
                            body        :   'Hi Just Testing The Sms From Dither'
                        }, function(err, message) {
                                if (err) {
                                    console.log(err);
                                    console.error('Text failed because: '+err.message);
                                    callback(false, {status: 2, status_type: 'Failure' , message: 'email not reachable'});
                                } else {
                                    console.log('Text sent! Message SID: '+message.sid);
                                    console.log("smsFrom ====================== +++++++++++++++++++++++");
                                    console.log(smsFrom);
                                    console.log("smsTo ======================== +++++++++++++++++++++++");
                                    console.log(smsTo);
                                    callback(false, {status: 1, status_type: 'Success' , message: 'success'});
                                    //return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully send the sms'});
                                }
                        });
            },



            sendSmsOTP: function (smsAccountSid, smsAuthToken, smsFrom,mobile,verification_code, callback) {

						sails.log(smsAccountSid);
						sails.log(smsAuthToken);
                        console.log("service")
                        var twilio = require('twilio');
                        var client = twilio(smsAccountSid, smsAuthToken);

                        //Twilio Test Account Credentials
					  
                      

                        client.sendMessage({

                                //to:mobile, // Any number Twilio can deliver to
                                to: mobile,
                                from: smsFrom, // A number you bought from Twilio and can use for outbound communications
                                body: 'Your Verification Code is'+ verification_code// body of the SMS message

                             }, function(err, message) {
                                if (err) {
                                    console.log(err);
                                    console.error('Text failed because: '+err.message);
                                    callback(false, {status: 2, status_type: 'Failure' , message: 'sms not reachable'});
                                } else {
											//console.log(responseData.body
											sails.log("sucessssssssssssssss")
											callback(true, {status: 1, status_type: 'Success' , message: 'OTP send Successfully'});
											
                                       }
                        });
            },
};
