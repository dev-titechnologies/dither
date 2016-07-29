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
        mobileVerificationStatus: {
                type: 'boolean',
                defaultsTo: false
            },
        mobileVerificationKey: {
                type: 'string',
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
        status: {
                type: 'string',
                enum: ['active', 'inactive', 'delete'],
                defaultsTo: 'active'
            },
        notifyOpinion: {
                type: 'boolean',
                defaultsTo: 'false'
            },
        notifyVote: {
                type: 'boolean',
                defaultsTo: 'false'
            },
        notifyComment: {
                type: 'boolean',
                defaultsTo: 'false'
            },
        notifyFB: {
                type: 'boolean',
                defaultsTo: 'false'
            },

        createdAt: {
                type: 'datetime',
            },
        updatedAt: {
                type: 'datetime',
            },



  }
};

