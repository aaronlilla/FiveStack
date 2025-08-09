import React from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  SparklesIcon,
  UserGroupIcon,
  TrophyIcon,
  ClockIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

const Matchmaking = () => {
  const features = [
    {
      icon: CpuChipIcon,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning analyzes your playstyle, performance patterns, and team synergy preferences.'
    },
    {
      icon: UserGroupIcon,
      title: 'Smart Team Building',
      description: 'Intelligent algorithms match complementary players for optimal team composition and chemistry.'
    },
    {
      icon: ClockIcon,
      title: 'Schedule Optimization',
      description: 'Perfect timezone and availability matching ensures consistent team play sessions.'
    },
    {
      icon: TrophyIcon,
      title: 'Performance Matching',
      description: 'Balanced skill ratings and progression goals create fair and competitive matches.'
    }
  ];

  return (
    <div 
      className="min-h-screen py-8"
      style={{
        backgroundColor: '#0f0f12',
        backgroundImage: 'linear-gradient(rgba(15, 15, 18, 0.95), rgba(15, 15, 18, 0.95)), url("/background.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-wow font-bold text-white mb-6">
            AI <span className="text-premium">Matchmaking</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Revolutionary AI technology that finds your perfect Mythic+ teammates based on 
            playstyle compatibility, schedule alignment, and performance synergy.
          </p>
        </motion.div>

        {/* Coming Soon Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-premium p-12 text-center mb-16 relative overflow-hidden"
        >
          {/* Animated background elements */}
          <div className="absolute top-4 left-4 w-20 h-20 bg-gold-500/10 rounded-full blur-xl animate-float floating"></div>
          <div className="absolute bottom-4 right-4 w-16 h-16 bg-white/5 rounded-full blur-xl animate-float floating"></div>
          
          <div className="relative">
            <SparklesIcon className="w-20 h-20 text-gold-400 mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl font-wow font-bold text-white mb-4">
              Launching Soon
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Our AI matchmaking system is currently in development. Get ready for the most 
              sophisticated team-building experience in World of Warcraft.
            </p>
            
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gold-gradient text-obsidian-950 font-semibold rounded-lg shadow-gold">
              <CpuChipIcon className="w-5 h-5" />
              <span>AI Training in Progress</span>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-wow font-bold text-white text-center mb-12">
            What Makes Our <span className="text-premium">AI Special</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="card hover-glow group p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gold-gradient rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-obsidian-950" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-wow font-semibold text-white mb-2 group-hover:text-gold-400 transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Early Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="card-premium p-8 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-subtle-gradient opacity-50"></div>
          <div className="absolute top-6 left-6 w-24 h-24 bg-gold-500/10 rounded-full blur-xl animate-float floating"></div>
          <div className="absolute bottom-6 right-6 w-20 h-20 bg-white/5 rounded-full blur-xl animate-float floating"></div>
          
          <div className="relative">
            <h3 className="text-2xl font-wow font-bold text-white mb-4">
              Want Early Access?
            </h3>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              Be among the first to experience our revolutionary AI matchmaking when it launches. 
              Early testers will help shape the future of Mythic+ team building.
            </p>
            <button className="btn-secondary inline-flex items-center space-x-2">
              <SparklesIcon className="w-5 h-5" />
              <span>Join Beta Waitlist</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Matchmaking; 