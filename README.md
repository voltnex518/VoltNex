# VoltNex Labs — Open-Source Hardware & Robotics Platform

> **Power Ideas. Build the Future.**  
> Creator: **Pradeep** • Instagram: [@pradeep_ln22](https://instagram.com/pradeep_ln22) • Email: [voltnex518@gmail.com](mailto:voltnex518@gmail.com)

VoltNex Labs is an open-access electronics, embedded systems, and robotics platform. Builders and makers discover verified schematics, Bill of Materials, wiring pinouts, step-by-step assembly guides, and production-grade firmware (.ino, .c, .cpp, .py). It includes a secure owner dashboard for content management with zero manual code editing required for new project publications.

---

## Architecture Overview

```
                      ┌────────────────────────────────────────┐
                      │             VoltNex Labs               │
                      │  React 19 + TypeScript + Vite + Tailwind│
                      └──────────────────┬─────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
      ┌──────────▼──────────┐                         ┌──────────▼──────────┐
      │    Public Portal    │                         │   Owner Dashboard   │
      │  - Home & Hero      │                         │  - Metric Counters  │
      │  - Projects Library │                         │  - Blueprint CRUD   │
      │  - Project Details  │                         │  - Tutorial Editor  │
      │  - BOM Checklists   │                         │  - Storage Manager  │
      │  - Circuit Zoomer   │                         │  - Taxonomy Engine  │
      │  - Syntax Highliter │                         │  - Global Settings  │
      │  - Resources Vault  │                         │  - Inquiry Inbox    │
      └──────────┬──────────┘                         └──────────┬──────────┘
                 │                                               │
                 └───────────────────────┬───────────────────────┘
                                         │
                      ┌──────────────────▼─────────────────────┐
                      │         Supabase Cloud Backend         │
                      │  - PostgreSQL 15+ (UUIDs, RLS, Indexes)│
                      │  - GoTrue Auth (Owner Authentication)  │
                      │  - Storage (Media & Firmware Buckets)  │
                      │  - Row Level Security (Zero Exposure)  │
                      └────────────────────────────────────────┘
```

---

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, React Router v7
- **Icons & Animations**: Lucide React, Framer Motion
- **Syntax Highlighting**: PrismJS (C, C++, Arduino INO, Python, Bash, JSON)
- **Backend & Database**: Supabase PostgreSQL, Supabase Auth, Supabase Storage
- **Security**: PostgreSQL Row Level Security (RLS) on all exposed tables and buckets
- **Testing**: Vitest, React Testing Library, @testing-library/jest-dom, jsdom

---

## Directory Structure

```
VoltNex/
├── .env.example                     # Environment variables template (placeholders only)
├── .gitignore                       # Strict exclusion of .env and credentials
├── index.html                       # HTML5 entry with Space Grotesk & Inter typography
├── package.json                     # Dependencies, scripts (dev, build, test, lint)
├── postcss.config.js                # PostCSS with Tailwind & Autoprefixer
├── tailwind.config.js               # VoltNex ice-blue & electric blue design tokens
├── tsconfig.app.json                # Strict TypeScript configuration
├── vitest.config.ts                 # Vitest test runner configuration
├── supabase/
│   └── migrations/
│       ├── 20261021000001_initial_schema.sql    # Relational schema (tables, constraints, indexes)
│       ├── 20261021000002_rls_policies.sql      # Database authorization & draft protection
│       ├── 20261021000003_storage_buckets.sql   # Storage buckets & policies
│       └── 20261021000004_seed_data.sql         # Production blueprints & sample hardware data
├── src/
│   ├── main.tsx                     # React application root
│   ├── App.tsx                      # Master routing & provider orchestration
│   ├── index.css                    # Tailwind base, engineering grid, syntax themes
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces for projects, BOM, tutorials
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client with offline demo detection
│   │   ├── storage.ts               # File upload helper, MIME & 10MB/50MB size validation
│   │   └── prism.ts                 # Safe syntax highlighter
│   ├── context/
│   │   ├── AuthContext.tsx          # Supabase Auth, session lifecycle, role verification
│   │   └── DataContext.tsx          # Dual-mode data access (Supabase live + localStorage demo)
│   ├── components/
│   │   ├── common/                  # Navbar, Footer, Modal, Toast, Button, Badge, CodeBlock, CircuitViewer
│   │   ├── projects/                # ProjectCard, BOMTable, ProjectFilters
│   │   └── admin/                   # AdminLayout, ProtectedRoute
│   ├── pages/
│   │   ├── public/                  # HomePage, ProjectsPage, ProjectDetailPage, TutorialsPage, etc.
│   │   └── admin/                   # AdminLoginPage, AdminOverviewPage, AdminProjectEditorPage, etc.
│   └── test/                        # Vitest automated test suites
```

---

## Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (v20+ or v24+ recommended)
- **npm**: v9.0.0 or later
- **Git**

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/voltnex/voltnex-platform.git
cd voltnex-platform
npm install
```

### 3. Environment Variables Configuration
Copy the sample environment file to create your local `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
# Supabase Project URL (found in Supabase Dashboard > Settings > API)
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# Supabase Anonymous Public Key (found in Supabase Dashboard > Settings > API)
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Fallback Demo Mode (Set to false once Supabase is connected)
VITE_ENABLE_DEMO_DATA=true
```

> **Note**: If `VITE_SUPABASE_URL` contains placeholder text or is unconfigured, VoltNex Labs automatically boots in **Local Offline Demo Mode**. All features (including project creation, edits, file uploads, and admin authentication) are fully functional out of the box using persistent local stores.

---

## Supabase Database Setup & Migrations

To connect your own Supabase project:

1. Create a free account at [supabase.com](https://supabase.com) and create a new project.
2. In the Supabase Dashboard, navigate to the **SQL Editor**.
3. Execute the migration scripts in sequential order:
   - **Step 1**: Run `supabase/migrations/20261021000001_initial_schema.sql` (Creates tables, primary keys, foreign keys, and indexes).
   - **Step 2**: Run `supabase/migrations/20261021000002_rls_policies.sql` (Enables Row Level Security and creates role-verification functions).
   - **Step 3**: Run `supabase/migrations/20261021000003_storage_buckets.sql` (Sets up `project-media` and `project-downloads` storage buckets).
   - **Step 4**: Run `supabase/migrations/20261021000004_seed_data.sql` (Seeds high-quality sample electronics blueprints, tutorials, and pinouts).

---

## Secure Owner Provisioning

The owner email is: `voltnex518@gmail.com`.

For security, the application **does not** provide a public administrator registration route. To provision the owner:

### Method A: Via Supabase Auth Dashboard (Recommended)
1. In your Supabase Dashboard, go to **Authentication > Users**.
2. Click **Add user > Create user**.
3. Enter `voltnex518@gmail.com` and generate a strong password.
4. The database trigger `on_auth_user_created` will automatically create a record in `public.profiles` and assign the `admin` role.

### Method B: SQL Promotion Trigger
If a user is already registered under this email, promote them to admin via the SQL Editor:
```sql
SELECT public.set_user_admin('voltnex518@gmail.com');
```

---

## Storage Buckets & Policies

VoltNex manages two dedicated storage buckets:

| Bucket Name | Purpose | Max Size | Allowed MIME Types | Access Rules |
| :--- | :--- | :--- | :--- | :--- |
| `project-media` | Schematics, pinouts, step images | 10 MB | `image/png`, `image/jpeg`, `image/webp`, `image/svg+xml`, `image/gif` | Public Read; Admin Write/Delete |
| `project-downloads` | Code (.ino, .cpp), CAD (.zip), PDFs | 50 MB | `application/zip`, `application/pdf`, `text/plain`, `text/x-c++`, `text/x-python` | Public Read; Admin Write/Delete |

Security rules enforced by `storage.ts`:
- Rejects executable extensions (`.exe`, `.bat`, `.cmd`, `.sh`, `.php`, `.js`).
- Strips directory traversal attempts (`..`, `/`, `\`).
- Names files with unique timestamps and cryptographic random entropy.

---

## Development Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server with Hot Module Replacement (HMR) at `http://localhost:5173` |
| `npm run build` | Compiles strict TypeScript and builds the production bundle into `/dist` |
| `npm run test` | Executes the Vitest unit & integration test suite |
| `npm run lint` | Runs the Oxlint linter for code health checks |
| `npm run preview` | Runs a local server to preview the production build in `/dist` |

---

## Automated Test Suite

VoltNex includes 18 automated tests covering:
- **File Upload Security** (`src/test/storage.test.ts`): Extension whitelisting, executable blocking, 10MB/50MB size validation, filename path traversal sanitization.
- **Project Search & Filtering** (`src/test/projects.test.ts`): Search across title and BOM parts, difficulty filtering, sorting logic, and strict draft isolation from public visitors.
- **Component Behaviors** (`src/test/components.test.tsx`): CodeBlock syntax highlighting, copy-to-clipboard, BOM checklist progress bar, status badges, and empty states.
- **Route Rendering & Form Validation** (`src/test/routes.test.tsx`): Public page rendering, 404 page routing, and contact form validation for empty or malformed fields.

Run tests at any time with:
```bash
npm run test
```

---

## Production Deployment

### Option A: Vercel / Netlify
1. Connect your GitHub repository to Vercel or Netlify.
2. Set build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Configure Environment Variables in the hosting dashboard:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase Anon Key
   - `VITE_ENABLE_DEMO_DATA` = `false`
4. Add SPA Rewrite Rules:
   - For Netlify: ensure a `public/_redirects` file contains `/* /index.html 200`.
   - For Vercel: ensure a `vercel.json` rewrites `source: "/(.*)"` to `destination: "/"`.

---

## Free-Tier Considerations & Backups

- **Supabase Free Tier**: Provides 500MB database storage, 1GB file storage, and 50,000 monthly active users.
- **Inactivity Pausing**: Supabase projects on the free tier may pause after 7 consecutive days of inactivity. Ensure you visit or configure a simple uptime ping to keep the project warm.
- **Database Backups**:
  - Export regular SQL dumps via the Supabase CLI: `supabase db dump -f voltnex_backup.sql`.
  - Automated daily backups are available on the Supabase Pro tier.

---

## License

Source code for the platform is released under the **MIT License**. Hardware blueprints, schematics, and firmware files published on the site are open-source and free for educational use.
