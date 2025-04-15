const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('site', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    status: {
      type: DataTypes.ENUM('CONFIRM','NONE','NO_PWA'),
      allowNull: true,
      defaultValue: "NONE"
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "UK2th8o52gyklwsm9ws5d449vmx"
    },
    pwa_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'pwa',
        key: 'id'
      },
      unique: "FK19gder3tio8dlq6l2vesfs2tq"
    }
  }, {
    sequelize,
    tableName: 'site',
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
        name: "UK2th8o52gyklwsm9ws5d449vmx",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "url" },
        ]
      },
      {
        name: "UKm3208xhf3pa9oihv7266x2xag",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "pwa_id" },
        ]
      },
      {
        name: "idx_site_updated_at_status",
        using: "BTREE",
        fields: [
          { name: "status" },
          { name: "updated_at" },
        ]
      },
    ]
  });
};
