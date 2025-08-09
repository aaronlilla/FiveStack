const express = require('express');
const { supabase, isDemoMode } = require('../config/supabase');
const router = express.Router();

// Get team activity leaderboard
router.get('/teams/activity', async (req, res) => {
  try {
    if (isDemoMode) {
      return res.json({
        period: req.query.period || 'week',
        leaderboard: [
          {
            id: 'demo-team-1',
            name: 'Mythic Masters',
            region: 'us',
            target_key_level: 20,
            activity_stats: {
              keys_completed: 15,
              applications_processed: 8,
              members_recruited: 2,
              total_activities: 25,
              activity_score: 156
            }
          },
          {
            id: 'demo-team-2',
            name: 'Casual Runners',
            region: 'us',
            target_key_level: 15,
            activity_stats: {
              keys_completed: 8,
              applications_processed: 12,
              members_recruited: 1,
              total_activities: 21,
              activity_score: 109
            }
          }
        ],
        generated_at: new Date().toISOString()
      });
    }

    const { 
      period = 'week', // week, month, season
      region,
      limit = 50 
    } = req.query;

    let timeFilter = new Date();
    switch (period) {
      case 'week':
        timeFilter.setDate(timeFilter.getDate() - 7);
        break;
      case 'month':
        timeFilter.setMonth(timeFilter.getMonth() - 1);
        break;
      case 'season':
        timeFilter.setMonth(timeFilter.getMonth() - 4); // Approximate season length
        break;
    }

    let query = supabase
      .from('teams')
      .select(`
        id,
        name,
        region,
        target_key_level,
        created_at,
        team_members!inner (
          id,
          users!inner (
            discord_username,
            avatar_url
          )
        ),
        team_activities (
          id,
          activity_type,
          details,
          created_at
        )
      `)
      .eq('is_active', true)
      .gte('team_activities.created_at', timeFilter.toISOString());

    if (region) {
      query = query.eq('region', region);
    }

    const { data: teams, error } = await query
      .order('team_activities.created_at', { ascending: false })
      .limit(parseInt(limit));

    if (error) throw error;

    // Calculate activity scores for each team
    const leaderboard = teams.map(team => {
      const activities = team.team_activities || [];
      
      // Count different types of activities
      const keyRuns = activities.filter(a => a.activity_type === 'key_completed').length;
      const applications = activities.filter(a => a.activity_type === 'application_processed').length;
      const memberJoined = activities.filter(a => a.activity_type === 'member_joined').length;
      
      // Calculate activity score
      const activityScore = (keyRuns * 10) + (applications * 2) + (memberJoined * 5);
      
      return {
        ...team,
        activity_stats: {
          keys_completed: keyRuns,
          applications_processed: applications,
          members_recruited: memberJoined,
          total_activities: activities.length,
          activity_score: activityScore
        }
      };
    });

    // Sort by activity score
    const sortedLeaderboard = leaderboard
      .sort((a, b) => b.activity_stats.activity_score - a.activity_stats.activity_score);

    res.json({
      period,
      leaderboard: sortedLeaderboard,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get team key completion leaderboard
router.get('/teams/keys', async (req, res) => {
  try {
    if (isDemoMode) {
      return res.json({
        period: req.query.period || 'week',
        min_level: parseInt(req.query.min_level || 2),
        leaderboard: [
          {
            id: 'demo-team-1',
            name: 'Mythic Masters',
            region: 'us',
            target_key_level: 20,
            key_stats: {
              total_keys: 15,
              in_time_keys: 12,
              timing_rate: '80.0',
              avg_key_level: '18.5',
              max_key_level: 23,
              total_score: 642
            }
          }
        ],
        generated_at: new Date().toISOString()
      });
    }

    const { 
      period = 'week',
      region,
      min_level = 2,
      limit = 50 
    } = req.query;

    let timeFilter = new Date();
    switch (period) {
      case 'week':
        timeFilter.setDate(timeFilter.getDate() - 7);
        break;
      case 'month':
        timeFilter.setMonth(timeFilter.getMonth() - 1);
        break;
      case 'season':
        timeFilter.setMonth(timeFilter.getMonth() - 4);
        break;
    }

    let query = supabase
      .from('teams')
      .select(`
        id,
        name,
        region,
        target_key_level,
        created_at,
        team_members!inner (
          id,
          users!inner (
            discord_username,
            avatar_url
          )
        ),
        key_completions (
          id,
          dungeon_name,
          key_level,
          completed_in_time,
          completion_time,
          completed_at
        )
      `)
      .eq('is_active', true)
      .gte('key_completions.completed_at', timeFilter.toISOString())
      .gte('key_completions.key_level', parseInt(min_level));

    if (region) {
      query = query.eq('region', region);
    }

    const { data: teams, error } = await query
      .limit(parseInt(limit));

    if (error) throw error;

    // Calculate key completion stats
    const leaderboard = teams.map(team => {
      const completions = team.key_completions || [];
      
      const totalKeys = completions.length;
      const inTimeKeys = completions.filter(k => k.completed_in_time).length;
      const avgKeyLevel = totalKeys > 0 
        ? completions.reduce((sum, k) => sum + k.key_level, 0) / totalKeys 
        : 0;
      const maxKeyLevel = totalKeys > 0 
        ? Math.max(...completions.map(k => k.key_level)) 
        : 0;
      
      // Calculate score based on keys completed, timing, and difficulty
      const baseScore = totalKeys * 10;
      const timingBonus = inTimeKeys * 5;
      const difficultyBonus = completions.reduce((sum, k) => sum + (k.key_level * 2), 0);
      const totalScore = baseScore + timingBonus + difficultyBonus;

      return {
        ...team,
        key_stats: {
          total_keys: totalKeys,
          in_time_keys: inTimeKeys,
          timing_rate: totalKeys > 0 ? (inTimeKeys / totalKeys * 100).toFixed(1) : 0,
          avg_key_level: avgKeyLevel.toFixed(1),
          max_key_level: maxKeyLevel,
          total_score: totalScore
        }
      };
    });

    // Sort by total score
    const sortedLeaderboard = leaderboard
      .sort((a, b) => b.key_stats.total_score - a.key_stats.total_score);

    res.json({
      period,
      min_level: parseInt(min_level),
      leaderboard: sortedLeaderboard,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get player leaderboard
router.get('/players', async (req, res) => {
  try {
    if (isDemoMode) {
      return res.json({
        filters: { 
          region: req.query.region, 
          role: req.query.role, 
          min_score: parseInt(req.query.min_score || 0) 
        },
        leaderboard: [
          {
            rank: 1,
            character_name: 'Demochar',
            realm: 'Demo-Realm',
            region: 'us',
            class: 'Death Knight',
            spec: 'Blood',
            role: 'tank',
            item_level: 480,
            mythic_plus_score: 2500,
            user: {
              discord_username: 'DemoUser',
              avatar_url: null,
              experience_level: 'advanced'
            },
            profile_url: null,
            last_synced: new Date().toISOString()
          }
        ],
        generated_at: new Date().toISOString()
      });
    }

    const { 
      region,
      role,
      min_score = 0,
      limit = 100 
    } = req.query;

    let query = supabase
      .from('characters')
      .select(`
        *,
        users!inner (
          discord_username,
          avatar_url,
          experience_level
        )
      `)
      .gte('mythic_plus_score', parseInt(min_score))
      .order('mythic_plus_score', { ascending: false });

    if (region) {
      query = query.eq('region', region);
    }

    if (role) {
      query = query.eq('role', role);
    }

    const { data: characters, error } = await query
      .limit(parseInt(limit));

    if (error) throw error;

    // Format leaderboard data
    const leaderboard = characters.map((character, index) => ({
      rank: index + 1,
      character_name: character.name,
      realm: character.realm,
      region: character.region,
      class: character.class,
      spec: character.spec,
      role: character.role,
      item_level: character.item_level,
      mythic_plus_score: character.mythic_plus_score,
      user: {
        discord_username: character.users.discord_username,
        avatar_url: character.users.avatar_url,
        experience_level: character.users.experience_level
      },
      profile_url: character.profile_url,
      last_synced: character.last_synced
    }));

    res.json({
      filters: { region, role, min_score: parseInt(min_score) },
      leaderboard,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Record key completion
router.post('/keys', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (isDemoMode) {
      return res.status(201).json({
        id: 'demo-key-completion',
        team_id: req.body.team_id,
        recorded_by: 'demo-user-id',
        dungeon_name: req.body.dungeon_name || 'Demo Dungeon',
        key_level: req.body.key_level || 15,
        completed_in_time: req.body.completed_in_time || true,
        completion_time: req.body.completion_time,
        participants: req.body.participants || [],
        completed_at: new Date().toISOString(),
        message: 'Demo mode - key completion recorded'
      });
    }

    const {
      team_id,
      dungeon_name,
      key_level,
      completed_in_time,
      completion_time,
      participants
    } = req.body;

    // Validate input
    if (!team_id || !dungeon_name || !key_level) {
      return res.status(400).json({ error: 'Team ID, dungeon name, and key level are required' });
    }

    // Check if user is team member
    const { data: teamMember, error: memberError } = await supabase
      .from('team_members')
      .select('id')
      .eq('team_id', team_id)
      .eq('user_id', req.user.id)
      .single();

    if (memberError || !teamMember) {
      return res.status(403).json({ error: 'You must be a team member to record completions' });
    }

    // Record key completion
    const { data: completion, error } = await supabase
      .from('key_completions')
      .insert({
        team_id,
        recorded_by: req.user.id,
        dungeon_name,
        key_level: parseInt(key_level),
        completed_in_time: completed_in_time || false,
        completion_time,
        participants: participants || [],
        completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Record team activity
    await supabase
      .from('team_activities')
      .insert({
        team_id,
        user_id: req.user.id,
        activity_type: 'key_completed',
        details: {
          dungeon: dungeon_name,
          level: key_level,
          in_time: completed_in_time
        },
        created_at: new Date().toISOString()
      });

    res.status(201).json(completion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get team's key completion history
router.get('/teams/:id/keys', async (req, res) => {
  try {
    if (isDemoMode) {
      return res.json([
        {
          id: 'demo-completion-1',
          team_id: req.params.id,
          dungeon_name: 'Demo Dungeon',
          key_level: 18,
          completed_in_time: true,
          completion_time: 1800,
          completed_at: new Date().toISOString(),
          users: {
            discord_username: 'DemoUser',
            avatar_url: null
          }
        }
      ]);
    }

    const { limit = 50, page = 1 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { data: completions, error } = await supabase
      .from('key_completions')
      .select(`
        *,
        users!recorded_by (
          discord_username,
          avatar_url
        )
      `)
      .eq('team_id', req.params.id)
      .order('completed_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) throw error;

    res.json(completions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 