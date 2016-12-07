/**
 * Collage.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  tableName : 'collage',
  attributes: {

        id: {
            type: 'integer',
            primaryKey: true,
            autoIncrement: true
        },

        imgTitle: {
            type: 'string',
        },

        image: {
            type: 'string',
        },

        location: {
            type: 'string',
        },

        latitude: {
            type: 'decimal',
            defaultsTo  : 0,
        },

        longitude: {
            type: 'decimal',
            defaultsTo  : 0,
        },

        userId: {
            type: 'integer',
            defaultsTo: 0
        },

        totalVote: {
            type: 'integer',
            defaultsTo: 0
        },
        //0 for not liked, 1 - 1st position , 2 - 2nd position etc .....
        likePosition: {
            type: 'integer',
            defaultsTo: 0
        },
        //true means 0 = active, false means 1 = inactive
        status: {
            type: 'string',
            enum: ['active', 'inactive'],
            defaultsTo: 'active'
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

