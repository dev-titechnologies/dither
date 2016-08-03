/**
* NotificationLog.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName : 'notificationLog',
  attributes: {

       id: {
                type: 'integer',
                primaryKey: true,
                autoIncrement: true
            },
       notificationTypeId: {
                type: 'integer',
            },
       userId: {
                type: 'integer',
            },    
	   ditherUserId	: {
                type: 'integer',
            },
       collage_id	: {
                type: 'integer',
            },
       image_id	: {
                type: 'integer',
            },
       tagged_users:{
			    type:'string',
		   } ,          
       readStatus:{
					type:'string',
		   } ,
	   description:{
			      type:'string',
		   } ,	   
	   createdAt:{
				
				type:'datetime',
			},    
	   updatedAt:{
		   
				type:'datetime',	
			},		
  }
};

