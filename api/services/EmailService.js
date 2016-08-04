module.exports = {
            sendEmail: function (global_settingsKeyValue, email_to, email_subject, email_template, email_context, callback) {

                    //Email credentials from settings table
                    console.log("Email Service")
                    var host        = global_settingsKeyValue.EMAIL_HOST;
                    var port        = parseInt(global_settingsKeyValue.EMAIL_PORT);
                    var user        = global_settingsKeyValue.EMAIL_AUTH_USERNAME;
                    var pass        = global_settingsKeyValue.EMAIL_AUTH_PASSWORD;
                    var from        = global_settingsKeyValue.EMAIL_FROM;
                    console.log(host)
                    console.log(port)
                    console.log(user)
                    console.log(pass)
                    console.log(from)
                    console.log(email_to)
                    var nodemailer = require('nodemailer');
                    console.log("require nodemailer")
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
                    console.log("require nodemailer-transport")
                    var transporter = nodemailer.createTransport(smtpTransport({
                        host: host,
                        secureConnection: false, // use SSL
                        port: port, // port for secure SMTP
                        auth: {
                            user: user,
                            pass: pass
                        }
                      }));
                      console.log("require nodemailer-transport2")
                     /* var transporter = nodemailer.createTransport(
                          smtpTransport('smtps://testteamti@gmail.com :ti!@#$%^')
                       );*/



                    transporter.use('compile', hbs(options));
                    console.log(email_to);
                    transporter.sendMail({
                        //from: email_to,
                        from: from,
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
