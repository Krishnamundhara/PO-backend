// backup-db.js
// This script creates a backup of the database

require('dotenv').config();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Create backups directory if it doesn't exist
const backupDir = path.join(__dirname, 'backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Parse the database URL
const dbUrl = new URL(process.env.DATABASE_URL);
const host = dbUrl.hostname;
const port = dbUrl.port || 5432;
const database = dbUrl.pathname.substring(1); // Remove leading '/'
const username = dbUrl.username;
const password = dbUrl.password;

// Format the current date for the backup filename
const date = new Date();
const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}-${String(date.getMinutes()).padStart(2, '0')}`;
const backupFileName = path.join(backupDir, `backup_${dateString}.sql`);

// Create environment variables object with password for pg_dump
const env = { ...process.env, PGPASSWORD: password };

// Build the pg_dump command
const pgDumpCmd = `pg_dump --host=${host} --port=${port} --username=${username} --dbname=${database} --format=plain --file="${backupFileName}" --no-owner --no-acl`;

console.log(`Creating database backup to ${backupFileName}`);
console.log(`Database: ${database} on ${host}:${port}`);

// Execute pg_dump
exec(pgDumpCmd, { env }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error during backup: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`pg_dump stderr: ${stderr}`);
    return;
  }
  
  console.log(`Backup created successfully: ${backupFileName}`);
  
  // Get size of the backup file
  const stats = fs.statSync(backupFileName);
  const fileSizeInMB = stats.size / (1024 * 1024);
  console.log(`Backup file size: ${fileSizeInMB.toFixed(2)} MB`);
  
  // List existing backups
  console.log('\nExisting backups:');
  const backups = fs.readdirSync(backupDir)
    .filter(file => file.endsWith('.sql'))
    .map(file => {
      const filePath = path.join(backupDir, file);
      const fileStats = fs.statSync(filePath);
      return {
        name: file,
        size: fileStats.size / (1024 * 1024), // size in MB
        date: fileStats.mtime
      };
    })
    .sort((a, b) => b.date - a.date); // Sort by date, newest first
  
  backups.forEach(backup => {
    console.log(`- ${backup.name} (${backup.size.toFixed(2)} MB) - ${backup.date.toISOString()}`);
  });
  
  // Clean up old backups (keep only last 5)
  if (backups.length > 5) {
    console.log('\nCleaning up old backups...');
    backups.slice(5).forEach(backup => {
      const backupPath = path.join(backupDir, backup.name);
      fs.unlinkSync(backupPath);
      console.log(`Deleted old backup: ${backup.name}`);
    });
  }
});
