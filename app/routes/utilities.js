/*jslint node: true */
'use strict';

let path = require('path');
let config = require(path.join(__dirname, '../../config/config'));

let PATH = '/utils';
let VERSION = '1.0.0';

module.exports = function (server) {
  server.get({path: PATH + '/health', version: VERSION}, health);

  function health(req, res, next) {
    res.json(200, {status: 'UP'});

    return next();
  }
};
