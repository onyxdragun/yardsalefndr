# YardSaleFndr

A modern, responsive web application built with Next.js, TypeScript, and Tailwind CSS for creating, managing, and browsing garage sales in the Comox Valley, BC.

## Features

- **User Authentication** - Secure user registration and login
- **Garage Sale Management** - Create, edit, and manage garage sales
- **Item Listing** - Add and categorize items for sale
- **Search & Filter** - Find sales and items by location, category, and keywords
- **Location-based Discovery** - Discover garage sales in your area
- **Image Upload** - Upload photos for items and sales
- **Responsive Design** - Works seamlessly on mobile and desktop
- **Smart Navigation** - Get directions using your preferred navigation app

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React** - UI component library
- **ESLint** - Code linting and quality

## Getting Started

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Project Structure

```
src/
├── app/                 # App Router pages and layouts
├── components/          # Reusable React components
├── lib/                 # Utility functions and configurations
└── types/              # TypeScript type definitions
```

## Development Guidelines

- Use server components by default, client components when needed
- Implement proper error handling and loading states
- Ensure accessibility compliance
- Write clean, maintainable code with proper comments
- Use semantic HTML and proper ARIA attributes

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - learn about TypeScript
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about Tailwind CSS

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
