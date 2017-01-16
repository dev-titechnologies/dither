module.exports = {

            sendSms: function (smsAccountSid, smsAuthToken, smsFrom,sms_arr,username, callback) {
					console.log("------service----SMS ARRAY-----------------")
					console.log(sms_arr)
					var twilio = require('twilio');
					var client = twilio(smsAccountSid, smsAuthToken);
					var NUM_ARR = sms_arr;
					if(NUM_ARR.length){
						NUM_ARR.forEach(function(factor, index){
							
								 client.sendMessage({

									//to:mobile, // Any number Twilio can deliver to
									to: factor,
									from: smsFrom, // A number you bought from Twilio and can use for outbound communications
									body: username+' has invited you on Dither,Click on the link to download the app https://goo.gl/wiLGM1'// body of the SMS message

								 }, function(err, message) {
									if (err) {
										console.log(err);
										console.error('Text failed because: '+err.message);
										//callback(true, {status: 2, status_type: 'Failure' , message: 'sms not reachable'});
									} else {
												//console.log(responseData.body
												sails.log("sucessssssssssssssss")
												//callback(false, {status: 1, status_type: 'Success' , message: 'OTP send Successfully'});
												
										   }
								});
                                       
                         },callback());
                         
						
					}
					else{
						callback();
					}
				

                      /*  sails.log("In sms Service");
                        sails.log(smsAccountSid);
                        sails.log(smsAuthToken);
                        var plivo   = require('plivo');
                        var p       = plivo.RestAPI({
                                                        authId      : smsAccountSid,
                                                        authToken   : smsAuthToken
                                                    });

                        var num_arr =   ['+91-8281442870','+919947632638']
                        var dest    =   '123';
                        for(i=0;i<num_arr.length;i++){
                            if(dest==''){
                                dest = num_arr[i];
                            }else{
                                dest = dest+'<'+num_arr[i];
                            }
                        }
                        console.log(dest)
                        var params  = {
                            'src'       : '+44 1629 304021', // Sender's phone number with country code
                            'dst'       : dest, // Receiver's phone Number with country code
                            'text'      : "Invitation for Dither", // Your SMS Text Message - English
                            'url'       : "http://example.com/report/", // The URL to which with the status of the message is sent
                            'method'    : "GET" // The method used to call the url
                        };
                        // Prints the complete response
                        p.send_message(params, function (status, response) {
                            console.log('Status: ', status);
                            console.log('API Response:\n', response);
                            console.log('Message UUID:\n', response['message_uuid']);
                            console.log('Api ID:\n', response['api_id']);
                            if(status==202){
                                callback(false, {status: 1, status_type: 'Success' , message: 'OTP send Successfully'});
                            }else{
                                callback(true, {status: 2, status_type: 'failure' , message: 'OTP sending failed!'});
                            }
                        });*/
            },

/*  =================================================================================================================================
            SMS OTP
    ================================================================================================================================== */

            sendSmsOTP: function (smsAccountSid, smsAuthToken, smsFrom,mobile,verification_code, callback){
                        /*var plivo   = require('plivo');
                        var p       = plivo.RestAPI({
                                                        authId      : smsAccountSid,
                                                        authToken   : smsAuthToken
                                                    });
                        var params  = {
                            'src'       : '+44 1629 304021', // Sender's phone number with country code
                            'dst'       : '+918281442870', // Receiver's phone Number with country code
                            'text'      : "Your Dither Verification Code is "+verification_code, // Your SMS Text Message - English
                            'url'       : "http://example.com/report/", // The URL to which with the status of the message is sent
                            'method'    : "GET" // The method used to call the url
                        };
                        // Prints the complete response
                        p.send_message(params, function (status, response) {
                            console.log('Status: ', status);
                            console.log('API Response:\n', response);
                            console.log('Message UUID:\n', response['message_uuid']);
                            console.log('Api ID:\n', response['api_id']);
                            if(status==202)
                            {
                                callback(true, {status: 1, status_type: 'Success' , message: 'OTP send Successfully'});
                            }
                            else
                            {
                                callback(false, {status: 2, status_type: 'failure' , message: 'OTP sending failed!'});
                            }
                        });*/
                        var twilio = require('twilio');
                        var client = twilio(smsAccountSid, smsAuthToken);
                         client.sendMessage({

                                //to:mobile, // Any number Twilio can deliver to
                                to: mobile,
                                from: smsFrom, // A number you bought from Twilio and can use for outbound communications
                                body: 'Your Verification Code is'+ verification_code// body of the SMS message

                             }, function(err, message) {
                                if (err) {
                                    console.log(err);
                                    console.error('Text failed because: '+err.message);
                                    callback(true, {status: 2, status_type: 'Failure' , message: 'sms not reachable'});
                                } else {
											//console.log(responseData.body
											sails.log("sucessssssssssssssss")
											callback(false, {status: 1, status_type: 'Success' , message: 'OTP send Successfully'});
											
                                       }
                        });
                       
                      // callback(false, {status: 1, status_type: 'Success' , message: 'OTP send Successfully'});
            },
};
