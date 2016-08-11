/**
 * ReportDither.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    tableName : 'reportDither',
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
            },

        collageId: {
                type: 'integer',
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

