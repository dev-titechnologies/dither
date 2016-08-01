/**
 * CollageLikes.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  tableName : 'collageLikes',
  attributes: {

        id: {
                type: 'integer',
                primaryKey: true,
                autoIncrement: true
            },
        collageId: {
                type: 'integer',
            },
        userId: {
                type: 'integer',
            },
        likeStatus: {
                type: 'boolean',
                defaultsTo: false
            },
        createdAt: {
                type: 'datetime',
            },
        updatedAt: {
                type: 'datetime',
            },
  }
};

