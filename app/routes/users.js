/*jslint node: true */
'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');
const path = require('path');
const fs = require('fs');

const PATH = '/users';

module.exports = function (server) {
  server.get({path: PATH + '/'}, list);
  server.post({path: PATH + '/'}, create);
  server.put({path: PATH + '/'}, update);

  function list(req, res, next) {
    User.find().sort({'timestamp': 1}).exec((error, users) => {
      if (error) {
        return next(error);
      }

      res.header('X-Total-Count', users.length);
      res.json(200, users);

      return next();
    });
  }

  function copyUserPhotos(id, files) {
    const userDir = path.join(__dirname, '../../user-data/', id)

    if (!fs.existsSync(userDir)){
      fs.mkdirSync(userDir);
    }

    return Promise.all(files.map((file) => new Promise((resolve, reject) => {
      fs.copyFile(file.path, path.join(userDir, file.name), (err) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      })
    })))
  }

  function create(req, res, next) {
    const user = new User({
      nickname: req.body ? req.body.nickname : null,
    });

    user.save((error, user) => {
      if (error) {
        return next(error);
      }

      res.json(200, user);

      return next();
    });
  }

  function update(req, res, next) {
    const nickname = req.body ? req.body.nickname : null

    User.findOne({nickname}, {}, {}, function (error, user) {
      if (error) {
        return next(error);
      }

      res.send(200, user);

      copyUserPhotos(nickname, Object.values(req.files))
        .then(() => next())
        .catch((err) => next(err))
    });
  }
};
