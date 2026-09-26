import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [profileRes, foodRes] = await Promise.all([
        api.get('/api/profile'),
        api.get(`/api/food/today?date=${selectedDate}`),
      ]);

      if (profileRes.data.success && foodRes.data.success) {
        setData({
          profile: profileRes.data.data.profile,
          food: foodRes.data.data.food,
          proteinTracking: foodRes.data.data.proteinTracking,
          nutritionAssessment: foodRes.data.data.nutritionAssessment,
          dailyNutrition: foodRes.data.data.dailyNutrition,
          requirements: foodRes.data.data.requirements,
          comparison: foodRes.data.data.comparison,
          recommendations: foodRes.data.data.recommendations || [],
        });
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      if (err.response?.status === 404 && err.response?.data?.message?.includes('Profile')) {
        setError('Please create your profile first');
      } else {
        setError('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await api.get(`/api/food/report?date=${selectedDate}`, {
        responseType: 'blob', // Important: tells axios to expect a binary file
      });

      // Create a blob URL and a temporary link to trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Nuricheck_Report_${selectedDate}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download report:', err);
      alert('Failed to download the PDF report. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error && error.includes('Profile')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            to="/profile"
            className="inline-block px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
          >
            Create Profile
          </Link>
        </div>
      </div>
    );
  }

  const { comparison } = data || {};
  const nutritionEntries = Object.values(comparison || {});
  const achievedNutrients = nutritionEntries.filter(({ intake, recommended }) => intake >= recommended).length;
  const nutritionProgress = nutritionEntries.length
    ? Math.round(nutritionEntries.reduce((total, { intake, recommended }) => total + Math.min((intake / recommended) * 100, 100), 0) / nutritionEntries.length)
    : 0;
  const allNutritionAchieved = nutritionEntries.length > 0 && achievedNutrients === nutritionEntries.length;
  const mealItems = mealType => (data?.food?.foodItems || [])
    .filter(item => item.mealType === mealType)
    .map(item => `${item.quantity} ${item.unit} ${item.foodName}`)
    .join(', ');
  const mealText = mealType => mealItems(mealType) || data?.food?.[mealType.toLowerCase()] || '';

  return (
    <div className="min-h-screen py-4 px-4 sm:px-6 lg:px-8 bg-gray-50 flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-500">🍎 Nuricheck Dashboard</h1>
            <div className="mt-2 flex items-center space-x-4">
              <p className="text-sm font-medium text-gray-500 hidden sm:block">Track your daily nutrition intake</p>
              <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                <label htmlFor="date-picker" className="mr-2 text-sm font-medium text-gray-700">Date:</label>
                <input
                  type="date"
                  id="date-picker"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent border-none p-0 focus:ring-0 text-sm font-semibold text-cyan-700 cursor-pointer"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Link
              to="/profile"
              className="px-4 py-2 bg-white text-cyan-600 border border-cyan-200 rounded-lg hover:bg-cyan-50 hover:border-indigo-300 transition-colors text-sm font-medium shadow-sm"
            >
              Profile
            </Link>
            <Link
              to={`/food?date=${selectedDate}`}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 text-white rounded-lg hover:from-cyan-600 hover:to-violet-600 transition-all text-sm font-medium shadow-sm"
            >
              Add Food
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {error && !error.includes('Profile') && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {data && (
          <>
            {/* Overall nutrition status */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nutrition targets</div>
                <div className="text-2xl font-bold text-gray-900">
                  {nutritionEntries.length}<span className="text-base font-medium text-gray-500 ml-1">nutrients</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Targets reached</div>
                <div className="text-2xl font-bold text-cyan-600">
                  {achievedNutrients}<span className="text-base font-medium text-gray-500 ml-1">/{nutritionEntries.length}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Overall nutrition</div>
                <div className={`text-2xl font-bold ${allNutritionAchieved ? 'text-emerald-500' : 'text-orange-500'}`}>
                  {allNutritionAchieved ? 'Achieved! ✅' : 'In progress'}
                </div>
              </div>

              {/* Progress Bar (integrated into the same row for compactness) */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nutrition progress</span>
                  <span className="text-sm font-bold text-cyan-600">{nutritionProgress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-cyan-1000 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                    style={{ width: `${nutritionProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Nutrition assessment</h2>
                <p className="text-sm text-gray-500">View your complete nutrient breakdown, recommendations, and status.</p>
              </div>
              <Link
                to={`/nutrition?date=${selectedDate}`}
                className="inline-flex items-center justify-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm font-semibold"
              >
                View full details <span className="ml-2">&rarr;</span>
              </Link>
            </div>

            {/* Main Content Area - Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">

              {/* Today's Meals */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-bold text-gray-900 border-b-2 border-indigo-100 pb-1 inline-block">Today's Meals</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownloadReport}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 px-3 py-1.5 rounded-full transition-colors flex items-center"
                      title="Download PDF Report"
                    >
                      <span className="mr-1">📄</span> Download PDF
                    </button>
                    <Link
                      to={`/food?date=${selectedDate}`}
                      className="text-xs font-semibold text-cyan-600 hover:text-cyan-800 bg-cyan-50 px-3 py-1.5 rounded-full transition-colors flex items-center"
                    >
                      <span className="mr-1">✏️</span> Edit Meals
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center"><span className="mr-1">🌅</span> Breakfast</div>
                    <div className="text-sm text-gray-800 line-clamp-3">
                      {mealText('Breakfast') || <span className="text-gray-400 italic">No breakfast logged</span>}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center"><span className="mr-1">☀️</span> Lunch</div>
                    <div className="text-sm text-gray-800 line-clamp-3">
                      {mealText('Lunch') || <span className="text-gray-400 italic">No lunch logged</span>}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center"><span className="mr-1">🌙</span> Dinner</div>
                    <div className="text-sm text-gray-800 line-clamp-3">
                      {mealText('Dinner') || <span className="text-gray-400 italic">No dinner logged</span>}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center"><span className="mr-1">🍎</span> Snacks</div>
                    <div className="text-sm text-gray-800 line-clamp-3">
                      {mealText('Snacks') || <span className="text-gray-400 italic">No snacks logged</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-bold text-gray-900 border-b-2 border-purple-100 pb-1 inline-block">Profile Snapshot</h2>
                  <Link
                    to="/profile"
                    className="text-xs font-semibold text-violet-600 hover:text-purple-800 bg-violet-50 px-3 py-1.5 rounded-full transition-colors"
                  >
                    Edit Profile 👤
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div className="flex flex-col justify-center bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Metrics</div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-lg font-bold text-gray-900">{data.profile.height}</span><span className="text-xs text-gray-500">cm</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-lg font-bold text-gray-900">{data.profile.weight}</span><span className="text-xs text-gray-500">kg</span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Goal</div>
                    <div className="mt-1 text-sm font-bold text-cyan-700 bg-cyan-50 inline-block px-2 py-1 rounded inline-flex w-max">
                      {data.profile.goal}
                    </div>
                  </div>

                  <div className="col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Health Conditions</div>
                    <div className="flex flex-wrap gap-2">
                      {data.profile.diseases.length > 0 ? (
                        data.profile.diseases.map((disease, idx) => (
                          <span key={idx} className="bg-rose-50 text-rose-700 text-xs font-medium px-2.5 py-1 rounded-full border border-rose-100">
                            {disease}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500 italic">None reported</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;



