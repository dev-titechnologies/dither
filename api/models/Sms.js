/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName : 'smsDetails',
  attributes: {

        Id: {
                type: 'integer',
                primaryKey: true,
                autoIncrement: true
            },
        ditherId: {
                type: 'integer',
            },
            
        smsVerified: {
                type: 'boolean',
                defaultsTo: false
            },
        OTPCode: {
                type: 'integer',
            },
        mobile_no:{
			type: 'integer',	
		},    
        createdAt: {
                type: 'datetime',
            },
        updatedAt: {
                type: 'datetime',
            },
  }
};

