const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  addFood,
  getTodayFood,
  getMealHistory,
  downloadReport
  ,getFoodDatabase
} = require('../controllers/foodController');

// All food routes require authentication
router.use(authMiddleware);

router.get('/database', getFoodDatabase);

// @route   GET /api/food/report
// @desc    Download a PDF report for a given date
// @access  Private
router.get('/report', downloadReport);

// @route   POST /api/food
// @desc    Add or update today's food intake
// @access  Private
router.post('/', addFood);

// @route   GET /api/food/today
// @desc    Get today's food intake
// @access  Private
router.get('/today', getTodayFood);

// @route   GET /api/food/history
// @desc    Get meal history
// @access  Private
router.get('/history', getMealHistory);

module.exports = router;



