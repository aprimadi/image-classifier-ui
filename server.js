const Hapi = require('hapi')
const Vision = require('vision')
const Path = require('path')

// Create a server with a host and port
const server = Hapi.server({
  host: 'localhost',
  port: 3000
})

// Add the route
server.route({
  method: 'GET',
  path: '/',
  handler: function(request, reply) {
    return reply.view('index')
  }
})

server.route({
  method: 'POST',
  path: '/image_update',
  handler: function(request, reply) {
    // TODO
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
