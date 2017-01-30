/**
 * SmsController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 module.exports = {
    /* ==================================================================================================================================
               To send OTP-Mobile verifictaion
     ==================================================================================================================================== */

        sendOTP:  function (req, res) {
                    console.log("sendOTP      =======================");
                    console.log(req.params.all());
                    var smsAccountSid       = req.options.settingsKeyValue.SMS_ACCOUNT_SID;
                    var smsAuthToken        = req.options.settingsKeyValue.SMS_AUTH_TOKEN;
                    var smsFrom             = req.options.settingsKeyValue.SMS_FROM;
                    var mobile              = req.param("mobile");
                    var email               = req.param("email");
                    var mention_id          = req.param("mention_id");
                    var message;
                    console.log(smsAccountSid)
                    console.log(smsAuthToken)
                    if(!mobile || !email || !mention_id){
                            return res.json(200, {status: 2, status_type: 'Failure' , message: 'Please pass mobile , email and mention_id'});
                    }else{
                            //var client            = require('twilio')(smsAccountSid, smsAuthToken); //API_KEY and TOCKEN from TWILIO
                            var query = "SELECT phoneNumber,email,mentionId FROM user where phoneNumber = '"+mobile+"' OR email = '"+email+"' OR mentionId= '"+mention_id+"'";
                            console.log(query);
                            User.query(query,function(err, getResult){
                            //User.find({phoneNumber: req.param('mobile'),email:email,mentionId:mention_id}).exec(function (err, getResult)
                                if(err){
                                    console.log(err);
                                    return res.json(200, {status: 2, status_type: 'Failure' , message: 'error occured while checking!'});
                                }else{
                                    console.log(getResult);
                                    mention_id 			= 	mention_id.toLowerCase();
                                    email	   			= 	email.toLowerCase();
                                    var resEmail 		= 	getResult[0].email;
                                    resEmail			= 	resEmail.toLowerCase();
                                    
                                    var resMentionId 	= 	getResult[0].mentionId;
                                    resMentionId		= 	resMentionId.toLowerCase();
                                    
                                    console.log(mention_id)
                                    console.log(resMentionId)
                                    console.log(email)
                                    console.log(resEmail)
                                    
                                    if(getResult.length){
                                        if(resEmail == email){
											console.log("1")
                                            message = "Email already exists";
                                        }else if(resMentionId == mention_id){
											console.log("2")
                                            message = "Username already exists";
                                        }else if(getResult[0].phoneNumber == mobile){
											console.log("3")
                                            message = "Phone number already exits";
                                        }
                                        else{
											console.log("4")
											message = "null";
										}
                                        console.log(getResult);
                                        //var msg=0;
                                        console.log(message)
                                        return res.json(200, {status: 2, status_type: 'Failure' , message: message});
                                    }else{
                                        //---------SMS SENDING-------------
                                        var possible              = "0123456789";
                                        var verification_code     = "";
                                        for(var i=0;i<4;i++){
                                                verification_code += possible.charAt(Math.floor(Math.random()*possible.length)); // usertoken generation
                                        }

                                        //Send an SMS text message
                                        SmsService.sendSmsOTP(smsAccountSid, smsAuthToken, smsFrom,mobile,verification_code, function(err,sendSmsResults)  {
                                            if(err){
													console.log("mobile resulttttttttttttt")
                                                    console.log(err);
                                                    return res.json(200, {status: 2, status_type: 'Failure' , message: 'mobile number is not valid', error_details: sendSmsResults});
                                            }else{
                                                    sails.log(req.param("mobile"))
                                                    var values = {
                                                        OTPCode          : verification_code,
                                                        mobile_no        : req.param("mobile")
                                                    };
                                                    Sms.create(values).exec(function(err, results){
                                                        if(err){
                                                                sails.log("eror");
                                                                return res.json(200, {status: 2, status_type: 'Failure' , message: 'Error occured in sending OTP'});
                                                        }else{
                                                                console.log("SMS success ========="+verification_code);
                                                                return res.json(200, {status: 1, status_type: 'Success' , message: 'OTP send Successfully',otp:verification_code});
                                                        }
                                                    });
                                            }
                                        });
                                    }
                                }
                            });
                    }
        }
};
