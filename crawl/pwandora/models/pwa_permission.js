const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pwa_permission', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    added_at: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    is_required: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'permission',
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
    tableName: 'pwa_permission',
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
        name: "FK85upksbmkadg7rti5wc9rk0pu",
        using: "BTREE",
        fields: [
          { name: "permission_id" },
        ]
      },
      {
        name: "FKggjxem4trjd6fgt7td6mr8stp",
        using: "BTREE",
        fields: [
          { name: "pwa_id" },
        ]
      },
    ]
  });
};
