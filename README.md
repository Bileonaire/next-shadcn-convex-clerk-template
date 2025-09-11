This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- **Authentication**: Powered by [Clerk](https://clerk.com) for secure user management
- **Database**: [Convex](https://convex.dev) for real-time data synchronization
- **UI Components**: Built with [Radix UI](https://www.radix-ui.com) and [Tailwind CSS](https://tailwindcss.com)
- **Theme Support**: Dark/light mode with [next-themes](https://github.com/pacocoursey/next-themes)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+
- npm, yarn, pnpm, or bun

## Environment Setup

1. **Copy the environment template:**
   ```bash
   cp env.example .env.local
   ```

2. **Set up Convex:**
   - Create a new project at [convex.dev](https://convex.dev)
   - Copy your deployment URL to `NEXT_PUBLIC_CONVEX_URL`

3. **Set up Clerk:**
   - Create a new application at [clerk.com](https://clerk.com)
   - Copy your publishable key to `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Copy your secret key to `CLERK_SECRET_KEY`

4. **Fill in your environment variables:**
   - Open `.env.local` and replace all placeholder values with your actual credentials

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then, run the development server:

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

### Environment Variables for Production

When deploying to production, make sure to set the following environment variables in your deployment platform:

**Required:**
- `NEXT_PUBLIC_CONVEX_URL` - Your Convex deployment URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key
- `CLERK_SECRET_KEY` - Your Clerk secret key

**Optional:**
- `NODE_ENV` - Set to `production` for production builds

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Other Deployment Platforms

This app can also be deployed on:
- [Netlify](https://netlify.com)
- [Railway](https://railway.app)
- [Render](https://render.com)
- [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)

Make sure to set all required environment variables in your chosen platform.
