const mongoose = require('mongoose')
require('dotenv').config()
require('./user.model.js')

const dbURI = process.env.MONGODB_URI;

module.exports = function () {
  mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

  mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection is open')
  })

  mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection has occured ' + err + ' error')
  })

  mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection is disconnected')
  })

  process.on('SIGINT', function () {
    mongoose.connection.close(function () {
      console.log('Mongoose default connection is disconnected due to application termination')
      process.exit(0)
    })
  })
}