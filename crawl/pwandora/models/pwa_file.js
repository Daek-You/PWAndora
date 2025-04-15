const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pwa_file', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    download_url: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    file_size: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    file_type: {
      type: DataTypes.ENUM('APK','WGT'),
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
    tableName: 'pwa_file',
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
        name: "FKiw1p54ghcjornaf786sl80can",
        using: "BTREE",
        fields: [
          { name: "pwa_id" },
        ]
      },
    ]
  });
};
