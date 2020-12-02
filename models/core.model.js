const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CoreSchema = new Schema({
  name: { type: String, unique: true, required: true },
  recipe: { type: String, required: true },
  nutrition: { type: String, required: true },
}, { timestamps: true })
const CoreModel = mongoose.model('Cores', CoreSchema)
module.exports = CoreModel;