const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  breakfast: {
    type: String,
    default: ''
  },
  lunch: {
    type: String,
    default: ''
  },
  dinner: {
    type: String,
    default: ''
  },
  snacks: {
    type: String,
    default: ''
  },
  foodItems: [{
    foodName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, enum: ['grams', 'ml', 'pieces', 'cups', 'kg', 'liters'], default: 'grams' },
    mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'], required: true }
  }],
  waterIntakeLitres: { type: Number, default: 0, min: 0 },
  proteinConsumed: {
    type: Number,
    default: 0,
    min: 0
  },
  nutritionConsumed: {
    carbohydrates: { type: Number, default: 0, min: 0 },
    fiber: { type: Number, default: 0, min: 0 },
    water: { type: Number, default: 0, min: 0 },
    vitamins: {
      A: { type: Number, default: 0, min: 0 }, C: { type: Number, default: 0, min: 0 },
      D: { type: Number, default: 0, min: 0 }, E: { type: Number, default: 0, min: 0 },
      K: { type: Number, default: 0, min: 0 }, B12: { type: Number, default: 0, min: 0 }
    },
    minerals: {
      calcium: { type: Number, default: 0, min: 0 }, iron: { type: Number, default: 0, min: 0 },
      magnesium: { type: Number, default: 0, min: 0 }, potassium: { type: Number, default: 0, min: 0 },
      zinc: { type: Number, default: 0, min: 0 }
    }
  },
  dailyNutrition: {
    calories: { type: Number, default: 0, min: 0 },
    protein: { type: Number, default: 0, min: 0 },
    carbohydrates: { type: Number, default: 0, min: 0 },
    fats: { type: Number, default: 0, min: 0 },
    fiber: { type: Number, default: 0, min: 0 },
    water: { type: Number, default: 0, min: 0 },
    vitamins: { type: mongoose.Schema.Types.Mixed, default: {} },
    minerals: { type: mongoose.Schema.Types.Mixed, default: {} }
  }
}, {
  timestamps: true
});

// Index for efficient queries
foodSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('Food', foodSchema);



