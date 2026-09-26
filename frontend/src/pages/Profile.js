import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Profile = () => {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
    activityLevel: 'Light',
    diseases: [],
    goal: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  const diseaseOptions = ['BP', 'Diabetes', 'PCOD', 'Kidney Disease', 'Heart Disease'];
  const goalOptions = ['Bulking', 'Leaning', 'Maintaining Health'];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/profile');
      if (response.data.success && response.data.data.profile) {
        setFormData({
          height: response.data.data.profile.height,
          weight: response.data.data.profile.weight,
          age: response.data.data.profile.age || '',
          gender: response.data.data.profile.gender || '',
          activityLevel: response.data.data.profile.activityLevel || 'Light',
          diseases: response.data.data.profile.diseases || [],
          goal: response.data.data.profile.goal,
        });
      }
    } catch (err) {
      // Profile doesn't exist yet, that's okay
      console.log('Profile not found, will create new one');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handleDiseaseChange = (disease) => {
    setFormData({
      ...formData,
      diseases: formData.diseases.includes(disease)
        ? formData.diseases.filter((d) => d !== disease)
        : [...formData.diseases, disease],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.height || !formData.weight || !formData.goal) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/api/profile', formData);

      if (response.data.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-100 via-violet-100 to-fuchsia-100 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-fuchsia-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 relative z-10 transition-all hover:shadow-cyan-200">
        <div className="mb-6">
          <h2 className="mt-2 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-500 drop-shadow-sm">
            👤 Create Your Profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 font-medium">
            Help us calculate your daily nutrition requirement
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="age" className="block text-sm font-bold text-gray-700 mb-1">Age</label>
              <input id="age" name="age" type="number" min="13" max="120" className="appearance-none block w-full px-4 py-2 border border-gray-200 rounded-xl" value={formData.age} onChange={handleChange} placeholder="e.g. 30" />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-bold text-gray-700 mb-1">Gender</label>
              <select id="gender" name="gender" className="block w-full px-4 py-2 border border-gray-200 rounded-xl" value={formData.gender} onChange={handleChange}>
                <option value="">Prefer not to say</option><option>Female</option><option>Male</option><option>Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-bold text-gray-700 mb-1">
                Height (cm) <span className="text-red-500">*</span>
              </label>
              <input
                id="height"
                name="height"
                type="number"
                required
                min="50"
                max="300"
                className="appearance-none block w-full px-4 py-2 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow sm:text-sm bg-gray-50/50 focus:bg-white"
                value={formData.height}
                onChange={handleChange}
                placeholder="e.g. 175"
              />
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-bold text-gray-700 mb-1">
                Weight (kg) <span className="text-red-500">*</span>
              </label>
              <input
                id="weight"
                name="weight"
                type="number"
                required
                min="20"
                max="500"
                className="appearance-none block w-full px-4 py-2 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow sm:text-sm bg-gray-50/50 focus:bg-white"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g. 70"
              />
            </div>
            <div>
              <label htmlFor="activityLevel" className="block text-sm font-bold text-gray-700 mb-1">Activity Level</label>
              <select id="activityLevel" name="activityLevel" className="block w-full px-4 py-2 border border-gray-200 rounded-xl" value={formData.activityLevel} onChange={handleChange}>
                <option>Sedentary</option><option>Light</option><option>Moderate</option><option>Active</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Health Conditions (Select all that apply)
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {diseaseOptions.map((disease) => (
                <label
                  key={disease}
                  className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${formData.diseases.includes(disease) ? 'bg-cyan-50 border-cyan-200 shadow-sm' : 'border-gray-200 hover:bg-gray-50/50 bg-white'}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.diseases.includes(disease)}
                    onChange={() => handleDiseaseChange(disease)}
                    className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                  />
                  <span className={`ml-2 text-sm ${formData.diseases.includes(disease) ? 'font-semibold text-cyan-900' : 'text-gray-700'}`}>{disease}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="goal" className="block text-sm font-bold text-gray-700 mb-2">
              Goal <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {goalOptions.map((goal) => (
                <label
                  key={goal}
                  className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${formData.goal === goal ? 'bg-violet-50 border-violet-200 shadow-sm' : 'border-gray-200 hover:bg-gray-50/50 bg-white'}`}
                >
                  <input
                    type="radio"
                    name="goal"
                    value={goal}
                    checked={formData.goal === goal}
                    onChange={handleChange}
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300"
                  />
                  <span className={`ml-2 text-sm ${formData.goal === goal ? 'font-semibold text-violet-900' : 'text-gray-700'}`}>{goal}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;



