const nutritionDataset = {
  chicken: { carbohydrates: 0, fiber: 0, water: 65, vitamins: { A: 6, C: 0, D: 0.1, E: 0.3, K: 2.4, B12: 0.3 }, minerals: { calcium: 15, iron: 1, magnesium: 29, potassium: 256, zinc: 1.3 } },
  beef: { carbohydrates: 0, fiber: 0, water: 61, vitamins: { A: 0, C: 0, D: 0.1, E: 0.2, K: 1.2, B12: 2.5 }, minerals: { calcium: 12, iron: 2.6, magnesium: 21, potassium: 318, zinc: 5.1 } },
  salmon: { carbohydrates: 0, fiber: 0, water: 64, vitamins: { A: 12, C: 0, D: 11, E: 2.3, K: 0.1, B12: 3.2 }, minerals: { calcium: 12, iron: 0.3, magnesium: 29, potassium: 363, zinc: 0.6 } },
  eggs: { carbohydrates: 1.1, fiber: 0, water: 76, vitamins: { A: 160, C: 0, D: 2, E: 1.1, K: 0.3, B12: 1.8 }, minerals: { calcium: 56, iron: 1.8, magnesium: 12, potassium: 138, zinc: 1.3 } },
  milk: { carbohydrates: 5, fiber: 0, water: 88, vitamins: { A: 46, C: 0, D: 1.2, E: 0.1, K: 0.3, B12: 0.4 }, minerals: { calcium: 125, iron: 0, magnesium: 11, potassium: 150, zinc: 0.4 } },
  yogurt: { carbohydrates: 4, fiber: 0, water: 82, vitamins: { A: 27, C: 0.5, D: 0.1, E: 0.1, K: 0, B12: 0.4 }, minerals: { calcium: 110, iron: 0.1, magnesium: 11, potassium: 141, zinc: 0.5 } },
  lentils: { carbohydrates: 20, fiber: 8, water: 69, vitamins: { A: 8, C: 1.5, D: 0, E: 0.1, K: 1.7, B12: 0 }, minerals: { calcium: 19, iron: 3.3, magnesium: 36, potassium: 369, zinc: 1.3 } },
  chickpeas: { carbohydrates: 27, fiber: 8, water: 60, vitamins: { A: 1, C: 4, D: 0, E: 0.4, K: 4, B12: 0 }, minerals: { calcium: 49, iron: 2.9, magnesium: 48, potassium: 291, zinc: 1.5 } },
  tofu: { carbohydrates: 2, fiber: 0.9, water: 83, vitamins: { A: 0, C: 0.1, D: 0, E: 0, K: 2.4, B12: 0 }, minerals: { calcium: 350, iron: 5.4, magnesium: 30, potassium: 121, zinc: 2 } },
  almonds: { carbohydrates: 22, fiber: 12, water: 5, vitamins: { A: 0, C: 0, D: 0, E: 25.6, K: 0, B12: 0 }, minerals: { calcium: 269, iron: 3.7, magnesium: 270, potassium: 733, zinc: 3.1 } },
  oats: { carbohydrates: 62, fiber: 11, water: 8, vitamins: { A: 0, C: 0, D: 0, E: 0.4, K: 2, B12: 0 }, minerals: { calcium: 54, iron: 4.7, magnesium: 177, potassium: 429, zinc: 4 } },
  quinoa: { carbohydrates: 64, fiber: 7, water: 13, vitamins: { A: 1, C: 0, D: 0, E: 2.4, K: 0, B12: 0 }, minerals: { calcium: 47, iron: 4.6, magnesium: 197, potassium: 563, zinc: 3.1 } },
  'brown rice': { carbohydrates: 76, fiber: 3.6, water: 12, vitamins: { A: 0, C: 0, D: 0, E: 0.6, K: 0.6, B12: 0 }, minerals: { calcium: 33, iron: 1.8, magnesium: 143, potassium: 268, zinc: 2 } },
  broccoli: { carbohydrates: 7, fiber: 2.6, water: 90, vitamins: { A: 31, C: 89, D: 0, E: 0.8, K: 102, B12: 0 }, minerals: { calcium: 47, iron: 0.7, magnesium: 21, potassium: 316, zinc: 0.4 } },
  spinach: { carbohydrates: 3.6, fiber: 2.2, water: 91, vitamins: { A: 469, C: 28, D: 0, E: 2, K: 483, B12: 0 }, minerals: { calcium: 99, iron: 2.7, magnesium: 79, potassium: 558, zinc: 0.5 } },
  potato: { carbohydrates: 17, fiber: 2.2, water: 79, vitamins: { A: 0, C: 20, D: 0, E: 0.1, K: 1.9, B12: 0 }, minerals: { calcium: 12, iron: 0.8, magnesium: 23, potassium: 421, zinc: 0.3 } },
  banana: { carbohydrates: 23, fiber: 2.6, water: 75, vitamins: { A: 3, C: 8.7, D: 0, E: 0.1, K: 0.5, B12: 0 }, minerals: { calcium: 5, iron: 0.3, magnesium: 27, potassium: 358, zinc: 0.2 } },
  apple: { carbohydrates: 14, fiber: 2.4, water: 86, vitamins: { A: 3, C: 4.6, D: 0, E: 0.2, K: 2.2, B12: 0 }, minerals: { calcium: 6, iron: 0.1, magnesium: 5, potassium: 107, zinc: 0 } }
};

