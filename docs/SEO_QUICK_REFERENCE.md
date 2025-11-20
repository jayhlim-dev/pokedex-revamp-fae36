# SEO Metadata - Quick Reference

## 🚀 Quick Test (30 seconds)

1. **Start your dev server**: `npm run dev`
2. **Visit**: `http://localhost:3000/pokemon/pikachu`
3. **Check browser tab**: Should show "Pikachu #025 | PokeVee" ✅
4. **Right-click → Inspect → Elements → `<head>`**: See all metadata tags ✅

## 📋 Testing Checklist

### Browser Test
- [ ] Tab title shows Pokemon name + number
- [ ] View source shows `<title>` tag
- [ ] View source shows `<meta name="description">`
- [ ] View source shows Open Graph tags (`og:title`, `og:image`)
- [ ] View source shows Twitter Card tags

### Local Testing (Works with localhost)
- [ ] **Visual Preview Tool**: Open `scripts/preview-metadata.html` in browser
- [ ] **Test Script**: `node scripts/test-metadata.js pikachu charizard`
- [ ] **Browser Extension**: Install "Open Graph Preview" extension

### Online Tools (Requires Public URL)
⚠️ **Note**: These need a public URL, not localhost. Options:
- Use **ngrok**: `ngrok http 3000` (then use the ngrok URL)
- Deploy to staging/production first
- [ ] **metatags.io** - Preview social media cards
- [ ] **Facebook Debugger** - Test Open Graph
- [ ] **Twitter Card Validator** - Test Twitter preview

## 📊 Tracking in Google Analytics

### View SEO Events
1. Go to GA4 → Events
2. Filter by: `seo_metadata_generated`
3. See which Pokemon pages are being accessed

### View by Pokemon
1. Go to GA4 → Events
2. Filter by Event Label = `pikachu` (or any Pokemon name)
3. See all events for that Pokemon including metadata generation

## 🔍 What Gets Tracked

When you visit `/pokemon/pikachu`:
- ✅ Page title: "Pikachu #025 | PokeVee"
- ✅ Meta description with Pokemon info
- ✅ Open Graph image (Pokemon artwork)
- ✅ Twitter Card preview
- ✅ Canonical URL
- ✅ SEO keywords

## 🛠️ Common Commands

### Local Testing (localhost)
```bash
# Test specific Pokemon
node scripts/test-metadata.js pikachu

# Test multiple Pokemon
node scripts/test-metadata.js pikachu charizard bulbasaur

# Visual preview tool
# Open scripts/preview-metadata.html in your browser
```

### Browser Testing
```bash
# View page source (in browser)
# Right-click → View Page Source

# Check metadata in DevTools
# F12 → Elements → <head> section
```

### Expose localhost for Online Tools
```bash
# Using ngrok (free)
ngrok http 3000
# Then use the provided URL with metatags.io, etc.
```

## 📈 Monitoring

### Weekly
- Check Google Search Console for indexing
- Review GA4 for popular Pokemon pages

### Monthly  
- Test random Pokemon pages
- Check social media previews
- Review search rankings

## 🐛 Troubleshooting

**Title not updating?**
→ Clear browser cache or use incognito mode

**Image not showing in social preview?**
→ Use Facebook Debugger to refresh cache

**Description too long?**
→ Edit `generateMetadata` in `app/pokemon/[name]/page.jsx` (line 56)

## 📚 Full Documentation

See `docs/SEO_TESTING_GUIDE.md` for detailed instructions.

