/*jslint node: true */
'use strict';

let restify = require('restify');
let path = require('path');

let config = require(path.join(__dirname, '/config/config'));
let log = require(path.join(__dirname, '/log'));
let models = require(path.join(__dirname, '/app/models/'));
let routes = require(path.join(__dirname, '/app/routes/'));
let dbConnection = require(path.join(__dirname, '/db-connection'));

dbConnection();

let server = restify.createServer({
  name: config.app.name,
  log: log
});

//server.use(restify.plugins.bodyParser());
server.use(restify.plugins.multipartBodyParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.gzipResponse());
server.pre(restify.pre.sanitizePath());
server.use(
  function crossOrigin(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    return next();
  }
);

/*jslint unparam:true*/
// Default error handler. Personalize according to your needs.
server.on('uncaughtException', function (req, res, route, err) {
  log.info('******* Begin Error *******\n%s\n*******\n%s\n******* End Error *******', route, err.stack);
  if (!res.headersSent) {
    return res.send(500, {ok: false});
  }
  res.write('\n');
  res.end();
});

server.on('after', restify.plugins.auditLogger(
  {
    event: 'after',
    log: log
  })
);

models();
routes(server);

server.listen(config.app.port, function () {
  log.info('Application %s listening at %s:%s', config.app.name, config.app.address, config.app.port);
});
