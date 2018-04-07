/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var path = require('path');

var config = require(path.join(__dirname, '/config/config'));
var log = require(path.join(__dirname, 'log'));

module.exports = function () {
  var uri = ''.concat('mongodb://', config.db.host, ':', config.db.port, '/', config.db.name);

  mongoose.connect(uri);
};
