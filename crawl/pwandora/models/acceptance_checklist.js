const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('acceptance_checklist', {
    pwa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "PWA 테이블의 ID를 참조",
      references: {
        model: 'pwa',
        key: 'id'
      }
    },
    crawled_status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    display_status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    screenshot_status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ai_suggestion_status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ai_censor_status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    packaging_status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    lighthouse_status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    security_status: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'acceptance_checklist',
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
