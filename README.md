# 🏰 Mythic+ Team Builder

> **Elite team formation platform for World of Warcraft Mythic+ dungeons with AI-powered matchmaking and comprehensive Raider.io integration.**

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

</div>

## 🌟 Overview

Mythic+ Team Builder is a sophisticated web application designed for World of Warcraft players seeking to form consistent, high-performing Mythic+ dungeon teams. Using advanced AI-powered matchmaking algorithms and real-time Raider.io integration, the platform connects players based on skill level, schedule compatibility, role requirements, and team chemistry.

### 🎯 Key Highlights

- **🤖 Advanced AI Matchmaking** - Proprietary algorithms analyze 5+ compatibility factors
- **🔗 Real-time Raider.io Sync** - Live character data, scores, and performance metrics
- **👥 Comprehensive Team Management** - Role-based permissions and application workflows
- **📊 Interactive Leaderboards** - Track team performance and individual achievements
- **🌐 Multi-Platform OAuth** - Discord and Battle.net authentication
- **⚡ Real-time Updates** - Live notifications and team status changes

---

## 🚀 Features

### 🧠 AI-Powered Matchmaking System
Our sophisticated matchmaking algorithm evaluates multiple compatibility factors with weighted scoring:

- **Role Compatibility (30%)** - Perfect team composition matching
- **Mythic+ Score (25%)** - Skill-based pairing with performance analysis
- **Experience Level (20%)** - Balanced progression from beginner to expert
- **Schedule Overlap (15%)** - Smart timezone and availability coordination
- **Item Level (10%)** - Gear requirement validation

### 🎮 Raider.io Deep Integration
- **Automatic Character Sync** - Real-time data updates from Raider.io API
- **Multi-Season Tracking** - Historical performance and current season data
- **Role-Specific Scores** - Tank, Healer, and DPS specialization tracking
- **Recent Runs Analysis** - Performance trends and completion history
- **Achievement Validation** - Comprehensive character verification

### 👥 Advanced Team Management
- **Role-Based Hierarchy** - Leader, Officer, and Member permissions
- **Smart Recruitment System** - Automated application processing
- **Dynamic Requirements** - Flexible team criteria and filters
- **Schedule Coordination** - Multi-timezone availability matching
- **Progress Tracking** - Team achievement and goal monitoring

### 📈 Comprehensive Analytics
- **Team Activity Leaderboards** - Most active and successful teams
- **Key Completion Tracking** - Performance analytics and completion rates
- **Player Rankings** - Individual skill and contribution metrics
- **Performance Insights** - Detailed statistics and improvement suggestions

---

## 🛠 Technology Stack

### Frontend Architecture
- **⚛️ React 18** - Modern hooks and functional components
- **🎨 Tailwind CSS** - Utility-first responsive design
- **✨ Framer Motion** - Fluid animations and micro-interactions
- **🔄 React Query** - Intelligent data fetching and caching
- **🧭 React Router** - Client-side routing with protected routes
- **📋 React Hook Form** - Optimized form management
- **🌐 Axios** - HTTP client with interceptors

### Backend Infrastructure
- **🟢 Node.js & Express** - High-performance API server
- **🛡 Passport.js** - Secure OAuth authentication (Discord & Battle.net)
- **🗄 Supabase PostgreSQL** - Real-time database with Row Level Security
- **✅ Joi** - Comprehensive request validation
- **🔒 Helmet** - Security middleware suite
- **⏱ Express Rate Limiting** - API protection and throttling
- **📅 Node-Cron** - Scheduled data synchronization

### Database Design
- **🐘 PostgreSQL** - Robust relational database via Supabase
- **🔐 Row Level Security** - User-based data protection
- **⚡ Real-time Subscriptions** - Live data updates
- **🔍 Full-text Search** - Advanced search capabilities
- **📊 JSONB Fields** - Flexible data structures for complex requirements

---

## 🏗 Project Architecture

