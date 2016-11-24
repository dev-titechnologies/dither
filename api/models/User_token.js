/**
 * User_token.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  tableName : 'userToken',
  attributes: {

        id: {
                type: 'integer',
                primaryKey: true,
                autoIncrement: true
        },

        userId: {
                type: 'integer',
                //required: true,
                defaultsTo: 0
        },

        token: {
                type: 'string',
                required: true,
                unique: true,
        },

        deviceId: {
                type: 'string',
                required: true,
        },
		device_IMEI: {
                type: 'string'
                
        },
        device_Type: {
                type: 'string'
                
        },
        badgeCount: {
                type: 'integer',
                defaultsTo: 0
        },
        expiryDate: {
                type: 'datetime',
        },
        createdAt: {
                type: 'datetime',
            },
        updatedAt: {
                type: 'datetime',
            },

  }
};

