const foods = {
  rice: { calories: 130, protein: 2.7, carbohydrates: 28, fats: 0.3, fiber: 0.4, water: 68, vitamins: { A: 0, C: 0, D: 0, B12: 0 }, minerals: { calcium: 10, iron: 0.2, magnesium: 12, potassium: 35 } },
  chapati: { calories: 297, protein: 11, carbohydrates: 55, fats: 4, fiber: 11, water: 30, vitamins: { A: 0, C: 0, D: 0, B12: 0 }, minerals: { calcium: 125, iron: 3.9, magnesium: 82, potassium: 282 } },
  oats: { calories: 389, protein: 17, carbohydrates: 66, fats: 7, fiber: 11, water: 8, vitamins: { A: 0, C: 0, D: 0, B12: 0 }, minerals: { calcium: 54, iron: 4.7, magnesium: 177, potassium: 429 } },
  potato: { calories: 77, protein: 2, carbohydrates: 17, fats: 0.1, fiber: 2.2, water: 79, vitamins: { A: 0, C: 20, D: 0, B12: 0 }, minerals: { calcium: 12, iron: 0.8, magnesium: 23, potassium: 421 } },
  bread: { calories: 265, protein: 9, carbohydrates: 49, fats: 3.2, fiber: 2.7, water: 36, vitamins: { A: 0, C: 0, D: 0, B12: 0.1 }, minerals: { calcium: 107, iron: 3.6, magnesium: 82, potassium: 230 } },
  banana: { calories: 89, protein: 1.1, carbohydrates: 23, fats: 0.3, fiber: 2.6, water: 75, vitamins: { A: 3, C: 8.7, D: 0, B12: 0 }, minerals: { calcium: 5, iron: 0.3, magnesium: 27, potassium: 358 } },
  apple: { calories: 52, protein: 0.3, carbohydrates: 14, fats: 0.2, fiber: 2.4, water: 86, vitamins: { A: 3, C: 4.6, D: 0, B12: 0 }, minerals: { calcium: 6, iron: 0.1, magnesium: 5, potassium: 107 } },
  orange: { calories: 47, protein: 0.9, carbohydrates: 12, fats: 0.1, fiber: 2.4, water: 87, vitamins: { A: 11, C: 53, D: 0, B12: 0 }, minerals: { calcium: 40, iron: 0.1, magnesium: 10, potassium: 181 } },
  mango: { calories: 60, protein: 0.8, carbohydrates: 15, fats: 0.4, fiber: 1.6, water: 83, vitamins: { A: 54, C: 36, D: 0, B12: 0 }, minerals: { calcium: 11, iron: 0.2, magnesium: 10, potassium: 168 } },
  papaya: { calories: 43, protein: 0.5, carbohydrates: 11, fats: 0.3, fiber: 1.7, water: 88, vitamins: { A: 47, C: 61, D: 0, B12: 0 }, minerals: { calcium: 20, iron: 0.3, magnesium: 21, potassium: 182 } },
  carrot: { calories: 41, protein: 0.9, carbohydrates: 10, fats: 0.2, fiber: 2.8, water: 88, vitamins: { A: 835, C: 6, D: 0, B12: 0 }, minerals: { calcium: 33, iron: 0.3, magnesium: 12, potassium: 320 } },
  spinach: { calories: 23, protein: 2.9, carbohydrates: 3.6, fats: 0.4, fiber: 2.2, water: 91, vitamins: { A: 469, C: 28, D: 0, B12: 0 }, minerals: { calcium: 99, iron: 2.7, magnesium: 79, potassium: 558 } },
  tomato: { calories: 18, protein: 0.9, carbohydrates: 3.9, fats: 0.2, fiber: 1.2, water: 95, vitamins: { A: 42, C: 14, D: 0, B12: 0 }, minerals: { calcium: 10, iron: 0.3, magnesium: 11, potassium: 237 } },
  beans: { calories: 31, protein: 1.8, carbohydrates: 7, fats: 0.2, fiber: 2.7, water: 90, vitamins: { A: 35, C: 12, D: 0, B12: 0 }, minerals: { calcium: 37, iron: 1, magnesium: 25, potassium: 211 } },
  dal: { calories: 116, protein: 9, carbohydrates: 20, fats: 0.4, fiber: 8, water: 69, vitamins: { A: 8, C: 1.5, D: 0, B12: 0 }, minerals: { calcium: 19, iron: 3.3, magnesium: 36, potassium: 369 } },
  lentils: { calories: 116, protein: 9, carbohydrates: 20, fats: 0.4, fiber: 8, water: 69, vitamins: { A: 8, C: 1.5, D: 0, B12: 0 }, minerals: { calcium: 19, iron: 3.3, magnesium: 36, potassium: 369 } },
  chickpeas: { calories: 164, protein: 9, carbohydrates: 27, fats: 2.6, fiber: 8, water: 60, vitamins: { A: 1, C: 4, D: 0, B12: 0 }, minerals: { calcium: 49, iron: 2.9, magnesium: 48, potassium: 291 } },
  soybean: { calories: 173, protein: 17, carbohydrates: 10, fats: 9, fiber: 6, water: 63, vitamins: { A: 1, C: 6, D: 0, B12: 0 }, minerals: { calcium: 102, iron: 5.1, magnesium: 86, potassium: 515 } },
  egg: { calories: 143, protein: 13, carbohydrates: 1.1, fats: 10, fiber: 0, water: 76, vitamins: { A: 160, C: 0, D: 2, B12: 1.8 }, minerals: { calcium: 56, iron: 1.8, magnesium: 12, potassium: 138 } },
  chicken: { calories: 165, protein: 31, carbohydrates: 0, fats: 3.6, fiber: 0, water: 65, vitamins: { A: 6, C: 0, D: 0.1, B12: 0.3 }, minerals: { calcium: 15, iron: 1, magnesium: 29, potassium: 256 } },
  fish: { calories: 140, protein: 22, carbohydrates: 0, fats: 5, fiber: 0, water: 65, vitamins: { A: 12, C: 0, D: 8, B12: 2.5 }, minerals: { calcium: 12, iron: 0.3, magnesium: 29, potassium: 363 } },
  milk: { calories: 61, protein: 3.4, carbohydrates: 5, fats: 3.3, fiber: 0, water: 88, vitamins: { A: 46, C: 0, D: 1.2, B12: 0.4 }, minerals: { calcium: 125, iron: 0, magnesium: 11, potassium: 150 } },
  curd: { calories: 61, protein: 3.5, carbohydrates: 4.7, fats: 3.3, fiber: 0, water: 88, vitamins: { A: 27, C: 0.5, D: 0.1, B12: 0.4 }, minerals: { calcium: 121, iron: 0.1, magnesium: 12, potassium: 155 } },
  paneer: { calories: 265, protein: 18, carbohydrates: 6, fats: 20, fiber: 0, water: 52, vitamins: { A: 210, C: 0, D: 0.1, B12: 0.8 }, minerals: { calcium: 208, iron: 2.2, magnesium: 26, potassium: 138 } },
  nuts: { calories: 579, protein: 21, carbohydrates: 22, fats: 50, fiber: 12, water: 5, vitamins: { A: 0, C: 0, D: 0, B12: 0 }, minerals: { calcium: 269, iron: 3.7, magnesium: 270, potassium: 733 } },
  seeds: { calories: 486, protein: 17, carbohydrates: 30, fats: 31, fiber: 27, water: 8, vitamins: { A: 0, C: 1, D: 0, B12: 0 }, minerals: { calcium: 631, iron: 7.7, magnesium: 335, potassium: 813 } }
};

