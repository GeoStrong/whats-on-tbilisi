# What'sOnTbilisi

A modern event discovery and social platform for Tbilisi, Georgia. Discover, create, and participate in local activities and events.

## Features

- **Event Discovery**: Browse activities by category, location, and date
- **Interactive Map**: View events on an interactive Google Map
- **User Profiles**: Create profiles, follow users, and track your activities
- **Activity Management**: Create, edit, and manage your own activities
- **Social Features**: Follow users, comment on activities, and participate in events
- **Real-time Updates**: Get real-time notifications and updates
- **Dark Mode**: Beautiful dark mode support

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: Redux Toolkit
- **Database**: Supabase (PostgreSQL)
- **Storage**: Cloudflare R2
- **Maps**: Google Maps API
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Cloudflare R2 account (for image storage)
- Google Maps API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/whatson-tbilisi.git
cd whatson-tbilisi
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Fill in your environment variables in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `GOOGLE_MAPS_API_KEY` - Your Google Maps API key (required for map functionality)
- `R2_ENDPOINT` - Your Cloudflare R2 endpoint
- `R2_ACCESS_KEY_ID` - Your R2 access key ID
- `R2_SECRET_ACCESS_KEY` - Your R2 secret access key
- `R2_BUCKET_NAME` - Your R2 bucket name

4. Run database migrations:

   - Set up your Supabase database schema
   - Run the indexes from `lib/db/indexes.sql` in your Supabase SQL editor

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run test:e2e` - Run E2E tests with Playwright

## Project Structure

```
whatson-tbilisi/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── activities/        # Activity pages
│   ├── create-activity/   # Activity creation
│   ├── discover/          # Discovery/search
│   ├── map/               # Map view
│   └── profile/           # User profile
├── components/            # React components
│   ├── activities/        # Activity components
│   ├── auth/              # Authentication components
│   ├── ui/                # Reusable UI components
│   └── ...
├── lib/                   # Core utilities
│   ├── auth/              # Authentication functions
│   ├── functions/         # Helper functions
│   ├── hooks/             # Custom React hooks
│   ├── middleware/        # API middleware
│   ├── store/             # Redux store
│   ├── supabase/          # Supabase configuration
│   └── utils/             # Utility functions
├── public/                # Static assets
└── tests/                 # Test files
```

## Environment Variables

See `.env.example` for all required environment variables.

## Database Schema

The application uses Supabase (PostgreSQL). Key tables:

- `users` - User profiles
- `activities` - Events/activities
- `activity_categories` - Activity categorization
- `followers` - User follow relationships
- `activity_participants` - Event participation
- `activity_comments` - Comments on activities
- `saved_activities` - Bookmarked activities

## Documentation

### Production & Deployment

- [Production Launch Guide](docs/LAUNCH.md) - Complete launch strategy and checklist
- [Production Readiness Checklist](docs/PRODUCTION_CHECKLIST.md) - Pre-launch verification
- [Supabase RLS Policies](docs/supabase-rls-policies.sql) - Database security policies
- [API Reference](docs/API.md) - API endpoint documentation

### Legal & Compliance

- [Privacy Policy](/privacy) - Data collection and privacy rights
- [Terms of Service](/terms) - Acceptable use and liability

## API Documentation

See [docs/API.md](docs/API.md) for detailed API documentation.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## Testing

The project includes:

- Unit tests (Jest + React Testing Library)
- E2E tests (Playwright)
- Component tests

Run all tests:

```bash
npm test
npm run test:e2e
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- Self-hosted with Node.js

## Security

- All API routes are protected with authentication
- Environment variables are validated at startup
- File uploads are validated for type and size
- Input sanitization is implemented

## Performance

- Image optimization with Next.js Image component
- Database query optimization with indexes
- Pagination for large datasets
- Lazy loading and code splitting

## License

[Add your license here]

## Support

For issues and questions, please open an issue on GitHub.

## Acknowledgments

- Built with Next.js
- Powered by Supabase
- Styled with Tailwind CSS
