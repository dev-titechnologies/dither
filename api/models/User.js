/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName : 'user',
  attributes: {

        id: {
                type: 'integer',
                primaryKey: true,
                autoIncrement: true
            },
        name: {
                type: 'string',
            },
        email: {
                type: 'email',
                //required: true,
                //unique: true
            },
        gender: {
                type: 'string',
            },
        birthdate: {
                type: 'string',
            },
        emailVerificationStatus: {
                type: 'boolean',
                defaultsTo: false
            },
        profilePic: {
                type: 'string',
            },
        fbId: {
                type: 'string',
                //unique: true
            },
        phoneNumber: {
                type: 'integer',
                //unique: true
            },
        notificationStatus: {
                type: 'boolean',
                defaultsTo: true
            },
        createdAt: {
                type: 'datetime',
            },
        updatedAt: {
                type: 'datetime',
            },



  }
};

