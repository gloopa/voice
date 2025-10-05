'use client'

import Link from 'next/link'
import { Mic, Heart, Clock, DollarSign } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <Mic className="w-12 h-12 text-primary-400" />
            <h1 className="text-4xl font-bold text-gray-900">VoiceBank</h1>
          </div>

          {/* Headline */}
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Preserve Your Voice
            <span className="block text-primary-400">Forever</span>
          </h2>

          {/* Subheadline */}
          <p className="text-2xl text-gray-600 mb-8">
            Simple. Free. 15 minutes.
          </p>

          {/* CTA Button */}
          <Link
            href="/record"
            className="inline-block bg-primary-400 hover:bg-primary-500 text-white font-semibold text-xl px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Start Recording →
          </Link>

          {/* Hook */}
          <p className="mt-8 text-lg text-gray-700 font-medium">
            30,000 people lose their voice each year. Don't wait.
          </p>
        </div>

        {/* Value Props */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="text-center p-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-primary-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">100% Free</h3>
            <p className="text-gray-600">
              Professional voice banking costs $3,000+. We make it free for everyone.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-primary-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Just 15 Minutes</h3>
            <p className="text-gray-600">
              Record 8 simple prompts. Our AI does the rest in 10 minutes.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Your Legacy</h3>
            <p className="text-gray-600">
              Preserve what makes you unique. Your family will always hear you.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              This is my voice. My family will always hear <em>me</em>.
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              For people facing ALS, laryngeal cancer, stroke, or progressive diseases, 
              losing your voice means losing a fundamental part of your identity.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              VoiceBank uses advanced AI to preserve your unique voice forever — 
              so you can still say "I love you," share stories, and be present for 
              the moments that matter most.
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <Link
            href="/record"
            className="inline-block bg-primary-400 hover:bg-primary-500 text-white font-semibold text-xl px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Get Started — It's Free →
          </Link>
        </div>
      </div>
    </div>
  )
}

