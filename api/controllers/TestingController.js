/**
 * TestingController
 *
 * @description :: Server-side logic for managing testings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /* ==================================================================================================================================
               E-mail
        ==================================================================================================================================== */
        email: function (req, res) {

                var global_settingsKeyValue     =   req.options.settingsKeyValue;
                var email_to                    =   req.param("email_to");
                var receiver_name               =   req.param("receiver_name");
                if(!email_to || !receiver_name){
                                return res.json(200, {status: 2, status_type: 'Failure' , message: 'please pass email_to(Email addres) and receiver_name(Your name)'});
                }else{
                        var email_subject               =   'Welcome to Email Test';
                        var email_template              =   'email-test';
                        var email_context               =   {
                                                                receiverName    :   receiver_name,
                                                                pic             :   global_settingsKeyValue.CDN_IMAGE_URL + "images/profilePics/31db73cf-8305-4351-b075-ffe287dd7dab.jpg",
                                                                email_img_url   :   global_settingsKeyValue.CDN_IMAGE_URL + 'images/email/'
                                                            };
                        // Calling Email Service to send Mail
                        EmailService.sendEmail(global_settingsKeyValue, email_to,email_subject,email_template,email_context, function(err, sendEmailResults) {
                            if(err)
                            {
                                    console.log(err);
                                    console.log("async parallel in Mailpart Error");
                                    return res.json(200, {status: 2, status_type: 'Failure' , message: 'Some error occured in Email Send on signup', error_details: sendEmailResults});

                            }else{
                                    //console.log(results);
                                    console.log(email_to);
                                    console.log(email_subject);
                                    console.log(email_template);
                                    console.log(email_context);
                                    console.log("async parallel in Mailpart Success");
                                    return res.json(200, {status: 1, status_type: 'Success' , message: 'Succesfully completed the email Testing'});
                            }


                        });
                }
        },
};

