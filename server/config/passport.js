const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const BnetStrategy = require('passport-bnet').Strategy;
const { supabase, isDemoMode } = require('./supabase');

// Demo user for testing
const demoUser = {
  id: 'demo-user-id',
  discord_id: 'demo-discord-id',
  discord_username: 'DemoUser',
  discord_discriminator: '0001',
  avatar_url: null,
  email: 'demo@example.com',
  created_at: new Date().toISOString(),
  last_login: new Date().toISOString()
};

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    if (isDemoMode) {
      return done(null, demoUser);
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Only set up OAuth strategies if we have the credentials
if (process.env.DISCORD_CLIENT_ID && 
    process.env.DISCORD_CLIENT_SECRET && 
    process.env.DISCORD_CLIENT_ID !== 'placeholder_discord_client_id') {
  
  // Discord Strategy
  passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: '/api/auth/discord/callback',
    scope: ['identify', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      if (isDemoMode) {
        return done(null, demoUser);
      }

      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('discord_id', profile.id)
        .single();

      if (existingUser) {
        // Update existing user
        const { data: updatedUser, error } = await supabase
          .from('users')
          .update({
            discord_username: profile.username,
            discord_discriminator: profile.discriminator,
            avatar_url: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null,
            email: profile.email,
            last_login: new Date().toISOString()
          })
          .eq('discord_id', profile.id)
          .select()
          .single();

        if (error) throw error;
        return done(null, updatedUser);
      } else {
        // Create new user
        const { data: newUser, error } = await supabase
          .from('users')
          .insert({
            discord_id: profile.id,
            discord_username: profile.username,
            discord_discriminator: profile.discriminator,
            avatar_url: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null,
            email: profile.email,
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        return done(null, newUser);
      }
    } catch (error) {
      return done(error, null);
    }
  }));
} else {
  console.log('⚠️  Discord OAuth not configured - set DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET');
}

// Battle.net Strategy
if (process.env.BNET_CLIENT_ID && 
    process.env.BNET_CLIENT_SECRET && 
    process.env.BNET_CLIENT_ID !== 'placeholder_bnet_client_id') {
  
  passport.use(new BnetStrategy({
    clientID: process.env.BNET_CLIENT_ID,
    clientSecret: process.env.BNET_CLIENT_SECRET,
    callbackURL: '/api/auth/bnet/callback',
    region: 'us' // or 'eu', 'kr', 'tw', 'cn'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      if (isDemoMode) {
        return done(null, demoUser);
      }

      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('bnet_id', profile.id)
        .single();

      if (existingUser) {
        // Update existing user with Battle.net info
        const { data: updatedUser, error } = await supabase
          .from('users')
          .update({
            bnet_id: profile.id,
            bnet_battletag: profile.battletag,
            last_login: new Date().toISOString()
          })
          .eq('bnet_id', profile.id)
          .select()
          .single();

        if (error) throw error;
        return done(null, updatedUser);
      } else {
        // Link Battle.net to existing Discord user or create new
        const { data: newUser, error } = await supabase
          .from('users')
          .insert({
            bnet_id: profile.id,
            bnet_battletag: profile.battletag,
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        return done(null, newUser);
      }
    } catch (error) {
      return done(error, null);
    }
  }));
} else {
  console.log('⚠️  Battle.net OAuth not configured - set BNET_CLIENT_ID and BNET_CLIENT_SECRET');
} 