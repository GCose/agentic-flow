# Migration Plan: Add systems to Client model

1. Update Prisma schema to add a `systems` field to the `User` model (for clients).
2. Migrate the database.
3. Update API routes to support reading and updating `systems`.
4. Update admin UI to allow updating client systems.

---

## Prisma Schema Update

Add to `User` model:
```
systems String[] @default([])
```

## Migration Command
```
npx prisma migrate dev --name add-client-systems
```

## API Changes
- GET/POST/PUT for `/api/clients` and `/api/clients/[id]` should handle `systems`.

## UI Changes
- Allow admin to update client systems from the dashboard.
