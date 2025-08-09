-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    discord_id VARCHAR(20) UNIQUE,
    discord_username VARCHAR(32),
    discord_discriminator VARCHAR(4),
    bnet_id VARCHAR(20) UNIQUE,
    bnet_battletag VARCHAR(50),
    email VARCHAR(255),
    avatar_url TEXT,
    preferred_role VARCHAR(10) CHECK (preferred_role IN ('tank', 'healer', 'dps')),
    timezone VARCHAR(50),
    available_days TEXT[], -- Array of days: ['monday', 'tuesday', etc.]
    available_times JSONB, -- Flexible time ranges
    voice_chat BOOLEAN DEFAULT false,
    experience_level VARCHAR(20) CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    goals TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Characters table
CREATE TABLE characters (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    realm VARCHAR(100) NOT NULL,
    region VARCHAR(5) NOT NULL CHECK (region IN ('us', 'eu', 'kr', 'tw', 'cn')),
    class VARCHAR(50) NOT NULL,
    spec VARCHAR(50) NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('tank', 'healer', 'dps')),
    item_level INTEGER,
    mythic_plus_score INTEGER DEFAULT 0,
    mythic_plus_score_tank INTEGER DEFAULT 0,
    mythic_plus_score_healer INTEGER DEFAULT 0,
    mythic_plus_score_dps INTEGER DEFAULT 0,
    achievement_points INTEGER,
    thumbnail_url TEXT,
    profile_url TEXT,
    is_main BOOLEAN DEFAULT false,
    last_synced TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, realm, region)
);

-- Teams table
CREATE TABLE teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    leader_id UUID REFERENCES users(id) ON DELETE CASCADE,
    region VARCHAR(5) NOT NULL CHECK (region IN ('us', 'eu', 'kr', 'tw', 'cn')),
    target_key_level INTEGER NOT NULL CHECK (target_key_level >= 2 AND target_key_level <= 35),
    schedule JSONB NOT NULL, -- Flexible schedule format
    needed_roles TEXT[] DEFAULT '{}', -- Array of needed roles
    max_members INTEGER DEFAULT 5 CHECK (max_members >= 1 AND max_members <= 20),
    is_recruiting BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team requirements table
CREATE TABLE team_requirements (
    id SERIAL PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    min_score INTEGER DEFAULT 0,
    min_item_level INTEGER,
    experience_level VARCHAR(20) CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    voice_required BOOLEAN DEFAULT false,
    age_requirement INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members table
CREATE TABLE team_members (
    id SERIAL PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    character_id INTEGER REFERENCES characters(id) ON DELETE SET NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('leader', 'officer', 'member')),
    status VARCHAR(20) DEFAULT 'accepted' CHECK (status IN ('pending', 'accepted', 'declined')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Team applications table
CREATE TABLE team_applications (
    id SERIAL PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    character_id INTEGER REFERENCES characters(id) ON DELETE SET NULL,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(team_id, user_id)
);

-- Team activities table (for tracking team activity)
CREATE TABLE team_activities (
    id SERIAL PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    activity_type VARCHAR(50) NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Key completions table (for leaderboards)
CREATE TABLE key_completions (
    id SERIAL PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    recorded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    dungeon_name VARCHAR(100) NOT NULL,
    key_level INTEGER NOT NULL CHECK (key_level >= 2 AND key_level <= 35),
    completed_in_time BOOLEAN DEFAULT false,
    completion_time INTEGER, -- in seconds
    participants JSONB, -- Array of participant info
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Matchmaking preferences (optional table for advanced matchmaking)
CREATE TABLE matchmaking_preferences (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    preferred_key_levels INTEGER[],
    preferred_regions VARCHAR(5)[],
    avoid_players UUID[],
    auto_apply BOOLEAN DEFAULT false,
    notification_preferences JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_discord_id ON users(discord_id);
CREATE INDEX idx_users_bnet_id ON users(bnet_id);
CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_characters_region_realm ON characters(region, realm);
CREATE INDEX idx_characters_score ON characters(mythic_plus_score DESC);
CREATE INDEX idx_teams_region ON teams(region);
CREATE INDEX idx_teams_recruiting ON teams(is_recruiting) WHERE is_recruiting = true;
CREATE INDEX idx_teams_active ON teams(is_active) WHERE is_active = true;
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_team_applications_team_id ON team_applications(team_id);
CREATE INDEX idx_team_applications_user_id ON team_applications(user_id);
CREATE INDEX idx_team_applications_status ON team_applications(status);
CREATE INDEX idx_team_activities_team_id ON team_activities(team_id);
CREATE INDEX idx_key_completions_team_id ON key_completions(team_id);
CREATE INDEX idx_key_completions_completed_at ON key_completions(completed_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON characters 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matchmaking_preferences_updated_at BEFORE UPDATE ON matchmaking_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get matchmaking statistics
CREATE OR REPLACE FUNCTION get_matchmaking_stats()
RETURNS JSON AS $$
DECLARE
    stats JSON;
BEGIN
    SELECT json_build_object(
        'total_teams', (SELECT COUNT(*) FROM teams WHERE is_active = true),
        'recruiting_teams', (SELECT COUNT(*) FROM teams WHERE is_active = true AND is_recruiting = true),
        'total_players', (SELECT COUNT(*) FROM users),
        'recent_matches', (SELECT COUNT(*) FROM team_members WHERE joined_at > NOW() - INTERVAL '7 days')
    ) INTO stats;
    
    RETURN stats;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_applications ENABLE ROW LEVEL SECURITY;

-- Users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Characters belong to users
CREATE POLICY "Users can manage own characters" ON characters FOR ALL USING (auth.uid() = user_id);

-- Teams are publicly viewable, but only leaders can edit
CREATE POLICY "Teams are publicly viewable" ON teams FOR SELECT USING (true);
CREATE POLICY "Team leaders can update teams" ON teams FOR UPDATE USING (auth.uid() = leader_id);
CREATE POLICY "Users can create teams" ON teams FOR INSERT WITH CHECK (auth.uid() = leader_id);

-- Team members and applications
CREATE POLICY "Team members are viewable" ON team_members FOR SELECT USING (true);
CREATE POLICY "Team applications are viewable by team leaders and applicants" ON team_applications 
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (SELECT leader_id FROM teams WHERE id = team_id));

-- Insert sample data for development
INSERT INTO users (id, discord_username, discord_discriminator, email, preferred_role, experience_level, created_at) VALUES
    ('00000000-0000-0000-0000-000000000001', 'TestUser1', '1234', 'test1@example.com', 'tank', 'intermediate', NOW()),
    ('00000000-0000-0000-0000-000000000002', 'TestUser2', '5678', 'test2@example.com', 'healer', 'advanced', NOW()),
    ('00000000-0000-0000-0000-000000000003', 'TestUser3', '9012', 'test3@example.com', 'dps', 'expert', NOW());

INSERT INTO characters (user_id, name, realm, region, class, spec, role, item_level, mythic_plus_score) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Tankmaster', 'Stormrage', 'us', 'Death Knight', 'Blood', 'tank', 480, 2500),
    ('00000000-0000-0000-0000-000000000002', 'Healbot', 'Tichondrius', 'us', 'Priest', 'Holy', 'healer', 485, 2800),
    ('00000000-0000-0000-0000-000000000003', 'Dpsking', 'Area-52', 'us', 'Mage', 'Fire', 'dps', 490, 3200); 