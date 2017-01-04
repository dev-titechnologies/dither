/**
 * TempFbData.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  tableName : 'tempFbData',
  attributes: {
		id: {
                type: 'integer',
                primaryKey: true,
                autoIncrement: true
            },
        
        data: {
                type: 'string'
                
            },
       createdAt: {
                type: 'datetime',
            },
        updatedAt: {
                type: 'datetime',
            },
        
  }
};

