import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';

const FoodEntry = () => {
  const [formData, setFormData] = useState({
    breakfast: '',
    lunch: '',
    dinner: '',
    snacks: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [proteinInfo, setProteinInfo] = useState(null);
  const [nutritionInfo, setNutritionInfo] = useState(null);
  const [foodOptions, setFoodOptions] = useState([]);
  const [foodItems, setFoodItems] = useState([{ foodName: 'rice', quantity: 100, unit: 'grams', mealType: 'Lunch' }]);
  const [waterIntakeLitres, setWaterIntakeLitres] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchTodayFood();
    api.get('/api/food/database').then(response => setFoodOptions(response.data.data.foods || [])).catch(() => {});
  }, [dateParam]);

  const fetchTodayFood = async () => {
    try {
      const response = await api.get(`/api/food/today?date=${dateParam}`);
      if (response.data.success) {
        const food = response.data.data.food;
        setFormData({
          breakfast: food.breakfast || '',
          lunch: food.lunch || '',
          dinner: food.dinner || '',
          snacks: food.snacks || '',
        });
        setProteinInfo(response.data.data.proteinTracking);
        setNutritionInfo(response.data.data.dailyNutrition || response.data.data.nutritionAssessment);
        setFoodItems(food.foodItems || [{ foodName: 'rice', quantity: 100, unit: 'grams', mealType: 'Lunch' }]);
        setWaterIntakeLitres(food.waterIntakeLitres || 0);
      }
    } catch (err) {
      console.error('Failed to fetch today\'s food:', err);
    }
  };

  const updateFoodItem = (index, field, value) => {
    setFoodItems(items => items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: field === 'quantity' ? Number(value) : value } : item));
  };

  const addFoodItem = () => setFoodItems(items => [...items, { foodName: foodOptions[0]?.foodName || 'rice', quantity: 100, unit: 'grams', mealType: 'Lunch' }]);
  const removeFoodItem = (index) => setFoodItems(items => items.length > 1 ? items.filter((_, itemIndex) => itemIndex !== index) : items);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/api/food', { ...formData, foodItems, waterIntakeLitres, date: dateParam });

      if (response.data.success) {
        setSuccess('Food entry saved successfully!');
        setProteinInfo(response.data.data.proteinTracking);
        setNutritionInfo(response.data.data.dailyNutrition || response.data.data.nutritionAssessment);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save food entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 bg-gray-50 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">
              🍽️ Add Meals for {dateParam}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Enter your meals and we'll calculate your nutrition assessment
            </p>
          </div>
          <button
            onClick={() => navigate(`/dashboard`)}
            className="text-cyan-600 hover:text-cyan-800 font-medium text-sm flex items-center"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="border border-cyan-100 rounded-xl p-4 bg-cyan-50/40">
              <div className="flex items-center justify-between mb-3">
                <div><h3 className="font-bold text-gray-900">Food-Based Assessment</h3><p className="text-xs text-gray-600">Values are approximate per serving and intended for general guidance.</p></div>
                <button type="button" onClick={addFoodItem} className="px-3 py-1.5 text-sm font-semibold text-cyan-700 bg-white border border-cyan-200 rounded-lg">+ Add food</button>
              </div>
              <div className="space-y-3">
                {foodItems.map((item, index) => (
                  <div key={`${index}-${item.foodName}`} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-end">
                    <label className="text-xs font-semibold text-gray-600">Food
                      <select value={item.foodName} onChange={e => updateFoodItem(index, 'foodName', e.target.value)} className="mt-1 block w-full px-2 py-2 border border-gray-200 rounded-lg bg-white">
                        {foodOptions.map(food => <option key={food.foodName} value={food.foodName}>{food.foodName}</option>)}
                      </select>
                    </label>
                    <label className="text-xs font-semibold text-gray-600">Quantity<input type="number" min="0" step="0.1" value={item.quantity} onChange={e => updateFoodItem(index, 'quantity', e.target.value)} className="mt-1 block w-full px-2 py-2 border border-gray-200 rounded-lg" /></label>
                    <label className="text-xs font-semibold text-gray-600">Unit<select value={item.unit} onChange={e => updateFoodItem(index, 'unit', e.target.value)} className="mt-1 block w-full px-2 py-2 border border-gray-200 rounded-lg bg-white"><option>grams</option><option>ml</option><option>pieces</option><option>cups</option><option>kg</option></select></label>
                    <label className="text-xs font-semibold text-gray-600">Meal<select value={item.mealType} onChange={e => updateFoodItem(index, 'mealType', e.target.value)} className="mt-1 block w-full px-2 py-2 border border-gray-200 rounded-lg bg-white"><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snacks</option></select></label>
                    <button type="button" onClick={() => removeFoodItem(index)} className="py-2 text-sm text-rose-600 hover:text-rose-800">Remove</button>
                  </div>
                ))}
              </div>
              <label className="block mt-4 text-xs font-semibold text-gray-600">Water intake (litres)
                <input type="number" min="0" step="0.1" value={waterIntakeLitres} onChange={e => setWaterIntakeLitres(Number(e.target.value))} className="mt-1 block w-full sm:w-48 px-2 py-2 border border-gray-200 rounded-lg bg-white" placeholder="e.g. 2" />
              </label>
            </div>
            {proteinInfo && (
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-cyan-900 mb-2">Protein Summary</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-cyan-600">Required</div>
                    <div className="font-bold text-lg">{proteinInfo.requiredProtein}g</div>
                  </div>
                  <div>
                    <div className="text-green-600">Consumed</div>
                    <div className="font-bold text-lg">{proteinInfo.consumedProtein}g</div>
                  </div>
                  <div>
                    <div className="text-orange-600">Remaining</div>
                    <div className="font-bold text-lg">
                      {proteinInfo.remainingProtein > 0 ? `${proteinInfo.remainingProtein}g` : 'Done!'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {nutritionInfo && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-emerald-900 mb-3">Nutrition Assessment</h3>
                <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                  <div><div className="text-emerald-700">Carbohydrates</div><div className="font-bold">{nutritionInfo.carbohydrates || 0}g</div></div>
                  <div><div className="text-emerald-700">Fiber</div><div className="font-bold">{nutritionInfo.fiber || 0}g</div></div>
                  <div><div className="text-emerald-700">Water</div><div className="font-bold">{nutritionInfo.water || 0}g</div></div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-700">
                  <div><span className="font-semibold">Vitamins: </span>{Object.entries(nutritionInfo.vitamins || {}).map(([key, value]) => `${key} ${value || 0}mg`).join(' | ')}</div>
                  <div><span className="font-semibold">Minerals: </span>{Object.entries(nutritionInfo.minerals || {}).map(([key, value]) => `${key} ${value || 0}mg`).join(' | ')}</div>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate(`/dashboard`)}
                className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Saving...' : 'Save Meals'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FoodEntry;



