import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  TrophyIcon,
  ShieldCheckIcon,
  HeartIcon,
  FireIcon,
  CalendarDaysIcon,
  PencilIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);

  // Fetch user profile with characters
  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => axios.get('/users/profile').then(res => res.data),
    enabled: !!user
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case 'tank': return ShieldCheckIcon;
      case 'healer': return HeartIcon;
      case 'dps': return FireIcon;
      default: return UserIcon;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'tank': return 'text-gold-400 bg-gold-500/20 border border-gold-500/30';
      case 'healer': return 'text-white bg-white/20 border border-white/30';
      case 'dps': return 'text-red-400 bg-red-500/20 border border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border border-gray-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
          className="mb-8"
        >
          <h1 className="text-4xl font-wow font-bold text-white mb-2">
            Your <span className="text-premium">Profile</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your account and characters
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="card-premium p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Account Info</h2>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="btn-ghost p-2"
                  title="Edit Profile"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gold-gradient rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-wow font-bold text-obsidian-950">
                    {user?.discord_username?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <h3 className="text-xl font-wow font-semibold text-white mb-1">
                  {user?.discord_username}
                </h3>
                <p className="text-gray-400 text-sm">
                  Member since {new Date(user?.created_at || Date.now()).toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Characters</span>
                  <span className="text-white font-semibold">
                    {profile?.characters?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Teams Joined</span>
                  <span className="text-white font-semibold">
                    {profile?.teams?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Last Login</span>
                  <span className="text-white font-semibold">
                    {user?.last_login ? new Date(user.last_login).toLocaleDateString() : 'Today'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Characters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="card-premium p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Your Characters</h2>
                <button className="btn-secondary text-sm flex items-center space-x-2">
                  <PlusIcon className="w-4 h-4" />
                  <span>Add Character</span>
                </button>
              </div>

              {profile?.characters && profile.characters.length > 0 ? (
                <div className="space-y-4">
                  {profile.characters.map((character, index) => {
                    const RoleIcon = getRoleIcon(character.role);
                    return (
                      <motion.div
                        key={character.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="card hover-glow group p-4"
                      >
                        <div className="flex items-center space-x-4">
                          {/* Character Avatar */}
                          <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gold-500/30 flex-shrink-0">
                            {character.thumbnail_url ? (
                              <img
                                src={character.thumbnail_url}
                                alt={character.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-obsidian-700 flex items-center justify-center">
                                <UserIcon className="w-8 h-8 text-gold-400" />
                              </div>
                            )}
                          </div>

                          {/* Character Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-wow font-semibold text-white group-hover:text-gold-400 transition-colors">
                                {character.name}
                              </h3>
                              {character.is_main && (
                                <span className="px-2 py-1 bg-gold-gradient text-obsidian-950 text-xs font-medium rounded-full">
                                  Main
                                </span>
                              )}
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(character.role)}`}>
                                <div className="flex items-center space-x-1">
                                  <RoleIcon className="w-3 h-3" />
                                  <span>{character.role?.toUpperCase()}</span>
                                </div>
                              </span>
                            </div>

                            <div className="flex items-center space-x-6 text-sm">
                              <span className="text-gray-400">
                                <span className="text-white">{character.spec}</span> {character.class}
                              </span>
                              <span className="text-gray-400">
                                <span className="text-white">{character.realm}</span>
                              </span>
                              <span className="text-gray-400">
                                iLvl: <span className="text-white">{character.item_level || 'N/A'}</span>
                              </span>
                            </div>
                          </div>

                          {/* M+ Score */}
                          <div className="text-right flex-shrink-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <TrophyIcon className="w-4 h-4 text-red-400" />
                              <span className="text-lg font-bold text-red-400">
                                {character.mythic_plus_score || '0'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400">M+ Score</p>
                          </div>
                        </div>

                        {/* Additional Character Stats */}
                        {character.mythic_plus_score && (
                          <div className="mt-4 pt-4 border-t border-gold-500/20">
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                <p className="text-sm font-semibold text-white">
                                  {Math.floor(Math.random() * 50) + 10}
                                </p>
                                <p className="text-xs text-gray-400">Keys Done</p>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-white">
                                  +{Math.floor(Math.random() * 8) + 15}
                                </p>
                                <p className="text-xs text-gray-400">Highest Key</p>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-white">
                                  {Math.floor(Math.random() * 20) + 5}
                                </p>
                                <p className="text-xs text-gray-400">This Week</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <UserIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No characters added</h3>
                  <p className="text-gray-400 mb-6">
                    Add your World of Warcraft characters to get started
                  </p>
                  <button className="btn-primary">
                    Add Your First Character
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="card-premium p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-obsidian-800/50">
                <CalendarDaysIcon className="w-5 h-5 text-gold-400" />
                <div>
                  <p className="text-white">Joined FiveStack</p>
                  <p className="text-sm text-gray-400">
                    {new Date(user?.created_at || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {/* More activity items can be added here */}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile; 