const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('display', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pwa_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'pwa',
        key: 'id'
      },
      unique: "FK3fqy1c258cg54bjhodq76f97j"
    },
    image_url_large: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    image_url_medium: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    image_url_small: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    is_large: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_medium: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_medium_small: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_small: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'display',
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
        name: "UKgwqfcvp41krgls7e10qvmtmbl",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "pwa_id" },
        ]
      },
    ]
  });
};
