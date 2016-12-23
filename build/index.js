'use strict';

var _http = require('http');

var http = _interopRequireWildcard(_http);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _Api = require('./Api');

var _Api2 = _interopRequireDefault(_Api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// ErrnoError interface for use in onError
var logger = (0, _debug2.default)('flow-api:startup');
var app = new _Api2.default();
var DEFAULT_PORT = 3000;
var port = normalizePort(process.env.PORT);
// $FlowFixMe: express libdef issue
var server = http.createServer(app.express);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  var port = typeof val === 'string' ? parseInt(val, 10) : val;

  if (port && isNaN(port)) return port;else if (port >= 0) return port;else return DEFAULT_PORT;
}

function onError(error) {
  if (error.syscall !== 'listen') throw error;
  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port.toString();

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

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  logger('Listening on ' + bind);
}
//# sourceMappingURL=index.js.map
