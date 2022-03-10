'use strict';
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class DeviceDetails extends Model {
        static associate() {
            // this.hasOne(User, { foreignKey: 'deviceId' })
        }
    };
    DeviceDetails.init({
        deviceName: {
            type: DataTypes.STRING,
        },
        deviceId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true,
            validate: {
                notNull: true,
                notEmpty: true
            }
        },
        login: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'DeviceDetails',
        tableName: 'devicedetails',
    })
    return DeviceDetails;
}
