# Gemini API Connection Test

## Changes Made

### 1. API Endpoint Update
**Previous:**
```javascript
BASE_URL: 'https://generativelanguage.googleapis.com/v1'
MODEL: 'gemini-2.0-flash-exp'
```

**Current:**
```javascript
BASE_URL: 'https://generativelanguage.googleapis.com/v1beta'
MODEL: 'gemini-1.5-flash'
```

**Reason:** 
- The `v1` endpoint doesn't support `gemini-2.0-flash-exp` model
- Changed to stable `gemini-1.5-flash` model with `v1beta` endpoint

### 2. Authentication Method Update
**Previous:**
```javascript
headers: {
  'Content-Type': 'application/json',
  'x-goog-api-key': apiKey
}
```

**Current:**
```javascript
const url = `${this.BASE_URL}/models/${this.MODEL}:generateContent?key=${apiKey}`;

headers: {
  'Content-Type': 'application/json'
}
```

**Reason:**
- Google Gemini API documentation recommends using query parameter for API key
- Header-based authentication was causing connection issues

## Test Script

A standalone test script has been created: `test_gemini.sh`

### Usage:
```bash
chmod +x test_gemini.sh
./test_gemini.sh YOUR_API_KEY_HERE
```

### What it tests:
- Direct HTTP POST to Gemini API
- Using the new endpoint and authentication method
- Validates API key is working
- Returns either the AI response or error message

## Testing in Application

### Steps to test:
1. Open the app: https://8000-isa1udxzf9cy1bvd79jcc-b32ec7bb.sandbox.novita.ai
2. Open browser console (F12)
3. Click Settings (⚙️) button
4. Enter your Gemini API key
5. Click "연결 테스트" (Connection Test)
6. Check console for output

### Expected Console Output:

**If successful:**
```
🤖 Calling Gemini API: {url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=***", model: "gemini-1.5-flash"}
✅ Gemini API 연결 성공!
```

**If failed:**
```
❌ Gemini API 연결 실패: [error message]
```

## Common Issues

### Issue 1: API Key Invalid
**Error:** `API key not valid`
**Solution:** 
- Get a valid API key from: https://makersuite.google.com/app/apikey
- Make sure you copy the full key
- Check for any extra spaces

### Issue 2: Quota Exceeded
**Error:** `Resource has been exhausted`
**Solution:**
- Your free tier quota may be exceeded
- Wait for quota to reset
- Or upgrade to paid tier

### Issue 3: Model Not Found
**Error:** `models/[model-name] is not found`
**Solution:**
- This is now fixed with gemini-1.5-flash model
- If issue persists, check if model is available in your region

### Issue 4: CORS Error
**Error:** `Access to fetch has been blocked by CORS policy`
**Solution:**
- Gemini API should allow cross-origin requests
- If blocked, you may need to use a backend proxy

## API Documentation

Official Gemini API documentation:
- https://ai.google.dev/api/rest/v1beta/models/generateContent
- https://ai.google.dev/gemini-api/docs/get-started/tutorial?lang=rest

## Debug Logging

The application now includes debug logging for Gemini API calls:

```javascript
console.log('🤖 Calling Gemini API:', {
  url: url.replace(/key=.*/, 'key=***'),
  model: this.MODEL
});
```

This will help diagnose connection issues.

## Next Steps

1. **Test with valid API key:** User needs to provide their Gemini API key for full testing
2. **Verify response format:** Ensure the AI response is properly extracted and displayed
3. **Error handling:** Test various error scenarios (invalid key, quota exceeded, etc.)
4. **UI feedback:** Ensure proper notifications are shown for success/failure

## Files Modified

- `js/api.js` - Updated Gemini API configuration and authentication
- `test_gemini.sh` - Created standalone test script
- `GEMINI_API_TEST.md` - This documentation
