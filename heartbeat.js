/**
 * Medicare+ Automation Heartbeat
 * This script triggers the medication reminder engine every minute.
 * Run this alongside your Next.js server to enable automatic notifications.
 */

const http = require('http');

const CHECK_INTERVAL = 60000; // 60 seconds
const API_URL = 'http://localhost:3000/api/notifications/process';

console.log('--- Medicare+ Heartbeat Started ---');
console.log(`Interval: ${CHECK_INTERVAL / 1000}s`);
console.log(`Target: ${API_URL}`);
console.log('Status: ACTIVE - Watching for scheduled medications...');

function triggerSync() {
  const now = new Date();
  const time = now.toLocaleTimeString();
  
  http.get(API_URL, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.success) {
          if (json.processed > 0) {
            console.log(`[${time}] SUCCESS: Processed ${json.processed} due medicines.`);
          }
        } else {
          console.error(`[${time}] ERROR: ${json.error || 'Unknown error'}`);
        }
      } catch (e) {
        console.error(`[${time}] PARSE ERROR: Server might still be starting up...`);
      }
    });
  }).on('error', (err) => {
    console.error(`[${time}] CONNECTION ERROR: Ensure Next.js is running on port 3000.`);
  });
}

// Run immediately on start
triggerSync();

// Then run every minute
setInterval(triggerSync, CHECK_INTERVAL);
