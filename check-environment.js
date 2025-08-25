// check-environment.js
// This script checks if all required environment variables are set

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Define required environment variables for backend
const requiredEnvVars = {
  backend: {
    PORT: { default: '5000', description: 'Port on which the server will listen' },
    JWT_SECRET: { default: null, description: 'Secret key for JWT token signing' },
    DATABASE_URL: { default: null, description: 'PostgreSQL database connection string' }
  },
  frontend: {
    REACT_APP_API_URL: { default: 'http://localhost:5000/api', description: 'Backend API URL' }
  }
};

// Check backend environment
console.log('========== BACKEND ENVIRONMENT CHECK ==========');

const backendEnvPath = path.join(__dirname, '.env');
let backendEnvExists = fs.existsSync(backendEnvPath);

console.log(`Backend .env file exists: ${backendEnvExists ? 'Yes ✅' : 'No ❌'}`);

if (!backendEnvExists) {
  console.log('\nCreating backend .env file with default values...');
  
  let envContent = '';
  for (const [key, config] of Object.entries(requiredEnvVars.backend)) {
    if (config.default !== null) {
      envContent += `${key}=${config.default}\n`;
    }
  }
  
  try {
    fs.writeFileSync(backendEnvPath, envContent);
    console.log('Backend .env file created ✅');
    backendEnvExists = true;
  } catch (err) {
    console.error('Failed to create backend .env file:', err.message);
  }
}

// Check if all required backend env vars are set
const backendMissingVars = [];

for (const [key, config] of Object.entries(requiredEnvVars.backend)) {
  if (!process.env[key]) {
    backendMissingVars.push({ key, description: config.description });
  }
}

if (backendMissingVars.length > 0) {
  console.log('\n❌ Missing required backend environment variables:');
  backendMissingVars.forEach(({ key, description }) => {
    console.log(`- ${key}: ${description}`);
  });
  console.log('\nPlease add these variables to your .env file.');
} else {
  console.log('\n✅ All required backend environment variables are set.');
}

// Check frontend environment
console.log('\n========== FRONTEND ENVIRONMENT CHECK ==========');

const frontendEnvPath = path.join(__dirname, '..', 'frontend', '.env');
const frontendEnvProductionPath = path.join(__dirname, '..', 'frontend', '.env.production');

let frontendEnvExists = fs.existsSync(frontendEnvPath);
let frontendEnvProductionExists = fs.existsSync(frontendEnvProductionPath);

console.log(`Frontend .env file exists: ${frontendEnvExists ? 'Yes ✅' : 'No ❌'}`);
console.log(`Frontend .env.production file exists: ${frontendEnvProductionExists ? 'Yes ✅' : 'No ❌'}`);

// Create frontend .env if it doesn't exist
if (!frontendEnvExists) {
  console.log('\nCreating frontend .env file with default values...');
  
  let envContent = '';
  for (const [key, config] of Object.entries(requiredEnvVars.frontend)) {
    if (config.default !== null) {
      envContent += `${key}=${config.default}\n`;
    }
  }
  
  try {
    fs.writeFileSync(frontendEnvPath, envContent);
    console.log('Frontend .env file created ✅');
    frontendEnvExists = true;
  } catch (err) {
    console.error('Failed to create frontend .env file:', err.message);
  }
}

// Create frontend .env.production if it doesn't exist
if (!frontendEnvProductionExists) {
  console.log('\nCreating frontend .env.production file...');
  
  // Use environment variable or default to localhost with backend port
  const apiUrl = process.env.PRODUCTION_API_URL || `http://localhost:${process.env.PORT || 5000}/api`;
  const envContent = `REACT_APP_API_URL=${apiUrl}\n`;
  
  try {
    fs.writeFileSync(frontendEnvProductionPath, envContent);
    console.log('Frontend .env.production file created ✅');
    frontendEnvProductionExists = true;
  } catch (err) {
    console.error('Failed to create frontend .env.production file:', err.message);
  }
}

// Summary
console.log('\n========== ENVIRONMENT CHECK SUMMARY ==========');
if (backendMissingVars.length === 0 && frontendEnvExists && frontendEnvProductionExists) {
  console.log('✅ All environment files are set up correctly.');
} else {
  console.log('❌ There are environment issues that need to be addressed.');
}

// Display current environment settings
console.log('\nCurrent Backend Environment:');
for (const key of Object.keys(requiredEnvVars.backend)) {
  // Mask sensitive information
  let value = process.env[key] || '(not set)';
  if (key === 'JWT_SECRET' || key === 'DATABASE_URL') {
    value = value !== '(not set)' ? '********' : '(not set)';
  }
  console.log(`- ${key}: ${value}`);
}

// Check frontend env files content (without displaying sensitive info)
if (frontendEnvExists) {
  try {
    const frontendEnvContent = fs.readFileSync(frontendEnvPath, 'utf8');
    console.log('\nFrontend .env contains:');
    frontendEnvContent.split('\n').forEach(line => {
      if (line.trim()) {
        const parts = line.split('=');
        if (parts.length >= 2) {
          console.log(`- ${parts[0]}: ${parts[0].includes('SECRET') ? '********' : parts.slice(1).join('=')}`);
        }
      }
    });
  } catch (err) {
    console.error('Error reading frontend .env:', err.message);
  }
}

if (frontendEnvProductionExists) {
  try {
    const frontendProdEnvContent = fs.readFileSync(frontendEnvProductionPath, 'utf8');
    console.log('\nFrontend .env.production contains:');
    frontendProdEnvContent.split('\n').forEach(line => {
      if (line.trim()) {
        const parts = line.split('=');
        if (parts.length >= 2) {
          console.log(`- ${parts[0]}: ${parts[0].includes('SECRET') ? '********' : parts.slice(1).join('=')}`);
        }
      }
    });
  } catch (err) {
    console.error('Error reading frontend .env.production:', err.message);
  }
}
