#!/usr/bin/env node

/**
 * VoiceBank Setup Diagnostic Tool
 * Run this to check if everything is configured correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VoiceBank Setup Diagnostic\n');
console.log('==============================\n');

let hasIssues = false;

// Check 1: .env.local file exists
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file NOT FOUND');
  console.log('   → Create a .env.local file in the project root\n');
  hasIssues = true;
} else {
  console.log('✅ .env.local file exists\n');
  
  // Check 2: Required environment variables
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const hasElevenLabsKey = envContent.includes('ELEVENLABS_API_KEY=');
  const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=');
  const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=');
  
  if (!hasElevenLabsKey) {
    console.log('❌ ELEVENLABS_API_KEY is missing');
    console.log('   → Get your API key from https://elevenlabs.io\n');
    hasIssues = true;
  } else {
    // Check if it looks like a real key
    const keyMatch = envContent.match(/ELEVENLABS_API_KEY=(.+)/);
    if (keyMatch && keyMatch[1].trim().length > 10) {
      console.log('✅ ELEVENLABS_API_KEY is configured');
      
      // Check if it looks like the example/placeholder
      if (keyMatch[1].includes('your-') || keyMatch[1].includes('your_') || keyMatch[1].includes('sk_...')) {
        console.log('   ⚠️  WARNING: Key looks like a placeholder. Replace with your actual key!\n');
        hasIssues = true;
      } else {
        console.log('');
      }
    } else {
      console.log('❌ ELEVENLABS_API_KEY appears to be empty or invalid\n');
      hasIssues = true;
    }
  }
  
  if (!hasSupabaseUrl) {
    console.log('❌ NEXT_PUBLIC_SUPABASE_URL is missing');
    console.log('   → Get from https://supabase.com → Project Settings → API\n');
    hasIssues = true;
  } else {
    console.log('✅ NEXT_PUBLIC_SUPABASE_URL is configured\n');
  }
  
  if (!hasSupabaseKey) {
    console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
    console.log('   → Get from https://supabase.com → Project Settings → API\n');
    hasIssues = true;
  } else {
    console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is configured\n');
  }
}

// Check 3: Node modules
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('❌ node_modules NOT FOUND');
  console.log('   → Run: npm install\n');
  hasIssues = true;
} else {
  console.log('✅ Dependencies installed\n');
}

// Check 4: Key files exist
const keyFiles = [
  'app/api/generate-voice/route.ts',
  'app/api/speak/route.ts',
  'lib/elevenlabs.ts',
  'package.json'
];

let allFilesExist = true;
for (const file of keyFiles) {
  if (!fs.existsSync(path.join(__dirname, file))) {
    console.log(`❌ Missing file: ${file}`);
    allFilesExist = false;
    hasIssues = true;
  }
}

if (allFilesExist) {
  console.log('✅ All core files present\n');
}

// Final verdict
console.log('==============================\n');
if (hasIssues) {
  console.log('⚠️  SETUP INCOMPLETE - Fix the issues above\n');
  console.log('📖 See VOICE_CLONING_FIX.md for detailed help\n');
} else {
  console.log('🎉 Setup looks good!\n');
  console.log('⚠️  IMPORTANT: Voice cloning requires a PAID ElevenLabs subscription');
  console.log('   Free tier only allows pre-made voices, not voice cloning.');
  console.log('   Upgrade at: https://elevenlabs.io/subscription\n');
  console.log('💡 Next steps:');
  console.log('   1. Make sure you have a paid ElevenLabs plan (Starter or higher)');
  console.log('   2. Run: npm run dev');
  console.log('   3. Go to: http://localhost:3000');
  console.log('   4. Record your voice and check the console for any errors\n');
}

