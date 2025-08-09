import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrophyIcon,
  FireIcon,
  UserGroupIcon,
  StarIcon,
  ChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Leaderboard = () => {
  const leaderboardTypes = [
    {
      icon: TrophyIcon,
      title: 'Top Teams',
      description: 'Highest performing Mythic+ teams based on key completion rates and progression.',
      gradient: 'from-gold-400 to-gold-600'
    },
    {
      icon: FireIcon,
      title: 'Most Active',
      description: 'Teams with the highest activity levels and consistent play sessions.',
      gradient: 'from-red-400 to-red-600'
    },
    {
      icon: UserGroupIcon,
      title: 'Best Recruiters',
      description: 'Teams that successfully build strong, long-lasting member relationships.',
      gradient: 'from-white to-gray-200'
    },
    {
      icon: StarIcon,
      title: 'Rising Stars',
      description: 'Newest teams showing exceptional growth and potential.',
      gradient: 'from-gold-400 via-white to-gold-400'
    }
  ];

  const mockTeams = [
    { rank: 1, name: 'Mythic Legends', score: '2847', members: 5, keys: '247' },
    { rank: 2, name: 'Key Crushers', score: '2791', members: 5, keys: '234' },
    { rank: 3, name: 'Elite Runners', score: '2653', members: 4, keys: '198' },
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
            <span className="text-premium">Leaderboards</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Compete with the best teams, track your progress, and climb the ranks in various 
            categories from key completion to team activity.
          </p>
        </motion.div>

        {/* Preview Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-premium p-8 mb-16 relative overflow-hidden"
        >
          <div className="absolute top-4 right-4 w-20 h-20 bg-gold-500/10 rounded-full blur-xl animate-float floating"></div>
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-wow font-bold text-white mb-2">
                Top Teams Preview
              </h2>
              <p className="text-gray-400">Based on overall Mythic+ performance</p>
            </div>
            <SparklesIcon className="w-12 h-12 text-gold-400 animate-pulse" />
          </div>

          <div className="space-y-4 mb-8">
            {mockTeams.map((team, index) => (
              <motion.div
                key={team.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  team.rank === 1 ? 'bg-gold-gradient text-obsidian-950' :
                  team.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-obsidian-950' :
                  team.rank === 3 ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white' :
                  'bg-obsidian-800 text-white'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    team.rank === 1 ? 'bg-obsidian-950 text-gold-400' :
                    team.rank === 2 ? 'bg-obsidian-950 text-gray-300' :
                    team.rank === 3 ? 'bg-obsidian-950 text-amber-600' :
                    'bg-gold-500 text-obsidian-950'
                  }`}>
                    {team.rank}
                  </div>
                  <div>
                    <h3 className="font-wow font-semibold">{team.name}</h3>
                    <p className={`text-sm ${team.rank <= 3 ? 'opacity-80' : 'text-gray-400'}`}>
                      {team.members} members • {team.keys} keys completed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{team.score}</div>
                  <div className={`text-sm ${team.rank <= 3 ? 'opacity-80' : 'text-gray-400'}`}>Score</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-obsidian-800 text-gold-400 font-semibold rounded-lg border border-gold-500/30">
              <ChartBarIcon className="w-5 h-5" />
              <span>Full Rankings Coming Soon</span>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-wow font-bold text-white text-center mb-12">
            Compete in <span className="text-premium">Multiple Categories</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {leaderboardTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 + index * 0.1 }}
                  className="card hover-glow group p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 bg-gradient-to-r ${type.gradient} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-obsidian-950" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-wow font-semibold text-white mb-2 group-hover:text-gold-400 transition-colors">
                        {type.title}
                      </h4>
                      <p className="text-gray-400 leading-relaxed">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Competitive Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="card-premium p-8 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-subtle-gradient opacity-50"></div>
          <div className="absolute top-6 left-6 w-24 h-24 bg-gold-500/10 rounded-full blur-xl animate-float floating"></div>
          <div className="absolute bottom-6 right-6 w-20 h-20 bg-white/5 rounded-full blur-xl animate-float floating"></div>
          
          <div className="relative">
            <h3 className="text-2xl font-wow font-bold text-white mb-4">
              Ready to Compete?
            </h3>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              Track your team's performance, earn achievements, and compete for the top spots 
              in our comprehensive ranking system.
            </p>
            <button className="btn-secondary inline-flex items-center space-x-2">
              <TrophyIcon className="w-5 h-5" />
              <span>View Full Rankings</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard; 