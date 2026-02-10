# 📊 Analytics & Lead Generation Setup

## Google Analytics 4 (GA4)

### Setup Instructions:

1. **Create a GA4 property:**
   - Go to [Google Analytics](https://analytics.google.com)
   - Create a new property for your domain
   - Get your **Measurement ID** (format: `G_XXXXXXXXXX`)

2. **Add to Layout.astro:**
   - Open `src/layouts/Layout.astro`
   - Find this line:
     ```javascript
     const GA_ID = "G_XXXXXXXX"; // TODO: Replace with actual GA4 Measurement ID
     ```
   - Replace `G_XXXXXXXX` with your actual GA4 Measurement ID

3. **Verify setup:**
   - Visit your site and open DevTools Console
   - You should see: `✓ Analytics initialized` (in development)
   - Check Google Analytics Real-time dashboard to see events

### Tracked Events:

- `form_submit` — When user submits contact form
- `form_error` — When form submission fails
- `form_step_completed` — Each step of multi-step form
- `scroll_depth` — User scroll engagement (25%, 50%, 75%, 100%)
- `cta_click` — Calls-to-action clicks
- `phone_click` — Phone number clicks
- `whatsapp_click` — WhatsApp link clicks
- `project_view` — Project case study views
- `service_view` — Service page views

## Formspree Integration

### Setup Instructions:

1. **Create Formspree form:**
   - Go to [Formspree](https://formspree.io)
   - Sign up (free tier available)
   - Create a new form
   - Copy your **Endpoint URL** (format: `https://formspree.io/f/xxxxx`)

2. **Add to Contact.astro:**
   - Open `src/components/sections/home/Contact.astro`
   - Find this line in `handleSubmit()`:
     ```typescript
     const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
     ```
   - Replace `YOUR_FORM_ID` with the ID from your Formspree endpoint

3. **Test the form:**
   ```bash
   npm run dev
   ```

   - Visit `http://localhost:4321`
   - Fill out the contact form
   - Check your Formspree dashboard for new submissions
   - You'll receive email notifications for each lead

### Formspree Features:

✅ **Email notifications** — Get instant alerts for new leads  
✅ **SPAM filtering** — Built-in protection  
✅ **Webhook support** — Integrate with Slack, Discord, etc.  
✅ **CSV exports** — Download all submissions  
✅ **Custom redirects** — Redirect after submission

## Microsoft Clarity (Optional)

For heatmaps and session recordings:

1. Go to [Microsoft Clarity](https://clarity.microsoft.com)
2. Create a project
3. Get your Clarity ID
4. Add to `.env.example`:
   ```
   CLARITY_ID=xxxxx
   ```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your IDs:

```bash
cp .env.example .env.local
```

## Testing Analytics

### In Development:

```bash
npm run dev
```

Open DevTools Console to see event logs:

```
📊 Event: form_submit { form_name: 'samana_contact', ... }
```

### In Production:

Deploy to your hosting platform:

```bash
npm run build
npm run preview
```

Visit Google Analytics → Real-time to see live events

## Conversion Goals (Next Steps)

To track high-ticket conversions:

1. **In Google Analytics:** Create conversion events for:
   - Form submission value (estimate: $XXX per lead)
   - Project inquiry intent
   - Service consultation request

2. **In Formspree:** Set up webhooks to:
   - Notify sales team immediately
   - Log to CRM (Pipedrive, HubSpot, etc.)
   - Send auto-response email to lead

## Help

- **GA4 Issues:** [Google Analytics Help](https://support.google.com/analytics)
- **Formspree Issues:** [Formspree Docs](https://formspree.io/help)
- **Clarity Issues:** [Clarity Help](https://learn.microsoft.com/en-us/clarity/)
