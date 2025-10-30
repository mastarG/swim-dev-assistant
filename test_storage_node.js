// Simulate LocalStorage behavior
class LocalStorage {
  constructor() {
    this.store = {};
  }
  
  setItem(key, value) {
    this.store[key] = String(value);
  }
  
  getItem(key) {
    return this.store[key] || null;
  }
  
  removeItem(key) {
    delete this.store[key];
  }
  
  clear() {
    this.store = {};
  }
}

// Create global localStorage
global.localStorage = new LocalStorage();

// Load storage.js code
const fs = require('fs');
const storageCode = fs.readFileSync('js/storage.js', 'utf8');

// Remove 'use strict' and wrap in function
const wrappedCode = storageCode.replace("'use strict';", '');
eval(wrappedCode);

console.log('🧪 Testing Storage Module\n');

// Test 1: Basic encryption/decryption
console.log('Test 1: Encryption/Decryption');
const testKey = 'AIzaSyABC123XYZ';
const encrypted = Storage.encrypt(testKey);
const decrypted = Storage.decrypt(encrypted);
console.log(`  Original: ${testKey}`);
console.log(`  Encrypted: ${encrypted}`);
console.log(`  Decrypted: ${decrypted}`);
console.log(`  Match: ${decrypted === testKey ? '✅' : '❌'}\n`);

// Test 2: Save and load Gemini API key
console.log('Test 2: Save/Load Gemini API Key');
const saveResult = Storage.Settings.saveGeminiApiKey(testKey);
console.log(`  Save result: ${saveResult ? '✅' : '❌'}`);

const loaded = Storage.Settings.loadGeminiApiKey();
console.log(`  Loaded: ${loaded}`);
console.log(`  Match: ${loaded === testKey ? '✅' : '❌'}\n`);

// Test 3: Load all settings
console.log('Test 3: Load All Settings');
Storage.Settings.saveGithubRepoUrl('https://github.com/test/repo');
Storage.Settings.saveTheme('dark');
Storage.Settings.saveFontSize('medium');

const allSettings = Storage.Settings.loadAll();
console.log('  All settings:', JSON.stringify(allSettings, null, 2));

// Test 4: Verify localStorage contents
console.log('\nTest 4: LocalStorage Contents');
console.log('  Keys:', Object.keys(localStorage.store));
console.log('  Values:');
Object.entries(localStorage.store).forEach(([key, value]) => {
  const display = value.length > 50 ? value.substring(0, 50) + '...' : value;
  console.log(`    ${key}: ${display}`);
});

// Test 5: Persistence simulation
console.log('\nTest 5: Persistence Simulation');
console.log('  Saving new key...');
Storage.Settings.saveGeminiApiKey('NewTestKey123');
console.log('  Immediate load:', Storage.Settings.loadGeminiApiKey());

// Simulate page reload by creating new instance
const oldStore = {...localStorage.store};
global.localStorage = new LocalStorage();
global.localStorage.store = oldStore;

console.log('  After "reload" simulation:', Storage.Settings.loadGeminiApiKey());
