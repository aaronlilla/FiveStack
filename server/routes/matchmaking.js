const express = require('express');
const { supabase, isDemoMode } = require('../config/supabase');
const router = express.Router();

const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Calculate compatibility score between player and team
const calculateCompatibilityScore = (player, team, character) => {
  let score = 0;
  let factors = [];

  // Role compatibility (30% weight)
  if (team.needed_roles && team.needed_roles.includes(character.role)) {
    score += 30;
    factors.push({ factor: 'Role Match', points: 30, details: `Team needs ${character.role}` });
  }

  // Mythic+ score compatibility (25% weight)
  if (character.mythic_plus_score && team.team_requirements?.[0]) {
    const req = team.team_requirements[0];
    if (req.min_score) {
      if (character.mythic_plus_score >= req.min_score) {
        const scoreRatio = Math.min(character.mythic_plus_score / req.min_score, 2);
        const points = Math.round(25 * scoreRatio);
        score += points;
        factors.push({ 
          factor: 'Score Compatibility', 
          points, 
          details: `Score: ${character.mythic_plus_score} (req: ${req.min_score})` 
        });
      }
    } else {
      score += 15; // Base points if no requirement
      factors.push({ factor: 'Score Available', points: 15, details: `Score: ${character.mythic_plus_score}` });
    }
  }

  // Experience level compatibility (20% weight)
  if (player.experience_level && team.team_requirements?.[0]?.experience_level) {
    const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
    const playerLevel = levels.indexOf(player.experience_level);
    const reqLevel = levels.indexOf(team.team_requirements[0].experience_level);
    
    if (playerLevel >= reqLevel) {
      const points = 20 - Math.abs(playerLevel - reqLevel) * 5;
      score += Math.max(points, 10);
      factors.push({ 
        factor: 'Experience Match', 
        points: Math.max(points, 10), 
        details: `${player.experience_level} (req: ${team.team_requirements[0].experience_level})` 
      });
    }
  }

  // Schedule compatibility (15% weight)
  if (player.available_days && team.schedule?.days) {
    const commonDays = player.available_days.filter(day => 
      team.schedule.days.includes(day)
    );
    const compatibilityRatio = commonDays.length / team.schedule.days.length;
    const points = Math.round(15 * compatibilityRatio);
    score += points;
    factors.push({ 
      factor: 'Schedule Match', 
      points, 
      details: `${commonDays.length}/${team.schedule.days.length} days overlap` 
    });
  }

  // Item level compatibility (10% weight)
  if (character.item_level && team.team_requirements?.[0]?.min_item_level) {
    const req = team.team_requirements[0];
    if (character.item_level >= req.min_item_level) {
      const points = 10;
      score += points;
      factors.push({ 
        factor: 'Item Level', 
        points, 
        details: `${character.item_level} (req: ${req.min_item_level})` 
      });
    }
  }

  return { score: Math.min(score, 100), factors };
};

