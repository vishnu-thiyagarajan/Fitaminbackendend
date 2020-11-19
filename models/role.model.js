const mongoose = require('mongoose')
const rolesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: String, required: true }
})
mongoose.model('Roles', rolesSchema)
module.exports = rolesSchema