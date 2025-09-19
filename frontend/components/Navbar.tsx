'use client'

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Menu, X, ChevronDown, Brain } from 'lucide-react'

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigationLinks = [
    { name: 'Home', href: '/home' },
    { name: 'Features', href: '/features' },
    { name: 'How it works', href: '/how-it-works' },
    { name: 'Blogs', href: '/blog' },
    { name: 'FAQs', href: '/why-mindmate' },
  ]

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
              <Link
                key={link.name}
                href={link.href}
                className="font-sans text-gray-700 hover:text-purple-700 font-medium text-md transition-colors duration-200 px-3 py-2 rounded-lg hover:text-lg"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Dropdown */}
           

            {/* Subscribe Button */}
            <Button 
            onClick={() => window.location.href = '/signup'}
            className="font-sans bg-white/50 hover:bg-gray-50 text-purple-700 border-2 border-white px-6 py-2 rounded-full font-medium text-md transition-all duration-200 shadow-sm hover:shadow-md">
              Get Started
            </Button>
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
                <Link
                  key={link.name}
                  href={link.href}
                  className="font-sans block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Mobile Actions */}
              <div className="pt-4 space-y-3 border-t border-purple-100">
                
                <Button className="font-sans w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-200">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
