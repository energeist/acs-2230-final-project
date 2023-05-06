const { Schema, model } = require('mongoose');

const shelterSchema = new Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true},
  phone: { type: String, required: true },
  email: { type: String, required: true },
  cats: [{ type: Schema.Types.ObjectId, ref: 'Cat'}],
}, { timestamps: true });

module.exports = model('Shelter', shelterSchema);