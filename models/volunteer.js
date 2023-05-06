const { Schema, model } = require('mongoose');

const volunteerSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
}, { timestamps: true });

module.exports = model('Volunteer', volunteerSchema);