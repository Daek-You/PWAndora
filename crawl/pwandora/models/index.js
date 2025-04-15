const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

function initModels(sequelize) {
  const db = {};

  fs.readdirSync(__dirname)
    .filter(
      (file) =>
        file.endsWith('.js') && file !== basename && !file.includes('.test.js')
    )
    .forEach((file) => {
      const model = require(path.join(__dirname, file))(
        sequelize,
        Sequelize.DataTypes
      );
      db[model.name] = model;
    });

  // 모델 간의 관계 설정
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db); // 관계 설정
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  return db;
}

module.exports = initModels;
