const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('content_moderation', {
    pwa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'pwa',
        key: 'id'
      }
    },
    child_endangerment: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    inappropriate_content: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    financial_service: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    real_money_gambling: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    illegal_activity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    health_content_service: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    blockchain_based_content: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ai_generated_content: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'content_moderation',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "pwa_id" },
        ]
      },
    ]
  });
};
