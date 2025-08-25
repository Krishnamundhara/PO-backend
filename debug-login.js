// debug-login.js
// Simple script to debug login API

const http = require('http');

// Create simple POST request to test login
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const data = JSON.stringify({
  username: 'admin',
  password: 'admin123'
});

console.log('Sending login request to http://localhost:5000/api/auth/login');

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('RESPONSE BODY:', responseData);
    try {
      const parsedData = JSON.parse(responseData);
      if (parsedData.token) {
        console.log('✓ Login successful, token received');
      } else {
        console.log('✗ No token in response');
      }
    } catch (e) {
      console.log('✗ Could not parse response as JSON');
    }
  });
});

req.on('error', (e) => {
  console.error(`✗ Error: ${e.message}`);
});

// Write data to request body
req.write(data);
req.end();
