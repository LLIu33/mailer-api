/**
 * Module dependencies.
 */

var app = require('./app');

var debug = require('debug')('express-app:server');
var models = require('./models');
var http = require('http');

var Server = require('socket.io');

var io = new Server().attach(process.env.SOCKETS_PORT || '5001');
io.on('connection', function(socket) {
  // socket.emit('state', console.log('socket.emit'));
  // socket.on('action', console.log('socket.on'));
});

/**
 * Get port from environment and store in Express.
 */

var port = process.env.PORT || '5000';
app.set('port', port);

  /**
 * Create HTTP server.
 */

var server = http.createServer(app);

models.sequelize.sync().then(function() {
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
  console.log(`Your server is running on port ${port}.`);
});

// app.use(logger('dev')); // Log requests to API using morgan

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  console.log(error);
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
      break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
      break;
      default:
        throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
