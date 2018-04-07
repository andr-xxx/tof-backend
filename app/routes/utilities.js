/*jslint node: true */
'use strict';

let path = require('path');
let config = require(path.join(__dirname, '../../config/config'));

let PATH = '/utils';

module.exports = function (server) {
  server.get({path: PATH + '/health'}, health);

  function health(req, res, next) {
    res.json(200, {status: 'UP'});

    return next();
  }
};
