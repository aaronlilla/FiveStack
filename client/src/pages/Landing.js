import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon, 
  TrophyIcon, 
  ClockIcon,
  StarIcon,
  CheckBadgeIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: UserGroupIcon,
      title: 'AI-Powered Team Matching',
      description: 'Advanced algorithms analyze your playstyle, schedule, and preferences to find the perfect teammates for consistent Mythic+ progression.',
      gradient: 'from-gold-400 to-gold-600'
    },
    {
      icon: TrophyIcon,
      title: 'Raider.io Integration',
      description: 'Seamless character sync with real-time Mythic+ scores, recent runs, and detailed performance analytics for informed team decisions.',
      gradient: 'from-white to-gray-200'
    },
    {
      icon: ClockIcon,
      title: 'Schedule Coordination',
      description: 'Smart timezone handling and availability matching ensures your team can consistently play together when it matters most.',
      gradient: 'from-red-400 to-red-600'
    },
    {
      icon: StarIcon,
      title: 'Premium Experience',
      description: 'Elegant, responsive design with smooth animations and intuitive navigation designed for serious players.',
      gradient: 'from-gold-400 via-white to-gold-400'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative bg-obsidian-950 overflow-hidden hero-background"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(15, 15, 18, 0.95) 0%, rgba(24, 24, 27, 0.95) 30%, rgba(251, 191, 36, 0.02) 100%),
            url('/mythic1.jpg')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gold-500/20 rounded-full blur-xl animate-float floating"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-float floating"></div>
          <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gold-400/10 rounded-full blur-xl animate-float floating"></div>
          <div className="absolute top-32 right-20 w-24 h-24 bg-gold-600/15 rounded-full blur-xl animate-float floating"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center h-96 flex flex-col justify-between items-center py-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex-1 flex items-center justify-center min-h-0"
            >
              <img 
                src="/logo.png" 
                alt="FiveStack Logo" 
                className="h-48 md:h-64 lg:h-80 xl:h-[650px] object-contain"
                style={{
                  filter: 'drop-shadow(0 0 40px rgba(251, 191, 36, 0.7))'
                }}
              />
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed flex-shrink-0 px-4"
            >
              Build <span className="text-gold-400 font-semibold">consistent teams</span>, climb the ranks, and conquer the highest keys with 
              <span className="text-white font-semibold"> AI-powered matchmaking</span> and 
              <span className="text-gold-400 font-semibold"> Raider.io integration</span>.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center flex-shrink-0 mt-8"
            >
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary text-base px-8 py-3 inline-flex items-center space-x-2">
                  <RocketLaunchIcon className="w-5 h-5" />
                  <span>Go to Dashboard</span>
                </Link>
              ) : (
                <Link to="/login" className="btn-primary text-base px-8 py-3 inline-flex items-center space-x-2">
                  <CheckBadgeIcon className="w-5 h-5" />
                  <span>Get Started Free</span>
                </Link>
              )}
              <a 
                href="#features" 
                className="btn-secondary text-base px-8 py-3 inline-flex items-center space-x-2"
              >
                <StarIcon className="w-5 h-5" />
                <span>Discover Features</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-obsidian-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-wow font-bold text-white mb-6">
              Premium <span className="text-premium">Features</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to build the perfect Mythic+ team and dominate the leaderboards
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="card-premium p-8 hover-glow group"
                >
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-obsidian-950" />
                  </div>
                  <h3 className="text-2xl font-wow font-semibold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-obsidian-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-reverse-gradient opacity-50"></div>
        <div className="absolute top-10 left-10 w-40 h-40 bg-gold-500/10 rounded-full blur-xl animate-float floating"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-float floating"></div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-wow font-bold text-white mb-8">
              Ready to <span className="text-premium">Dominate</span> Mythic+?
            </h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Join thousands of players who've found their perfect teams and achieved their highest keys ever.
            </p>
            {!isAuthenticated && (
              <Link to="/login" className="btn-primary text-xl px-12 py-5 inline-flex items-center space-x-3">
                <CheckBadgeIcon className="w-7 h-7" />
                <span>Start Your Journey</span>
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing; 