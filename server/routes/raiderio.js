const express = require('express');
const axios = require('axios');
const { supabase, isDemoMode } = require('../config/supabase');
const router = express.Router();

const RAIDERIO_BASE_URL = process.env.RAIDERIO_BASE_URL || 'https://raider.io/api/v1';

// Cache for API responses (in production, use Redis)
const cache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

const getCacheKey = (endpoint, params) => {
  return `${endpoint}-${JSON.stringify(params)}`;
};

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

// Get character profile from Raider.io
router.get('/character/:region/:realm/:name', async (req, res) => {
  try {
    const { region, realm, name } = req.params;
    const fields = 'mythic_plus_scores_by_season:current,gear,guild,mythic_plus_ranks,mythic_plus_recent_runs';
    
    const cacheKey = getCacheKey('character', { region, realm, name, fields });
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    const response = await axios.get(`${RAIDERIO_BASE_URL}/characters/profile`, {
      params: {
        region,
        realm,
        name,
        fields
      }
    });

    setCachedData(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Character not found' });
    }
    res.status(500).json({ error: 'Failed to fetch character data' });
  }
});

// Search for character
router.get('/character/search', async (req, res) => {
  try {
    const { region, realm, name } = req.query;
    
    if (!region || !realm || !name) {
      return res.status(400).json({ error: 'Region, realm, and name are required' });
    }

    const cacheKey = getCacheKey('search', { region, realm, name });
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    const response = await axios.get(`${RAIDERIO_BASE_URL}/characters/profile`, {
      params: {
        region,
        realm,
        name,
        fields: 'mythic_plus_scores_by_season:current'
      }
    });

    const characterData = {
      name: response.data.name,
      realm: response.data.realm,
      region: response.data.region,
      class: response.data.class,
      active_spec_name: response.data.active_spec_name,
      active_spec_role: response.data.active_spec_role,
      race: response.data.race,
      faction: response.data.faction,
      achievement_points: response.data.achievement_points,
      thumbnail_url: response.data.thumbnail_url,
      profile_url: response.data.profile_url,
      mythic_plus_scores: response.data.mythic_plus_scores_by_season?.[0] || null
    };

    setCachedData(cacheKey, characterData);
    res.json(characterData);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Character not found' });
    }
    res.status(500).json({ error: 'Failed to search character' });
  }
});

// Update character data from Raider.io
router.post('/character/:id/sync', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (isDemoMode) {
      return res.json({
        id: req.params.id,
        name: 'DemoChar',
        last_synced: new Date().toISOString(),
        message: 'Demo mode - sync simulated'
      });
    }

    // Get character from database
    const { data: character, error: fetchError } = await supabase
      .from('characters')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError) throw fetchError;

    // Fetch latest data from Raider.io
    const response = await axios.get(`${RAIDERIO_BASE_URL}/characters/profile`, {
      params: {
        region: character.region,
        realm: character.realm,
        name: character.name,
        fields: 'mythic_plus_scores_by_season:current,gear,mythic_plus_ranks'
      }
    });

    const raiderioData = response.data;
    const currentSeason = raiderioData.mythic_plus_scores_by_season?.[0];

    // Update character in database
    const { data: updatedCharacter, error: updateError } = await supabase
      .from('characters')
      .update({
        class: raiderioData.class,
        spec: raiderioData.active_spec_name,
        role: raiderioData.active_spec_role,
        item_level: raiderioData.gear?.item_level_equipped,
        mythic_plus_score: currentSeason?.scores?.all || 0,
        mythic_plus_score_tank: currentSeason?.scores?.tank || 0,
        mythic_plus_score_healer: currentSeason?.scores?.healer || 0,
        mythic_plus_score_dps: currentSeason?.scores?.dps || 0,
        achievement_points: raiderioData.achievement_points,
        thumbnail_url: raiderioData.thumbnail_url,
        profile_url: raiderioData.profile_url,
        last_synced: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json(updatedCharacter);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Character not found on Raider.io' });
    }
    res.status(500).json({ error: 'Failed to sync character data' });
  }
});

// Get mythic+ leaderboard
router.get('/leaderboard/:region', async (req, res) => {
  try {
    const { region } = req.params;
    const { dungeon, period = 'season', page = 0 } = req.query;

    const cacheKey = getCacheKey('leaderboard', { region, dungeon, period, page });
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    const params = {
      region,
      period,
      page
    };

    if (dungeon) {
      params.dungeon = dungeon;
    }

    const response = await axios.get(`${RAIDERIO_BASE_URL}/mythic-plus/runs`, {
      params
    });

    setCachedData(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard data' });
  }
});

// Get available dungeons
router.get('/dungeons/:expansion?', async (req, res) => {
  try {
    const { expansion = 'current' } = req.params;
    
    const cacheKey = getCacheKey('dungeons', { expansion });
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    const response = await axios.get(`${RAIDERIO_BASE_URL}/mythic-plus/static-data`, {
      params: { expansion }
    });

    setCachedData(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dungeon data' });
  }
});

// Clean cache periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
}, CACHE_TTL);

module.exports = router; 