'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const steps = [
  {
    id: '01',
    number: '01', 
    title: 'Track Your Daily Mood',
    description: 'Check in with yourself daily using our simple mood tracker. View weekly trends to gain self-awareness of your mental health patterns.'
  },
  {
    id: '02',
    number: '02',
    title: 'Chat with AI Support',
    description: 'Get instant emotional support, stress relief, and study advice from our AI chatbot powered by Gemini API with safe response moderation.'
  },
  {
    id: '03',
    number: '03',
    title: 'Connect with Peers',
    description: 'Share experiences and support others anonymously in our moderated peer support forum designed specifically for Bangladeshi students.'
  },
  {
    id: '04',
    number: '04',
    title: 'Access Local Resources',
    description: 'Find local helplines, university counselors, and mental health resources available in Bangladesh when you need professional help.'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.8
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const
    }
  }
};

function HowItWorks() {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-purple-50 to-transparent">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It <span className="text-[#5e2bf5]">Works</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Anonymous, affordable, and culturally sensitive mental health support for Bangladeshi students aged 16-25
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Brain Circuit Visual */}
          <div>
            <img
              src="/howirworks.png"
              alt="Brain Circuit"
              className="mx-auto w-full max-w-xl rounded-2xl shadow-lg"
            />
          </div>

          {/* Steps */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-8 bg-violet-100 p-6 rounded-2xl lg:p-12"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-start space-x-3 bg-white/60 p-4 rounded-xl transition-shadow duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-violet-300 to-gray-200 rounded-xl flex items-center justify-center text-gray-800 font-extralight text-3xl">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;