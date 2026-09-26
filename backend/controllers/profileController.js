const Profile = require('../models/Profile');
const calculateProtein = require('../utils/calculateProtein');

/**
 * Create or update user profile
 */
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { height, weight, age, gender, activityLevel, diseases, goal } = req.body;
    const userId = req.user._id;

    // Validation
    if (!height || !weight || !goal) {
      return res.status(400).json({
        success: false,
        message: 'Please provide height, weight, and goal'
      });
    }

    // Calculate protein requirement
    const proteinRequirement = calculateProtein(weight, goal);

    // Check if profile exists
    let profile = await Profile.findOne({ userId });

    if (profile) {
      // Update existing profile
      profile.height = height;
      profile.weight = weight;
      profile.age = age;
      profile.gender = gender;
      profile.activityLevel = activityLevel || 'Light';
      profile.diseases = diseases || [];
      profile.goal = goal;
      profile.proteinRequirement = proteinRequirement;
      await profile.save();
    } else {
      // Create new profile
      profile = await Profile.create({
        userId,
        height,
        weight,
        age,
        gender,
        activityLevel: activityLevel || 'Light',
        diseases: diseases || [],
        goal,
        proteinRequirement
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile saved successfully',
      data: {
        profile: {
          height: profile.height,
          weight: profile.weight,
          age: profile.age,
          gender: profile.gender,
          activityLevel: profile.activityLevel,
          diseases: profile.diseases,
          goal: profile.goal,
          proteinRequirement: profile.proteinRequirement
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Profile creation/update failed',
      error: error.message
    });
  }
};

/**
 * Get user profile
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Please create your profile first.'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        profile: {
          height: profile.height,
          weight: profile.weight,
          age: profile.age,
          gender: profile.gender,
          activityLevel: profile.activityLevel,
          diseases: profile.diseases,
          goal: profile.goal,
          proteinRequirement: profile.proteinRequirement
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};



