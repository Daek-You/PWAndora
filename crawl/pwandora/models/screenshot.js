const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('screenshot', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    screenshot_order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pwa_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'pwa',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'screenshot',
    timestamps: true,
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
        name: "FKkmuqp2bi0q5pyq0689dxea6cs",
        using: "BTREE",
        fields: [
          { name: "pwa_id" },
        ]
      },
    ]
  });
};
