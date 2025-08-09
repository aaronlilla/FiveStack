const express = require('express');
const passport = require('passport');
const { isDemoMode } = require('../config/supabase');
const router = express.Router();

// Demo login route for testing
router.post('/demo-login', (req, res) => {
  if (!isDemoMode) {
    return res.status(403).json({ error: 'Demo login only available in demo mode' });
  }
  
  // Simulate login with demo user
  req.login({
    id: 'demo-user-id',
    discord_username: 'DemoUser',
    discord_discriminator: '0001',
    avatar_url: null,
    email: 'demo@example.com'
  }, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Demo login failed' });
    }
    res.json({ message: 'Demo login successful', user: req.user });
  });
});

// Discord OAuth routes
router.get('/discord', (req, res, next) => {
  if (isDemoMode) {
    return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?demo=true`);
  }
  
  if (!process.env.DISCORD_CLIENT_ID || process.env.DISCORD_CLIENT_ID === 'placeholder_discord_client_id') {
    return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=discord_not_configured`);
  }
  
  passport.authenticate('discord')(req, res, next);
});

router.get('/discord/callback', 
  passport.authenticate('discord', {
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=discord_failed`
  }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard`);
  }
);

// Battle.net OAuth routes
router.get('/bnet', (req, res, next) => {
  if (isDemoMode) {
    return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?demo=true`);
  }
  
  if (!process.env.BNET_CLIENT_ID || process.env.BNET_CLIENT_ID === 'placeholder_bnet_client_id') {
    return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=bnet_not_configured`);
  }
  
  passport.authenticate('bnet')(req, res, next);
});

router.get('/bnet/callback',
  passport.authenticate('bnet', {
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=bnet_failed`
  }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard`);
  }
);

// Logout route
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Current user route
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

module.exports = router; 