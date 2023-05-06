const { Schema, model } = require('mongoose');

const volunteerAssignmentSchema = new Schema({
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer'
  },
  shelter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shelter'
  },
}, { timestamps: true });

module.exports = model('VolunteerAssignment', volunteerAssignmentSchema);