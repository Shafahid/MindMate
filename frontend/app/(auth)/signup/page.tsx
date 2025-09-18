'use client';

import { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Brain,
  Heart,
  Shield,
  Users,
  User,
  Phone,
  GraduationCap,
  Calendar,
} from 'lucide-react';
import Image from 'next/image';

function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    university: '',
    age: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert('Account created successfully! (This is a demo)');
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4 font-nohemi">
      <style jsx>{`
        .signup-btn {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          position: relative;
          overflow: hidden;
        }
        .signup-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s;
        }
        .signup-btn:hover::before {
          left: 100%;
        }
      `}</style>
      <div className="z-10 w-full max-w-6xl">
        <div className="bg-purple-100/30 overflow-hidden rounded-[40px] border-1 border-purple-300">
          <div className="grid min-h-[700px] lg:grid-cols-2">
            {/* Left Side */}
            <div className="brand-side relative m-4 rounded-3xl bg-[url('/signup.png')] bg-cover bg-center p-12 text-white">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-blue-900/60 to-indigo-900/60 rounded-3xl"></div>
              <div className="relative h-full flex flex-col justify-end">
                <div className="mb-6 text-lg font-semibold">
                  MindMate
                </div>
                <h1 className="mb-4 text-6xl font-medium">
                  Start Your Wellness Journey
                </h1>
                <p className="mb-12 text-xl opacity-80">
                  Join our community and take the first step towards better mental health
                </p>
        
              </div>
            </div>

            {/* Right Side */}
            <div className="flex flex-col justify-center p-12">
              <div className="mx-auto w-full max-w-md">
                <div className="mb-8 text-center">
                  <Image src="/mindmate.png" alt="MindMate Logo" width={140} height={32} className="mx-auto mb-4"/>
                  <h2 className="text-3xl font-light uppercase">
                    Create Account
                  </h2>
                  <p className="mt-2 text-sm text-stone-600">
                    Join MindMate and start your mental wellness journey
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="mb-2 block text-sm font-medium uppercase"
                      >
                        First Name
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="border-border bg-gray-100 block w-full rounded-lg border py-3 pr-3 pl-10 text-sm"
                          placeholder="First name"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="mb-2 block text-sm font-medium uppercase"
                      >
                        Last Name
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="border-border bg-gray-100 block w-full rounded-lg border py-3 pr-3 pl-10 text-sm"
                          placeholder="Last name"
                        />
                      </div>
                    </div>
                  </div>

                  {/* University */}
                  <div>
                    <label
                      htmlFor="university"
                      className="mb-2 block text-sm font-medium uppercase"
                    >
                      University
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <GraduationCap className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="university"
                        name="university"
                        type="text"
                        value={formData.university}
                        onChange={handleInputChange}
                        required
                        className="border-border bg-gray-100 block w-full rounded-lg border py-3 pr-3 pl-10 text-sm"
                        placeholder="Your university"
                      />
                    </div>
                  </div>

                  {/* Age & Phone Number */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="age"
                        className="mb-2 block text-sm font-medium uppercase"
                      >
                        Age
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="age"
                          name="age"
                          type="number"
                          min="13"
                          max="120"
                          value={formData.age}
                          onChange={handleInputChange}
                          required
                          className="border-border bg-gray-100 block w-full rounded-lg border py-3 pr-3 pl-10 text-sm"
                          placeholder="Age"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="phoneNumber"
                        className="mb-2 block text-sm font-medium uppercase"
                      >
                        Phone
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          required
                          className="border-border bg-gray-100 block w-full rounded-lg border py-3 pr-3 pl-10 text-sm"
                          placeholder="Phone number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium uppercase"
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="border-border bg-gray-100 block w-full rounded-lg border py-3 pr-3 pl-10 text-sm"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-medium uppercase"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="border-border bg-gray-100 block w-full rounded-lg border py-3 pr-12 pl-10 text-sm"
                        placeholder="Create password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm font-medium uppercase"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="border-border bg-gray-100 block w-full rounded-lg border py-3 pr-12 pl-10 text-sm"
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="border-border text-primary h-4 w-4 rounded"
                    />
                    <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                      I agree to the Privacy Policy and Terms of Service
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="signup-btn relative flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="ml-2">Creating account...</span>
                      </>
                    ) : (
                      'Create your account'
                    )}
                  </button>
                </form>

                <div className="text-muted-foreground mt-8 text-center text-sm">
                  Already have an account?{' '}
                  <a href="/signin" className="text-primary hover:text-primary/80">
                    Sign in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
