const express = require('express');
const { supabase, isDemoMode } = require('../config/supabase');
const Joi = require('joi');
const router = express.Router();

const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Demo teams data
const demoTeams = [
  {
    id: 'demo-team-1',
    name: 'Mythic Masters',
    description: 'Pushing high keys with a chill attitude. Looking for consistent players.',
    region: 'us',
    target_key_level: 20,
    needed_roles: ['tank', 'healer'],
    max_members: 5,
    is_recruiting: true,
    is_active: true,
    team_members: [
      {
        id: 1,
        role: 'leader',
        users: {
          discord_username: 'TeamLeader',
          avatar_url: null
        }
      }
    ],
    team_requirements: [{
      min_score: 2500,
      min_item_level: 480,
      experience_level: 'advanced'
    }]
  },
  {
    id: 'demo-team-2',
    name: 'Casual Runners',
    description: 'Weekly key runs for valor and fun. All skill levels welcome!',
    region: 'us',
    target_key_level: 15,
    needed_roles: ['dps'],
    max_members: 5,
    is_recruiting: true,
    is_active: true,
    team_members: [
      {
        id: 2,
        role: 'leader',
        users: {
          discord_username: 'CasualLeader',
          avatar_url: null
        }
      }
    ],
    team_requirements: []
  }
];

