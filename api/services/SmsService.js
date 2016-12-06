module.exports = {

            sendSms: function (smsAccountSid, smsAuthToken, smsFrom,mobile, callback) {

						sails.log("In sms Service");
						sails.log(smsAccountSid);
						sails.log(smsAuthToken);
						
						var plivo 	= require('plivo');
						var p 		= plivo.RestAPI({
														authId		: smsAccountSid,
														authToken	: smsAuthToken
													});
													
						var num_arr	=	['+91-8281442870','+919947632638']
						var dest	=	'123';
						for(i=0;i<num_arr.length;i++)
						{
							if(dest=='')
							{
								dest = num_arr[i];
							}
							else
							{
								dest = dest+'<'+num_arr[i];
							}
						}
						console.log(dest)

						var params  = {
							'src': '+44 1629 304021', // Sender's phone number with country code
							'dst' : dest, // Receiver's phone Number with country code
							'text' : "Invitation for Dither", // Your SMS Text Message - English
							'url' : "http://example.com/report/", // The URL to which with the status of the message is sent
							'method' : "GET" // The method used to call the url
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
						});
						

                      
            },



            sendSmsOTP: function (smsAccountSid, smsAuthToken, smsFrom,mobile,verification_code, callback) {

						
                        
                        var plivo 	= require('plivo');
						var p 		= plivo.RestAPI({
														authId		: smsAccountSid,
														authToken	: smsAuthToken
													});

						var params  = {
							'src': '+44 1629 304021', // Sender's phone number with country code
							'dst' : '+918281442870', // Receiver's phone Number with country code
							'text' : "Your Dither Verification Code is "+verification_code, // Your SMS Text Message - English
							'url' : "http://example.com/report/", // The URL to which with the status of the message is sent
							'method' : "GET" // The method used to call the url
						};

						// Prints the complete response
						/*p.send_message(params, function (status, response) {
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
                       callback(true, {status: 1, status_type: 'Success' , message: 'OTP send Successfully'});
                        
            },
};
