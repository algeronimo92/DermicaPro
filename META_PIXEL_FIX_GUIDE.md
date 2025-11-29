# Meta Pixel Fix - Testing Guide

## 🔧 Changes Made

### 1. **Hybrid PageView Tracking (Best Practice)**
**File:** [public/index.html](public/index.html#L47)
- **Kept:** `fbq('track', 'PageView');` fires on initial page load
- **File:** [src/components/MetaPixel.jsx](src/components/MetaPixel.jsx#L22-L26)
- **Added:** Smart skip on first render to prevent duplicate
- **Why:** Guarantees immediate PageView + tracks SPA route changes without duplicates

### 2. **Added Pixel Readiness Check**
**File:** [src/utils/metaPixelHelper.js](src/utils/metaPixelHelper.js#L20-L42)
- **New:** `waitForPixel()` function waits up to 5 seconds for pixel to load
- **New:** `isPixelReady()` validates fbq function exists
- **Why:** Events were firing before pixel was fully loaded

### 3. **Improved Event Tracking Functions**
**File:** [src/utils/metaPixelHelper.js](src/utils/metaPixelHelper.js#L49-L82)
- **Updated:** `trackMetaEvent()` now async with try/catch
- **Updated:** `trackMetaCustomEvent()` now async with try/catch
- **Added:** Better console logging with emojis (✅ success, ❌ error, ⚠️ warning)
- **Why:** Ensures events only fire when pixel is ready, better debugging

### 4. **Enhanced PageView Component**
**File:** [src/components/MetaPixel.jsx](src/components/MetaPixel.jsx#L16-L61)
- **Updated:** Retry logic with 30 attempts (3 seconds)
- **Added:** Try/catch error handling
- **Added:** `useRef` to skip first render (prevent duplicate with index.html)
- **Added:** Better console logging with info message
- **Why:** Ensures PageView tracks reliably on route changes, no duplicates

---

## 🧪 Testing Instructions

### Step 1: Open Meta Pixel Helper

1. Install [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/) if not installed
2. Navigate to `http://localhost:3000/hifu-landing`
3. Open Chrome DevTools (F12) → **Console** tab

### Step 2: Test PageView Event

**Expected Console Output (initial load):**
```
ℹ️ Meta Pixel - PageView inicial ya trackeado por index.html
```

**Note:** The first PageView is tracked by `index.html`, React component skips it to prevent duplicates

**Expected Pixel Helper:**
- Shows **green icon** (1 pixel found)
- Click helper → Should show **PageView** event with ✅ checkmark

**If not working:**
- Check console for errors
- Look for ⚠️ warning messages
- Verify pixel ID `1431286785234837` in Network tab

### Step 2b: Test PageView on Route Change

1. Click the DermicaPro logo or navigate to `/` (home page)
2. Check console

**Expected Console Output:**
```
✅ Meta Pixel - PageView tracked: /
```

**Expected Pixel Helper:**
- Shows **new PageView** event (total count increases)

---

### Step 3: Test ViewContent Event (on page load)

**Expected Console Output:**
```
✅ Meta Pixel - ViewContent tracked: {
  content_name: "HIFU 12D Landing Page",
  content_type: "landing_page"
}
```

**Expected Pixel Helper:**
- Shows **ViewContent** event
- Click to expand → Should show `content_name` and `content_type` parameters

---

### Step 4: Test Lead Event (form submission)

1. Scroll to form on `/hifu-landing`
2. Fill form:
   - **Nombre:** Juan Pérez
   - **WhatsApp:** 987654321
   - **Email:** test@example.com
3. Click "Recibir orientación honesta (gratis)"

**Expected Console Output:**
```
✅ Meta Pixel - Lead tracked: {
  content_name: "HIFU 12D",
  content_category: "Tratamiento Facial",
  value: 200,
  currency: "PEN"
}
```

**Expected Pixel Helper:**
- Shows **Lead** event with green checkmark
- Parameters should include:
  - `content_name: "HIFU 12D"`
  - `content_category: "Tratamiento Facial"`
  - `value: 200`
  - `currency: "PEN"`

---

### Step 5: Test TikTok Pixel (separate from Meta)

**Expected Console Output:**
```
(No specific console logs for TikTok Pixel - it's silent)
```

**TikTok Pixel Verification:**
- Use **TikTok Pixel Helper** extension (if available)
- Or check Network tab for requests to `analytics.tiktok.com`

---

## 🐛 Troubleshooting

### Problem: Pixel Helper shows pixel but no events

**Solution:**
1. Check console for ⚠️ warnings
2. Verify fbq is defined: Type `window.fbq` in console → Should show function
3. Hard refresh page (Cmd+Shift+R / Ctrl+Shift+F5)

---

### Problem: Console shows "Meta Pixel no se cargó después de 5 segundos"

**Solution:**
1. Check Network tab → Filter by "fbevents.js"
2. Verify script is loading from `connect.facebook.net`
3. Check for ad blockers blocking Meta scripts
4. Try disabling browser extensions

---

### Problem: Events fire but show up delayed in Pixel Helper

**This is normal!**
- Pixel Helper sometimes lags by 1-2 seconds
- Check **Console** for immediate confirmation
- Events are still being sent to Meta

---

### Problem: Lead event not firing on form submit

**Checklist:**
1. ✅ Form validation passed (no red error messages)
2. ✅ Success modal appeared
3. ✅ Check console for error messages
4. ✅ Verify webhook responded with 200 OK in Network tab

**Debug:**
```javascript
// Open console and check:
window.fbq('track', 'Lead', { test: true });
// Should trigger Lead event manually
```

---

## 📊 Expected Event Flow

### Landing Page Visit (`/hifu-landing`):
```
1. [PageView] → ✅ Meta Pixel
2. [ViewContent] → ✅ Meta Pixel (automatic)
3. [TikTok PageView] → ✅ TikTok Pixel (automatic)
```

### Form Submission:
```
1. User fills form
2. Validation passes
3. Webhook POST → n8n
4. [Lead] → ✅ Meta Pixel
5. [SubmitForm] → ✅ TikTok Pixel
6. Success modal shows
```

---

## 🔍 Manual Testing Commands

Open browser console and run:

### Test if pixel is loaded:
```javascript
typeof window.fbq
// Should return: "function"
```

### Test manual event:
```javascript
window.fbq('track', 'Lead', {
  content_name: 'Test Lead',
  value: 100,
  currency: 'PEN'
});
// Check Pixel Helper for Lead event
```

### Test custom event:
```javascript
window.fbq('trackCustom', 'DermicaPro_Test', {
  test_param: 'hello'
});
// Check Pixel Helper for custom event
```

---

## ✅ Success Criteria

Your pixel is working correctly if:

- ✅ Pixel Helper shows **green icon** (not gray)
- ✅ **PageView** fires on every route change
- ✅ **ViewContent** fires on landing page load
- ✅ **Lead** fires on successful form submission
- ✅ Console shows `✅ Meta Pixel - ...` messages
- ✅ No `❌` or `⚠️` error messages in console

---

## 📝 Next Steps

### For Production Deployment:

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Verify pixel in build:**
   - Check `build/index.html` contains Meta Pixel script
   - Check `build/static/js/main.*.js` for tracking calls

3. **Test on staging/production:**
   - Repeat all tests above
   - Use **Test Events** in Meta Events Manager
   - Verify events appear in real-time

### Meta Events Manager Setup:

1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Select your pixel: **1431286785234837**
3. Click **Test Events**
4. Open your site in another tab
5. Actions should appear in Test Events dashboard

---

## 🚨 Common Mistakes to Avoid

❌ **Don't** call `fbq('track', ...)` before pixel loads
✅ **Do** use helper functions that wait for pixel

❌ **Don't** track PageView in multiple places
✅ **Do** let MetaPixel component handle all PageViews

❌ **Don't** forget to test in incognito mode
✅ **Do** test with clean browser (no cache/ad blockers)

❌ **Don't** track sensitive data (full phone/email)
✅ **Do** only track event names and generic values

---

## 📞 Support

If issues persist:
1. Check [Meta Pixel Troubleshooting Guide](https://www.facebook.com/business/help/1728540670806315)
2. Use Meta's [Pixel Test Events](https://www.facebook.com/business/help/2040882589516719)
3. Contact Meta Business Support

---

**Last Updated:** November 29, 2025
**Tested On:** Chrome 131, React 19.1.1
**Pixel ID:** 1431286785234837
