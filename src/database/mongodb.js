'use strict';
const config = require('../../configs/config');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

mongoose.connect(`mongodb://localhost/${config.databaseName}`);
const db = mongoose.connection;
autoIncrement.initialize(db);

db.on('error', console.error.bind(console, 'connection error:'));

/*
db.once('open', function () {
  // we're connected!
  console.log('database connected !!')
});
*/


let userSchema = mongoose.Schema({
  email_address: String,
  password: String,
},{versionKey: false});


userSchema.plugin(autoIncrement.plugin, {model: 'user'})
mongoose.model('user', userSchema);
