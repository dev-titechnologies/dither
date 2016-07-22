module.exports = {

            sendSms: function (callback) {

                    var accountSid = "AC5652cf99b933599eec08782c90d4f0dd";
                    var authToken  = "9a4ae2f86e7b3b272541f0c8aef8e2a7";
                    var smsFrom    = '+15005550006';
                    var smsTo      = '+919746354170'; //Airtel
                    //var smsTo      = '+919746354170'; Bsnl
                    //var smsTo      = '+919809502603'; Vodafone
                    //var smsTo      = '+919526132793'; Idea




                    var twilio = require('twilio');
                    var client = twilio(accountSid, authToken);

                    client.sendMessage({
                        to          :   smsTo,
                        from        :   smsFrom,
                        body        :   'Hi Just Testing The Sms From Dither'
                    }, function(err, message) {
                        if (err) {
                            console.log(err);
                            console.error('Text failed because: '+err.message);
                            callback(false, {status: 2, message: 'email not reachable'});
                        } else {
                            console.log('Text sent! Message SID: '+message.sid);
                            console.log("smsFrom ====================== +++++++++++++++++++++++");
                            console.log(smsFrom);
                            console.log("smsTo ======================== +++++++++++++++++++++++");
                            console.log(smsTo);
                            callback(false, {status: 1, message: 'success'});
                        }
                    });


            },

};


 /*let twilio = SMSService('twilio', {
                      sender: '+123456789',
                      recipient: [],
                      message: 'Hey, there!',
                      provider: {
                        accountSid      : accountSid,
                        authToken       : authToken
                      }
                    });

                    twilio
                        .send({
                            recipient: ['+09746354170'],
                            message: 'You can override here predefined config'
                        }, function (err, response) {
                                if (err)
                                {
                                    console.log(err);
                                    callback(false, {status: 2, message: 'email not reachable'});
                                }
                                else
                                {
                                    console.log("SMS Succcess in service");
                                    callback(false, {status: 1, message: 'success'});
                                }
                        });
                      //.then(console.log.bind(console))
                      //.catch(console.error.bind(console));*/
