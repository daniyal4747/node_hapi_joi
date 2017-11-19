'use strict';

let responseCodes = {};
// Generic - Series 1XX
responseCodes[exports.OK = 100] = 'Action successful';
responseCodes[exports.INVALID_PARAMETERS = 101] = 'Invalid Parameters';
responseCodes[exports.FAILED = 102] = 'failed';

// Auth - Series 2XX
responseCodes[exports.LOGIN_FAIL = 201] = 'Invalid credentials';
responseCodes[exports.INVALID_PASSWORD = 202] = 'Invalid password';
responseCodes[exports.USER_EXISTS = 203] = 'User already exists';


exports.getStatusText = function (code) {
  if (responseCodes.hasOwnProperty(code)) {
    return responseCodes[code];
  } else {
    throw new Error('Status code does not exist: ' + code);
  }
};
