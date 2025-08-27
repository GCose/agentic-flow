
# Agentic Flow Service

## Setup

1. Install dependencies:
	```sh
	yarn install
	```
2. Set up environment variables in `.env` and `.env.local` (see example below):
	```env
	DATABASE_URL="file:./prisma/dev.db"
	NEXTAUTH_SECRET=your_secret
	```
3. Run database migrations:
	```sh
	yarn prisma migrate dev
	```
4. Seed the database:
	```sh
	yarn prisma:seed
	```
5. Start the development server:
	```sh
	yarn dev
	```

## Architecture Overview

- **Next.js** frontend and API routes
- **Prisma** ORM with SQLite
- **Centralized API calls** in `/lib/clients.ts`
- **Role-based user management** (admin, client, designer, videographer)
- **Password hashing** with bcrypt
- **Batch client+system fetching** for performance
- **Accessible UI** with feedback and keyboard navigation
- **Basic API tests** in `__tests__`

## Testing

Install test dependencies:
```sh
yarn add --dev jest node-mocks-http
```
Run tests:
```sh
yarn test
```

## Contribution

Please follow code style and add tests for new features. Document any new environment variables or setup steps in this README.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