// Get team recommendations for player
router.get('/recommendations', requireAuth, async (req, res) => {
  try {
    if (isDemoMode) {
      return res.json([
        {
          id: 'demo-team-1',
          name: 'Mythic Masters',
          description: 'Pushing high keys with a chill attitude.',
          target_key_level: 20,
          region: 'us',
          compatibility_score: 85,
          compatibility_factors: [
            { factor: 'Role Match', points: 30, details: 'Team needs tank' },
            { factor: 'Score Compatibility', points: 25, details: 'Score: 2500 (req: 2500)' },
            { factor: 'Experience Match', points: 20, details: 'advanced (req: advanced)' },
            { factor: 'Item Level', points: 10, details: '480 (req: 480)' }
          ],
          spots_available: 2
        }
      ]);
    }

    const { character_id, limit = 10 } = req.query;

    if (!character_id) {
      return res.status(400).json({ error: 'Character ID is required' });
    }

    // Get player data with character
    const { data: player, error: playerError } = await supabase
      .from('users')
      .select('*, characters(*)')
      .eq('id', req.user.id)
      .single();

    if (playerError) throw playerError;

    const character = player.characters.find(c => c.id === parseInt(character_id));
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    // Get available teams (excluding teams user is already in)
    const { data: userTeams } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', req.user.id);

    const userTeamIds = userTeams?.map(tm => tm.team_id) || [];

    let teamsQuery = supabase
      .from('teams')
      .select(`
        *,
        team_members (
          id,
          role,
          status,
          users (discord_username, avatar_url)
        ),
        team_requirements (*),
        team_applications!left (
          id,
          user_id,
          status
        )
      `)
      .eq('is_active', true)
      .eq('is_recruiting', true);

    if (userTeamIds.length > 0) {
      teamsQuery = teamsQuery.not('id', 'in', `(${userTeamIds.join(',')})`);
    }

    const { data: teams, error: teamsError } = await teamsQuery;
    if (teamsError) throw teamsError;

    // Filter out teams where user already applied
    const availableTeams = teams.filter(team => {
      const hasApplied = team.team_applications.some(app => 
        app.user_id === req.user.id && app.status === 'pending'
      );
      return !hasApplied;
    });

    // Calculate compatibility scores
    const recommendations = availableTeams.map(team => {
      const compatibility = calculateCompatibilityScore(player, team, character);
      return {
        ...team,
        compatibility_score: compatibility.score,
        compatibility_factors: compatibility.factors,
        current_members: team.team_members.length,
        spots_available: team.max_members - team.team_members.length
      };
    });

    // Sort by compatibility score and limit results
    const sortedRecommendations = recommendations
      .sort((a, b) => b.compatibility_score - a.compatibility_score)
      .slice(0, parseInt(limit));

    res.json(sortedRecommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get player recommendations for team
router.get('/teams/:teamId/player-recommendations', requireAuth, async (req, res) => {
  try {
    if (isDemoMode) {
      return res.json([]);
    }

    const { teamId } = req.params;
    const { role, limit = 20 } = req.query;

    // Check if user is team leader
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select(`
        *,
        team_members (
          user_id,
          role,
          status
        ),
        team_requirements (*)
      `)
      .eq('id', teamId)
      .single();

    if (teamError) throw teamError;

    if (team.leader_id !== req.user.id) {
      return res.status(403).json({ error: 'Only team leader can view recommendations' });
    }

    // Get current team member IDs
    const currentMemberIds = team.team_members.map(tm => tm.user_id);

    // Get potential players
    let playersQuery = supabase
      .from('users')
      .select(`
        *,
        characters!inner (*)
      `)
      .not('id', 'in', `(${currentMemberIds.join(',')})`);

    // Filter by role if specified
    if (role) {
      playersQuery = playersQuery.eq('characters.role', role);
    }

    const { data: players, error: playersError } = await playersQuery;
    if (playersError) throw playersError;

    // Calculate compatibility for each player
    const recommendations = [];

    for (const player of players) {
      for (const character of player.characters) {
        if (role && character.role !== role) continue;

        const compatibility = calculateCompatibilityScore(player, team, character);
        
        if (compatibility.score > 30) { // Only show decent matches
          recommendations.push({
            user: player,
            character,
            compatibility_score: compatibility.score,
            compatibility_factors: compatibility.factors
          });
        }
      }
    }

    // Sort by compatibility score and limit results
    const sortedRecommendations = recommendations
      .sort((a, b) => b.compatibility_score - a.compatibility_score)
      .slice(0, parseInt(limit));

    res.json(sortedRecommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auto-match players to teams
router.post('/auto-match', requireAuth, async (req, res) => {
  try {
    if (isDemoMode) {
      return res.json({
        matches: [
          {
            team: {
              id: 'demo-team-1',
              name: 'Mythic Masters',
              target_key_level: 20
            },
            compatibility_score: 85,
            compatibility_factors: [
              { factor: 'Role Match', points: 30 },
              { factor: 'Score Compatibility', points: 25 },
              { factor: 'Experience Match', points: 20 },
              { factor: 'Item Level', points: 10 }
            ]
          }
        ],
        total_evaluated: 1,
        message: 'Found 1 high-compatibility team(s)'
      });
    }

    const { character_id, preferences = {} } = req.body;

    if (!character_id) {
      return res.status(400).json({ error: 'Character ID is required' });
    }

    // Get player data
    const { data: player, error: playerError } = await supabase
      .from('users')
      .select('*, characters(*)')
      .eq('id', req.user.id)
      .single();

    if (playerError) throw playerError;

    const character = player.characters.find(c => c.id === parseInt(character_id));
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    // Get teams that match basic criteria
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select(`
        *,
        team_members (
          id,
          user_id,
          role,
          status
        ),
        team_requirements (*)
      `)
      .eq('is_active', true)
      .eq('is_recruiting', true)
      .contains('needed_roles', [character.role]);

    if (teamsError) throw teamsError;

    // Filter teams where user isn't already a member
    const availableTeams = teams.filter(team => 
      !team.team_members.some(member => member.user_id === req.user.id)
    );

    if (availableTeams.length === 0) {
      return res.json({ matches: [], message: 'No suitable teams found' });
    }

    // Calculate compatibility and find best match
    const matches = availableTeams.map(team => {
      const compatibility = calculateCompatibilityScore(player, team, character);
      return {
        team,
        compatibility_score: compatibility.score,
        compatibility_factors: compatibility.factors
      };
    });

    // Sort by score and get top matches
    const topMatches = matches
      .filter(match => match.compatibility_score >= 60) // High compatibility threshold
      .sort((a, b) => b.compatibility_score - a.compatibility_score)
      .slice(0, 3);

    res.json({
      matches: topMatches,
      total_evaluated: availableTeams.length,
      message: topMatches.length > 0 
        ? `Found ${topMatches.length} high-compatibility team(s)` 
        : 'No high-compatibility teams found'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get matchmaking statistics
router.get('/stats', requireAuth, async (req, res) => {
  try {
    if (isDemoMode) {
      return res.json({
        total_teams: 2,
        recruiting_teams: 2,
        total_players: 5,
        recent_matches: 3
      });
    }

    const { data: stats, error } = await supabase.rpc('get_matchmaking_stats');
    
    if (error) throw error;
    
    res.json(stats || {
      total_teams: 0,
      recruiting_teams: 0,
      total_players: 0,
      recent_matches: 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 