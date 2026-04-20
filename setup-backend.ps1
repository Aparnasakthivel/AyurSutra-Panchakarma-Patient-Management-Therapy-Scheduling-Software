#!/usr/bin/env pwsh

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Panchakarma Backend Setup Script                         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "`n✅ Installation complete!" -ForegroundColor Green
Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Ensure MongoDB is running (local or Atlas)" -ForegroundColor White
Write-Host "2. Update .env file with your MONGODB_URI if needed" -ForegroundColor White
Write-Host "3. Run development server: npm run server:dev" -ForegroundColor White
Write-Host "4. Or run production server: npm run server" -ForegroundColor White

Write-Host "`n🌐 Server will run on: http://localhost:4000" -ForegroundColor Cyan
Write-Host "📚 API Documentation: Check backend/README.md" -ForegroundColor Cyan
Write-Host "`n"
