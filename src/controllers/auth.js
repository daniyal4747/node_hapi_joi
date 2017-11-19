'use strict';

const statusCodes = require('http-status-codes');
const model = require('../models/auth');
const validator = require('../validators/auth');
const responseCodes = require('../../constants/response_codes');

const emailSignUp = {
  description: 'Sign Up',
  notes: 'Sign Up using email address and password',
  tags: ['api', 'signup'],
  auth: false,
  handler: function (request, reply) {

    model.signUp(request.payload,
      (err, result) => {
        if (err) {
          request.log(['error'], err, new Date());
          reply({
            'success': false,
            'statusCode': responseCodes.FAILED,
            'message': err.message,
          }).code(statusCodes.INTERNAL_SERVER_ERROR);
          return;
        }
        if (result.exists) {
          return reply({
            'success': false,
            'statusCode': responseCodes.USER_EXISTS,
            'message': responseCodes.getStatusText(responseCodes.USER_EXISTS),
          });
        }
        return reply({
          'success': true,
          'statusCode': responseCodes.OK,
          'data': result.newUser,
        });
      });
  },
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'SIGNUP_SUCCESSFUL',
        },
        '400': {
          'description': 'INVALID_PARAMS',
        },
      },
      payloadType: 'json',
    },
  },
  validate: {
    payload: validator.validation,
    failAction: (request, reply, source, err) => {
      reply({
        message: 'INVALID_PARAMETERS',
        data: err.message,
      }).code(statusCodes.BAD_REQUEST);
    },
  },
};

const emailLogin = {
  description: 'Login',
  notes: 'Logs In a user using email_address and password',
  tags: ['api', 'auth'],
  auth: false,
  handler: function (request, reply) {
    model.login(request.payload,
      (err, result) => {
        if (err) {
          request.log(['error'], err, new Date());
          reply({
            'success': false,
            'statusCode': responseCodes.FAILED,
            'message': err.message,
          }).code(statusCodes.INTERNAL_SERVER_ERROR);
          return;
        }
        if (!result) {
          reply({
            'success': false,
            'statusCode': responseCodes.LOGIN_FAIL,
            'message': responseCodes.getStatusText(responseCodes.LOGIN_FAIL),
          }).code(statusCodes.OK);
          return;
        }
        reply({
          'success': true,
          'statusCode': responseCodes.OK,
          'data': result,
          'message': responseCodes.getStatusText(responseCodes.OK),
        }).code(statusCodes.OK);
      });
  },
  validate: {
    payload: validator.validation,
    failAction: (request, reply, source, err) => {
      reply({
        'success': false,
        'statusCode': responseCodes.INVALID_PARAMETERS,
        'message': err.message,
      }).code(statusCodes.BAD_REQUEST);
    },
  },
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'LOGIN_SUCCESSFUL',
        },
        '400': {
          'description': 'INVALID_PARAMS',
        },
      },
      payloadType: 'json',
    },
  },
};

const userInfo = {
  description: 'user details',
  notes: 'user details',
  tags: ['api', 'auth'],
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    reply({
      message: 'success',
      success: true,
      data:request.auth.credentials.id, //to get encode user id in jwt
    });
  },
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'LOGIN_SUCCESSFUL',
        },
        '400': {
          'description': 'INVALID_PARAMS',
        },
      },
      payloadType: 'json',
    },
  },
};


module.exports = {
  emailSignUp,
  emailLogin,
  userInfo,
};
