/**
 * TempFbFriends.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  tableName : 'TempFbFriends',
  attributes: {


		Id: {
                type: 'integer',
                primaryKey: true,
                autoIncrement: true
            },
        userId: {
                type: 'integer',
                defaultsTo: 0
            },
        fbName: {
                type: 'string',
            },    
		fbId: {
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

