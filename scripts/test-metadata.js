/**
 * Simple script to test SEO metadata for Pokemon pages
 * 
 * Usage:
 *   1. Start your dev server: npm run dev
 *   2. Run this script: node scripts/test-metadata.js
 * 
 * Or test specific Pokemon:
 *   node scripts/test-metadata.js pikachu charizard
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Test Pokemon names
const testPokemon = process.argv.slice(2).length > 0 
    ? process.argv.slice(2) 
    : ['pikachu', 'charizard', 'bulbasaur', 'squirtle'];

async function testMetadata(pokemonName) {
    const url = `${BASE_URL}/pokemon/${pokemonName}`;
    
    try {
        console.log(`\n🔍 Testing: ${pokemonName}`);
        console.log(`   URL: ${url}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            console.log(`   ❌ Failed: ${response.status} ${response.statusText}`);
            return;
        }
        
        const html = await response.text();
        
        // Extract metadata
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
        const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i);
        const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i);
        const twitterCardMatch = html.match(/<meta\s+name=["']twitter:card["']\s+content=["'](.*?)["']/i);
        const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i);
        
        // Display results
        console.log(`   ✅ Status: ${response.status}`);
        
        if (titleMatch) {
            console.log(`   📄 Title: ${titleMatch[1]}`);
        } else {
            console.log(`   ⚠️  Title: Not found`);
        }
        
        if (descMatch) {
            const desc = descMatch[1].substring(0, 80);
            console.log(`   📝 Description: ${desc}...`);
        } else {
            console.log(`   ⚠️  Description: Not found`);
        }
        
        if (ogTitleMatch) {
            console.log(`   🔗 Open Graph Title: ${ogTitleMatch[1]}`);
        } else {
            console.log(`   ⚠️  Open Graph Title: Not found`);
        }
        
        if (ogImageMatch) {
            console.log(`   🖼️  Open Graph Image: ${ogImageMatch[1].substring(0, 60)}...`);
        } else {
            console.log(`   ⚠️  Open Graph Image: Not found`);
        }
        
        if (twitterCardMatch) {
            console.log(`   🐦 Twitter Card: ${twitterCardMatch[1]}`);
        } else {
            console.log(`   ⚠️  Twitter Card: Not found`);
        }
        
        if (canonicalMatch) {
            console.log(`   🔗 Canonical URL: ${canonicalMatch[1]}`);
        } else {
            console.log(`   ⚠️  Canonical URL: Not found`);
        }
        
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        console.log(`   💡 Make sure your dev server is running on ${BASE_URL}`);
    }
}

async function runTests() {
    console.log('🚀 Starting SEO Metadata Tests\n');
    console.log(`📍 Base URL: ${BASE_URL}`);
    console.log(`📋 Testing ${testPokemon.length} Pokemon: ${testPokemon.join(', ')}\n`);
    
    for (const pokemon of testPokemon) {
        await testMetadata(pokemon);
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n✅ Testing complete!');
    console.log('\n💡 Tips:');
    console.log('   - Check browser tab title when visiting the page');
    console.log('   - Use https://metatags.io/ to preview social media cards');
    console.log('   - Use browser DevTools → Elements → <head> to inspect metadata');
}

// Run tests
runTests().catch(console.error);

