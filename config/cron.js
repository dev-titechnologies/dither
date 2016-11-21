//schedule: '*/5 * * * *'
module.exports.cron = {
    myFirstJob: {
        schedule: '* * * * * *',
        onTick: function () {
            var today = new Date().toISOString().slice(0, 19).replace('T', ' ');
            Collage.find({expiryDate:today }).exec(function(err, collageDetails){
                if(err){
                   console.log(err)
                }else{
                    if(collageDetails.length){
                        var userArr = [];
                        var device_Arr = [];
                        collageDetails.forEach(function(factor, index){
                            var values ={
                                notificationTypeId  :   8,
                                userId              :   factor.userId,
                                ditherUserId        :   factor.userId,
                                collage_id          :   factor.id
                            }
                            NotificationLog.create(values).exec(function(err, createdNotificationTags){
                                    if(err){
                                            console.log(err)
                                    }else{
                                            User_token.find({userId: factor.userId}).exec(function (err, getDeviceId){
                                                if(err){
                                                        console.log(err);
                                                }else{
                                                    var message     =  'Dither Closing Notification';
                                                    var ntfn_body   =  "Your Dither has been Expired";
                                                    getDeviceId.forEach(function(factor, index){
                                                        device_Arr.push(factor.deviceId);
                                                    });
                                                    if(device_Arr.length){
                                                            var data        =  {
                                                                            message             :   message,
                                                                            device_id           :   device_Arr,
                                                                            NtfnBody            :   ntfn_body,
                                                                            NtfnType            :   8,
                                                                            id                  :   factor.id,
                                                                            notification_id     :   createdNotificationTags.id
                                                                            };
                                                            NotificationService.NotificationPush(data, function(err, ntfnSend){
                                                                    if(err){
                                                                        console.log("Error in Push Notification Sending")
                                                                        console.log(err)
                                                                    }else{
                                                                        console.log("Notification sended")
                                                                        return {"msg":"haii"};
                                                                    }
                                                            });
                                                    }
                                                }
                                            });
                                    }
                            });
                        });
                    }
                }

            });
        }
    },
};
