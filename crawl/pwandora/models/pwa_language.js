const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pwa_language', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
      allowNull: false,
      references: {
        model: 'pwa',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'pwa_language',
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
        name: "UKe2d4tkafxt8fwf3pbbf44my1f",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "pwa_id" },
          { name: "language_id" },
        ]
      },
      {
        name: "FK4sx5chdqclo4k58s4ffx4uaas",
        using: "BTREE",
        fields: [
          { name: "language_id" },
        ]
      },
      {
        name: "FKh17y1ast8co6cm90de6mnwyvo",
        using: "BTREE",
        fields: [
          { name: "pwa_id" },
        ]
      },
    ]
  });
};