const vitaminKeys = ['A', 'C', 'D', 'E', 'K', 'B12'];
const mineralKeys = ['calcium', 'iron', 'magnesium', 'potassium', 'zinc'];

const emptyNutrition = () => ({
  carbohydrates: 0,
  fiber: 0,
  water: 0,
  vitamins: Object.fromEntries(vitaminKeys.map(key => [key, 0])),
  minerals: Object.fromEntries(mineralKeys.map(key => [key, 0]))
});

const extractNutritionFromFood = (foodText) => {
  const total = emptyNutrition();
  if (!foodText || typeof foodText !== 'string' || !foodText.trim()) return total;

  const foodItems = foodText.toLowerCase().trim().split(/[,;]|\sand\s|\swith\s/i).map(item => item.trim());
  foodItems.forEach(item => {
    const quantityMatch = item.match(/(\d+(?:\.\d+)?)\s*(g|gram|grams|kg|kilogram|kilograms|cup|cups|piece|pieces|egg|eggs|ml|liter|liters)?/i);
    let quantity = 100;
    let foodName = item;
    if (quantityMatch) {
      quantity = parseFloat(quantityMatch[1]);
      const unit = quantityMatch[2]?.toLowerCase() || 'g';
      if (unit.includes('kg') || unit.includes('kilogram')) quantity *= 1000;
      else if (unit.includes('cup')) quantity *= 240;
      else if (unit.includes('egg') || unit.includes('piece')) quantity *= 50;
      else if (unit.includes('ml') || unit.includes('liter')) quantity *= 1;
      foodName = item.replace(quantityMatch[0], '').trim();
    }

    const food = Object.keys(nutritionDataset).find(name => foodName.includes(name) || name.includes(foodName));
    if (!food) return;
    const scale = quantity / 100;
    total.carbohydrates += nutritionDataset[food].carbohydrates * scale;
    total.fiber += nutritionDataset[food].fiber * scale;
    total.water += nutritionDataset[food].water * scale;
    vitaminKeys.forEach(key => { total.vitamins[key] += nutritionDataset[food].vitamins[key] * scale; });
    mineralKeys.forEach(key => { total.minerals[key] += nutritionDataset[food].minerals[key] * scale; });
  });

  ['carbohydrates', 'fiber', 'water'].forEach(key => { total[key] = Math.round(total[key] * 10) / 10; });
  vitaminKeys.concat(mineralKeys).forEach(key => {
    const group = vitaminKeys.includes(key) ? total.vitamins : total.minerals;
    group[key] = Math.round(group[key] * 10) / 10;
  });
  return total;
};

module.exports = { nutritionDataset, extractNutritionFromFood, emptyNutrition };