# Na Food - Food Delivery Website

## Overview

Na Food is a modern food delivery web application built with a full-stack architecture. It's a Single Page Application (SPA) that allows users to browse food items, place orders, and manage their deliveries. The application supports multiple user roles with different permissions and features a complete order management system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom design tokens
- **Routing**: Wouter for client-side routing
- **State Management**: React Context API for authentication and shopping cart
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API**: RESTful API with role-based access control

### Build System
- **Bundler**: Vite for frontend development and building
- **Build Tool**: esbuild for backend bundling
- **Development**: Hot module replacement with Vite middleware

## Key Components

### Database Schema
The application uses a PostgreSQL database with the following main tables:
- **users**: User accounts with role-based permissions (user, staff, admin)
- **products**: Food items with categories, pricing, and availability
- **orders**: Customer orders with items, payment methods, and delivery info
- **reviews**: Product reviews with approval system
- **banners**: Homepage banner management

### Authentication System
- JWT token-based authentication
- Role-based access control (user, staff, admin)
- Secure password hashing with bcrypt
- Token storage in localStorage with automatic refresh

### Shopping Cart
- Context-based cart management
- Persistent cart state in localStorage
- Real-time cart updates across components
- Support for item quantities and totals

### Order Management
- Multi-step order process with customer information
- Multiple payment methods (COD, bank transfer, e-wallet)
- Order status tracking (pending, processing, shipping, delivered, cancelled)
- Role-based order management interface

### User Interface
- Responsive design with mobile-first approach
- Dark mode support with CSS custom properties
- Component-based architecture with reusable UI components
- Toast notifications for user feedback
- Modal dialogs for complex interactions

## Data Flow

1. **User Authentication**: Users register/login through JWT authentication
2. **Product Browsing**: Products are fetched from the database with filtering and search
3. **Cart Management**: Items are added to cart and stored in localStorage
4. **Order Placement**: Orders are created with customer details and payment method
5. **Order Processing**: Staff and admin can update order status
6. **Review System**: Users can leave reviews after order completion

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM, React Query)
- UI Components (Radix UI primitives)
- Styling (Tailwind CSS, class-variance-authority)
- Forms (React Hook Form, Zod validation)
- Icons (Lucide React)
- Date handling (date-fns)

### Backend Dependencies
- Express.js for server framework
- Drizzle ORM for database operations
- JWT for authentication
- bcrypt for password hashing
- Neon Database serverless client

### Development Dependencies
- Vite for development server and building
- TypeScript for type safety
- ESLint and Prettier for code quality
- PostCSS for CSS processing

## Deployment Strategy

### Production Build
- Frontend: Vite builds optimized static assets
- Backend: esbuild bundles Node.js application
- Database: Managed PostgreSQL on Neon Database

### Environment Configuration
- Environment variables for database connection
- JWT secret configuration
- Development vs production mode handling

### File Structure
```
├── client/          # Frontend React application
├── server/          # Backend Express application
├── shared/          # Shared types and schemas
├── migrations/      # Database migrations
├── attached_assets/ # Static assets and documentation
└── dist/           # Production build output
```

### Key Features
- Single Page Application with client-side routing
- Real-time order management for staff
- Admin dashboard with statistics and management tools
- Responsive design for mobile and desktop
- Vietnamese language support
- Role-based access control with three permission levels
- Image upload and management for products and banners
- Order tracking and status updates
- Review and rating system with moderation
- Complete user management system with real database integration
- PDF/CSV export functionality for orders and reports
- VSCode development environment setup guide

### Recent Changes
- **2025-01-14**: **MAJOR DATABASE MIGRATION**: Completely migrated from PostgreSQL to MongoDB
  - Replaced Drizzle ORM with native MongoDB driver
  - Updated all schemas and storage operations
  - Added MongoDB connection with connection string: mongodb+srv://admin:ZQJEPt9VIlcRGVp9@lamv.tzc1slv.mongodb.net/
  - Maintained all existing functionality with MongoDB backend
  - Created auto-incrementing ID system for compatibility
- **2025-01-14**: Fixed user management to display real users from database instead of mock data
- **2025-01-14**: Added complete user management functionality (edit user info, role changes, account lock/unlock)
- **2025-01-14**: Implemented PDF and CSV export functionality for order management
- **2025-01-14**: Created comprehensive VSCode development guide (VSCODE_GUIDE.md)
- **2025-01-14**: Fixed order placement validation errors for total field (string/number conversion) and notes field (null handling)
- **2025-01-14**: Enhanced user management with search and filtering capabilities