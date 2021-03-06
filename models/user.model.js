const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const usersSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  active: { type: Boolean, required: true, default: false},
  role: { type: Schema.Types.ObjectId, ref: 'Roles', required: true },
}, { timestamps: true })
usersSchema.pre(
  'save',
  async function(next) {
    const user = this;
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  }
);
usersSchema.methods.isValidPassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
}
const UsersModel = mongoose.model('Users', usersSchema)
module.exports = UsersModel;