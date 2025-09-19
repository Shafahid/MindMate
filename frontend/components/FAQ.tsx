'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';


const items = [
  {
    id: '1',
    title: 'How does MindMate support my mental health journey?',
    content:
      'MindMate provides AI-powered mental health support, personalized wellness plans, and access to licensed therapists. Our platform combines technology with human care to offer 24/7 support, mood tracking, progress monitoring, and a supportive community to help you on your mental wellness journey.',
  },
  {
    id: '2',
    title: 'Is my personal information and mental health data secure?',
    content:
      'Absolutely. We use end-to-end encryption and strict privacy controls to protect your mental health data. Your information is never shared without your consent, and we comply with all healthcare privacy regulations including HIPAA. Your privacy and security are our top priorities.',
  },
  {
    id: '4',
    title: 'How does the AI-powered support work?',
    content:
      'Our AI companion uses advanced algorithms to understand your mental health patterns, provide personalized coping strategies, and offer 24/7 emotional support. It learns from your interactions to provide more tailored assistance while always maintaining privacy and never replacing professional care when needed.',
  },
  {
    id: '5',
    title: 'What if I\'m in a mental health crisis?',
    content:
      'If you\'re experiencing a mental health crisis, please contact emergency services (911) or a crisis hotline immediately. MindMate also provides quick access to crisis support resources and can help connect you with immediate professional assistance when urgent care is needed.',
  },
  {
    id: '6',
    title: 'How do I track my mental wellness progress?',
    content:
      'MindMate offers comprehensive progress tracking including daily mood check-ins, wellness goal monitoring, therapy session notes, and milestone celebrations. You can visualize your journey through charts and insights that help you understand your patterns and celebrate your growth.',
  },
];

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 * index,
      duration: 0.4,
    },
  }),
};

// FAQ Card Component
const FAQCard = ({ item, index }: { item: typeof items[0]; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      custom={index}
      variants={fadeInAnimationVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="mb-4"
    >
      <motion.div
        className="backdrop-blur-sm rounded-xl border border-violet-200/60 shadow-lg overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-6 py-4 text-left flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg">
              <HelpCircle className="w-5 h-5 text-violet-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-violet-700 transition-colors duration-200">
              {item.title}
            </h3>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-violet-600" />
          </motion.div>
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-4">
                <div className="border-t border-violet-200/30 pt-4">
                  <p className="text-gray-600 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default function Faq1() {
  return (
    <section className="py-12 md:py-16 " id="faqs">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <motion.h2
            className="mb-4 text-3xl font-bold tracking-tight md:text-4xl text-gray-800"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-[#5e2bf5] to-[#5e2bf5] bg-clip-text text-transparent">
              Questions
            </span>
          </motion.h2>
          <motion.p
            className="text-gray-600 mx-auto max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Everything you need to know about MindMate and how we support your mental wellness journey with AI-powered care and professional guidance.
          </motion.p>
        </div>

        <motion.div
          className="relative mx-auto max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >


          <div className="grid gap-2">
            {items.map((item, index) => (
              <FAQCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
