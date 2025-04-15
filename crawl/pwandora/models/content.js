const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('content', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    description: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    summary: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    language_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'language',
        key: 'id'
      }
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
    tableName: 'content',
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
        name: "UKstxima8yj6hk4lb1y1ho7cvsk",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "pwa_id" },
          { name: "language_id" },
        ]
      },
      {
        name: "FKkcdjkg81jtkkpm1gggdq5xraw",
        using: "BTREE",
        fields: [
          { name: "language_id" },
        ]
      },
      {
        name: "FKrxbw8htm1cwhonwu2b4t2dgt3",
        using: "BTREE",
        fields: [
          { name: "pwa_id" },
        ]
      },
    ]
  });
};
