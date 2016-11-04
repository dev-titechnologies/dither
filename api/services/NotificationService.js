
var PusherService  = require('sails-service-pusher');

module.exports = {

	
	/*=================================================================================================================================
            PUSH Notification Service
    ================================================================================================================================== */
     
    
	
	//-----------IOS---------------------------------	
	
	pushNtfnApn: function(data,device_id, callback) 
	{
		console.log("Push Notification Apn")
		console.log(device_id)
		var details ={message:data.NtfnBody,type:data.NtfnType,id:data.id,notification_id:data.notification_id};
		console.log(details)
		ios = PusherService('ios', {
			device: [], // Array of string with device tokens
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
				title: data.NtfnBody, // Indicates notification title
				body: '', // Indicates notification body text
				icon: '', // Indicates notification icon
				sound: '', // Indicates sound to be played
				badge: '1', // Indicates the badge on client app home icon
				payload: {"alert":"Hello from APNs Tester.","badge":"1","payload":"1","message":data.NtfnBody,"type":data.NtfnType,"id":data.id,"notification_id":data.notification_id}, // Custom data to send within Push Notification
			  }
			});
			
			//console.log(ios)
		
			ios
			  .send([device_id], {
				body    		  : 	''
				
			  })
			  .then(console.log.bind(console))
			  .catch(console.error.bind(console));
			  callback();
	
	
	},
	
	//-----------ANDROID---------------------------------
	
	pushNtfnGcm: function(data,device_id, callback) 
	{
		
		console.log("Push Notification GCM")
		console.log(data)
		console.log(device_id)
		console.log("counttttttttttttttttttt"+data.device_id.length)
		var ntfnArr = [];
		ntfnArr	 	= data.device_id;
		//console.log("neww devicee  arrayyyyyy")
		//console.log(ntfnArr)
		
		var details ={message:data.NtfnBody,type:data.NtfnType,id:data.id,notification_id:data.notification_id};
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
		//console.log(android)
		console.log("device arrayyyyyyyyyyyyyyyyy")
		//console.log(ntfnArr)
		console.log(device_id)
		android
			.send([device_id], {
             		body: details
				})
			.then(console.log.bind(console))
			.catch(console.error.bind(console));
			 callback();
	},	
	
	
	
//console.error.bind(console)

//===============================================END OF PUSH==========================================================================================

  /*=============================================================================================================================================
										SERVICE FOR IN APP NOTIFICATION 
	==============================================================================================================================================*/
	
	
	NtfnInAPP: function(data,callback) 
	{
		console.log("**************device_Dataaaaaaaaaaaaaaaaaa******************")
		console.log(data)
		var arr = data.device_id;
		console.log("/////////----Device array----//////////")
		console.log(arr)
		if(arr)
		{
			arr.forEach(function(factor, index)
			{
				User_token.findOne({deviceId:factor }).exec(function (err, getDeviceType){
					if(err)
					{
						console.log("error")
					}
					else
					{
						
					 console.log("device token---------------------")	
					 console.log(factor)
					 console.log(getDeviceType)
					 if(factor!=0)
					 {	
						var deviceId	=  factor;
						var switchKey   =  getDeviceType.device_Type;
						console.log(switchKey)
						console.log("factorrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
						console.log(deviceId)
						switch(switchKey){
								case 'ios' :
											NotificationService.pushNtfnApn(data,deviceId, function(err, ntfnSend) {
												if(err)
												{
													console.log("Error in Push Notification Sending")
													console.log(err)
													//callback();
												}
												else
												{
													console.log("Push notification result i nIOS")
													console.log(ntfnSend)
													console.log("push notification sended")
													//callback();
													
												}
											});
								break;

								case 'android' :
											NotificationService.pushNtfnGcm(data,deviceId, function(err, ntfnSend) {
												if(err)
												{
													console.log("Error in Push Notification Sending")
													console.log(err)
													//callback();
												}
												else
												{
													console.log("Push notification result IN Android")
													console.log(ntfnSend)
													console.log("Push Notification sended")
													//callback();
												}
											});
								break;
								default:
											console.log("default")
											//callback();

								break;
								


						}
						
					}
					}
				});
				

			},callback());
				
		}
		else
		{
			callback();
		}
					
	
	}
	
	
};	
	
	
	
	
	
	
	
