/**
* Invitation.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName : 'invitation',
  attributes: {

        id: {
                type: 'integer',
                primaryKey: true,
                autoIncrement: true
            },
        collageId: {
                type: 'integer',
                defaultsTo: 0
            },
        userId: {
                type: 'integer',
                defaultsTo: 0
            },
        /*ditherUserId : {
                type: 'integer',
            },*/
        phoneNumber  : {
                type: 'string',
            },
        fbId:{
                  type:'string',
           },
        invitee : {
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

