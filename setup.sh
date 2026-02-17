#!/bin/bash

# Smart Bookmark Manager - Setup Helper Script
# This script helps you set up your environment variables

echo "🚀 Smart Bookmark Manager - Setup Wizard"
echo "=========================================="
echo ""

# Check if .env.local already exists
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted. Your existing .env.local is safe."
        exit 0
    fi
fi

echo "Please enter your Supabase credentials:"
echo "(You can find these in Supabase Dashboard → Settings → API)"
echo ""

# Get Supabase URL
read -p "Enter your Supabase URL (https://xxx.supabase.co): " SUPABASE_URL
if [ -z "$SUPABASE_URL" ]; then
    echo "❌ Error: Supabase URL cannot be empty"
    exit 1
fi

# Get Supabase Anon Key
read -p "Enter your Supabase Anon Key: " SUPABASE_ANON_KEY
if [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ Error: Supabase Anon Key cannot be empty"
    exit 1
fi

# Create .env.local file
cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
EOF

echo ""
echo "✅ .env.local file created successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Make sure you've set up the database (run supabase-setup.sql)"
echo "2. Configure Google OAuth in Supabase"
echo "3. Run 'npm run dev' to start the development server"
echo ""
echo "📚 For detailed setup instructions, see QUICKSTART.md"
echo ""
echo "Happy coding! 🎉"
