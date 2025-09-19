import React from 'react'
import Navbar from './Navbar'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { ArrowRight, Download, Heart, Shield, Users, Brain } from 'lucide-react'
import Link from 'next/link'

function Hero() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />
      
      {/* Hero Section with Grid Background */}
      <div className="relative flex h-screen w-full items-center justify-center bg-white dark:bg-black pt-20">
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
          )}
        />
        
        {/* Radial gradient for faded effect */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
        
        {/* Floating Gradient Text Divs */}
  <div className="absolute top-32 left-16 md:left-32 z-0 animate-float pointer-events-none">
          <div className="bg-gradient-to-r from-violet-500 to-gray-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm">
            We have prepared the best specialist for you
          </div>
        </div>

  <div className="absolute top-40 right-12 md:right-28 z-0 animate-float-delay pointer-events-none">
          <div className="bg-gradient-to-r from-violet-500 to-gray-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm">
            24/7 AI Support Available
          </div>
        </div>

  <div className="absolute bottom-40 left-12 md:left-24 z-0 animate-float-slow pointer-events-none">
          <div className="bg-gradient-to-r from-violet-500 to-gray-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm">
            100% Anonymous & Safe
          </div>
        </div>

  <div className="absolute bottom-32 right-16 md:right-32 z-0 animate-float pointer-events-none">
          <div className="bg-gradient-to-r from-violet-500 to-gray-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm">
            Join 10,000+ Students
          </div>
        </div>

  <div className="absolute top-1/2 left-8 md:left-16 z-0 animate-float-delay pointer-events-none">
          <div className="bg-gradient-to-r from-violet-500 to-gray-500 text-white px-3 py-2 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm">
            Mental Wellness
          </div>
        </div>

  <div className="absolute top-1/3 right-8 md:right-20 z-0 animate-float-slow pointer-events-none">
          <div className="bg-gradient-to-r from-violet-500 to-gray-500 text-white px-3 py-2 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm">
            Peer Support
          </div>
        </div>
        
        {/* Main Content */}
  <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
          {/* Main Headline */}
          <h1 className="mb-6 bg-gradient-to-b from-neutral-800 to-neutral-500 bg-clip-text text-5xl font-bold text-transparent dark:from-neutral-200 dark:to-neutral-500 sm:text-7xl lg:text-8xl">
            Care for Your Mind with{' '}
            <span className="bg-gradient-to-r from-[#5e2bf5] to-[#9775fa] bg-clip-text text-transparent">
              MindMate
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="mb-8 text-xl text-neutral-600 dark:text-neutral-300 sm:text-2xl lg:text-3xl">
            Your safe, supportive space for mental wellness—powered by empathy, technology, and community.
          </p>
          
          
          {/* CTA Buttons */}
          <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Link 
              href="/signup"
              className="group inline-flex items-center px-6 py-3 text-lg font-semibold text-violet-600 transition-all duration-300 hover:from-violet-700 hover:to-[#9775fa] hover:scale-105 hover:shadow-xl border border-violet-600 rounded-md hover:bg-violet-50 bg-white/50"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            
          </div>
          
          
          
        </div>
      </div>
    </div>
  )
}

export default Hero