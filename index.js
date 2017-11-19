'use strict';

require('dotenv').config();
const hapi = require('hapi');
const server = new hapi.Server();
const config = require('./configs/config');
const db =  require('./src/database/index');
const auth = require('./src/models/auth');
const routes = require('./src/routes');
const fs = require('fs-extra');
const log = require('./configs/log');
const documentation = require('./configs/documentation');


server.connection({
  port: config.port, labels: ['api'], routes: {cors: true},
});

let registrationErrors = false;
server.register([
  require('hapi-auth-jwt2'),
  require('inert'),
  require('vision'),
  {
    register: require('good'),
    options: log.goodOptions,
  },
  {
    register: require('hapi-swagger'),
    options: documentation.swaggerOptions,
  },
], function (err) {
  if (err) {
    registrationErrors = true;
    throw err;
  }
});
server.auth.strategy('jwt', 'jwt',
  {
    key: config.secretKey,
    validateFunc: auth.validate,
    verifyOptions: {algorithms: ['HS256']},
  });
server.auth.default('jwt');
server.route(routes);

server.start(function () {
  server.inject({url: '/', headers: {host: server.info.uri}});
});

module.exports = server;
