const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pwa', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    acceptance_status: {
      type: DataTypes.ENUM('ACCEPTED','NONE','REJECTED'),
      allowNull: true,
      defaultValue: "NONE"
    },
    accepted_at: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    app_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "UKel84m865xfo2gk038hpqgi144"
    },
    avg_score: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    },
    blocked_at: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    company: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    developer_site: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    download_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    icon_image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    version: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    website_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    age_limit: {
      type: DataTypes.ENUM('ALL','EIGHTEEN_PLUS','SEVEN_PLUS','SIXTEEN_PLUS','THREE_PLUS','TWELVE_PLUS','UNRATED'),
      allowNull: true,
      defaultValue: "UNRATED"
    }
  }, {
    sequelize,
    tableName: 'pwa',
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
        name: "UKel84m865xfo2gk038hpqgi144",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "app_id" },
        ]
      },
      {
        name: "idx_pwa_search",
        using: "BTREE",
        fields: [
          { name: "acceptance_status" },
          { name: "blocked_at" },
          { name: "created_at" },
        ]
      },
      {
        name: "idx_pwa_acceptance_status",
        using: "BTREE",
        fields: [
          { name: "acceptance_status" },
        ]
      },
    ]
  });
};
