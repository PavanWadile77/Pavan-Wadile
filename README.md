# Pavan Kishor Wadile - Personal Portfolio

A complete, production-ready personal branding website built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, Framer Motion, and Firebase.

## Features
- **Next.js 15 App Router**: Modern and fast architecture.
- **Premium UI**: Glassmorphism, smooth animations, and a responsive design using Shadcn UI.
- **Dark/Light Mode**: Full theme support.
- **PWA Ready**: Offline capabilities and installable.
- **SEO Optimized**: Dynamic metadata, sitemap, robots.txt, and structured data.
- **Admin Dashboard**: Manage projects, blogs, and settings (powered by Firebase).

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase Account

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

3. Update `.env.local` with your Firebase credentials.

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the site.

## Deployment Guide

### Vercel Deployment (Recommended)
1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/) and create a new project.
3. Import your GitHub repository.
4. Add the Environment Variables from your `.env.local` file to the Vercel project settings.
5. Click **Deploy**. Vercel will automatically detect the Next.js framework and build the project.

### Firebase Deployment
If you prefer Firebase Hosting:
1. Initialize Firebase Hosting:
   ```bash
   firebase init hosting
   ```
2. Build the project:
   ```bash
   npm run build
   ```
3. Deploy:
   ```bash
   firebase deploy --only hosting
   ```
