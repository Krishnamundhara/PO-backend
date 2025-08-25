#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define paths
const backendPath = path.join(__dirname);
const frontendPath = path.join(__dirname, '..', 'frontend');

// Check if PostgreSQL is installed
console.log('Checking if PostgreSQL is installed...');
const pgCheck = spawn('psql', ['--version']);

pgCheck.on('error', () => {
  console.error('\x1b[31mERROR: PostgreSQL is not installed or not in PATH.\x1b[0m');
  console.log('Please install PostgreSQL before continuing.');
  process.exit(1);
});

pgCheck.stdout.on('data', (data) => {
  console.log(`PostgreSQL: ${data.toString().trim()}`);
});

pgCheck.on('close', (code) => {
  if (code !== 0) {
    console.error('\x1b[31mERROR: PostgreSQL check failed.\x1b[0m');
    process.exit(1);
  }
  
  // Initialize database
  console.log('\x1b[36m\nInitializing database...\x1b[0m');
  const initDb = spawn('node', ['init-db.js'], { cwd: backendPath });
  
  initDb.stdout.on('data', (data) => {
    console.log(`${data.toString().trim()}`);
  });
  
  initDb.stderr.on('data', (data) => {
    console.error(`${data.toString().trim()}`);
  });
  
  initDb.on('close', (code) => {
    if (code !== 0) {
      console.error('\x1b[31mERROR: Database initialization failed.\x1b[0m');
      console.log('Check your PostgreSQL connection and try again.');
      process.exit(1);
    }
    
    console.log('\x1b[32m\nDatabase initialized successfully!\x1b[0m');
    console.log('\x1b[36m\nStarting backend server...\x1b[0m');
    
    // Start backend server
    const backendServer = spawn('npm', ['run', 'dev'], { cwd: backendPath });
    
    backendServer.stdout.on('data', (data) => {
      console.log(`\x1b[36m[Backend] ${data.toString().trim()}\x1b[0m`);
    });
    
    backendServer.stderr.on('data', (data) => {
      console.error(`\x1b[31m[Backend Error] ${data.toString().trim()}\x1b[0m`);
    });
    
    // Wait a bit before starting the frontend
    setTimeout(() => {
      console.log('\x1b[35m\nStarting frontend server...\x1b[0m');
      
      // Start frontend server
      const frontendServer = spawn('npm', ['start'], { cwd: frontendPath });
      
      frontendServer.stdout.on('data', (data) => {
        console.log(`\x1b[35m[Frontend] ${data.toString().trim()}\x1b[0m`);
      });
      
      frontendServer.stderr.on('data', (data) => {
        console.error(`\x1b[31m[Frontend Error] ${data.toString().trim()}\x1b[0m`);
      });
      
      frontendServer.on('close', (code) => {
        if (code !== 0) {
          console.error('\x1b[31mERROR: Frontend server exited unexpectedly.\x1b[0m');
        }
        
        // Kill backend when frontend exits
        backendServer.kill();
        process.exit(0);
      });
    }, 3000);
  });
});
