'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Notification extends Model { 
         static associate({ User }) {
            this.belongsTo(User, { foreignKey: 'userId' })
             }
    }
    Notification.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                notNull: true
            },
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
                notNull: true
            }
        },
    }, {
        sequelize,
        tableName: 'notifications',
        modelName: 'Notification'
    })
    return Notification
};
