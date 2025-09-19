"use client"
import {
  Brain,
  Heart,
  Shield,
  Users,
  MessageCircle,
  Calendar,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Define the feature item type
type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  position?: 'left' | 'right';
  cornerStyle?: string;
};

// Create feature data arrays for left and right columns
const leftFeatures: FeatureItem[] = [
  {
    icon: Brain,
    title: 'AI-Powered Support',
    description:
      'Get intelligent mental health guidance with our advanced AI companion that understands your needs.',
    position: 'left',
    cornerStyle: 'sm:translate-x-4 sm:rounded-br-[2px]',
  },
  {
    icon: Heart,
    title: 'Personalized Care',
    description:
      'Receive tailored wellness plans and coping strategies designed specifically for your journey.',
    position: 'left',
    cornerStyle: 'sm:-translate-x-4 sm:rounded-br-[2px]',
  },
  {
    icon: Calendar,
    title: 'Progress Tracking',
    description:
      'Monitor your mental wellness journey with daily check-ins, mood tracking, and milestone celebrations.',
    position: 'left',
    cornerStyle: 'sm:translate-x-4 sm:rounded-tr-[2px]',
  },
];

const rightFeatures: FeatureItem[] = [
  {
    icon: Users,
    title: 'Community Support',
    description:
      'Connect with others on similar journeys in a safe, supportive environment.',
    position: 'right',
    cornerStyle: 'sm:-translate-x-4 sm:rounded-bl-[2px]',
  },
  {
    icon: MessageCircle,
    title: 'Professional Guidance',
    description:
      'Access licensed therapists and mental health professionals when you need expert support.',
    position: 'right',
    cornerStyle: 'sm:translate-x-4 sm:rounded-bl-[2px]',
  },
  {
    icon: Shield,
    title: 'Privacy & Security',
    description:
      'Your mental health data is always protected with end-to-end encryption and strict privacy controls.',
    position: 'right',
    cornerStyle: 'sm:-translate-x-4 sm:rounded-tl-[2px]',
  },
];

// Feature card component
const FeatureCard = ({ feature, index }: { feature: FeatureItem; index: number }) => {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        className={cn(
          'relative rounded-2xl px-4 pt-4 pb-4 text-sm',
          'bg-violet-100 ring-border ring',
          feature.cornerStyle,
        )}
        whileHover={{ 
          backgroundColor: 'rgba(147, 51, 234, 0.1)',
          boxShadow: '0 10px 30px rgba(147, 51, 234, 0.1)' 
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="text-primary mb-3 text-[2rem]"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          <Icon />
        </motion.div>
        <h2 className="text-foreground mb-2.5 text-2xl">{feature.title}</h2>
        <p className="text-muted-foreground text-base text-pretty">
          {feature.description}
        </p>
        {/* Decorative elements with motion */}
        <motion.span 
          className="from-primary/0 via-primary to-primary/0 absolute -bottom-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r opacity-60"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <span className="absolute inset-0 bg-[radial-gradient(30%_5%_at_50%_100%,hsl(var(--primary)/0.15)_0%,transparent_100%)] opacity-60 transition-opacity duration-500 hover:opacity-80"></span>
      </motion.div>
    </motion.div>
  );
};

export default function Feature3() {
  return (
    <motion.section 
      className="pt-20 pb-8 " 
      id="features"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="mx-6 max-w-[1120px] pt-2 pb-16 max-[300px]:mx-4 min-[1150px]:mx-auto">
        <motion.div 
          className="flex flex-col-reverse gap-6 md:grid md:grid-cols-3"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Left column */}
          <div className="flex flex-col gap-6">
            {leftFeatures.map((feature, index) => (
              <FeatureCard key={`left-feature-${index}`} feature={feature} index={index} />
            ))}
          </div>

          {/* Center column */}
          <motion.div 
            className="order-[1] mb-6 self-center sm:order-[0] md:mb-0"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div 
              className="bg-violet-100 text-foreground ring-border relative mx-auto mb-4.5 w-fit rounded-full rounded-bl-[2px] px-4 py-2 text-sm ring"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <span className="relative z-1 flex items-center gap-2 text-2xl text-gray-800">
                Features
              </span>
              <motion.span 
                className="from-primary/0 via-primary to-primary/0 absolute -bottom-px left-1/2 h-px w-2/5 -translate-x-1/2 bg-gradient-to-r"
                animate={{ 
                  backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              <span className="absolute inset-0 bg-[radial-gradient(30%_40%_at_50%_100%,hsl(var(--primary)/0.25)_0%,transparent_100%)] transition-opacity duration-500 hover:opacity-80"></span>
            </motion.div>
            <motion.h2 
              className="text-gray-700 mb-2 text-center font-bold text-3xl sm:mb-2.5 md:text-[2rem]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Comprehensive Mental Wellness
            </motion.h2>
            <motion.p 
              className="text-muted-foreground mx-auto max-w-[18rem] text-center text-pretty"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              Everything you need to support your mental health journey, from AI assistance to community support
            </motion.p>
          </motion.div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {rightFeatures.map((feature, index) => (
              <FeatureCard key={`right-feature-${index}`} feature={feature} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