const recommendations = {
  protein: ['Eggs', 'Dal', 'Paneer', 'Milk', 'Fish'], fiber: ['Oats', 'Fruits', 'Vegetables', 'Beans', 'Chia seeds'],
  vitaminC: ['Orange', 'Papaya', 'Tomato', 'Spinach'], calcium: ['Milk', 'Curd', 'Paneer', 'Seeds'],
  iron: ['Spinach', 'Lentils', 'Beans', 'Seeds'], water: ['Water', 'Orange', 'Papaya', 'Tomato']
};

const emptyTotals = () => ({ calories: 0, protein: 0, carbohydrates: 0, fats: 0, fiber: 0, water: 0, vitamins: { A: 0, C: 0, D: 0, B12: 0 }, minerals: { calcium: 0, iron: 0, magnesium: 0, potassium: 0 } });
const roundTotals = totals => {
  Object.keys(totals).filter(key => !['vitamins', 'minerals'].includes(key)).forEach(key => { totals[key] = Math.round(totals[key] * 10) / 10; });
  [totals.vitamins, totals.minerals].forEach(group => Object.keys(group).forEach(key => { group[key] = Math.round(group[key] * 10) / 10; }));
  return totals;
};

const unitToGrams = (quantity, unit) => {
  const value = Number(quantity) || 0;
  if (unit === 'kg' || unit === 'liters') return value * 1000;
  if (unit === 'cups') return value * 240;
  if (unit === 'pieces') return value * 100;
  return value;
};

