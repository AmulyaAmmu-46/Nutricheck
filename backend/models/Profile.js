const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  height: {
    type: Number,
    required: [true, 'Height is required'],
    min: [50, 'Height must be at least 50 cm'],
    max: [300, 'Height must be at most 300 cm']
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: [20, 'Weight must be at least 20 kg'],
    max: [500, 'Weight must be at most 500 kg']
  },
  age: { type: Number, min: 13, max: 120 },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  activityLevel: { type: String, enum: ['Sedentary', 'Light', 'Moderate', 'Active'], default: 'Light' },
  diseases: {
    type: [String],
    enum: ['BP', 'Diabetes', 'PCOD', 'Kidney Disease', 'Heart Disease'],
    default: []
  },
  goal: {
    type: String,
    required: [true, 'Goal is required'],
    enum: ['Bulking', 'Leaning', 'Maintaining Health']
  },
  proteinRequirement: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);



