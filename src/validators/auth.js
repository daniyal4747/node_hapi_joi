'use strict';

const joi = require('joi');

const validation = joi.object({
  email_address: joi.string().email().required(),
  password: joi.string().min(8).required(),
});

module.exports = {
  validation,

};
