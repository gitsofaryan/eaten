# 🚀 Quick Setup Guide - Eaten App with Gemini AI

## What Changed?

The app has been upgraded to use **Google Gemini AI** directly instead of n8n webhooks. This provides:
- ✅ Real-time food recognition
- ✅ Accurate nutritional analysis
- ✅ No middleware dependencies
- ✅ Direct API integration

---

## Setup Instructions

### 1. Get Your Gemini API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

### 2. Configure the App

1. Open the `.env` file in the root directory
2. Replace `your_gemini_api_key_here` with your actual API key:
   ```
   VITE_GEMINI_API_KEY=AIza...your_actual_key
   ```
3. Save the file

### 3. Run the App

```bash
npm run dev
```

The app will start at http://localhost:5173

---

## How It Works

### Architecture

```
User uploads image
    ↓
Base64 encoding
    ↓
Gemini Vision API (gemini-1.5-flash)
    ↓
AI analyzes food items
    ↓
Returns JSON with nutrition data
    ↓
Display results
```

### Files Modified

1. **`src/services/geminiService.ts`** (NEW)
   - Handles all Gemini API communication
   - Converts images to proper format
   - Parses AI responses into structured data

2. **`src/pages/Index.tsx`** (UPDATED)
   - Removed n8n webhook endpoint
   - Integrated geminiService
   - Improved error handling

3. **`.env`** (NEW)
   - Stores API key securely
   - Never committed to git

4. **`src/vite-env.d.ts`** (UPDATED)
   - TypeScript types for environment variables

---

## Testing the App

1. **Start the dev server**: `npm run dev`
2. **Upload a food image**: Click "Take Photo" or "Upload Photo"
3. **Analyze**: Click the "Analyze" button
4. **View results**: See detected food items and nutrition info

### Sample Test Images

Try uploading images of:
- ✅ Simple meals (1-3 items)
- ✅ Clear, well-lit photos
- ✅ Common foods (easier for AI to recognize)

Avoid:
- ❌ Very blurry images
- ❌ Complex plates with 10+ items
- ❌ Dark/poorly lit photos

---

## Troubleshooting

### Error: "Gemini API key not configured"
**Solution**: Make sure you've added your API key to `.env` file

### Error: "Invalid API key"
**Solution**: 
1. Check your API key is correct
2. Ensure there are no extra spaces in the `.env` file
3. Verify the key is enabled at https://makersuite.google.com

### Error: "API quota exceeded"
**Solution**: 
- Gemini has rate limits on free tier
- Wait a few minutes before trying again
- Consider upgrading your API plan

### No food items detected
**Solution**:
- Try a clearer, better-lit photo
- Ensure food items are clearly visible
- Try a photo with fewer items

---

## API Limits (Free Tier)

Gemini API free tier includes:
- 60 requests per minute
- 1,500 requests per day
- Perfect for development and testing!

For production apps with high traffic, consider:
- Implementing request caching
- Adding user authentication
- Upgrading to paid tier

---

## Code Overview

### Key Components

**geminiService.ts**
```typescript
// Main service class
class GeminiService {
  analyzeFoodImage(base64Image: string): Promise<AnalysisResult>
}

// Usage in components
import { geminiService } from '@/services/geminiService';
const result = await geminiService.analyzeFoodImage(imageData);
```

**Prompt Engineering**
The AI prompt is carefully crafted to:
- Return JSON format only
- Identify individual food items
- Estimate realistic portions
- Provide accurate nutritional values

---

## Next Steps

Now that direct Gemini integration is working, you can:

1. **Improve Accuracy**: Fine-tune the AI prompt for better results
2. **Add Features**: 
   - Save meal history
   - Track daily nutrition goals
   - Export reports
3. **Optimize Performance**:
   - Add image compression before upload
   - Implement request caching
   - Add loading states
4. **Deploy**: Host on Vercel, Netlify, or your preferred platform

---

## Security Notes

⚠️ **Important**: 
- Never commit `.env` file to git
- The API key is exposed in client-side code (Vite bundles it)
- For production, consider using a backend proxy to keep API keys secure

---

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key is valid
3. Ensure you're using a supported image format (JPEG, PNG)
4. Check the Gemini API status: https://status.cloud.google.com/

---

Happy analyzing! 🍽️✨
