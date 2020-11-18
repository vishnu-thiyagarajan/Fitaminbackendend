const mongoose = require('mongoose')
const usersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  createdAt: { type: String, required: true }
})
mongoose.model('Users', usersSchema)