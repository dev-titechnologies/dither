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
                defaultsTo: 0
            },
       userId: {
                type: 'integer',
                defaultsTo: 0
            },
       ditherUserId : {
                type: 'integer',
                defaultsTo: 0
            },
       collage_id   : {
                type: 'integer',
                defaultsTo: 0
            },
       image_id : {
                type: 'integer',
                defaultsTo: 0
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

