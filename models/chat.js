'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Chat.belongsTo(models.User, {foreignKey: "sender", as: "sender_data"})
      Chat.belongsTo(models.User, {foreignKey: "receiver", as: "receiver_data"})
    }
  }
  Chat.init({
    sender: DataTypes.INTEGER,
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Chat Message Is Required"
        },
        notEmpty: {
          msg: "Chat Message Is Required"
        }
      }
    },
    receiver: DataTypes.INTEGER,
    reply_to: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Chat',
  });
  return Chat;
};