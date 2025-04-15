const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('content_moderation_reasoning', {
    pwa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'pwa',
        key: 'id'
      }
    },
    child_endangerment_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    inappropriate_content_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    financial_service_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    real_money_gambling_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    illegal_activity_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    health_content_service_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    blockchain_based_content_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ai_generated_content_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    overall_assessment: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'content_moderation_reasoning',
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
