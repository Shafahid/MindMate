'use client';

import { useState } from 'react';
import {
  Mail,
  Loader2,
  Brain,
  Heart,
  Shield,
  Users,
  ArrowLeft,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4 font-nohemi">
      <style jsx>{`
        .reset-btn {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          position: relative;
          overflow: hidden;
        }
        .reset-btn::before {
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
        .reset-btn:hover::before {
          left: 100%;
        }
      `}</style>
      <div className="z-10 w-full max-w-4xl">
        <div className="bg-purple-100/30 overflow-hidden rounded-[40px] border-1 border-purple-300">
          <div className="flex flex-col justify-center lg:flex-row">
            

            <div className="flex flex-col justify-center p-12">
              <div className="mx-auto w-full max-w-md">
                {!sent ? (
                  <>
                    <div className="mb-8 text-center">
                      <Image src="/mindmate.png" alt="MindMate Logo" width={140} height={32} className="mx-auto mb-4"/>
                      <h2 className="text-3xl font-light uppercase">
                        Forgot Password?
                      </h2>
                      <p className="mt-2 text-sm text-stone-600">
                        Enter your email address and we'll send you a link to reset your password
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border-border bg-gray-100 block w-full rounded-lg border py-3 pr-3 pl-10 text-sm"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="reset-btn relative flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition-all duration-300"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="ml-2">Sending reset link...</span>
                          </>
                        ) : (
                          'Send reset link'
                        )}
                      </button>
                    </form>

                    <div className="text-muted-foreground mt-8 text-center text-sm">
                      Remember your password?{' '}
                      <Link href="/signin" className="text-primary hover:text-primary/80">
                        Sign in
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <Image src="/mindmate.png" alt="MindMate Logo" width={140} height={32} className="mx-auto mb-4"/>
                    <div className="mb-6">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <Mail className="h-8 w-8 text-green-600" />
                      </div>
                      <h2 className="text-3xl font-light uppercase mb-4">
                        Check Your Email
                      </h2>
                      <p className="text-sm text-stone-600 mb-2">
                        We've sent a password reset link to:
                      </p>
                      <p className="text-sm font-medium text-purple-600 mb-6">
                        {email}
                      </p>
                      <p className="text-sm text-stone-600">
                        Didn't receive the email? Check your spam folder or try again.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={() => setSent(false)}
                        className="reset-btn relative flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition-all duration-300"
                      >
                        Send another email
                      </button>

                      <Link
                        href="/signin"
                        className="flex items-center justify-center w-full text-sm text-gray-600 hover:text-purple-600 transition-colors"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to sign in
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