```
mythic-plus-team-builder/
├── 📁 client/                     # React Frontend Application
│   ├── 📁 public/                 # Static assets and manifest
│   ├── 📁 src/
│   │   ├── 📁 components/         # Reusable UI components
│   │   │   ├── Navbar.js          # Navigation with authentication state
│   │   │   ├── LoadingSpinner.js  # Loading indicators
│   │   │   └── ProtectedRoute.js  # Route protection wrapper
│   │   ├── 📁 contexts/           # React contexts for state management
│   │   │   └── AuthContext.js     # Authentication state management
│   │   ├── 📁 pages/              # Application pages and views
│   │   │   ├── Landing.js         # Marketing landing page
│   │   │   ├── Login.js           # OAuth authentication
│   │   │   ├── Dashboard.js       # User dashboard with overview
│   │   │   ├── Teams.js           # Team browsing and search
│   │   │   ├── TeamDetail.js      # Detailed team view and management
│   │   │   ├── Matchmaking.js     # AI-powered team recommendations
│   │   │   ├── Leaderboard.js     # Performance rankings
│   │   │   └── Profile.js         # User profile and character management
│   │   ├── 📁 assets/             # Images, fonts, and static resources
│   │   ├── App.js                 # Main application component
│   │   ├── index.js               # Application entry point
│   │   └── index.css              # Global styles and Tailwind base
│   ├── tailwind.config.js         # Tailwind CSS configuration
│   ├── postcss.config.js          # PostCSS configuration
│   └── package.json               # Frontend dependencies
├── 📁 server/                     # Express Backend API
│   ├── 📁 config/                 # Configuration files
│   │   ├── passport.js            # OAuth strategy configuration
│   │   └── supabase.js            # Database connection and settings
│   ├── 📁 routes/                 # API route handlers
│   │   ├── auth.js                # Authentication endpoints
│   │   ├── users.js               # User profile management
│   │   ├── teams.js               # Team CRUD operations
│   │   ├── matchmaking.js         # AI matchmaking algorithms
│   │   ├── raiderio.js            # Raider.io API integration
│   │   └── leaderboard.js         # Rankings and statistics
│   ├── server.js                  # Main server configuration
│   └── package.json               # Backend dependencies
├── 📁 database/                   # Database schema and migrations
│   └── schema.sql                 # Complete PostgreSQL schema
├── .gitignore                     # Git ignore rules
├── package.json                   # Root project configuration
└── README.md                      # This file
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js 16+** and npm
- **Supabase Account** and project setup
- **Discord Developer Application** for OAuth
- **Battle.net Developer Account** for OAuth (optional)

### 🔧 Installation

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd mythic-plus-team-builder
   npm run install-all
   ```

