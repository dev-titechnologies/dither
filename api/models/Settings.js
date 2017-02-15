/**
 * Settings.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  tableName : 'settings',
  attributes: {
        id: {
            type: 'integer',
            primaryKey: true,
            autoIncrement: true
        },

        key: {
            type: 'string',
            unique: true,
        },

        value: {
            type: 'string',
        },

        createdAt: {
            type: 'datetime',
            defaultsTo : new Date(),
        },

        updatedAt: {
            type: 'datetime',
            defaultsTo : new Date(),
        },

  }
};

