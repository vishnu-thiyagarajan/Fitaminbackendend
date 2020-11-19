const roleSchema = require('./role.model');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const usersSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: Schema.Types.ObjectId, ref: 'Roles', required: true },
  createdAt: { type: String, required: true }
})
mongoose.model('Users', usersSchema)