module.exports = {
            sendEmail: function (email_to, email_subject, email_template, email_context, callback) {

                            var nodemailer = require('nodemailer');
                            var smtpTransport = require('nodemailer-smtp-transport');
                            var hbs = require('nodemailer-express-handlebars');
                            var options = {
                                viewEngine: {
                                    extname: '.hbs',
                                    layoutsDir: 'views/email/',
                                    defaultLayout: 'template',
                                    partialsDir: 'views/partials/'
                                },
                                viewPath: 'views/email/',
                                extName: '.hbs'
                            };
                            var sgTransport = require('nodemailer-sendgrid-transport');
                            //using sendgrid as transport, but can use any transport.
                            //var transporter = nodemailer.createTransport();
                            var transporter = nodemailer.createTransport(smtpTransport({
                                host: "smtp.gmail.com",
                                secureConnection: false, // use SSL
                                port: 465, // port for secure SMTP
                                auth: {
                                    user: "noreply@titechnologies.in",
                                    pass: "Noreply!@#"
                                }
                              }));
                             /* var transporter = nodemailer.createTransport(
                                  smtpTransport('smtps://testteamti@gmail.com :ti!@#$%^')
                               );*/



                            transporter.use('compile', hbs(options));
                            console.log(email_to);
                            transporter.sendMail({
                                //from: email_to,
                                from: "noreply@zentiera.com",
                                to: email_to,
                                subject: email_subject,
                                template: email_template,
                                context: email_context,

                            }, function (error, response) {
                                if (error)
                                {
                                    sails.log.debug('Some error occured ' + error);
                                    transporter.close();
                                    callback(false, {status: 2, message: 'email not reachable'});
                                }
                                else
                                {

                                    console.log("email Succcess in userservice")
                                    transporter.close();
                                    callback(false, {status: 1, message: 'success'});
                                }
                            });
            },

};
