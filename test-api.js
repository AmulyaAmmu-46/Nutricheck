const http = require('http');
const https = require('https');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const apiBaseUrl = process.env.API_BASE_URL;
if (!apiBaseUrl) throw new Error('API_BASE_URL must be set in the environment or backend/.env');
const apiUrl = new URL('/api/auth/register', apiBaseUrl);

const data = JSON.stringify({
    username: 'test_api_user',
    email: 'test_api@example.com',
    phone: '0987654321',
    password: 'password123'
});

const options = {
    hostname: apiUrl.hostname,
    port: apiUrl.port || (apiUrl.protocol === 'https:' ? 443 : 80),
    path: `${apiUrl.pathname}${apiUrl.search}`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const transport = apiUrl.protocol === 'https:' ? https : http;
const req = transport.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

    let body = '';
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        body += chunk;
    });
    res.on('end', () => {
        console.log('BODY: ' + body);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(data);
req.end();
