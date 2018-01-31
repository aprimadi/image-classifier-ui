const Sequelize = require('sequelize')
const config = require('../config')
const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
  host: config.db.host,
  dialect: 'mysql',
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
})

const Image = sequelize.define('image', {
  imageId: { type: Sequelize.INTEGER, field: 'image_id' },
  rotation: Sequelize.INTEGER,
})

module.exports = sequelize