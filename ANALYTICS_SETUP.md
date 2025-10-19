# Amplitude Analytics - Quick Start Guide

## Overview

This project now includes comprehensive Amplitude analytics tracking for:
- Chat interactions
- Model generation events (T2I, T2V, I2V)
- API errors
- Page views
- User engagement

## Setup Instructions

### 1. Get Your Amplitude API Key

1. Sign up for Amplitude at [https://amplitude.com](https://amplitude.com)
2. Create a new project for your app
3. Get your API key from: **Settings → Projects → [Your Project] → General**
4. Copy the API key

### 2. Add API Key to Environment Variables

Add your Amplitude API key to `.env.local`:

```bash
NEXT_PUBLIC_AMPLITUDE_API_KEY=your_actual_amplitude_api_key_here
```

**Important:** Replace `YOUR_AMPLITUDE_API_KEY` with your real API key.

### 3. Restart Development Server

```bash
pnpm dev
```

### 4. Verify It's Working

1. Open your app in the browser
2. Navigate to different pages
3. Send a chat message
4. Go to Amplitude dashboard: **User Lookup → Debugger**
5. Enter your device ID (check browser console logs for "Amplitude initialized with device ID: ...")
6. You should see events appearing in real-time!

## Events Being Tracked

### Page Events
- **Page Viewed** - Every page navigation

### Chat Events
- **Chat Message Sent** - When user sends a message
- **Chat Response Received** - When assistant responds
- **Feature Card Clicked** - When user clicks feature cards
- **Suggestion Prompt Clicked** - When user clicks suggestions

### Generation Events (Core Metrics)
- **Generation Started** - When any generation begins
- **Generation Completed** - When generation succeeds
- **Generation Failed** - When generation fails
- **Generation Downloaded** - When user downloads content

### Error Events
- **API Error** - When API calls fail
- **Client Error** - When client-side errors occur

## How to Use Analytics in Your Code

### Track a Custom Event

```typescript
import { amplitude } from '@/lib/analytics/amplitude';

// Simple event
amplitude.track('Button Clicked', {
  button_name: 'Subscribe',
  page: '/pricing'
});
```

### Get Session ID

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

function MyComponent() {
  const { sessionId } = useAnalytics();

  // Use sessionId in your events
}
```

### Track User Properties

```typescript
import { setUserProperties } from '@/lib/analytics/amplitude';

// After user logs in
setUserProperties({
  email: user.email,
  subscription_tier: 'pro',
  signup_date: user.createdAt
});
```

## Files Structure

```
/lib/analytics/
  ├── amplitude.ts    # SDK initialization
  ├── events.ts       # All tracking functions
  └── types.ts        # TypeScript types

/hooks/
  └── useAnalytics.ts # React hook for analytics

/components/
  └── analytics-provider.tsx # Client-side wrapper
```

## Amplitude Dashboard Setup

### Recommended Charts to Create

1. **Total Generations (Last 30 Days)**
   - Event: Generation Completed
   - Group by: model_name

2. **Generation Success Rate**
   - Event: Generation Started vs Generation Completed
   - Formula: (Completed / Started) * 100

3. **Most Used Models**
   - Event: Generation Started
   - Group by: model_name
   - Chart type: Bar

4. **User Funnel**
   ```
   Page Viewed → Chat Message Sent → Generation Started → Generation Completed
   ```

5. **Error Rate by Endpoint**
   - Event: API Error
   - Group by: endpoint

## Development vs Production

The analytics are configured to work in both environments:

- **Development:** Events tracked to your Amplitude project
- **Production:** Same Amplitude project (or create separate project)

To use separate projects:
1. Create a production Amplitude project
2. Use different API keys in `.env.local` (dev) vs `.env.production` (prod)

## Privacy & GDPR

Currently tracking:
- ✅ Anonymous device IDs
- ✅ Session data
- ✅ Usage patterns
- ❌ Personal information (until auth is added)

When you add authentication:
- Update user ID with `setUserId(userId)`
- Add user consent mechanism
- Provide data export/deletion options

## Troubleshooting

### Events Not Showing Up?

1. **Check API Key:** Make sure `NEXT_PUBLIC_AMPLITUDE_API_KEY` is set
2. **Check Console:** Look for "Amplitude initialized" message
3. **Check Network:** Open DevTools → Network, filter for "amplitude"
4. **Check Debugger:** Amplitude dashboard → User Lookup → Debugger

### Console Warning "API key not found"?

- Your `.env.local` file doesn't have the Amplitude API key
- Make sure it starts with `NEXT_PUBLIC_` (required for Next.js client-side)
- Restart your dev server after adding the key

### TypeScript Errors?

```bash
# Rebuild TypeScript
pnpm build
```

## Next Steps

1. ✅ Add Amplitude API key
2. ✅ Verify events are tracking
3. 📊 Create dashboards in Amplitude
4. 🎯 Set up conversion funnels
5. 📈 Monitor model usage and success rates
6. 🔄 Add tracking to Generate page (Pro Mode) - See TODO
7. 🔐 Add user authentication tracking (when implemented)

## Need Help?

- [Amplitude Documentation](https://www.docs.developers.amplitude.com/)
- [Amplitude Browser SDK](https://www.docs.developers.amplitude.com/data/sdks/browser-2/)
- Check `AMPLITUDE_IMPLEMENTATION_GUIDE.md` for detailed implementation guide

---

**Ready to track!** 🚀 Add your Amplitude API key and start measuring your AI model usage.
