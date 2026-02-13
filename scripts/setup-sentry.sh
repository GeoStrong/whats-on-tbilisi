#!/usr/bin/env bash

# Sentry Setup Script for What'sOnTbilisi
# Run this after creating a Sentry account to configure error tracking

set -e

echo "[SETUP] Sentry Setup for What'sOnTbilisi"
echo "===================================="
echo ""

# Check if Sentry CLI is installed
if ! command -v sentry-cli &> /dev/null; then
    echo "Installing Sentry CLI..."
    npm install -D @sentry/cli
fi

# Prompt for Sentry DSN
echo "1. Go to https://sentry.io and create an account"
echo "2. Create a new project (Next.js)"
echo "3. Copy the DSN from Settings → Client Keys (DSN)"
echo ""
read -p "Enter your Sentry DSN: " SENTRY_DSN

if [ -z "$SENTRY_DSN" ]; then
    echo "[ERROR] Sentry DSN is required"
    exit 1
fi

# Prompt for Sentry Auth Token
echo ""
echo "4. Go to Settings → Auth Tokens in Sentry"
echo "5. Create a token with org:read and project:releases scopes"
echo "6. Copy the token"
echo ""
read -p "Enter your Sentry Auth Token: " SENTRY_AUTH_TOKEN

if [ -z "$SENTRY_AUTH_TOKEN" ]; then
    echo "[ERROR] Sentry Auth Token is required"
    exit 1
fi

# Install Sentry packages
echo ""
echo "[INSTALL] Installing Sentry packages..."
npm install @sentry/nextjs

# Update .env.local
echo ""
echo "[CONFIG] Updating .env.local..."
cat >> .env.local << EOF

# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=$SENTRY_DSN
SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
EOF

echo ""
echo "[OK] Sentry installation complete!"
echo ""
echo "Next steps:"
echo "1. Review lib/utils/logger.ts to ensure Sentry integration is working"
echo "2. Initialize Sentry in app/layout.tsx (see lib/middleware/sentry.ts for example)"
echo "3. Test: npm run dev, then trigger an error"
echo "4. Check Sentry dashboard to confirm errors are being captured"
echo ""
echo "For Vercel deployment:"
echo "1. Add these to GitHub repo secrets (Settings → Secrets):"
echo "   - NEXT_PUBLIC_SENTRY_DSN"
echo "   - SENTRY_AUTH_TOKEN"
echo "2. They will be automatically used in CI/CD pipeline"
