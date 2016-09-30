
var PusherService  = require('sails-service-pusher');

module.exports = {

	
	/*=================================================================================================================================
            PUSH Notification Service
    ================================================================================================================================== */
     
    
	
	//-----------IOS---------------------------------	
	
	pushNtfnApn: function(data, callback) 
	{
		console.log("Push Notification Apn")
		ios = PusherService('ios', {
			device: [data.device_id], // Array of string with device tokens
			provider: {
				cert: 'assets/push_Ntfn_certificates/PushChatCert.pem', // The filename of the connection certificate to load from disk
				key: 'assets/push_Ntfn_certificates/PushChatKey.pem', // The filename of the connection key to load from disk
				ca: [], // An array of trusted certificates
				pfx: '', // File path for private key, certificate and CA certs in PFX or PKCS12 format
				passphrase: '123456789', // The passphrase for the connection key
				production: false, // Specifies which environment to connect to: Production (if true) or Sandbox
				voip: false, // Enable when you are using a VoIP certificate to enable paylods up to 4096 bytes
				port: 2195, // Gateway port
				rejectUnauthorized: true, // Reject Unauthorized property to be passed through to tls.connect()
				cacheLength: 1000, // Number of notifications to cache for error purposes
				autoAdjustCache: true, // Whether the cache should grow in response to messages being lost after errors
				maxConnections: 1, // The maximum number of connections to create for sending messages
				connectTimeout: 10000, // The duration of time the module should wait, in milliseconds
				connectionTimeout: 3600000, // The duration the socket should stay alive with no activity in milliseconds
				connectionRetryLimit: 10, // The maximum number of connection failures that will be tolerated before apn will "terminate"
				buffersNotifications: true, // Whether to buffer notifications and resend them after failure
				fastMode: false // Whether to aggresively empty the notification buffer while connected
			  },
			  notification: {
				title: 'iOS Test Push', // Indicates notification title
				body: 'Hey, there!', // Indicates notification body text
				icon: '', // Indicates notification icon
				sound: '', // Indicates sound to be played
				badge: '', // Indicates the badge on client app home icon
				payload: {} // Custom data to send within Push Notification
			  }
			});
			
			console.log(ios)
			
	
			ios
			  .send([data.device_id], {
				body: data.NtfnBody
			  })
			  .then(console.log.bind(console))
			  .catch(console.error.bind(console));
			  callback();
	
	
	},
	
	//-----------ANDROID---------------------------------
	
	pushNtfnGcm: function(data, callback) 
	{
		
		console.log("Push Notification GCM")
		console.log(data)
		console.log(data.device_id)
		console.log("counttttttttttttttttttt"+data.device_id.length)
		var ntfnArr = [];
		ntfnArr	 	= data.device_id;
		console.log("neww devicee  arrayyyyyy")
		console.log(ntfnArr)
		
		var details ={message:data.NtfnBody,type:data.NtfnType,id:data.id};
		 android = PusherService('android', {
			  
				device: [], // Array of string with device tokens
				provider: {
							apiKey		: 'AIzaSyAtRgo9lBqb-bMhyxqfNnNILthdyRNkiLg', // Your Google Server API Key
							maxSockets	: 0, // Max number of sockets to have open at one time
							proxy		: '' // This is [just like passing a proxy on to request](https://github.com/request/request#proxies)
						 },
				notification: {
							title	: 'Android Test Push', // Indicates notification title
							body	: data.NtfnBody, // Indicates notification body text
							icon	: '', // Indicates notification icon
							sound	: '', // Indicates sound to be played
							badge	: '', // Indicates the badge on client app home icon
							payload : {}// Custom data to send within Push Notification
						},			
		 });
		console.log(android)
		console.log("device arrayyyyyyyyyyyyyyyyy")
		console.log(ntfnArr)
		android
			.send(ntfnArr, {
             		body: details
				})
			.then(console.log.bind(console))
			.catch(console.error.bind(console));
			 callback();
	},	
	
	
	
//console.error.bind(console)

//===============================================END OF PUSH==========================================================================================

 /* =============================================================================================================================================
										SERVICE FOR IN APP NOTIFICATION 
	==============================================================================================================================================
	
	
	NtfnInAPP: function(data, callback) 
	{
		
			var values ={
							notificationTypeId  :   data.notificationTypeId,
							userId              :   data.userId,
							ditherUserId        :   data.ditherUserId,
							collage_id          :   data.collage_id,
							description         :   data.description
						}
						
			console.log(values)
		 
		    NotificationLog.create(values).exec(function(err, createdNotificationTags) {
					if(err){
						console.log(err);
						callback(true, {status: 2, status_type: "Failure", message: 'Some error occured in inserting collage commented users', error_details: err});
					}else{
						var creator_roomName  = "socket_user_"+collageDetails.userId;
						sails.sockets.broadcast(creator_roomName,{
																type                       :       "notification",
																id                         :       collageId,
																user_id                    :       userId,
																message                    :       "Comment Dither - Room Broadcast - to Creator",
																//roomName                   :       creator_roomName,
																//subscribers                :       sails.sockets.subscribers(creator_roomName),
																//socket                     :       sails.sockets.rooms(),
																notification_type          :       3,
																notification_id            :       createdNotificationTags.id
																});
						//-----------------------------End OF NotificationLog---------------------------------
						
					   User.findOne({id:data.ditherUserId}).exec(function (err, notifySettings){
						if(err)
						{
							console.log(err)
							callback(true, {status: 2, status_type: "Failure", message: 'Some error occured in retrieving user details', error_details: err});
						}
						else{
						   if(notifySettings.notifyComment==0){
							   
								callback(true, {status: 1, status_type: "Success", message: 'Succesfully commented against the dither', error_details: err});
								
						   }
						   else{
						
						
								//----------------------------Push Notification For Comment------------------------------------------
								var message   = 'Comment Notification';
								var ntfn_body =  tokenCheck.tokenDetails.name +" Commented on Your Dither";
								//var query   =  "SELECT DISTINCT(deviceId) FROM userToken where userId ='"+collageDetails.userId+"'";
								//User_token.query(query, function(err, getDeviceId) {
								User_token.find({userId: collageDetails.userId }).exec(function (err, getDeviceId){
									if(err){
										  console.log(err)
										  return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Push Notification', error_details: err});
									}else{
										if(!getDeviceId.length){
										   console.log("device not found")
										   return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully commented against the dither',
																comment_id                      :    results.id,
																comment_msg                     :    results.msg,
																comment_created_date_time       :    results.createdAt,
														});
										}else{
											  var deviceId_arr  = [];
											   getDeviceId.forEach(function(factor, index){

															deviceId_arr.push(factor.deviceId);


												});
											if(deviceId_arr.length){
											  var data    = {message:message, device_id:deviceId_arr,NtfnBody:ntfn_body,NtfnType:3,id:collageId};
											  console.log(data)
												if(device_type=='ios'){
														NotificationService.pushNtfnApn(data, function(err, ntfnSend) {
															if(err){
																console.log("Error in Push Notification Sending")
																console.log(err)
																return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Push Notification', error_details: err});
															}else{
																console.log("Push notification result")
																console.log(ntfnSend)
																console.log("Push Notification sended")

																 return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully commented against the dither',
																	comment_id                      :    results.id,
																	comment_msg                     :    results.msg,
																	comment_created_date_time       :    results.createdAt,
																 });

															}
														});
												}else if(device_type=='android'){
														console.log("push notification")
														NotificationService.pushNtfnGcm(data, function(err, ntfnSend) {
															if(err)
															{
																console.log("Error in Push Notification Sending")
																console.log(err)
																return res.json(200, {status: 2, status_type: 'Failure' ,message: 'Some error occured in Push Notification', error_details: err});
															}
															else
															{
																console.log("Push notification result")
																console.log(ntfnSend)
																console.log("Push Notification sended")
																return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully commented against the dither',
																	comment_id                      :    results.id,
																	comment_msg                     :    results.msg,
																	comment_created_date_time       :    results.createdAt,
																});


															}
														});
												}else{
															return res.json(200, {status: 1 ,status_type: 'Success', message: 'Succesfully commented against the dither',
																	comment_id                      :    results.id,
																	comment_msg                     :    results.msg,
																	comment_created_date_time       :    results.createdAt,
															});
												}
											}
										}//kkkk
									}
								});
							}
						 }
					  }); 
					}
				
					
			 });
				 //}    
				 
			 //}
			//});

			
		    
		   
		    
		
	}*/
	
	
};	
	
	
	
	
	
	
	
