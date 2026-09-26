/**
 * Protein dataset containing common foods and their protein content per 100g
 * This is a sample dataset - in production, you might want to use a comprehensive food database API
 */
const proteinDataset = {
  // Meats
  'chicken': 27,
  'chicken breast': 31,
  'chicken thigh': 26,
  'beef': 26,
  'pork': 27,
  'lamb': 25,
  'turkey': 29,
  'fish': 22,
  'salmon': 25,
  'tuna': 30,
  'cod': 18,
  'shrimp': 24,
  'eggs': 13,
  'egg': 13,
  'egg white': 11,
  'egg yolk': 16,
  
  // Dairy
  'milk': 3.4,
  'yogurt': 10,
  'greek yogurt': 10,
  'cheese': 25,
  'cottage cheese': 11,
  'paneer': 18,
  'whey protein': 80,
  'protein powder': 80,
  
  // Legumes & Beans
  'lentils': 9,
  'chickpeas': 19,
  'black beans': 21,
  'kidney beans': 24,
  'tofu': 8,
  'tempeh': 19,
  'edamame': 11,
  
  // Nuts & Seeds
  'almonds': 21,
  'peanuts': 26,
  'walnuts': 15,
  'cashews': 18,
  'chia seeds': 17,
  'flax seeds': 18,
  'pumpkin seeds': 19,
  'sunflower seeds': 21,
  
  // Grains
  'quinoa': 4.4,
  'oats': 17,
  'brown rice': 2.7,
  'white rice': 2.7,
  'wheat': 13,
  'bread': 9,
  'pasta': 5,
  
  // Vegetables
  'broccoli': 2.8,
  'spinach': 2.9,
  'peas': 5,
  'corn': 3.4,
  'potato': 2,
  'sweet potato': 1.6,
  
  // Others
  'peanut butter': 25,
  'almond butter': 21,
  'soy milk': 3.3,
  'oat milk': 1,
  'almond milk': 1
};

/**
 * Extract protein from food text
 * @param {String} foodText - Food description text
 * @returns {Number} Total protein in grams
 */
const extractProteinFromFood = (foodText) => {
  if (!foodText || typeof foodText !== 'string') {
    return 0;
  }

  const text = foodText.toLowerCase().trim();
  if (text === '') return 0;

  let totalProtein = 0;
  
  // Split by common separators (comma, and, with, etc.)
  const foodItems = text.split(/[,;]|\sand\s|\swith\s/i).map(item => item.trim());
  
  foodItems.forEach(item => {
    // Try to extract quantity (e.g., "200g chicken", "2 eggs", "1 cup milk")
    const quantityMatch = item.match(/(\d+(?:\.\d+)?)\s*(g|gram|grams|kg|kilogram|kilograms|cup|cups|piece|pieces|egg|eggs|ml|liter|liters)?/i);
    let quantity = 100; // Default to 100g if no quantity specified
    let foodName = item;

    if (quantityMatch) {
      quantity = parseFloat(quantityMatch[1]);
      const unit = quantityMatch[2]?.toLowerCase() || 'g';
      
      // Convert to grams
      if (unit.includes('kg') || unit.includes('kilogram')) {
        quantity = quantity * 1000;
      } else if (unit.includes('cup')) {
        quantity = quantity * 240; // Approximate: 1 cup = 240g
      } else if (unit.includes('egg')) {
        quantity = quantity * 50; // Average egg weight
      } else if (unit.includes('ml') || unit.includes('liter')) {
        quantity = quantity * 1; // For liquids, ml ≈ g
      }
      
      // Remove quantity from food name
      foodName = item.replace(quantityMatch[0], '').trim();
    }

    // Find matching protein value
    for (const [food, proteinPer100g] of Object.entries(proteinDataset)) {
      if (foodName.includes(food) || food.includes(foodName)) {
        const protein = (quantity / 100) * proteinPer100g;
        totalProtein += protein;
        break;
      }
    }
  });

  return Math.round(totalProtein * 10) / 10; // Round to 1 decimal place
};

module.exports = {
  proteinDataset,
  extractProteinFromFood
};



