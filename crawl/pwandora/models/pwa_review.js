const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pwa_review', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pwa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pwa',
        key: 'id'
      }
    },
    review_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'review',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'pwa_review',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "FKsxlyt4ewnjypaa0xu4it79jxa",
        using: "BTREE",
        fields: [
          { name: "pwa_id" },
        ]
      },
      {
        name: "FK8s5tx0aiwyss4remk6f7j0gmt",
        using: "BTREE",
        fields: [
          { name: "review_id" },
        ]
      },
    ]
  });
};
