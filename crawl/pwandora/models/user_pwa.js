const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_pwa', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    download_at: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    file_type: {
      type: DataTypes.ENUM('APK','WGT'),
      allowNull: true
    },
    update_at: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    pwa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pwa',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    download_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'user_pwa',
    timestamps: false,
    paranoid: true,
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
        name: "FKb3xj8pjbrlo2fly8x7me2f1y4",
        using: "BTREE",
        fields: [
          { name: "pwa_id" },
        ]
      },
      {
        name: "FKp5sx51gxrj03wpyn1j29ux7b",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "idx_user_pwa_download_at",
        using: "BTREE",
        fields: [
          { name: "download_at" },
        ]
      },
    ]
  });
};
