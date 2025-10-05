'use client'

import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Warm ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-amber-100/40 via-transparent to-transparent blur-3xl pointer-events-none"></div>
        
        <div className="relative container mx-auto px-6 pt-32 pb-24 md:pt-40 md:pb-32">
          <div className="max-w-5xl mx-auto text-center">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200/50 mb-8">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
              <span className="text-sm font-medium text-amber-900">Voice preservation for everyone</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-[4rem] md:text-[5.5rem] lg:text-[7rem] font-bold tracking-tight leading-[0.95] mb-8">
              Preserve your
              <span className="block mt-2 bg-gradient-to-r from-amber-600 via-neutral-900 to-amber-600 bg-clip-text text-transparent">
                voice forever
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-neutral-700 mb-12 max-w-2xl mx-auto leading-relaxed">
              Professional voice banking for everyone. Free, private, and ready in 15 minutes.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                asChild 
                size="xl" 
                className="text-base bg-neutral-900 hover:bg-neutral-800 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <Link href="/record">
                  Start recording
                </Link>
              </Button>
              <Button 
                asChild 
                size="xl" 
                variant="outline" 
                className="text-base border-neutral-300 hover:bg-neutral-50"
              >
                <Link href="/voices">
                  View my voices
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 border-t border-neutral-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-neutral-900">30K+</div>
                <div className="text-sm text-neutral-600 mt-1">People lose their voice yearly</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-neutral-200"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-neutral-900">15 min</div>
                <div className="text-sm text-neutral-600 mt-1">To preserve your voice</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-neutral-200"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-neutral-900">100%</div>
                <div className="text-sm text-neutral-600 mt-1">Free forever</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-24 md:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              How it works
            </h2>
            <p className="text-xl text-neutral-600">
              Three simple steps to preserve your voice forever
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-amber-50 to-transparent rounded-3xl opacity-50"></div>
              <div className="relative bg-white rounded-2xl p-8 border border-neutral-200 h-full">
                <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xl font-bold mb-6">
                  1
                </div>
                <h3 className="text-2xl font-semibold text-neutral-900 mb-4">
                  Record your voice
                </h3>
                <p className="text-lg text-neutral-600 leading-relaxed">
                  Read 8 simple prompts out loud. Takes just 5 minutes. No special equipment needed.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-amber-50 to-transparent rounded-3xl opacity-50"></div>
              <div className="relative bg-white rounded-2xl p-8 border border-neutral-200 h-full">
                <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xl font-bold mb-6">
                  2
                </div>
                <h3 className="text-2xl font-semibold text-neutral-900 mb-4">
                  AI creates your voice
                </h3>
                <p className="text-lg text-neutral-600 leading-relaxed">
                  Our advanced AI analyzes your recordings and creates a digital replica of your voice.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-amber-50 to-transparent rounded-3xl opacity-50"></div>
              <div className="relative bg-white rounded-2xl p-8 border border-neutral-200 h-full">
                <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xl font-bold mb-6">
                  3
                </div>
                <h3 className="text-2xl font-semibold text-neutral-900 mb-4">
                  Generate speech
                </h3>
                <p className="text-lg text-neutral-600 leading-relaxed">
                  Type any text and hear it in your voice. Share messages with loved ones forever.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-6 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-to-br from-amber-50 via-orange-50/30 to-transparent rounded-[3rem] opacity-60"></div>
            <div className="relative bg-white/80 backdrop-blur rounded-3xl p-12 md:p-16 border border-amber-100">
              <blockquote className="space-y-8">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>
                <p className="text-3xl md:text-4xl font-medium text-neutral-900 leading-tight">
                  This is my voice. My family will always hear me.
                </p>
                <div className="space-y-6 text-lg text-neutral-700 leading-relaxed">
                  <p>
                    For people facing ALS, laryngeal cancer, stroke, or progressive diseases, 
                    losing your voice means losing a fundamental part of your identity.
                  </p>
                  <p>
                    VoiceU uses advanced AI to preserve your unique voice forever — 
                    so you can still say "I love you," share stories, and be present for 
                    the moments that matter most.
                  </p>
                </div>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-24 md:py-32 border-t border-neutral-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-neutral-900">
                Secure & Private
              </h4>
              <p className="text-neutral-600 leading-relaxed">
                Your voice data is encrypted end-to-end. Only you control who can access your voice.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-neutral-900">
                AI-Powered Quality
              </h4>
              <p className="text-neutral-600 leading-relaxed">
                Professional-grade voice cloning technology that captures your unique tone and emotion.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-neutral-900">
                For Everyone
              </h4>
              <p className="text-neutral-600 leading-relaxed">
                Join thousands of people preserving their voices for family, friends, and future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-6 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-300 to-amber-400 rounded-3xl blur opacity-20"></div>
            <div className="relative bg-neutral-900 rounded-3xl p-12 md:p-20 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to preserve your voice?
              </h2>
              <p className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto">
                It only takes 15 minutes, and it's completely free. Start today and give your family the gift of your voice.
              </p>
              <Button 
                asChild 
                size="xl" 
                className="text-base bg-white hover:bg-neutral-100 text-neutral-900 shadow-xl"
              >
                <Link href="/record">
                  Get started now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer spacing */}
      <div className="h-20"></div>
    </div>
  )
}

