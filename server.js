const Hapi = require('hapi')
const Vision = require('vision')
const Path = require('path')
const _ = require('lodash')

const ImageWalker = require("./models/ImageWalker")
const sequelize = require("./models")

// Create a server with a host and port
const server = Hapi.server({
  host: 'localhost',
  port: 3000
})

// Add the route
server.route({
  method: 'GET',
  path: '/',
  handler: async function(request, reply) {
    let result = await sequelize.query("SELECT MAX(image_id) FROM images", {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
    })
    let lastImageId = _.values(result[0])[0] || 0
    if (request.query['last_image_id']) {
      lastImageId = parseInt(request.query['last_image_id'])
    }
    let skipExist = request.query['skip_exist'] || 'false'
    let limit = request.query['limit'] || 100
    return reply.view('index', {
      lastImageId: lastImageId,
      skipExist: skipExist,
      limit: limit,
    })
  }
})

server.route({
  method: 'GET',
  path: '/images',
  handler: async function(request, reply) {
    let lastImageId = request.query['last_image_id'] || 0
    let limit = request.query['limit'] || 100
    let skipExist = request.query['skip_exist']
    let walker = new ImageWalker(Path.join(__dirname, "data"))
    console.log('lastImageId:', lastImageId)
    let result = await walker.walk(lastImageId, limit, skipExist)
    const response = reply.response(result)
    response.type('application/json')
    return response
  }
})

server.route({
  method: 'POST',
  path: '/images/update',
  handler: function(request, reply) {
    let imageId = request.payload['image_id']
    let rotation = request.payload['rotation']
    sequelize.query(`INSERT INTO images(image_id, rotation) VALUES (${imageId}, ${rotation}) ON DUPLICATE KEY UPDATE rotation=${rotation}`)
    const response = reply.response({})
    response.type('application/json')
    return response
  }
})

// Start the server
async function start() {
  try {
    await server.register(Vision)
    server.views({
      engines: {
        html: require('handlebars')
      },
      relativeTo: __dirname,
      path: 'templates',
      layout: true,
      layoutPath: Path.join(__dirname, 'templates/layout')
    })
    await server.start()
  } catch (err) {
    console.log(err)
    process.exit(1)
  }

  console.log('Server running at:', server.info.uri)
}

start()
