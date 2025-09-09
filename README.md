# QR Meal

A modern, full-stack QR code-based restaurant ordering system that enables contactless dining experiences. Customers can scan QR codes at their table to view the menu, place orders, and track their meals in real-time.

## Project Overview

QR Meal revolutionizes the dining experience by providing a seamless, contactless ordering system for restaurants. With multi-language support (English & Vietnamese), real-time order tracking, and comprehensive management tools, it's designed to enhance both customer satisfaction and restaurant operations.

## Live Demo

🔗 **Demo Link**: [qrmeal_demo.mp4](https://drive.google.com/file/d/12OPtU1yrKCkcswaL9aj47UcuUR1b93-I/view?usp=sharing)

## Features

### For Customers (Guests)

- **QR Code Scanning**: Simply scan the QR code at your table to access the menu
- **Digital Menu**: Browse dishes with images, descriptions, and prices
- **Easy Ordering**: Add items to cart and place orders instantly
- **Order Tracking**: Real-time updates on order status (Pending → Processing → Delivered → Paid)
- **Multi-language Support**: Available in English and Vietnamese

### For Restaurant Staff

- **Order Management**: View and manage all incoming orders with status updates
- **Real-time Notifications**: Get instant notifications for new orders via WebSocket
- **Table Management**: Monitor table availability and reservations
- **Guest Management**: Track customer sessions and table assignments

### For Restaurant Owners/Managers

- **Dashboard Analytics**: Comprehensive insights with interactive charts
- **Menu Management**: Add, edit, and organize dishes with images
- **Staff Management**: Create and manage employee accounts with role-based access
- **Table Setup**: Configure tables and generate QR codes
- **Order Reports**: Detailed order history and analytics

### Technical Features

- **Real-time Communication**: WebSocket integration for instant updates
- **JWT Authentication**: Secure token-based authentication system
- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop)
- **Dark Mode**: Toggle between light and dark themes
- **Form Validation**: Comprehensive client and server-side validation
- **Image Upload**: Media management for dish photos
- **SEO Optimized**: Meta tags and sitemap generation

## Installation & Configuration

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun package manager
- Backend API server (separate repository)

### Environment Setup

1. **Clone the repository**

   ```bash
   git clone <your-repository-url>
   cd qrmeal
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_ENDPOINT=http://localhost:4000/api
   NEXT_PUBLIC_URL=http://localhost:3000
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI=http://localhost:3000/api/auth/login/google
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Backend Configuration

This frontend requires a backend API server. Make sure to:

- Set up the backend server on the configured API endpoint
- Ensure the backend supports the required endpoints for authentication, orders, dishes, tables, etc.
- Configure CORS settings to allow requests from your frontend domain

## Tech Stack

### Frontend Framework

- **Next.js 15.4.7** - React framework with App Router
- **React 19.1.0** - UI library with latest features
- **TypeScript 5** - Type-safe development

### Styling & UI

- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI primitives
- **Lucide React** - Beautiful & consistent icon library
- **next-themes** - Dark mode support

### State Management & Data Fetching

- **TanStack Query (React Query)** - Server state management
- **Zustand** - Lightweight client state management
- **React Hook Form** - Performant form handling

### Internationalization

- **next-intl** - Type-safe internationalization
- **Support for English & Vietnamese**

### Development Tools

- **ESLint** - Code linting with Next.js configuration
- **Prettier** - Code formatting
- **Husky** - Git hooks for code quality
- **lint-staged** - Run linters on staged files

### Additional Libraries

- **Socket.io Client** - Real-time communication
- **QRCode** - QR code generation
- **JWT Decode** - JWT token handling
- **Zod** - Schema validation
- **React-Recharts** - Data visualization
- **Sonner** - Toast notifications

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
