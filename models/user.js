'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Wishlist, Cart, Orders, Products, Notification }) {
      this.hasMany(Wishlist, { foreignKey: 'userId', as: 'wishlists' })
      this.hasMany(Cart, { foreignKey: 'userId', as: 'carts' })
      this.hasMany(Orders, { foreignKey: 'userId' })
      this.belongsToMany(Products, { through: 'Reviews', foreignKey: 'userId', otherKey: 'productId' })
      this.hasMany(Notification, { foreignKey: 'userId' })
    }
  };
  User.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: true,
        notEmpty: true,
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    mobileNumber: {
      type: DataTypes.STRING
    },
    alternateMobileNumber: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING
    },
    landmark: {
      type: DataTypes.STRING
    },
    deviceId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    OTP: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'User'
    }
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'User'
  });
  return User;
};
