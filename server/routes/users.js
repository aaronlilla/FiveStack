const express = require('express');
const { supabase, isDemoMode } = require('../config/supabase');
const Joi = require('joi');
const router = express.Router();

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Get user profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    if (isDemoMode) {
      return res.json({
        id: 'demo-user-id',
        discord_username: 'DemoUser',
        avatar_url: null,
        characters: [
          {
            id: 1,
            name: 'Demochar',
            realm: 'Demo-Realm',
            class: 'Death Knight',
            spec: 'Blood',
            role: 'tank',
            item_level: 480,
            mythic_plus_score: 2500,
            is_main: true
          }
        ],
        team_members: []
      });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select(`
        *,
        characters (*),
        team_members!inner (
          teams (*)
        )
      `)
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    if (isDemoMode) {
      return res.json({ message: 'Demo mode - profile update simulated' });
    }

    const schema = Joi.object({
      preferred_role: Joi.string().valid('tank', 'healer', 'dps'),
      timezone: Joi.string(),
      available_days: Joi.array().items(Joi.string()),
      available_times: Joi.object(),
      voice_chat: Joi.boolean(),
      experience_level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert'),
      goals: Joi.string().max(500),
      notes: Joi.string().max(1000)
    });

    const { error: validationError, value } = schema.validate(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError.details[0].message });
    }

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        ...value,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add/Update character
router.post('/characters', requireAuth, async (req, res) => {
  try {
    if (isDemoMode) {
      return res.json({
        id: 'demo-char-id',
        name: req.body.name || 'DemoChar',
        realm: req.body.realm || 'Demo-Realm',
        class: req.body.class || 'Death Knight',
        spec: req.body.spec || 'Blood',
        role: req.body.role || 'tank',
        item_level: req.body.item_level || 480,
        mythic_plus_score: req.body.mythic_plus_score || 2500
      });
    }

    const schema = Joi.object({
      name: Joi.string().required(),
      realm: Joi.string().required(),
      region: Joi.string().valid('us', 'eu', 'kr', 'tw', 'cn').required(),
      class: Joi.string().required(),
      spec: Joi.string().required(),
      role: Joi.string().valid('tank', 'healer', 'dps').required(),
      item_level: Joi.number().min(1).max(1000),
      mythic_plus_score: Joi.number().min(0),
      is_main: Joi.boolean().default(false)
    });

    const { error: validationError, value } = schema.validate(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError.details[0].message });
    }

    // If this is marked as main, unset other main characters
    if (value.is_main) {
      await supabase
        .from('characters')
        .update({ is_main: false })
        .eq('user_id', req.user.id);
    }

    const { data: character, error } = await supabase
      .from('characters')
      .upsert({
        ...value,
        user_id: req.user.id,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    res.json(character);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's characters
router.get('/characters', requireAuth, async (req, res) => {
  try {
    if (isDemoMode) {
      return res.json([
        {
          id: 1,
          name: 'Demochar',
          realm: 'Demo-Realm',
          region: 'us',
          class: 'Death Knight',
          spec: 'Blood',
          role: 'tank',
          item_level: 480,
          mythic_plus_score: 2500,
          is_main: true
        }
      ]);
    }

    const { data: characters, error } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', req.user.id)
      .order('is_main', { ascending: false });

    if (error) throw error;
    res.json(characters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete character
router.delete('/characters/:id', requireAuth, async (req, res) => {
  try {
    if (isDemoMode) {
      return res.json({ message: 'Demo mode - character deletion simulated' });
    }

    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ message: 'Character deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 