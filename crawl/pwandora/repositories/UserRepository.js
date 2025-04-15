const { models } = require('../config/dbConfig')

class UserRepository {
  static async findAllEmail() {
    return await models.user.findAll({
      attributes: ['email'],
      where: {
        email: {
          [models.Sequelize.Op.not]: null,
        },
      },
    })
  }
}

module.exports = { UserRepository }
