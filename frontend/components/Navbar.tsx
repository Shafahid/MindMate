'use client'

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Menu, X, ChevronDown, Brain, User, LogOut, Settings } from 'lucide-react'
import { supabase } from '@/lib/supabase'

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 10)
    }

    // Check authentication status
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        console.log('Auth check - User:', user)
        console.log('Auth check - Error:', error)
        setUser(user)
      } catch (error) {
        console.error('Error checking auth:', error)
        setUser(null)
      }
    }

    checkAuth()
    window.addEventListener('scroll', handleScroll)

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      subscription.unsubscribe()
    }
  }, [])

  const navigationLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'How it works', href: '#how-it-works' },
    { name: 'Blogs', href: '#blogs' },
    { name: 'FAQs', href: '#faqs' },
  ]

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
  <nav className={`w-full border-b border-purple-100/50 sticky top-0 z-50 font-sans transition-all duration-300 ${
    isScrolled 
      ? 'bg-white/80 backdrop-blur-md shadow-lg' 
      : 'bg-gradient-to-r from-purple-50/50 via-pink-50/50 to-purple-100'
  }`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 lg:h-18">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex">
              <div className="flex items-center">
                {/* Custom Logo Design similar to Poruch */}
                <Image
                  src="/mindmate.png"
                  alt="MindMate Logo"
                  width={70}
                  height={32}
                />
                <span className="font-sans font-semibold text-xl text-gray-800">
                 <h3 className="text-2xl font-bold text-gray-900">Mind<span className="text-violet-600">Mate</span></h3>
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="font-sans text-gray-700 hover:text-purple-700 font-medium text-md transition-colors duration-200 px-3 py-2 rounded-lg hover:text-lg cursor-pointer"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              /* Profile Button */
              <Link href="/profile">
                <Button variant="ghost" className="font-sans flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 hover:bg-gray-50 text-purple-700 border-2 border-white transition-all duration-200 shadow-sm hover:shadow-md">
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </Button>
              </Link>
            ) : (
              /* Get Started Button */
              <Button 
                onClick={() => window.location.href = '/signup'}
                className="font-sans bg-white/50 hover:bg-gray-50 text-purple-700 border-2 border-white px-6 py-2 rounded-full font-medium text-md transition-all duration-200 shadow-sm hover:shadow-md">
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-purple-700 hover:bg-white/50"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-purple-100 bg-white/80 backdrop-blur-sm">
            <div className="px-4 pt-4 pb-6 space-y-3">
              {navigationLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    scrollToSection(link.href)
                    setIsMobileMenuOpen(false)
                  }}
                  className="font-sans block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition-colors duration-200"
                >
                  {link.name}
                </button>
              ))}
              {/* Mobile Actions */}
              <div className="pt-4 space-y-3 border-t border-purple-100">
                {user ? (
                  /* Mobile Profile Link */
                  <Link 
                    href="/profile"
                    className="font-sans flex items-center gap-2 w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </Link>
                ) : (
                  /* Mobile Get Started Button */
                  <Button 
                    onClick={() => window.location.href = '/signup'}
                    className="font-sans w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-200">
                    Get Started
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
