/**
 * Calculate daily protein requirement based on weight and goal
 * @param {Number} weight - User weight in kg
 * @param {String} goal - User goal (Bulking, Leaning, Maintaining Health)
 * @returns {Number} Daily protein requirement in grams
 */
const calculateProtein = (weight, goal) => {
  let multiplier;
  
  switch (goal) {
    case 'Bulking':
      multiplier = 2;
      break;
    case 'Leaning':
      multiplier = 1.6;
      break;
    case 'Maintaining Health':
      multiplier = 1;
      break;
    default:
      multiplier = 1;
  }
  
  return Math.round(weight * multiplier);
};

module.exports = calculateProtein;



