const Food = require('../models/Food');
const Profile = require('../models/Profile');
const { extractProteinFromFood } = require('../utils/proteinDataset');
const { extractNutritionFromFood, emptyNutrition } = require('../utils/nutritionDataset');
const { foods, emptyTotals, calculateFoodItems, calculateRequirements, compareNutrition, getRecommendations, roundTotals } = require('../utils/nutritionEngine');
const { generateMealReportPDF } = require('../utils/pdfService');

const calculateNutrition = meals => meals.reduce((total, meal) => {
  const nutrients = extractNutritionFromFood(meal || '');
  total.carbohydrates += nutrients.carbohydrates;
  total.fiber += nutrients.fiber;
  total.water += nutrients.water;
  Object.keys(total.vitamins).forEach(key => { total.vitamins[key] += nutrients.vitamins[key]; });
  Object.keys(total.minerals).forEach(key => { total.minerals[key] += nutrients.minerals[key]; });
  return total;
}, emptyNutrition());

/**
 * Add or update food intake for today
 */
exports.addFood = async (req, res) => {
  try {
    const { breakfast, lunch, dinner, snacks, date, foodItems, waterIntakeLitres } = req.body;
    const userId = req.user._id;

    // Get target date (start of day)
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    // Calculate protein from all meals
    const breakfastProtein = extractProteinFromFood(breakfast || '');
    const lunchProtein = extractProteinFromFood(lunch || '');
    const dinnerProtein = extractProteinFromFood(dinner || '');
    const snacksProtein = extractProteinFromFood(snacks || '');

    let totalProteinConsumed = breakfastProtein + lunchProtein + dinnerProtein + snacksProtein;

    const nutritionConsumed = calculateNutrition([breakfast, lunch, dinner, snacks]);
    const structuredItems = Array.isArray(foodItems) ? foodItems : [];
    const dailyNutrition = structuredItems.length
      ? roundTotals(calculateFoodItems(structuredItems))
      : { ...emptyTotals(), ...nutritionConsumed, protein: totalProteinConsumed };
    if (structuredItems.length) totalProteinConsumed = dailyNutrition.protein;
    dailyNutrition.water += (Number(waterIntakeLitres) || 0) * 1000;
    dailyNutrition.water = Math.round(dailyNutrition.water * 10) / 10;
    // Find or create today's food entry
    let foodEntry = await Food.findOne({
      userId,
      date: {
        $gte: targetDate,
        $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (foodEntry) {
      // Update existing entry
      foodEntry.breakfast = breakfast || foodEntry.breakfast;
      foodEntry.lunch = lunch || foodEntry.lunch;
      foodEntry.dinner = dinner || foodEntry.dinner;
      foodEntry.snacks = snacks || foodEntry.snacks;
      foodEntry.proteinConsumed = totalProteinConsumed;
      foodEntry.nutritionConsumed = nutritionConsumed;
      foodEntry.foodItems = structuredItems;
      foodEntry.waterIntakeLitres = Number(waterIntakeLitres) || 0;
      foodEntry.dailyNutrition = dailyNutrition;
      await foodEntry.save();
    } else {
      // Create new entry
      foodEntry = await Food.create({
        userId,
        date: targetDate,
        breakfast: breakfast || '',
        lunch: lunch || '',
        dinner: dinner || '',
        snacks: snacks || '',
        proteinConsumed: totalProteinConsumed,
        nutritionConsumed
        ,foodItems: structuredItems,
        waterIntakeLitres: Number(waterIntakeLitres) || 0,
        dailyNutrition
      });
    }

    // Get user profile for protein requirement
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(200).json({
        success: true,
        message: 'Food entry saved successfully',
        data: {
          food: {
            breakfast: foodEntry.breakfast,
            lunch: foodEntry.lunch,
            dinner: foodEntry.dinner,
            snacks: foodEntry.snacks,
            proteinConsumed: foodEntry.proteinConsumed,
            nutritionConsumed: foodEntry.nutritionConsumed
          },
          note: 'Profile not found. Please create your profile to see protein tracking.'
        }
      });
    }

    const requiredProtein = profile.proteinRequirement;
    const remainingProtein = requiredProtein - totalProteinConsumed;
    const requirements = calculateRequirements(profile);
    const comparison = compareNutrition(dailyNutrition, requirements);

    res.status(200).json({
      success: true,
      message: 'Food entry saved successfully.',
      data: {
        food: {
          breakfast: foodEntry.breakfast,
          lunch: foodEntry.lunch,
          dinner: foodEntry.dinner,
          snacks: foodEntry.snacks,
          proteinConsumed: foodEntry.proteinConsumed,
          nutritionConsumed: foodEntry.nutritionConsumed
        },
        proteinTracking: {
          requiredProtein,
          consumedProtein: totalProteinConsumed,
          remainingProtein: remainingProtein > 0 ? remainingProtein : 0
        },
        nutritionAssessment: dailyNutrition
        ,dailyNutrition,
        requirements,
        comparison,
        recommendations: getRecommendations(comparison)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to save food entry',
      error: error.message
    });
  }
};

/**
 * Get today's food intake
 */
exports.getTodayFood = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date } = req.query;

    // Get target date (start of day)
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const foodEntry = await Food.findOne({
      userId,
      date: {
        $gte: targetDate,
        $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    // Get user profile
    const profile = await Profile.findOne({ userId });
    const nutritionAssessment = foodEntry?.nutritionConsumed || emptyNutrition();
    const consumedProtein = foodEntry ? foodEntry.proteinConsumed : 0;
    const dailyNutrition = foodEntry?.dailyNutrition || { ...emptyTotals(), ...nutritionAssessment, protein: consumedProtein };
    const requirements = calculateRequirements(profile || {});
    const comparison = compareNutrition(dailyNutrition, requirements);

    if (!profile) {
      return res.status(200).json({
        success: true,
        data: {
          food: foodEntry || null,
          proteinTracking: null,
          nutritionAssessment,
          message: 'Profile not found. Please create your profile first.'
        }
      });
    }

    const requiredProtein = profile.proteinRequirement;
    const remainingProtein = requiredProtein - consumedProtein;

    res.status(200).json({
      success: true,
      data: {
        food: foodEntry || {
          breakfast: '',
          lunch: '',
          dinner: '',
          snacks: '',
          proteinConsumed: 0,
          nutritionConsumed: emptyNutrition()
        },
        proteinTracking: {
          requiredProtein,
          consumedProtein,
          remainingProtein: remainingProtein > 0 ? remainingProtein : 0
        },
        nutritionAssessment: dailyNutrition
        ,dailyNutrition,
        requirements,
        comparison,
        recommendations: getRecommendations(comparison)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch food entry',
      error: error.message
    });
  }
};

exports.getFoodDatabase = async (req, res) => {
  res.status(200).json({ success: true, data: { foods: Object.keys(foods).map(foodName => ({ foodName, ...foods[foodName] })) } });
};

/**
 * Get meal history
 */
exports.getMealHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 7; // Default to last 7 days

    const foodEntries = await Food.find({ userId })
      .sort({ date: -1 })
      .limit(limit)
      .select('-__v');

    res.status(200).json({
      success: true,
      data: {
        history: foodEntries
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch meal history',
      error: error.message
    });
  }
};

/**
 * Generate and download PDF report
 */
exports.downloadReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, message: 'Please provide a date' });
    }

    // Get target date (start of day)
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const foodEntry = await Food.findOne({
      userId,
      date: {
        $gte: targetDate,
        $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!foodEntry) {
      return res.status(404).json({ success: false, message: 'No food logs found for this date' });
    }

    // Get user profile
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(400).json({ success: false, message: 'Profile not found. Please create your profile first.' });
    }

    const requiredProtein = profile.proteinRequirement;
    const consumedProtein = foodEntry.proteinConsumed;
    const remainingProtein = requiredProtein - consumedProtein;

    // Generate PDF summary
    const pdfBuffer = await generateMealReportPDF({
      date: date,
      food: {
        breakfast: foodEntry.breakfast,
        lunch: foodEntry.lunch,
        dinner: foodEntry.dinner,
        snacks: foodEntry.snacks
      },
      foodItems: foodEntry.foodItems,
      profile: {
        age: profile.age,
        gender: profile.gender,
        activityLevel: profile.activityLevel,
        goal: profile.goal
      },
      proteinTracking: {
        requiredProtein,
        consumedProtein,
        remainingProtein: remainingProtein > 0 ? remainingProtein : 0
      },
      dailyNutrition: foodEntry.dailyNutrition,
      nutritionAssessment: foodEntry.nutritionConsumed,
      comparison: foodEntry.dailyNutrition ? compareNutrition(foodEntry.dailyNutrition, calculateRequirements(profile)) : {},
      recommendations: foodEntry.dailyNutrition ? getRecommendations(compareNutrition(foodEntry.dailyNutrition, calculateRequirements(profile))) : []
    });

    // Send PDF buffer as attachment
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Nuricheck_Report_${date}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report',
      error: error.message
    });
  }
};



