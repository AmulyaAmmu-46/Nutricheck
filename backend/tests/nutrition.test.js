const test = require('node:test');
const assert = require('node:assert/strict');
const {
  calculateFoodItems,
  calculateRequirements,
  compareNutrition,
  getRecommendations
} = require('../utils/nutritionEngine');

test('calculates structured food quantities and nutrient totals', () => {
  const totals = calculateFoodItems([
    { foodName: 'rice', quantity: 200, unit: 'grams', mealType: 'Lunch' },
    { foodName: 'banana', quantity: 1, unit: 'pieces', mealType: 'Breakfast' }
  ]);

  assert.equal(totals.calories, 349);
  assert.equal(totals.carbohydrates, 79);
  assert.equal(totals.protein, 6.5);
  assert.ok(totals.minerals.potassium > 0);
});

test('compares intake and recommends foods for low nutrients', () => {
  const requirements = calculateRequirements({
    age: 30,
    gender: 'Female',
    height: 165,
    weight: 60,
    activityLevel: 'Light',
    proteinRequirement: 60
  });
  const comparison = compareNutrition({
    calories: 500,
    protein: 10,
    carbohydrates: 40,
    fats: 10,
    fiber: 3,
    water: 500,
    vitamins: { A: 0, C: 0, D: 0, B12: 0 },
    minerals: { calcium: 100, iron: 2, magnesium: 50, potassium: 500 }
  }, requirements);

  assert.equal(comparison.protein.status, 'Low');
  assert.ok(getRecommendations(comparison).includes('Eggs'));
  assert.ok(getRecommendations(comparison).includes('Orange'));
});
