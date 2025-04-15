const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('category_content', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'category',
        key: 'id'
      }
    },
    language_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'language',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'category_content',
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
        name: "UKap6ijhd73n3w8g3bk1jhcvf00",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "category_id" },
          { name: "language_id" },
        ]
      },
      {
        name: "FKgnua0selu0cq9hct5f40n39bc",
        using: "BTREE",
        fields: [
          { name: "language_id" },
        ]
      },
      {
        name: "FKqp06n8ipmwcx3q5xqwmsphgmg",
        using: "BTREE",
        fields: [
          { name: "category_id" },
        ]
      },
    ]
  });
};
