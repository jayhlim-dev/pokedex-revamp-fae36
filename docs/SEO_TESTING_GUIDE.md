# SEO Metadata Testing Guide

## Quick Testing Methods

### 1. **Browser Developer Tools** (Easiest)

1. Open your app in the browser (e.g., `http://localhost:3000/pokemon/pikachu`)
2. Right-click → **Inspect** (or press `F12`)
3. Go to the **Elements** tab
4. Look for `<head>` section
5. Check for:
   - `<title>` tag
   - `<meta name="description">` tag
   - `<meta property="og:title">` (Open Graph)
   - `<meta property="og:image">` (Open Graph image)
   - `<meta name="twitter:card">` (Twitter Card)

### 2. **View Page Source**

1. Visit a Pokemon page (e.g., `/pokemon/pikachu`)
2. Right-click → **View Page Source** (or `Ctrl+U` / `Cmd+U`)
3. Search for "Pikachu" or "og:title" to see the metadata

### 3. **Browser Tab Title**

- Simply look at the browser tab - it should show: **"Pikachu #025 | PokeVee"**

### 4. **Local Testing Tools** (Works with localhost)

#### **Browser Extension: Open Graph Preview**

- Install browser extensions that can preview Open Graph tags locally
- **Chrome**: "Open Graph Preview" extension
- **Firefox**: "Open Graph Preview" add-on
- These work directly in your browser without needing a public URL

#### **Local HTML Validator**

- Save the HTML source and validate locally
- Or use the built-in test script: `node scripts/test-metadata.js pikachu`

### 5. **Online SEO Testing Tools** (Requires Public URL)

⚠️ **Note**: These tools require a publicly accessible URL (not localhost). Use one of these options:

- Deploy to a staging/production environment first
- Use a tunneling service (see below)

#### **Option A: Use Tunneling Service** (Recommended for Local Testing)

Expose your localhost to the internet temporarily:

**Using ngrok** (Free):

```bash
# Install ngrok: https://ngrok.com/
# Then run:
ngrok http 3000

# Use the provided URL (e.g., https://abc123.ngrok.io) with online tools
```

**Using Cloudflare Tunnel** (Free):

```bash
# Install cloudflared: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/
cloudflared tunnel --url http://localhost:3000
```

**Using VS Code Port Forwarding** (If using VS Code):

- Right-click on port 3000 → "Port Visibility" → "Public"
- Use the provided public URL

#### **Option B: Deploy First**

Deploy to Netlify/Vercel and test with the live URL.

#### **Online Tools** (After exposing localhost or deploying):

**Meta Tags Preview**

- **URL**: https://metatags.io/
- Paste your Pokemon page URL (must be public)
- See preview of how it appears on social media

**Open Graph Preview**

- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

**Google Rich Results Test**

- **URL**: https://search.google.com/test/rich-results
- Test if Google can parse your structured data

**Schema Markup Validator**

- **URL**: https://validator.schema.org/
- Validate structured data (if you add schema markup later)

### 6. **Command Line Testing** (cURL)

```bash
# Test a Pokemon page
curl -s http://localhost:3000/pokemon/pikachu | grep -E '<title>|<meta.*description|<meta.*og:'

# Or use a more detailed view
curl -s http://localhost:3000/pokemon/pikachu | grep -A 1 -E 'title|description|og:'
```

## Tracking SEO Performance

### 1. **Google Search Console** (Recommended)

1. Go to https://search.google.com/search-console
2. Add your website property
3. Verify ownership
4. Monitor:
   - **Performance**: See which Pokemon pages get the most impressions/clicks
   - **Coverage**: Check if all Pokemon pages are indexed
   - **Enhancements**: See if metadata is working correctly

### 2. **Google Analytics 4** (You already have this!)

Your existing GA4 setup (`G-YVQ7XEX0QM`) can track:

- Page views per Pokemon
- User engagement
- Search queries that lead to Pokemon pages

**To track SEO-specific metrics:**

- Go to GA4 → Reports → Engagement → Pages and screens
- Filter by Pokemon pages to see which are most popular
- Check the "Page title" dimension to see if metadata titles are being used

### 3. **Add SEO Event Tracking** (Optional)

You can add custom tracking for metadata generation:

```javascript
// Track when metadata is successfully generated
trackEvent('seo_metadata_generated', {
  eventCategory: 'seo',
  eventLabel: pokemonName,
  customData: {
    pokemon_name: pokemonName,
    has_image: !!pokemonImage,
    has_description: !!description
  }
});
```

## Testing Checklist

### ✅ Basic Metadata

- [ ] Page title shows Pokemon name and number
- [ ] Meta description includes Pokemon info
- [ ] Keywords are present
- [ ] Canonical URL is correct

### ✅ Open Graph (Social Sharing)

- [ ] og:title is present
- [ ] og:description is present
- [ ] og:image shows Pokemon image
- [ ] og:url is correct

### ✅ Twitter Card

- [ ] twitter:card is set to "summary_large_image"
- [ ] twitter:title is present
- [ ] twitter:description is present
- [ ] twitter:image is present

### ✅ Performance

- [ ] Metadata loads quickly
- [ ] Images load properly
- [ ] No console errors

## Common Issues & Solutions

### Issue: Title not updating

**Solution**: Clear browser cache or use incognito mode

### Issue: Image not showing in social preview

**Solution**:

- Check if image URL is absolute (starts with http:// or https://)
- Use Facebook Debugger to refresh cache
- Ensure image is publicly accessible

### Issue: Description too long/short

**Solution**: Adjust the substring length in `generateMetadata` function (currently 120 chars)

## Monitoring SEO Health

### Weekly Checks:

1. Google Search Console - Check for indexing issues
2. GA4 - Review which Pokemon pages are most viewed
3. Test a few random Pokemon pages to ensure metadata works

### Monthly Checks:

1. Review search rankings for Pokemon-related keywords
2. Check social media shares to see if previews look good
3. Monitor page load times (metadata shouldn't slow things down)

## Advanced: Add Schema Markup (Future Enhancement)

You can add JSON-LD structured data for even better SEO:

```javascript
// In generateMetadata, you could add:
export async function generateMetadata({ params }) {
  // ... existing code ...

  return {
    // ... existing metadata ...
    other: {
      'application/ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `${capitalizedName} ${pokedexNumber}`,
        description: description,
        image: pokemonImage
      })
    }
  };
}
```
