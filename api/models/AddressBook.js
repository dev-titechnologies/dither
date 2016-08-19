/**
 * AddressBook.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  tableName : 'addressBook',
  attributes: {

        id: {
                type: 'integer',
                primaryKey: true,
                autoIncrement: true
            },
        userId: {
                type: 'integer',
                defaultsTo: 0
            },
        ditherUserId: {
                type: 'integer',
                defaultsTo: 0
            },
        ditherUserName: {
                type: 'string',
            },
        ditherUserPhoneNumber: {
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

