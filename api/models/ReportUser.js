/**
 * ReportUser.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    tableName : 'reportUser',
    attributes: {

        id: {
                type: 'integer',
                primaryKey: true,
                autoIncrement: true
            },

        report: {
                type: 'string',
            },

        reportType: {
                type: 'string',
            },

        reporterId: {
                type: 'integer',
                defaultsTo: 0
            },

        userId: {
                type: 'integer',
                defaultsTo: 0
            },

        approvalStatus: {
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

