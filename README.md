# Car Showroom Frontend

A responsive customer-facing vehicle showroom for browsing cars, viewing detailed specifications, exploring rental options, and contacting the business. The interface supports multiple languages and light/dark themes.

## Features

- Featured vehicles, brands, banners, and rental listings
- Search and filter flows for available cars
- Vehicle detail pages with image presentation
- Responsive navigation and mobile layouts
- Language and theme controls
- API-backed content with loading and error states

## Stack

- React 18 and React Router
- Vite
- Tailwind CSS
- Axios
- Framer Motion and Swiper
- Font Awesome and React Icons

## Local setup

```bash
npm install
copy .env.example .env
npm run dev
```

Create `.env.example` with:

```env
VITE_API_URL=http://localhost:5000/api
```

## Quality checks

```bash
npm run lint
npm run build
```

The production build currently passes. The repository audit found lint issues that should be resolved before enabling CI.

## Live application

[Open the deployed showroom](https://showroom-frontend-pghu.vercel.app/)

## Status

Active portfolio project. Add desktop/mobile screenshots and document the matching backend API before featuring it prominently.
