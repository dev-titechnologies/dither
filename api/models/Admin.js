/**
* Admin.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName : 'admin',
  attributes: {

         id: {
                type: 'integer',
                primaryKey: true,
                autoIncrement: true
            },
        username: {
                type: 'string',
            },
	    password: {
				type: 'string',
				//required: true,
			},

        createdAt: {
                type: 'datetime',
            },
        updatedAt: {
                type: 'datetime',
            },



  }
};

