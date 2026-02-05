# State Management Architecture

## Stack

- **Zustand** - for local/UI state
- **Tanstack Query (React Query)** - for server state (API data)

## Structure

```
src/
├── stores/              # Zustand stores
│   └── authStore.ts     # Selected profile ID (global)
├── api/                 # API functions (plain fetch)
│   └── profiles.ts      # fetchProfiles, createProfile, deleteProfile
├── hooks/                   # React Query hooks (for production)
│   ├── useProfiles.ts       # useProfiles, useCreateProfile, useDeleteProfile
│   └── useProfilesMock.ts   # Mock hooks (currently used)
├── types/               # TypeScript types
│   └── profile.ts       # Profile, ProfileRole
└── providers/           # Context providers
    └── QueryProvider.tsx # React Query provider
```

## Current Setup

### Mock Data (Development)

Currently using `useProfilesMock.ts` which returns mock data without API calls.

**Component usage:**

```typescript
import { useProfiles, useDeleteProfile } from '../../hooks/useProfilesMock';
```

### Switch to Real API

When ready to connect to backend, change import in component:

```typescript
// Change from:
import { useProfiles, useDeleteProfile } from '../../hooks/useProfilesMock';

// To:
import { useProfiles, useDeleteProfile } from '../../hooks/useProfiles';
```

## State Management

### Zustand (authStore)

Global state for:

- `selectedProfileId` - currently selected profile (persists across app)

### React Query (when connected)

Server data:

- Profiles from backend
- Appointments, ratings, comments
- Auto-caching, refetching, invalidation

## Usage Examples

### Zustand

```typescript
const selectedProfileId = useAuthStore((state) => state.selectedProfileId);
const setSelectedProfileId = useAuthStore(
  (state) => state.setSelectedProfileId
);

setSelectedProfileId('profile-123');
```

### Mock Hooks (Current)

```typescript
const { data: profiles, isLoading, error } = useProfiles();
// Returns mock data immediately, isLoading: false

const deleteMutation = useDeleteProfile();
deleteMutation.mutate(profileId);
// Logs to console, no real delete
```

### Real API (Future)

Same interface, different behavior:

```typescript
const { data: profiles, isLoading, error } = useProfiles();
// Fetches from backend, isLoading: true during fetch

const deleteMutation = useDeleteProfile();
deleteMutation.mutate(profileId);
// Calls API, auto-refetches profiles on success
```

## Configuration

// TODO:

- API base URL: set `VITE_API_URL` env variable (defaults to localhost:3000)
- Query defaults: see `src/providers/QueryProvider.tsx`

## Migration Path

1. Keep using mock hooks during development
2. When backend is ready, switch import from `useProfilesMock` to `useProfiles`
3. Component code stays the same - only import changes
