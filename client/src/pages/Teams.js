import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';

const Teams = () => {
  const [filters, setFilters] = useState({
    role: '',
    keyLevel: '',
    region: '',
    recruiting: 'true'
  });
  const [search, setSearch] = useState('');

  const { data: teams, isLoading } = useQuery({
    queryKey: ['teams', filters],
    queryFn: () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      return axios.get(`/teams?${params.toString()}`).then(res => res.data);
    }
  });

  const filteredTeams = teams?.filter(team => 
    team.name.toLowerCase().includes(search.toLowerCase()) ||
    team.description?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'tank': return 'text-gold-400 bg-gold-500/20 border border-gold-500/30';
      case 'healer': return 'text-white bg-white/20 border border-white/30';
      case 'dps': return 'text-red-400 bg-red-500/20 border border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border border-gray-500/30';
    }
  };

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
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-wow font-bold text-white mb-4"
          >
            Discover <span className="text-premium">Teams</span>
          </motion.h1>
          <p className="text-gray-400 text-lg">
            Find the perfect Mythic+ team that matches your schedule and goals
          </p>
        </div>

        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search teams..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <select
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                className="select min-w-[140px]"
              >
                <option value="">All Roles</option>
                <option value="tank">Tank</option>
                <option value="healer">Healer</option>
                <option value="dps">DPS</option>
              </select>

              <select
                value={filters.keyLevel}
                onChange={(e) => handleFilterChange('keyLevel', e.target.value)}
                className="select min-w-[140px]"
              >
                <option value="">All Key Levels</option>
                <option value="10">+10-15</option>
                <option value="15">+15-20</option>
                <option value="20">+20+</option>
              </select>

              <select
                value={filters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
                className="select min-w-[140px]"
              >
                <option value="">All Regions</option>
                <option value="us">US</option>
                <option value="eu">EU</option>
                <option value="kr">KR</option>
                <option value="tw">TW</option>
              </select>
            </div>

            <Link to="/teams/create" className="btn-primary flex items-center space-x-2">
              <PlusIcon className="w-5 h-5" />
              <span>Create Team</span>
            </Link>
          </div>
        </motion.div>

        {/* Teams Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover-glow group"
              >
                <Link to={`/teams/${team.id}`} className="block p-6">
                  {/* Team Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-wow font-semibold text-white mb-2 group-hover:text-gold-400 transition-colors">
                        {team.name}
                      </h3>
                      {team.description && (
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {team.description}
                        </p>
                      )}
                    </div>
                    {team.is_recruiting && (
                      <span className="px-3 py-1 bg-gold-gradient text-obsidian-950 text-xs font-medium rounded-full shadow-gold">
                        Recruiting
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {/* Team Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Target Keys:</span>
                      <span className="text-white font-medium">+{team.target_key_level}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Region:</span>
                      <span className="text-white font-medium">{team.region.toUpperCase()}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Members:</span>
                      <span className="text-white font-medium">
                        {team.team_members?.length || 0}/{team.max_members}
                      </span>
                    </div>

                    {/* Needed Roles */}
                    {team.needed_roles && team.needed_roles.length > 0 && (
                      <div>
                        <p className="text-gray-500 text-sm mb-2">Looking for:</p>
                        <div className="flex flex-wrap gap-1">
                          {team.needed_roles.map((role) => (
                            <span
                              key={role}
                              className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(role)}`}
                            >
                              {role.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Team Members Preview */}
                    {team.team_members && team.team_members.length > 0 && (
                      <div>
                        <p className="text-gray-500 text-sm mb-2">Team:</p>
                        <div className="flex items-center space-x-2">
                          <UserGroupIcon className="w-4 h-4 text-gold-400" />
                          <div className="flex -space-x-2">
                            {team.team_members.slice(0, 3).map((member, idx) => (
                              <div
                                key={idx}
                                className="w-8 h-8 bg-gold-gradient rounded-full border-2 border-obsidian-800 flex items-center justify-center"
                              >
                                <span className="text-xs font-medium text-obsidian-950">
                                  {member.user?.discord_username?.[0] || 'U'}
                                </span>
                              </div>
                            ))}
                            {team.team_members.length > 3 && (
                              <div className="w-8 h-8 bg-obsidian-700 rounded-full border-2 border-obsidian-800 flex items-center justify-center">
                                <span className="text-xs text-gray-400">
                                  +{team.team_members.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredTeams.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <UserGroupIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No teams found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your filters or create a new team
            </p>
            <Link to="/teams/create" className="btn-primary">
              Create Your Team
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Teams; 