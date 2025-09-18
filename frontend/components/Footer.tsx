import {
  Heart,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Shield,
  Brain,
  Users,
  MessageCircle,
  Calendar,
  HelpCircle,
} from 'lucide-react';
import Image from 'next/image';

const data = {
  facebookLink: 'https://facebook.com/mindmate',
  instaLink: 'https://instagram.com/mindmate',
  twitterLink: 'https://twitter.com/mindmate',
  features: {
    ai: '/ai-support',
    therapy: '/therapy',
    community: '/community',
    tracking: '/progress-tracking',
  },
  resources: {
    blog: '/blog',
    guides: '/mental-health-guides',
    webinars: '/webinars',
    research: '/research',
  },
  support: {
    help: '/help-center',
    crisis: '/crisis-support',
    contact: '/contact-support',
    faq: '/faq',
  },
  contact: {
    email: 'support@mindmate.com',
    phone: '+1 (555) 123-4567',
    address: 'Mental Health District, Wellness City',
  },
  company: {
    name: 'MindMate',
    description:
      'Your trusted companion for mental wellness. We provide AI-powered support, professional guidance, and a caring community to help you on your mental health journey.',
    logo: '/mindmate.png',
  },
};

const socialLinks = [
  { icon: Facebook, label: 'Facebook' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Twitter, label: 'Twitter' },
];

const featureLinks = [
  { text: 'AI-Powered Support', icon: Brain },
  { text: 'Therapy Sessions', icon: Heart },
  { text: 'Community Support', icon: Users },
  { text: 'Progress Tracking', icon: Calendar },
];

const resourceLinks = [
  { text: 'Mental Health Blog' },
  { text: 'Wellness Guides' },
  { text: 'Live Webinars' },
  { text: 'Research & Studies' },
];

const supportLinks = [
  { text: 'Help Center' },
  { text: 'Crisis Support', hasIndicator: true },
  { text: 'Contact Support' },
  { text: 'FAQs' },
];

const contactInfo = [
  { icon: Mail, text: data.contact.email },
  { icon: Phone, text: data.contact.phone },
  { icon: MapPin, text: data.contact.address, isAddress: true },
];

export default function Footer4Col() {
  return (
    <footer className="bg-[#25262b] mt-16 w-full place-self-end border-t border-gray-100">
      <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="text-primary flex justify-center sm:justify-start items-center">
              <Image
                src={data.company.logo || '/mindmate.png'}
                alt="MindMate Logo"
                width={62}
                height={32}
                className="rounded-full"
              />
              <span className="text-3xl font-semibold text-violet-500">
                {data.company.name}
              </span>
            </div>

            <p className="text-gray-400 mt-6 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left">
              {data.company.description}
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              {socialLinks.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <div className="text-gray-400 hover:text-gray-400 transition-colors duration-200 cursor-pointer">
                    <span className="sr-only">{label}</span>
                    <Icon className="size-6" />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-gray-200">Features</p>
              <ul className="mt-8 space-y-4 text-sm">
                {featureLinks.map(({ text, icon: Icon }) => (
                  <li key={text}>
                    <div className="text-gray-400 hover:text-gray-300 transition-colors duration-200 flex items-center gap-2 justify-center sm:justify-start cursor-pointer">
                      <Icon className="size-4" />
                      {text}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-gray-200">Support</p>
              <ul className="mt-8 space-y-4 text-sm">
                {supportLinks.map(({ text, hasIndicator }) => (
                  <li key={text}>
                    <div
                      className={`${
                        hasIndicator
                          ? 'group flex justify-center gap-1.5 sm:justify-start cursor-pointer'
                          : 'text-gray-400 hover:text-gray-300 transition-colors duration-200 cursor-pointer'
                      }`}
                    >
                      <span className="text-gray-400 hover:text-gray-300 transition-colors duration-200">
                        {text}
                      </span>
                      {hasIndicator && (
                        <span className="relative flex size-2">
                          <span className="bg-red-500 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                          <span className="bg-red-500 relative inline-flex size-2 rounded-full" />
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm text-gray-200">
              <span className="block sm:inline">Your mental health journey matters. All rights reserved.</span>
            </p>

            <p className="text-gray-200 mt-4 text-sm transition sm:order-first sm:mt-0">
              &copy; 2025 {data.company.name} - Supporting mental wellness together
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
