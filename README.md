# Mythic+ Team Builder

A comprehensive web application for World of Warcraft players to form consistent Mythic+ teams with AI-powered matchmaking and Raider.io integration.

## Features

- **Discord & Battle.net OAuth Authentication**
- **AI-Powered Team Matching** using Raider.io data, schedule compatibility, and player preferences
- **Team Creation & Management** with role-based recruitment
- **Character Integration** with automatic Raider.io sync
- **Comprehensive Leaderboards** for teams and individual players
- **Real-time Application System** for joining teams
- **Schedule Coordination** based on timezone and availability
- **Modern, Responsive UI** with WoW-themed design

## Tech Stack

### Frontend
- **React 18** with modern hooks and functional components
- **Tailwind CSS** for responsive, utility-first styling
- **Framer Motion** for smooth animations
- **React Query** for efficient data fetching and caching
- **React Router** for client-side routing
- **React Hook Form** for form management
- **Axios** for HTTP requests

### Backend
- **Node.js & Express** for the API server
- **Passport.js** for OAuth authentication (Discord & Battle.net)
- **Supabase** for PostgreSQL database and real-time features
- **Joi** for request validation
- **Axios** for Raider.io API integration
- **Express Rate Limiting** for API protection

### Database
- **PostgreSQL** (via Supabase) with comprehensive schema
- **Row Level Security** for data protection
- **Real-time subscriptions** for live updates
- **Full-text search** capabilities

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Supabase account and project
- Discord application for OAuth
- Battle.net application for OAuth

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mythic-plus-team-builder
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**

   Create `server/.env` with:
   ```bash
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000

   # Database
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Discord OAuth
   DISCORD_CLIENT_ID=your_discord_client_id
   DISCORD_CLIENT_SECRET=your_discord_client_secret

   # Battle.net OAuth
   BNET_CLIENT_ID=your_bnet_client_id
   BNET_CLIENT_SECRET=your_bnet_client_secret

   # Security
   SESSION_SECRET=your_random_session_secret
   JWT_SECRET=your_random_jwt_secret

   # APIs
   RAIDERIO_BASE_URL=https://raider.io/api/v1
   ```

4. **Set up the database**
   - Run the SQL schema in `database/schema.sql` in your Supabase SQL editor
   - This creates all necessary tables, indexes, and functions

5. **Configure OAuth Applications**

   **Discord:**
   - Go to https://discord.com/developers/applications
   - Create a new application
   - Add redirect URI: `http://localhost:5000/api/auth/discord/callback`

   **Battle.net:**
   - Go to https://develop.battle.net/
   - Create a new client
   - Add redirect URI: `http://localhost:5000/api/auth/bnet/callback`

6. **Start the development servers**
   ```bash
   npm run dev
   ```

   This starts both the React frontend (port 3000) and Express backend (port 5000).

## Project Structure

```
mythic-plus-team-builder/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth, etc.)
│   │   ├── pages/          # Page components
│   │   └── App.js          # Main app component
│   └── package.json
├── server/                 # Express backend
│   ├── config/             # Configuration files
│   ├── routes/             # API route handlers
│   ├── server.js           # Main server file
│   └── package.json
├── database/               # Database schema and migrations
│   └── schema.sql
└── package.json            # Root package.json
```

## API Endpoints

### Authentication
- `GET /api/auth/discord` - Initiate Discord OAuth
- `GET /api/auth/bnet` - Initiate Battle.net OAuth
- `GET /api/auth/user` - Get current user
- `POST /api/auth/logout` - Logout user

### Teams
- `GET /api/teams` - List teams with filters
- `GET /api/teams/:id` - Get team details
- `POST /api/teams` - Create team
- `PUT /api/teams/:id` - Update team
- `POST /api/teams/:id/apply` - Apply to team
- `PATCH /api/teams/:teamId/applications/:appId` - Manage applications

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/characters` - Get user's characters
- `POST /api/users/characters` - Add/update character

### Matchmaking
- `GET /api/matchmaking/recommendations` - Get team recommendations
- `POST /api/matchmaking/auto-match` - Find automatic matches
- `GET /api/matchmaking/teams/:id/player-recommendations` - Get player suggestions

### Raider.io Integration
- `GET /api/raiderio/character/search` - Search for character
- `GET /api/raiderio/character/:region/:realm/:name` - Get character data
- `POST /api/raiderio/character/:id/sync` - Sync character data

### Leaderboards
- `GET /api/leaderboard/teams/activity` - Team activity leaderboard
- `GET /api/leaderboard/teams/keys` - Team key completion leaderboard
- `GET /api/leaderboard/players` - Player leaderboard
- `POST /api/leaderboard/keys` - Record key completion

## Key Features Explained

### AI-Powered Matchmaking
The matchmaking algorithm considers multiple factors:
- **Role Compatibility** (30% weight) - Does the team need your role?
- **Mythic+ Score** (25% weight) - Do you meet requirements and skill level?
- **Experience Level** (20% weight) - Matching beginner to expert players
- **Schedule Overlap** (15% weight) - Compatible play times
- **Item Level** (10% weight) - Gear requirements

### Raider.io Integration
- Automatic character data sync
- Real-time Mythic+ scores and rankings
- Item level and achievement tracking
- Character validation and verification

### Team Management
- Role-based permissions (Leader, Officer, Member)
- Application workflow with accept/reject
- Flexible team requirements and filters
- Schedule coordination tools

## Deployment

### Production Environment Variables
Update the environment variables for production:
- Set `NODE_ENV=production`
- Use production database URLs
- Configure production OAuth redirect URIs
- Set secure session and JWT secrets

### Build and Deploy
```bash
# Build the React app
npm run build

# Start production server
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the development team. 