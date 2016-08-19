/**
 * CollageDetails.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  tableName : 'collageDetails',
  attributes: {


        id: {
            type: 'integer',
            primaryKey: true,
            autoIncrement: true
        },

        image: {
            type: 'string',
        },

        position: {
            type: 'string',
        },

        collageId: {
            type: 'integer',
            defaultsTo: 0
        },

        vote: {
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

