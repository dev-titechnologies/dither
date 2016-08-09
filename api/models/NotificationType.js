/**
* NotificationLog.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName : 'notificationType',
  attributes: {

       id: {
                type: 'integer',
                primaryKey: true,
                autoIncrement: true
            },
       type: {
                type: 'string',
            },
       body: {
                type: 'string',
            },    
	   createdAt:{
				
					type:'datetime',
				},    
	   updatedAt:{
		   
				type:'datetime',	
			},		
  }
};