const calculateFoodItems = items => (items || []).reduce((totals, item) => {
  const food = foods[String(item.foodName || '').toLowerCase()];
  if (!food) return totals;
  const scale = unitToGrams(item.quantity, item.unit || 'grams') / 100;
  ['calories', 'protein', 'carbohydrates', 'fats', 'fiber', 'water'].forEach(key => { totals[key] += food[key] * scale; });
  Object.keys(totals.vitamins).forEach(key => { totals.vitamins[key] += food.vitamins[key] * scale; });
  Object.keys(totals.minerals).forEach(key => { totals.minerals[key] += food.minerals[key] * scale; });
  return totals;
}, emptyTotals());

const calculateRequirements = profile => {
  const weight = Number(profile.weight) || 0;
  const age = Number(profile.age) || 30;
  const height = Number(profile.height) || 170;
  const base = profile.gender === 'Female' ? 10 * weight + 6.25 * height - 5 * age - 161 : 10 * weight + 6.25 * height - 5 * age + 5;
  const activity = { Sedentary: 1.2, Light: 1.375, Moderate: 1.55, Active: 1.725 }[profile.activityLevel] || 1.375;
  const calories = Math.max(1200, Math.round(base * activity));
  return { calories, protein: Number(profile.proteinRequirement) || Math.round(weight), carbohydrates: Math.round(calories * 0.5 / 4), fats: Math.round(calories * 0.3 / 9), fiber: Math.round(calories / 1000 * 14), water: profile.gender === 'Female' ? 2.2 : 2.5, vitamins: { A: 700, C: 75, D: 15, B12: 2.4 }, minerals: { calcium: 1000, iron: profile.gender === 'Female' ? 18 : 8, magnesium: profile.gender === 'Female' ? 310 : 400, potassium: 3500 } };
};

const compareNutrition = (intake, requirements) => {
  const comparison = {};
  const add = (key, intakeValue, requirement) => { const ratio = requirement ? intakeValue / requirement : 0; comparison[key] = { intake: Math.round(intakeValue * 10) / 10, recommended: requirement, status: ratio < 0.8 ? 'Low' : ratio > 1.2 ? 'High' : 'Adequate' }; };
  ['calories', 'protein', 'carbohydrates', 'fats', 'fiber'].forEach(key => add(key, intake[key], requirements[key]));
  add('water', intake.water / 1000, requirements.water);
  Object.keys(requirements.vitamins).forEach(key => add(`vitamin${key}`, intake.vitamins[key], requirements.vitamins[key]));
  Object.keys(requirements.minerals).forEach(key => add(key, intake.minerals[key], requirements.minerals[key]));
  return comparison;
};

const getRecommendations = comparison => Object.entries(comparison).filter(([, value]) => value.status === 'Low').flatMap(([key]) => {
  if (key === 'protein') return recommendations.protein;
  if (key === 'fiber') return recommendations.fiber;
  if (key === 'vitaminC') return recommendations.vitaminC;
  if (key === 'calcium') return recommendations.calcium;
  if (key === 'iron') return recommendations.iron;
  if (key === 'water') return recommendations.water;
  return [];
}).filter((value, index, list) => list.indexOf(value) === index);

module.exports = { foods, emptyTotals, calculateFoodItems, calculateRequirements, compareNutrition, getRecommendations, roundTotals };