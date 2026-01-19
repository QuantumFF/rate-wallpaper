# Tech Context

## Tech Stack

- **Backend:**
  - Language: Python 3.x
  - Framework: FastAPI
  - Database: SQLite (via SQLAlchemy)
  - Ranking: TrueSkill (Python library)
  - Environment: `venv`
- **Frontend:**
  - Framework: React 19
  - Build Tool: Vite
  - UI Library: shadcn/ui (Tailwind CSS)
  - Icons: Lucide React
  - Package Manager: Bun (as requested)

## Development Setup

- **Backend:**
  - Run: `./run_backend.sh` (or `python -m backend.run`)
  - Dependencies: `backend/requirements.txt`
  - Note: `backend/__init__.py` exists to support module execution.
- **Frontend:**
  - Run: `bun run dev`
  - Build: `bun run build`
  - Lint: `bun run lint`

## Constraints

- **Localhost:** All API calls to `http://localhost:8000`.
- **File Access:** Backend needs read/write access to the wallpaper directory.
- **State:** Frontend state is transient (except for what's fetched from DB).

## Code Quality

- **Linter:** ESLint with `react-refresh` plugin.
  - Note: `react-refresh/only-export-components` rule is disabled in files exporting non-components (types, variants) alongside components (`AppContext.tsx`, UI components).
