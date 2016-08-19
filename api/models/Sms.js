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
                defaultsTo: 0
            },

        smsVerified: {
                type: 'boolean',
                defaultsTo: false
            },
        OTPCode: {
                type: 'integer',
                defaultsTo: 0
            },
        mobile_no:{
            type: 'string',
        },
        createdAt: {
                type: 'datetime',
            },
        updatedAt: {
                type: 'datetime',
            },
  }
};

