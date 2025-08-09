import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  UserGroupIcon,
  MapPinIcon,
  TrophyIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';
import toast from 'react-hot-toast';

const TeamDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState('');

  const { data: team, isLoading } = useQuery({
    queryKey: ['team', id],
    queryFn: () => axios.get(`/teams/${id}`).then(res => res.data)
  });

  const { data: userCharacters } = useQuery({
    queryKey: ['user-characters'],
    queryFn: () => axios.get('/users/characters').then(res => res.data),
    enabled: !!user
  });

  const applyMutation = useMutation({
    mutationFn: (applicationData) => axios.post(`/teams/${id}/apply`, applicationData),
    onSuccess: () => {
      queryClient.invalidateQueries(['team', id]);
      setShowApplicationModal(false);
      setApplicationMessage('');
      setSelectedCharacter('');
      toast.success('Application submitted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to submit application');
    }
  });

  const manageApplicationMutation = useMutation({
    mutationFn: ({ applicationId, action }) => 
      axios.patch(`/teams/${id}/applications/${applicationId}`, { action }),
    onSuccess: () => {
      queryClient.invalidateQueries(['team', id]);
      toast.success('Application updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update application');
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Team not found</h2>
          <Link to="/teams" className="btn-primary">
            Back to Teams
          </Link>
        </div>
      </div>
    );
  }

  const isLeader = user?.id === team.leader_id;
  const isMember = team.team_members?.some(member => member.user_id === user?.id);
  const hasApplied = team.team_applications?.some(app => app.user_id === user?.id && app.status === 'pending');
  
  const handleApply = () => {
    if (!selectedCharacter) {
      toast.error('Please select a character');
      return;
    }
    
    applyMutation.mutate({
      character_id: parseInt(selectedCharacter),
      message: applicationMessage
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'tank': return 'text-tank-500 bg-tank-500/20';
      case 'healer': return 'text-healer-500 bg-healer-500/20';
      case 'dps': return 'text-dps-500 bg-dps-500/20';
      default: return 'text-gray-500 bg-gray-500/20';
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
        {/* Back Button */}
        <Link 
          to="/teams" 
          className="inline-flex items-center text-gray-400 hover:text-gold-400 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Teams
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Team Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-premium p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-wow font-bold text-white mb-2">
                    {team.name}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="flex items-center">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      {team.region.toUpperCase()}
                    </span>
                    <span className="flex items-center">
                      <TrophyIcon className="w-4 h-4 mr-1" />
                      +{team.target_key_level} Keys
                    </span>
                    <span className="flex items-center">
                      <UserGroupIcon className="w-4 h-4 mr-1" />
                      {team.team_members?.length || 0}/{team.max_members} Members
                    </span>
                  </div>
                </div>
                {team.is_recruiting && (
                  <span className="px-3 py-1 bg-gold-gradient text-obsidian-950 text-sm font-medium rounded-full shadow-gold">
                    Recruiting
                  </span>
                )}
              </div>

              {team.description && (
                <p className="text-gray-300 leading-relaxed">
                  {team.description}
                </p>
              )}
            </motion.div>

            {/* Team Members */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card-premium p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Team Members</h2>
              <div className="space-y-4">
                {team.team_members?.map((member) => (
                  <div key={member.id} className="flex items-center space-x-4 p-4 rounded-lg bg-obsidian-800/50 border border-gold-500/20 hover:border-gold-500/40 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-obsidian-700 flex items-center justify-center overflow-hidden border-2 border-gold-500/30">
                      {member.users?.avatar_url ? (
                        <img
                          src={member.users.avatar_url}
                          alt={member.users.discord_username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserGroupIcon className="w-6 h-6 text-gold-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-white">
                          {member.users?.discord_username}
                        </h3>
                        {member.role === 'leader' && (
                          <span className="bg-gold-gradient text-obsidian-950 px-2 py-1 rounded text-xs font-medium">
                            Leader
                          </span>
                        )}
                      </div>
                      {member.characters && (
                        <p className="text-sm text-gray-400">
                          {member.characters.name} - {member.characters.spec} {member.characters.class}
                        </p>
                      )}
                    </div>
                    {member.characters?.role && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        member.characters.role === 'tank' ? 'text-gold-400 bg-gold-500/20 border border-gold-500/30' :
                        member.characters.role === 'healer' ? 'text-white bg-white/20 border border-white/30' :
                        member.characters.role === 'dps' ? 'text-red-400 bg-red-500/20 border border-red-500/30' :
                        'text-gray-400 bg-gray-500/20 border border-gray-500/30'
                      }`}>
                        {member.characters.role.toUpperCase()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Applications (for leaders) */}
            {isLeader && team.team_applications?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card-premium p-6"
              >
                <h2 className="text-xl font-semibold text-white mb-4">Pending Applications</h2>
                <div className="space-y-4">
                  {team.team_applications.filter(app => app.status === 'pending').map((application) => (
                    <div key={application.id} className="p-4 rounded-lg bg-obsidian-800/50 border border-gold-500/20">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-white">
                              {application.users?.discord_username}
                            </h3>
                            {application.characters && (
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                application.characters.role === 'tank' ? 'text-gold-400 bg-gold-500/20 border border-gold-500/30' :
                                application.characters.role === 'healer' ? 'text-white bg-white/20 border border-white/30' :
                                application.characters.role === 'dps' ? 'text-red-400 bg-red-500/20 border border-red-500/30' :
                                'text-gray-400 bg-gray-500/20 border border-gray-500/30'
                              }`}>
                                {application.characters.role.toUpperCase()}
                              </span>
                            )}
                          </div>
                          {application.characters && (
                            <p className="text-sm text-gray-400 mb-2">
                              {application.characters.name} - {application.characters.spec} {application.characters.class}
                              {application.characters.mythic_plus_score && (
                                <span className="ml-2">• Score: {application.characters.mythic_plus_score}</span>
                              )}
                            </p>
                          )}
                          {application.message && (
                            <p className="text-sm text-gray-300">"{application.message}"</p>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => manageApplicationMutation.mutate({ 
                              applicationId: application.id, 
                              action: 'accepted' 
                            })}
                            className="btn-primary p-2"
                            disabled={manageApplicationMutation.isLoading}
                          >
                            <CheckIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => manageApplicationMutation.mutate({ 
                              applicationId: application.id, 
                              action: 'rejected' 
                            })}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                            disabled={manageApplicationMutation.isLoading}
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Section */}
            {!isMember && !isLeader && team.is_recruiting && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card-premium p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Join This Team</h3>
                {hasApplied ? (
                  <div className="text-center py-4">
                    <p className="text-gold-400 mb-2">Application Pending</p>
                    <p className="text-sm text-gray-400">Your application is being reviewed</p>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowApplicationModal(true)}
                    className="btn-primary w-full"
                  >
                    Apply to Team
                  </button>
                )}
              </motion.div>
            )}

            {/* Team Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card-premium p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Team Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Target Level:</span>
                  <span className="text-white">+{team.target_key_level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Region:</span>
                  <span className="text-white">{team.region.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Max Members:</span>
                  <span className="text-white">{team.max_members}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={team.is_recruiting ? 'text-gold-400' : 'text-red-400'}>
                    {team.is_recruiting ? 'Recruiting' : 'Closed'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Needed Roles */}
            {team.needed_roles && team.needed_roles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card-premium p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Looking For</h3>
                <div className="flex flex-wrap gap-2">
                  {team.needed_roles.map((role) => (
                    <span
                      key={role}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        role === 'tank' ? 'text-gold-400 bg-gold-500/20 border border-gold-500/30' :
                        role === 'healer' ? 'text-white bg-white/20 border border-white/30' :
                        role === 'dps' ? 'text-red-400 bg-red-500/20 border border-red-500/30' :
                        'text-gray-400 bg-gray-500/20 border border-gray-500/30'
                      }`}
                    >
                      {role.toUpperCase()}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Requirements */}
            {team.team_requirements && team.team_requirements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="card-premium p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Requirements</h3>
                <div className="space-y-2 text-sm">
                  {team.team_requirements[0].min_score && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Min M+ Score:</span>
                      <span className="text-white">{team.team_requirements[0].min_score}</span>
                    </div>
                  )}
                  {team.team_requirements[0].min_item_level && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Min Item Level:</span>
                      <span className="text-white">{team.team_requirements[0].min_item_level}</span>
                    </div>
                  )}
                  {team.team_requirements[0].experience_level && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Experience:</span>
                      <span className="text-white capitalize">{team.team_requirements[0].experience_level}</span>
                    </div>
                  )}
                  {team.team_requirements[0].voice_required && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Voice Chat:</span>
                      <span className="text-gold-400">Required</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Application Modal */}
        {showApplicationModal && (
          <div className="fixed inset-0 bg-obsidian-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-premium p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Apply to {team.name}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Character
                  </label>
                  <select
                    value={selectedCharacter}
                    onChange={(e) => setSelectedCharacter(e.target.value)}
                    className="select w-full"
                  >
                    <option value="">Choose a character...</option>
                    {userCharacters?.map((character) => (
                      <option key={character.id} value={character.id}>
                        {character.name} - {character.spec} {character.class} ({character.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={applicationMessage}
                    onChange={(e) => setApplicationMessage(e.target.value)}
                    placeholder="Tell the team leader why you'd be a good fit..."
                    className="input w-full h-24 resize-none"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleApply}
                  disabled={applyMutation.isLoading || !selectedCharacter}
                  className="btn-primary flex-1"
                >
                  {applyMutation.isLoading ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamDetail; 