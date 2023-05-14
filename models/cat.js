const { Schema, model} = require('mongoose');

const catSchema = new Schema({
  name: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number },
  description: { type: String },
  pictureUrl: { type: String },
  fact: {type: String },
  loveMeter: {type: Number, default: 0},
  favouriteThing: {type: String},
  shelter: {type: Schema.Types.ObjectId, ref: 'Shelter'},
}, { timestamps: true });

module.exports = model('Cat', catSchema);