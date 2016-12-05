/**
 * CommentImages.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	
  tableName : 'commentImages',	
  attributes: {
	  
	  id: {
                type: 'integer',
                primaryKey: true,
                autoIncrement: true
            },
	commentId: {
			type: 'integer',
			defaultsTo: 0
		},
	 image: {
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

