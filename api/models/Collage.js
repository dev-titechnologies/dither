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
        },

        totalVote: {
            type: 'integer',
        },

        createdAt: {
            type: 'datetime',
        },

        updatedAt: {
            type: 'datetime',
        },
  }
};

