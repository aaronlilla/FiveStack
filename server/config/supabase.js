const { createClient } = require('@supabase/supabase-js');

// Check if we have Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
let isDemoMode = false;

if (supabaseUrl && supabaseServiceKey && 
    supabaseUrl !== 'https://placeholder.supabase.co' && 
    supabaseServiceKey !== 'placeholder_service_role_key') {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('✅ Connected to Supabase');
  } catch (error) {
    console.error('❌ Failed to connect to Supabase:', error.message);
    isDemoMode = true;
  }
} else {
  console.log('⚠️  Running in DEMO MODE - No database connection');
  console.log('   To connect to a real database, set up your .env file with:');
  console.log('   - SUPABASE_URL=your_supabase_project_url');
  console.log('   - SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  isDemoMode = true;
}

// Mock supabase client for demo mode
const mockSupabase = {
  from: (table) => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: { message: 'Demo mode - no database' } }),
        limit: () => Promise.resolve({ data: [], error: null }),
        order: () => Promise.resolve({ data: [], error: null }),
        range: () => Promise.resolve({ data: [], error: null })
      }),
      limit: () => Promise.resolve({ data: [], error: null }),
      order: () => Promise.resolve({ data: [], error: null }),
      range: () => Promise.resolve({ data: [], error: null }),
      gte: () => Promise.resolve({ data: [], error: null }),
      contains: () => Promise.resolve({ data: [], error: null }),
      not: () => Promise.resolve({ data: [], error: null })
    }),
    insert: () => ({
      select: () => ({
        single: () => Promise.resolve({ 
          data: { id: 'demo-id', name: 'Demo Data' }, 
          error: null 
        })
      })
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: () => Promise.resolve({ 
            data: { id: 'demo-id', name: 'Updated Demo Data' }, 
            error: null 
          })
        })
      })
    }),
    delete: () => ({
      eq: () => Promise.resolve({ error: null })
    }),
    upsert: () => ({
      select: () => ({
        single: () => Promise.resolve({ 
          data: { id: 'demo-id', name: 'Upserted Demo Data' }, 
          error: null 
        })
      })
    })
  }),
  rpc: () => Promise.resolve({ 
    data: { 
      total_teams: 0, 
      recruiting_teams: 0, 
      total_players: 0, 
      recent_matches: 0 
    }, 
    error: null 
  })
};

module.exports = {
  supabase: supabase || mockSupabase,
  isDemoMode
}; 