// Get all teams (with filters)
router.get('/', async (req, res) => {
  try {
    if (isDemoMode) {
      return res.json(demoTeams);
    }

    const { 
      page = 1, 
      limit = 20, 
      role, 
      keyLevel, 
      region, 
      realm,
      recruiting 
    } = req.query;

    let query = supabase
      .from('teams')
      .select(`
        *,
        team_members!inner (
          id,
          role,
          status,
          users!inner (
            discord_username,
            avatar_url
          )
        ),
        team_requirements (*)
      `)
      .eq('is_active', true);

    if (recruiting === 'true') {
      query = query.eq('is_recruiting', true);
    }

    if (role) {
      query = query.contains('needed_roles', [role]);
    }

    if (keyLevel) {
      query = query.gte('target_key_level', parseInt(keyLevel));
    }

    if (region) {
      query = query.eq('region', region);
    }

    const { data: teams, error } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get team by ID
router.get('/:id', async (req, res) => {
  try {
    if (isDemoMode) {
      const team = demoTeams.find(t => t.id === req.params.id);
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }
      return res.json({
        ...team,
        team_applications: []
      });
    }

    const { data: team, error } = await supabase
      .from('teams')
      .select(`
        *,
        team_members (
          *,
          users (
            discord_username,
            avatar_url,
            preferred_role,
            experience_level
          ),
          characters (*)
        ),
        team_requirements (*),
        team_applications (
          *,
          users (
            discord_username,
            avatar_url
          ),
          characters (*)
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create team
router.post('/', requireAuth, async (req, res) => {
  try {
    if (isDemoMode) {
      return res.status(201).json({
        id: 'demo-new-team',
        name: req.body.name || 'New Demo Team',
        description: req.body.description || 'Demo team description',
        region: req.body.region || 'us',
        target_key_level: req.body.target_key_level || 15,
        leader_id: 'demo-user-id',
        is_recruiting: true,
        is_active: true,
        created_at: new Date().toISOString()
      });
    }

    const schema = Joi.object({
      name: Joi.string().required().max(100),
      description: Joi.string().max(1000),
      region: Joi.string().valid('us', 'eu', 'kr', 'tw', 'cn').required(),
      target_key_level: Joi.number().min(2).max(35).required(),
      schedule: Joi.object().required(),
      needed_roles: Joi.array().items(Joi.string().valid('tank', 'healer', 'dps')),
      requirements: Joi.object({
        min_score: Joi.number().min(0),
        min_item_level: Joi.number().min(1),
        experience_level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert'),
        voice_required: Joi.boolean(),
        age_requirement: Joi.number().min(13)
      }),
      is_recruiting: Joi.boolean().default(true),
      max_members: Joi.number().min(1).max(20).default(5)
    });

    const { error: validationError, value } = schema.validate(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError.details[0].message });
    }

    // Create team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({
        ...value,
        leader_id: req.user.id,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (teamError) throw teamError;

    // Add leader as team member
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: team.id,
        user_id: req.user.id,
        role: 'leader',
        status: 'accepted',
        joined_at: new Date().toISOString()
      });

    if (memberError) throw memberError;

    // Add requirements if provided
    if (value.requirements) {
      const { error: reqError } = await supabase
        .from('team_requirements')
        .insert({
          team_id: team.id,
          ...value.requirements
        });

      if (reqError) throw reqError;
    }

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update team
router.put('/:id', requireAuth, async (req, res) => {
  try {
    if (isDemoMode) {
      return res.json({
        message: 'Demo mode - team update simulated',
        ...req.body
      });
    }

    // Check if user is team leader
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('leader_id')
      .eq('id', req.params.id)
      .single();

    if (teamError) throw teamError;
    
    if (team.leader_id !== req.user.id) {
      return res.status(403).json({ error: 'Only team leader can update team' });
    }

    const schema = Joi.object({
      name: Joi.string().max(100),
      description: Joi.string().max(1000),
      target_key_level: Joi.number().min(2).max(35),
      schedule: Joi.object(),
      needed_roles: Joi.array().items(Joi.string().valid('tank', 'healer', 'dps')),
      is_recruiting: Joi.boolean(),
      is_active: Joi.boolean()
    });

    const { error: validationError, value } = schema.validate(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError.details[0].message });
    }

    const { data: updatedTeam, error } = await supabase
      .from('teams')
      .update({
        ...value,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply to team
router.post('/:id/apply', requireAuth, async (req, res) => {
  try {
    if (isDemoMode) {
      return res.status(201).json({
        id: 'demo-application',
        team_id: req.params.id,
        user_id: 'demo-user-id',
        character_id: req.body.character_id,
        message: req.body.message,
        status: 'pending',
        applied_at: new Date().toISOString()
      });
    }

    const { character_id, message } = req.body;

    // Check if already applied or member
    const { data: existingApplication } = await supabase
      .from('team_applications')
      .select('id')
      .eq('team_id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (existingApplication) {
      return res.status(400).json({ error: 'Already applied to this team' });
    }

    const { data: existingMember } = await supabase
      .from('team_members')
      .select('id')
      .eq('team_id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (existingMember) {
      return res.status(400).json({ error: 'Already a member of this team' });
    }

    const { data: application, error } = await supabase
      .from('team_applications')
      .insert({
        team_id: req.params.id,
        user_id: req.user.id,
        character_id,
        message,
        status: 'pending',
        applied_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Manage team application (accept/reject)
router.patch('/:teamId/applications/:applicationId', requireAuth, async (req, res) => {
  try {
    if (isDemoMode) {
      return res.json({
        message: `Demo mode - application ${req.body.status} simulated`
      });
    }

    const { status } = req.body; // 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Check if user is team leader
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('leader_id')
      .eq('id', req.params.teamId)
      .single();

    if (teamError) throw teamError;
    
    if (team.leader_id !== req.user.id) {
      return res.status(403).json({ error: 'Only team leader can manage applications' });
    }

    // Update application status
    const { data: application, error } = await supabase
      .from('team_applications')
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: req.user.id
      })
      .eq('id', req.params.applicationId)
      .eq('team_id', req.params.teamId)
      .select('*, users(*)')
      .single();

    if (error) throw error;

    // If accepted, add to team members
    if (status === 'accepted') {
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: req.params.teamId,
          user_id: application.user_id,
          character_id: application.character_id,
          role: 'member',
          status: 'accepted',
          joined_at: new Date().toISOString()
        });

      if (memberError) throw memberError;
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Leave team
router.delete('/:id/leave', requireAuth, async (req, res) => {
  try {
    if (isDemoMode) {
      return res.json({ message: 'Demo mode - team leave simulated' });
    }

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ message: 'Left team successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 