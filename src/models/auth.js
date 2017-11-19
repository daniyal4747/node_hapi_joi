'use strict';

const config = require('../../configs/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const salt = bcrypt.genSaltSync(16);
const async = require('async');
const mongoose = require('mongoose');
let user = mongoose.model('user');

/**
 * @name login
 * @description login a user
 */
const login = function (model, callback) {
  let funcs = {};
  funcs.user = function (cb) {
    let qry = user.findOne({email_address: model.email_address});
    qry.select('_id email_address password');
    qry.exec((err, result) => {
      if (err) {
        return cb(err);
      }
      cb(null, result.toObject());
    });
  };
  funcs.comparePwd = function (user, cb) {
    if (!user) {
      return cb(null, false);
    }
    _comparePwd(model.password, user.password,
      (err, result) => {
        if (err) {
          cb(err);
          return;
        }
        if (result) {
          user.authToken = _generateToken(user._id);
        }
        cb(null, result);
      });
  };
  async.autoInject(funcs,
    function (err, results) {
      if (err) return callback(err);
      if (!results.comparePwd) {
        return callback(null, results.comparePwd);
      }
      delete results.user.password;
      callback(null, results.user);
    });
};
/**
 * @name _comparePwd
 */
const _comparePwd = function (data, hash, callback) {
  bcrypt.compare(data, hash, function (err, isValid) {
    if (err) return callback(err);
    callback(null, isValid);
  });
};

/**
 * @param model
 * @param callback
 * @description
 * Add new user
 * check if already exists
 * add new
 * attach token registered for that user
 */

const signUp = function (model, callback) {
  let funcs = {};
  funcs.exists = (cb) => {
    user.find({
      email_address: model.email_address,
    }, (err, res) => {
      if (err) return cb(err);
      if (res.length) {
        return cb(null, true);
      }
      cb(null, false);
    });
  };
  funcs.newUser = (exists, cb) => {
    if (exists) {
      return cb(null, null);
    }
    model.password = bcrypt.hashSync(model.password, salt);
    let newUser = new user(model);
    newUser.save((err, res) => {
      if (err) return cb(err);
      res = res.toObject();
      delete res.password;
      res.authToken = _generateToken(res._id);
      cb(null, res);
    });
  };

  async.autoInject(funcs, function (err, results) {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};

/**
 * @name generateToken
 * @description Generates a token for user using id, role, secretKey and expiry interval
 */
const _generateToken = function (id) {
  return jwt.sign(
    {id: id},
    config.secretKey,
    {expiresIn: '30d'}
  );
};


const validate = (decode, request, callback) => {
  user.findById(decode.id, (err, res) => {
    if (res) {
      return callback(null, true);
    }
    callback(null, false);
  });
};

module.exports = {
  signUp,
  login,
  validate,
};