2. **Environment Configuration**
   
   Create `server/.env`:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000

   # Database (Supabase)
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Discord OAuth
   DISCORD_CLIENT_ID=your_discord_client_id
   DISCORD_CLIENT_SECRET=your_discord_client_secret

   # Battle.net OAuth (Optional)
   BNET_CLIENT_ID=your_bnet_client_id
   BNET_CLIENT_SECRET=your_bnet_client_secret

   # Security
   SESSION_SECRET=your_random_session_secret_here
   JWT_SECRET=your_random_jwt_secret_here

   # External APIs
   RAIDERIO_BASE_URL=https://raider.io/api/v1
   ```

3. **Database Setup**
   - Import `database/schema.sql` into your Supabase SQL editor
   - This creates all tables, indexes, RLS policies, and functions

4. **OAuth Application Setup**

   **Discord Application:**
   - Visit https://discord.com/developers/applications
   - Create new application → OAuth2 → Add redirect URI:
     ```
     http://localhost:5000/api/auth/discord/callback
     ```

   **Battle.net Application:**
   - Visit https://develop.battle.net/
   - Create new client → Add redirect URI:
     ```
     http://localhost:5000/api/auth/bnet/callback
     ```

5. **Start Development**
   ```bash
   npm run dev
   ```
   
   Launches concurrent servers:
   - **Frontend**: http://localhost:3000
   - **Backend**: http://localhost:5000

---

## 🌐 API Reference

### Authentication Endpoints
- `GET /api/auth/discord` - Initiate Discord OAuth flow
- `GET /api/auth/bnet` - Initiate Battle.net OAuth flow
- `GET /api/auth/user` - Get current authenticated user
- `POST /api/auth/logout` - Logout and clear session

### Team Management
- `GET /api/teams` - List teams with filtering and pagination
- `GET /api/teams/:id` - Get detailed team information
- `POST /api/teams` - Create new team
- `PUT /api/teams/:id` - Update team settings (leader only)
- `POST /api/teams/:id/apply` - Apply to join team
- `PATCH /api/teams/:teamId/applications/:appId` - Manage applications

### User & Character Management
- `GET /api/users/profile` - Get complete user profile
- `PUT /api/users/profile` - Update user preferences and settings
- `GET /api/users/characters` - List user's characters
- `POST /api/users/characters` - Add or update character

### AI Matchmaking
- `GET /api/matchmaking/recommendations` - Get personalized team recommendations
- `POST /api/matchmaking/auto-match` - Find automatic matches for character
- `GET /api/matchmaking/teams/:id/player-recommendations` - Get player suggestions for team

### Raider.io Integration
- `GET /api/raiderio/character/search` - Search for character by name/realm
- `GET /api/raiderio/character/:region/:realm/:name` - Get detailed character data
- `POST /api/raiderio/character/:id/sync` - Synchronize character with latest data

### Leaderboards & Statistics
- `GET /api/leaderboard/teams/activity` - Most active teams
- `GET /api/leaderboard/teams/keys` - Top key completion teams
- `GET /api/leaderboard/players` - Individual player rankings
- `POST /api/leaderboard/keys` - Record key completion

---

## 🧠 AI Matchmaking Deep Dive

### Algorithm Architecture
The matchmaking system uses a sophisticated scoring algorithm that evaluates team-player compatibility across multiple dimensions:

```javascript
// Core compatibility calculation
const calculateCompatibilityScore = (player, team, character) => {
  let totalScore = 0;
  
  // Role Compatibility (30% weight)
  if (team.needed_roles.includes(character.role)) {
    totalScore += 30;
  }
  
  // Mythic+ Score Analysis (25% weight)
  const scoreRatio = character.mythic_plus_score / team.requirements.min_score;
  totalScore += Math.min(25 * scoreRatio, 25);
  
  // Experience Level Matching (20% weight)
  const experienceCompatibility = calculateExperienceMatch(
    player.experience_level, 
    team.requirements.experience_level
  );
  totalScore += experienceCompatibility * 20;
  
  // Schedule Overlap (15% weight)
  const scheduleMatch = calculateScheduleOverlap(
    player.available_times, 
    team.schedule
  );
  totalScore += scheduleMatch * 15;
  
  // Item Level Requirements (10% weight)
  if (character.item_level >= team.requirements.min_item_level) {
    totalScore += 10;
  }
  
  return totalScore;
};
```

### Performance Optimization
- **Caching Layer**: 15-minute TTL for Raider.io API responses
- **Database Indexing**: Optimized queries for character and team searches
- **Batch Processing**: Efficient bulk compatibility calculations
- **Rate Limiting**: API protection with 100 requests/15 minutes per IP

---

## 🎨 UI/UX Design Philosophy

### Design System
- **Color Palette**: WoW-inspired obsidian and gold theme
- **Typography**: Custom font stack with "WoW" branded headings
- **Animations**: Subtle Framer Motion transitions for premium feel
- **Responsiveness**: Mobile-first design with desktop enhancements

### Component Architecture
- **Modular Components**: Reusable UI elements with consistent styling
- **Loading States**: Comprehensive loading indicators and skeletons
- **Error Handling**: User-friendly error messages and retry mechanisms
- **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation

---

## 🚀 Deployment

### Production Environment Setup

1. **Environment Variables**
   ```env
   NODE_ENV=production
   CLIENT_URL=https://your-domain.com
   # Update all URLs and secrets for production
   ```

2. **Build Process**
   ```bash
   # Build optimized React bundle
   npm run build
   
   # Start production server
   npm start
   ```

3. **Recommended Hosting**
   - **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
   - **Backend**: Railway, Heroku, or AWS ECS
   - **Database**: Supabase (managed PostgreSQL)

### Performance Optimizations
- **React Bundle Splitting**: Automatic code splitting by route
- **Image Optimization**: WebP format with fallbacks
- **CDN Integration**: Static asset delivery via CDN
- **Database Connection Pooling**: Optimized connection management

---

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run client           # Start React development server
npm run server           # Start Express server with nodemon

# Installation
npm run install-all      # Install all dependencies (root, client, server)

# Production
npm run build           # Build optimized React bundle
npm start              # Start production server
```

### Code Quality Tools
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit validation
- **React Query DevTools**: Development debugging

### Testing Strategy
- **Frontend**: React Testing Library + Jest
- **Backend**: Supertest + Jest
- **E2E**: Cypress (recommended for future implementation)

---

## 🤝 Contributing

We welcome contributions from the WoW community! Here's how to get involved:

### Development Process
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Contribution Guidelines
- Follow existing code style and conventions
- Write comprehensive tests for new features
- Update documentation for API changes
- Ensure mobile responsiveness for UI changes

### Areas for Contribution
- 🌐 Internationalization (i18n)
- 📱 Mobile app development
- 🔧 Additional Raider.io features
- 📊 Advanced analytics and reporting
- 🤖 Machine learning model improvements

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Raider.io** - For providing comprehensive Mythic+ data API
- **Blizzard Entertainment** - For World of Warcraft and Battle.net API
- **Discord** - For community integration and OAuth services
- **Supabase** - For excellent database and real-time infrastructure
- **WoW Community** - For feedback and feature suggestions

---

## 📞 Support & Community

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Discord**: [Community Server](https://discord.gg/your-invite)

---

<div align="center">

**Built with ❤️ for the World of Warcraft Mythic+ community**

[⭐ Star this repo](https://github.com/your-repo) • [🐛 Report Bug](https://github.com/your-repo/issues) • [✨ Request Feature](https://github.com/your-repo/issues)

</div> 