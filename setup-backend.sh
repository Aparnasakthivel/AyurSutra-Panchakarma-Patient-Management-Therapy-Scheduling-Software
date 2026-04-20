#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Panchakarma Backend Setup Script                         ║"
echo "╚════════════════════════════════════════════════════════════╝"

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Installation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Ensure MongoDB is running (local or Atlas)"
echo "2. Update .env file with your MONGODB_URI if needed"
echo "3. Run development server: npm run server:dev"
echo "4. Or run production server: npm run server"

echo ""
echo "🌐 Server will run on: http://localhost:4000"
echo "📚 API Documentation: Check backend/README.md"
echo ""
