import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon, 
  TrophyIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();

  // Fetch user profile with teams and characters
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => axios.get('/users/profile').then(res => res.data),
    enabled: !!user
  });

  const mainCharacter = profile?.characters?.find(c => c.is_main) || profile?.characters?.[0];

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
        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-wow font-bold text-white mb-2">
            Welcome back, <span className="text-premium">{user?.discord_username}</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Ready to conquer some keys today?
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="card-premium p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Quick Stats</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Teams Joined</span>
                    <span className="text-2xl font-bold text-gold-400">
                      {profile?.teams?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Characters</span>
                    <span className="text-2xl font-bold text-white">
                      {profile?.characters?.length || 0}
                    </span>
                  </div>
                  {mainCharacter?.mythic_plus_score && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">M+ Score</span>
                      <span className="text-2xl font-bold text-red-400">
                        {mainCharacter.mythic_plus_score}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Main Character Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="card-premium p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Main Character</h2>
                {mainCharacter ? (
                  <div className="flex items-center space-x-6">
                    {mainCharacter.thumbnail_url && (
                      <img
                        src={mainCharacter.thumbnail_url}
                        alt={mainCharacter.name}
                        className="w-20 h-20 rounded-xl border-2 border-gold-500/30"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-2xl font-wow font-semibold text-white mb-2">
                        {mainCharacter.name}
                      </h3>
                      <p className="text-gray-400 mb-3">
                        {mainCharacter.spec} {mainCharacter.class} • {mainCharacter.realm}
                      </p>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          mainCharacter.role === 'tank' ? 'bg-role-tank text-gold-400' :
                          mainCharacter.role === 'healer' ? 'bg-role-healer text-white' :
                          'bg-role-dps text-red-400'
                        }`}>
                          {mainCharacter.role.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-400">
                          Score: <span className="text-red-400 font-semibold">{mainCharacter.mythic_plus_score}</span>
                        </span>
                        <span className="text-sm text-gray-400">
                          iLvl: <span className="text-white font-semibold">{mainCharacter.item_level}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <UserIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No main character set</h3>
                    <p className="text-gray-400 mb-4">Add a character to get started</p>
                    <Link to="/characters/add" className="btn-primary">
                      Add Character
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>

            {/* My Teams */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3"
            >
              <div className="card-premium p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">My Teams</h2>
                  <Link to="/teams" className="btn-secondary text-sm">
                    Browse All Teams
                  </Link>
                </div>
                
                {profile?.teams && profile.teams.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profile.teams.slice(0, 6).map((team, index) => (
                      <motion.div
                        key={team.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="card hover-glow group"
                      >
                        <Link to={`/teams/${team.id}`} className="block p-4">
                          <h3 className="font-wow font-semibold text-white mb-2 group-hover:text-gold-400 transition-colors">
                            {team.name}
                          </h3>
                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <span>+{team.target_key_level}</span>
                            <span>{team.region.toUpperCase()}</span>
                          </div>
                          <div className="mt-2 flex items-center space-x-2">
                            <UserGroupIcon className="w-4 h-4 text-gold-400" />
                            <span className="text-sm text-gray-400">
                              {team.team_members?.length || 0}/{team.max_members} members
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <UserGroupIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No teams yet</h3>
                    <p className="text-gray-400 mb-6">Join a team or create your own to start pushing keys</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link to="/teams" className="btn-secondary">
                        Browse Teams
                      </Link>
                      <Link to="/teams/create" className="btn-primary">
                        Create Team
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-3"
            >
              <div className="card-premium p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {/* Placeholder for recent activity - you can implement this based on your data */}
                  <div className="text-center py-8">
                    <TrophyIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No recent activity</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 