const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const customizeSchema = new Schema({
  corerecipe: { type: Schema.Types.ObjectId, ref: 'Cores', required: true },
  wantsto: { type: String, enum: ['lose', 'gain', 'maintain'], required : true },
  weight: {type: String, enum: ['30-35','35-40','40-45','45-50','50-55','55-60','60-65','65-70','70-75','75-80','80-85','85-90','90-95','95-100'], required: true},
  recipe: { type: String, required: true },
  nutrition: { type: String, required: true },
}, { timestamps: true })
const customizeModel = mongoose.model('Customizes', customizeSchema)
module.exports = customizeModel;