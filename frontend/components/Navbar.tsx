"use client";

import Image from 'next/image'
import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Menu, X, ChevronDown, Brain } from 'lucide-react'

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationLinks = [
    { name: 'Home', href: '/home' },
    { name: 'Features', href: '/features' },
    { name: 'How it works', href: '/how-it-works' },
    { name: 'Why MindMate', href: '/why-mindmate' },
    { name: 'Blogs', href: '/blog' },
  ]

  return (
  <nav className="w-full bg-gradient-to-r from-purple-50 via-pink-50 to-purple-100 border-b border-purple-100/50 sticky top-0 z-50 font-sans">
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
                <span className="font-sans font-bold text-xl text-gray-800 -ml-4">
                 <Image src="/mindmate1.png" alt="MindMate Logo" width={160} height={32} />
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
                className="font-sans text-gray-700 hover:text-purple-700 font-medium text-sm transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-white/50"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Dropdown */}
           

            {/* Subscribe Button */}
            <Button className="font-sans bg-white hover:bg-gray-50 text-purple-700 border border-purple-200 px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md">
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

export default Navbar