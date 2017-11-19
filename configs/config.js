'use strict';

module.exports = {
  port: process.env.PORT,
  environment: process.env.NODE_ENV,
  secretKey: process.env.SERVER_SECRET_KEY,
  databaseName: process.env.DATABASE_NAME,
};
