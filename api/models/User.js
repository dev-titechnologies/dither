/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
//console.log(new Date());

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
                required: true,
                unique: true
            },
        mobileVerificationStatus: {
                type: 'boolean',
                defaultsTo: false
            },

        profilePic: {
                type: 'string',
            },

        fbId: {
                type: 'string',
                unique: true
            },
        mentionId: {
                type: 'string',
                unique: true
            },
        phoneNumber: {
                type: 'string',
                unique: true
            },
        accessToken: {
                type: 'string',
                unique: true,
                defaultsTo: 'null'
            },
        status: {
                type: 'string',
                enum: ['active', 'inactive', 'delete'],
                defaultsTo: 'active'
            },
        type: {
                type: 'boolean',
                defaultsTo: false
            },
        notifyOpinion: {
                type: 'boolean',
                defaultsTo: true
            },
        notifyVote: {
                type: 'boolean',
                defaultsTo: true
            },
        notifyComment: {
                type: 'boolean',

                defaultsTo: true
            },

        notifyContact: {
                type: 'boolean',
                defaultsTo: true
            },
        notifyMention: {
                type: 'boolean',
                defaultsTo: true
            },
        notifyCommentLike: {
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

