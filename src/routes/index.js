'use strict';

const auth = require('../controllers/auth');

// Controllers

module.exports = [
  {
    method: 'GET',
    path: '/example',
    config: {
      description:'Hello World API',
      notes:'Hello world example',
      tags: ['api','example'],
      auth: false,
      handler: (request, reply) => {
        reply('hello world');
      },
    },
  },
  /**
   * Auth
   * */
  {
    method: 'POST',
    path: '/api/signup',
    config: auth.emailSignUp,
  },
  {
    method: 'POST',
    path: '/api/login',
    config: auth.emailLogin,
  },
  {
    method: 'GET',
    path: '/api/secure',
    config: auth.userInfo,
  },

];
