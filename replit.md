# Website Audit Tool

## Overview

A professional website auditing application that generates comprehensive business and website analysis reports. The tool scrapes websites, analyzes their content, structure, and effectiveness, then uses AI (OpenAI GPT-5) to generate detailed audit reports with scoring across 8 dimensions, actionable recommendations, and growth opportunities. Built as a full-stack TypeScript application with React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing
- Single-page application architecture with component-based UI

**UI Component System**
- Shadcn/ui component library based on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design system
- Material Design principles with custom data visualization elements
- Design guidelines emphasize clarity for professional audit reports that need to impress clients

**State Management**
- TanStack Query (React Query) for server state management, caching, and API interactions
- React Hook Form with Zod resolvers for form validation
- Local component state with React hooks

**Design System**
- Custom color palette with CSS variables for theming support (light/dark modes)
- Typography system using Inter/DM Sans for headings, system fonts for body, JetBrains Mono for technical content
- Consistent spacing primitives (4px increments)
- Responsive layout system with defined container widths (form: max-w-2xl, reports: max-w-5xl)

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for API routing and middleware
- HTTP server (Node.js native createServer)
- Development mode uses Vite middleware for HMR integration
- Production mode serves static files from dist/public

**API Structure**
- RESTful API design with `/api/*` prefix
- Primary endpoint: POST `/api/audit` - accepts URL, returns comprehensive audit report
- Request/response validation using Zod schemas
- JSON-based communication

**Web Scraping & Analysis**
- Axios for HTTP requests to target websites
- Cheerio for HTML parsing and content extraction
- Extracts: meta tags, headings, navigation, CTAs, contact info, social links, structural elements
- Validates HTTPS, counts images, detects forms/chat widgets

**AI Integration**
- OpenAI API (GPT-5 model) for generating audit insights
- Lazy initialization pattern - client only created when needed to avoid startup errors
- Processes scraped content to generate: company profile, business model analysis, value propositions, competitive positioning, detailed scoring across 8 dimensions, prioritized recommendations, issue identification, and growth opportunities

**Build Process**
- Custom build script using esbuild for server bundling
- Allowlist approach for dependencies to bundle (reduces syscalls, improves cold starts)
- Separate client (Vite) and server (esbuild) builds
- Production bundle outputs to dist/ directory

### Data Storage Solutions

**Current Implementation**
- In-memory storage using Map-based storage class (MemStorage)
- User storage interface defined (IStorage) for future database integration
- No persistent storage of audit reports currently - reports generated on-demand

**Database Schema Definition**
- Drizzle ORM configured for PostgreSQL with schema definitions
- Users table defined with id, username, password fields
- Database configuration present (drizzle.config.ts) but not actively used in current implementation
- Schema ready for migration when database is provisioned

**Future Database Integration**
- Drizzle ORM ready for PostgreSQL connection via @neondatabase/serverless
- Migration files configured to output to ./migrations
- Connection via DATABASE_URL environment variable

### Authentication & Authorization

**Current State**
- User schema defined with username/password authentication model
- Authentication infrastructure present but not actively enforced on audit endpoint
- Storage interface supports user CRUD operations
- No session management or JWT implementation currently active

### External Dependencies

**Third-Party Services**
- **OpenAI API**: Core dependency for AI-powered audit generation (GPT-5 model)
  - Requires OPENAI_API_KEY environment variable
  - Generates all analytical content, scoring, and recommendations
  - Lazy initialization prevents startup failures when unconfigured

**UI Component Libraries**
- **Radix UI**: Accessible, unstyled component primitives for all interactive elements
- **Shadcn/ui**: Pre-built component system built on Radix with Tailwind styling
- Includes 40+ components: dialogs, dropdowns, forms, navigation, data display, feedback

**Development Tools**
- **Replit-specific plugins**: Cartographer for navigation, dev banner, runtime error overlay
- **ESBuild**: Fast JavaScript bundler for server-side code
- **PostCSS & Autoprefixer**: CSS processing pipeline

**Data Fetching & Forms**
- **Axios**: Promise-based HTTP client for external website requests
- **Cheerio**: Fast HTML parser for server-side web scraping
- **React Hook Form**: Performant form validation with minimal re-renders
- **Zod**: TypeScript-first schema validation for forms and API contracts

**Utilities**
- **class-variance-authority**: Type-safe CSS variant management
- **clsx & tailwind-merge**: Class name manipulation and merging
- **date-fns**: Modern date utility library
- **nanoid**: Unique ID generation

**Database (Ready but Unused)**
- **Drizzle ORM**: Type-safe ORM for database operations
- **@neondatabase/serverless**: PostgreSQL driver for serverless environments
- **connect-pg-simple**: PostgreSQL session store (configured but unused)