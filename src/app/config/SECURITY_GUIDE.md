# Production Security & Live Hosting Best Practices

This directory contains configuration templates and patterns to ensure zero accidental credential leakage when hosting live on Vercel, Netlify, GitHub Pages, Firebase, or AWS.

## 🛡️ Security Rules Applied

1. **Git Isolation**:
   - `credentials.local.ts`, `*.env`, `*.key`, and secret token files are explicitly listed in `.gitignore`.
   - Never commit private tokens, passwords, or OAuth client secrets to any public git branch.

2. **Client-Side vs Backend Boundaries**:
   - Angular is a client-side Single Page Application (SPA). Any key placed directly in frontend JS code is visible to anyone inspecting the browser devtools.
   - For sensitive integrations (e.g. LinkedIn OAuth token exchanges, transactional email dispatchers with private API keys), use serverless functions (e.g., Netlify Functions, Vercel Serverless `/api/...`, or Firebase Cloud Functions) and route through `environment.linkedinProfileApiUrl`.

3. **Contact Form**:
   - The default contact form uses native `mailto:` redirection for zero-credential operation.
   - If using a mail service API, configure the endpoint via `APP_CREDENTIALS.apiEndpoints.contactFormWebhook` pointing to your secured serverless handler.

4. **Production Build Sanitization**:
   - `ng build --configuration production` uses `environment.prod.ts` with debugging/verbose logging disabled to prevent leaking internal traces.
