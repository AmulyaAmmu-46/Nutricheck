const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const apiBaseUrl = process.env.API_BASE_URL;
if (!apiBaseUrl) throw new Error('API_BASE_URL must be set in the environment or backend/.env');

const run = async () => {
  try {
    const res = await fetch(new URL('/api/auth/face-login', apiBaseUrl), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'chethu@gmail.com',
        faceDescriptor: Array(128).fill(0.1)
      })
    });
    const data = await res.json();
    console.log(res.status, data);
  } catch (err) {
    console.log(err.message);
  }
};
run();
