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
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="w-full scroll-mt-24 py-24 bg-gradient-to-b from-purple-50/70 to-transparent">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-20"
        >
          <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-5">
            How It <span className="text-[#5e2bf5]">Works</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Anonymous, affordable, and culturally sensitive mental health support for Bangladeshi students aged 16–25.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Illustration */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-violet-200/60 via-fuchsia-100/40 to-indigo-100/30 blur-2xl -z-10" aria-hidden="true" />
            <Image
              src="/howirworks.png"
              alt="Abstract illustration representing AI support, peer connection, and resources"
              width={900}
              height={700}
              priority
              className="mx-auto w-full max-w-xl rounded-3xl shadow-xl ring-1 ring-black/5"
            />
          </div>

          {/* Steps */}
          <motion.ol
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-6 bg-white/70 backdrop-blur-sm p-6 rounded-3xl lg:p-10 shadow-sm ring-1 ring-black/5"
          >
            {steps.map((step) => (
              <motion.li
                key={step.id}
                variants={itemVariants}
                className="group flex items-start gap-4 rounded-2xl border border-transparent bg-gradient-to-r from-violet-50/60 via-white to-white p-5 transition-shadow hover:shadow-md hover:border-violet-200"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-indigo-500 text-white rounded-2xl flex items-center justify-center text-2xl font-semibold shadow-md ring-1 ring-black/10">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {step.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;