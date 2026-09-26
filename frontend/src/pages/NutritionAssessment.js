import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../utils/api';

const nutrientCards = [
  ['Calories', 'calories', 'kcal', 'text-rose-600'],
  ['Protein', 'protein', 'g', 'text-cyan-600'],
  ['Carbohydrates', 'carbohydrates', 'g', 'text-amber-600'],
  ['Fats', 'fats', 'g', 'text-violet-600'],
  ['Fiber', 'fiber', 'g', 'text-emerald-600'],
];

const NutritionAssessment = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const selectedDate = searchParams.get('date') || new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchNutritionData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/api/food/today?date=${selectedDate}`);
        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError('Failed to load nutrition assessment');
        }
      } catch (err) {
        setError('Failed to load nutrition assessment');
      } finally {
        setLoading(false);
      }
    };

    fetchNutritionData();
  }, [selectedDate]);

  const handleDateChange = (event) => {
    setSearchParams({ date: event.target.value });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const dailyNutrition = data?.dailyNutrition || {};
  const comparison = data?.comparison || {};
  const nutritionAssessment = data?.nutritionAssessment || {};
  const recommendations = data?.recommendations || [];

  return (
    <div className="min-h-screen py-4 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div>
            <Link to="/dashboard" className="text-sm font-semibold text-cyan-600 hover:text-cyan-800">&larr; Back to dashboard</Link>
            <h1 className="mt-2 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-500">Nutrition Assessment</h1>
            <p className="mt-1 text-sm font-medium text-gray-500">Review your complete daily nutrient breakdown</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
            <label htmlFor="assessment-date" className="mr-2 text-sm font-medium text-gray-700">Date:</label>
            <input
              type="date"
              id="assessment-date"
              value={selectedDate}
              onChange={handleDateChange}
              className="bg-transparent border-none p-0 focus:ring-0 text-sm font-semibold text-cyan-700 cursor-pointer"
            />
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        {!error && (
          <>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Daily intake</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                {nutrientCards.map(([label, key, unit, color]) => (
                  <div key={label} className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs font-semibold text-gray-500 uppercase">{label}</div>
                    <div className={`text-xl font-bold ${color}`}>{dailyNutrition[key] || 0}<span className="text-xs text-gray-500 ml-1">{unit}</span></div>
                  </div>
                ))}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs font-semibold text-gray-500 uppercase">Water</div>
                  <div className="text-xl font-bold text-blue-600">{dailyNutrition.water ? dailyNutrition.water / 1000 : 0}<span className="text-xs text-gray-500 ml-1">L</span></div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase text-gray-500 border-b">
                    <tr><th className="py-3">Nutrient</th><th className="py-3">Daily intake</th><th className="py-3">Recommended</th><th className="py-3">Status</th></tr>
                  </thead>
                  <tbody>
                    {Object.entries(comparison).map(([key, value]) => (
                      <tr key={key} className="border-b border-gray-50">
                        <td className="py-3 capitalize">{key.replace('vitamin', 'Vitamin ')}</td>
                        <td className="py-3">{value.intake}</td>
                        <td className="py-3">{value.recommended}</td>
                        <td className={`py-3 font-semibold ${value.status === 'Low' ? 'text-amber-600' : value.status === 'High' ? 'text-rose-600' : 'text-emerald-600'}`}>{value.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm mt-6 pt-5 border-t">
                <div>
                  <div className="font-semibold text-gray-700 mb-2">Vitamins</div>
                  {Object.entries(nutritionAssessment.vitamins || {}).map(([key, value]) => <div key={key} className="flex justify-between text-gray-600"><span>{key}</span><span>{value || 0} mg</span></div>)}
                </div>
                <div>
                  <div className="font-semibold text-gray-700 mb-2">Minerals</div>
                  {Object.entries(nutritionAssessment.minerals || {}).map(([key, value]) => <div key={key} className="flex justify-between text-gray-600"><span className="capitalize">{key}</span><span>{value || 0} mg</span></div>)}
                </div>
              </div>

              <div className="mt-6 pt-5 border-t">
                <h3 className="font-semibold text-gray-800">Recommended foods</h3>
                <p className="text-xs text-gray-500 mb-2">For low nutrients identified above. Approximate guidance, not a medical diagnosis.</p>
                <div className="flex flex-wrap gap-2">{recommendations.length ? recommendations.map(food => <span key={food} className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-medium">{food}</span>) : <span className="text-sm text-emerald-700">Your tracked nutrients are currently adequate.</span>}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NutritionAssessment;
