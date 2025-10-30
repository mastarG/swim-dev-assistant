// This script will be run in the browser console to test storage

console.log('🧪 Swim Developer Assistant - Storage Test\n');

// Test 1: Basic LocalStorage Test
console.log('=== Test 1: Basic LocalStorage ===');
try {
  localStorage.setItem('test_key', 'test_value');
  const loaded = localStorage.getItem('test_key');
  console.log('Save/Load test:', loaded === 'test_value' ? '✅ SUCCESS' : '❌ FAILED');
  localStorage.removeItem('test_key');
} catch (e) {
  console.error('❌ LocalStorage not available:', e.message);
}

// Test 2: Encryption Test
console.log('\n=== Test 2: Encryption ===');
const testStr = 'AIzaSyABC123';
try {
  const encrypted = btoa(testStr);
  const decrypted = atob(encrypted);
  console.log('Original:', testStr);
  console.log('Encrypted:', encrypted);
  console.log('Decrypted:', decrypted);
  console.log('Match:', decrypted === testStr ? '✅ SUCCESS' : '❌ FAILED');
} catch (e) {
  console.error('❌ Encryption failed:', e.message);
}

// Test 3: Test Storage.Settings module
console.log('\n=== Test 3: Storage.Settings Module ===');
if (typeof Storage !== 'undefined') {
  console.log('✅ Storage module loaded');
  
  // Test save
  const testKey = 'TestAPIKey123';
  const testUrl = 'https://github.com/test/repo';
  
  console.log('\nSaving settings...');
  const saveKeyResult = Storage.Settings.saveGeminiApiKey(testKey);
  const saveUrlResult = Storage.Settings.saveGithubRepoUrl(testUrl);
  console.log('Save Gemini Key:', saveKeyResult ? '✅' : '❌');
  console.log('Save GitHub URL:', saveUrlResult ? '✅' : '❌');
  
  // Immediate load
  console.log('\nImmediate load...');
  const loadedKey = Storage.Settings.loadGeminiApiKey();
  const loadedUrl = Storage.Settings.loadGithubRepoUrl();
  console.log('Loaded Gemini Key:', loadedKey ? '***' + loadedKey.slice(-4) : '(empty)');
  console.log('Loaded GitHub URL:', loadedUrl);
  console.log('Key Match:', loadedKey === testKey ? '✅' : '❌');
  console.log('URL Match:', loadedUrl === testUrl ? '✅' : '❌');
  
  // Check localStorage directly
  console.log('\nDirect localStorage check:');
  const directKey = localStorage.getItem('gemini_api_key');
  const directUrl = localStorage.getItem('github_repo_url');
  console.log('Direct Gemini Key:', directKey);
  console.log('Direct GitHub URL:', directUrl);
  
  // Load all
  console.log('\nLoad all settings:');
  const allSettings = Storage.Settings.loadAll();
  console.log(JSON.stringify(allSettings, null, 2));
  
} else {
  console.error('❌ Storage module not loaded');
}

// Test 4: Inspect all localStorage keys
console.log('\n=== Test 4: All LocalStorage Keys ===');
const allKeys = Object.keys(localStorage);
console.log('Total keys:', allKeys.length);
allKeys.forEach(key => {
  const value = localStorage.getItem(key);
  const display = value && value.length > 50 ? value.substring(0, 50) + '...' : value;
  console.log(`  ${key}: ${display}`);
});
