const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pwa_hashtag', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    hashtag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hashtag',
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
    tableName: 'pwa_hashtag',
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
        name: "FKsw8dftbg4t32nu1cwvd7cq9t",
        using: "BTREE",
        fields: [
          { name: "hashtag_id" },
        ]
      },
      {
        name: "FK2wl6voq286b0umvsgw7423mch",
        using: "BTREE",
        fields: [
          { name: "pwa_id" },
        ]
      },
    ]
  });
};
