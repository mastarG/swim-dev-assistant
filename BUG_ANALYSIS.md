# Bug Analysis: Settings Not Persisting

## Problem Description
User reports that when they:
1. Open settings modal
2. Enter API keys/settings
3. Click "Save"
4. Close the modal
5. Reopen the modal

The settings are reset to empty/default values.

## Code Flow Analysis

### When Settings Modal Opens (`showSettingsModal()` in ui.js:309)
```javascript
const settings = Storage.Settings.loadAll();  // Line 313
```
This loads settings from LocalStorage.

### When Rendering Input Fields (ui.js:329)
```javascript
value="${settings.geminiApiKey || ''}"
```
This sets the input value to the loaded setting.

### When Save Button Clicked (`saveSettings()` in ui.js:455)
```javascript
const geminiApiKey = document.getElementById('geminiApiKey').value.trim();
// ... saves to Storage.Settings.saveGeminiApiKey(geminiApiKey)
```

### When Modal Closes (`closeModal()` in ui.js:445)
```javascript
modalContainer.innerHTML = '';  // Line 448
```
This clears the modal DOM.

## Potential Issues

### Issue 1: Storage Keys Don't Match ❌ (RULED OUT)
Looking at storage.js:
- Keys used: `'gemini_api_key'`, `'github_repo_url'`, etc.
- No prefix like `'swim_dev_assistant_'`

This is CONSISTENT throughout the codebase.

### Issue 2: Modal Reloads Settings Fresh Each Time ✅ (LIKELY CAUSE)
**Line 313 in ui.js:**
```javascript
const settings = Storage.Settings.loadAll();
```

This is called EVERY time `showSettingsModal()` is invoked.

**Test hypothesis:**
- If Storage.Settings.loadAll() returns old/default values
- Then the modal will show those old values
- Even if save was successful

### Issue 3: LocalStorage Not Persisting ⚠️ (POSSIBLE)
Browsers can block LocalStorage in:
- Private/Incognito mode
- Cross-origin iframes
- When storage quota is exceeded
- When browser settings block it

### Issue 4: Async Timing Issue ⚠️ (UNLIKELY but possible)
If there's any async operation that:
- Clears storage
- Resets storage
- Reloads page

Between save and reopen.

## Debug Steps Added

1. **In saveSettings() (ui.js:464-489)**:
   - Log input values being saved
   - Log return values from save operations
   - Log immediate loadAll() result

2. **Need to add in showSettingsModal()**:
   - Log what loadAll() returns when modal opens

## Reproduction Test Plan

### Test 1: Basic Storage Test
```javascript
// In browser console
localStorage.setItem('test', 'value');
localStorage.getItem('test');  // Should return 'value'
```

### Test 2: Storage Module Test
```javascript
// In browser console (with storage.js loaded)
Storage.Settings.saveGeminiApiKey('TestKey123');
Storage.Settings.loadGeminiApiKey();  // Should return 'TestKey123'
```

### Test 3: Full Flow Test
1. Open settings modal
2. Enter: "TestAPIKey123" in Gemini API field
3. Click Save
4. **Check console logs**:
   - "💾 Saving settings..." should show the key
   - "💾 Save results:" should show `{gemini: true, ...}`
   - "✅ Loaded after save:" should show the key
5. Close modal
6. Reopen modal
7. **Check console logs**:
   - Need to add logging here to see what loadAll() returns
8. **Check input field value**:
   - Should contain "TestAPIKey123"

## Hypothesis Ranking

1. **Most Likely**: Storage IS working, but modal is loading from wrong source
2. **Second**: Browser is blocking LocalStorage writes
3. **Third**: Some other code is clearing storage between save and reopen

## Next Steps

1. Add debug logging to showSettingsModal() at line 313
2. Test in browser with actual user data
3. Check browser console for:
   - Any localStorage errors
   - Any quota errors
   - The debug logs we added

## Files to Modify

1. `js/ui.js` - Add logging to showSettingsModal()
2. Create test page to isolate storage testing
