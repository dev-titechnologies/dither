/**
 * CollageComments.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  tableName : 'collageComments',
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
        comment: {
                type: 'string',
            },
        likeCount: {
                type: 'integer',
                defaultsTo: 0
            },
        createdAt: {
                type: 'datetime',
            },
        updatedAt: {
                type: 'datetime',
            },
  }
};

