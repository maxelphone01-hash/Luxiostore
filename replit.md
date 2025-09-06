# Overview

LUXIO is a premium e-commerce platform specializing in high-end consumer electronics and lifestyle products. The application offers a modern, multi-language shopping experience with features like real-time cart management, customer reviews, and payment integration with cryptocurrency and traditional payment methods. Built as a full-stack application using React for the frontend and Express.js for the backend, with Firebase authentication and a PostgreSQL database.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Technology Stack**: React 18 with TypeScript, Vite for build tooling, and Tailwind CSS with shadcn/ui components for styling.

**State Management**: Uses custom React hooks (`useCart`, `useLanguage`) for managing cart state and internationalization. TanStack Query handles server state management and API caching.

**Routing**: Implements client-side routing using Wouter library, with a simple route structure for home page and 404 handling.

**UI Framework**: Built on shadcn/ui component library with Radix UI primitives, providing accessible and customizable components with consistent theming through CSS variables.

**Responsive Design**: Mobile-first approach using Tailwind CSS breakpoints, with dedicated mobile detection hook (`useIsMobile`).

## Backend Architecture

**Framework**: Express.js with TypeScript, providing a RESTful API structure.

**Development Setup**: Vite middleware integration for hot module replacement during development, with proper production build configuration.

**Storage Interface**: Implements an abstraction layer (`IStorage`) allowing for different storage implementations. Currently includes in-memory storage for development, with PostgreSQL schema defined for production.

**Error Handling**: Centralized error handling middleware with proper HTTP status codes and JSON responses.

## Data Layer

**Database**: PostgreSQL with Drizzle ORM for type-safe database operations and migrations.

**Schema Design**: 
- Users table with authentication fields
- Products table with pricing, inventory, and media management
- Orders table for transaction tracking

**Type Safety**: Drizzle-Zod integration provides runtime validation and TypeScript types from database schema.

## Authentication System

**Provider**: Firebase Authentication with Google OAuth integration.

**Session Management**: Client-side authentication state management with redirect flow handling.

**User Experience**: Modal-based authentication flow with fallback to redirect for mobile compatibility.

## Internationalization

**Multi-language Support**: Supports 7 languages (French, English, Polish, Spanish, Portuguese, Italian, Hungarian) with automatic language detection based on browser settings and IP geolocation.

**Translation Management**: JSON-based translation system with nested key structure and runtime translation function.

**Locale Persistence**: Browser localStorage for language preference persistence across sessions.

## Shopping Cart

**State Management**: Client-side cart state with localStorage persistence for session continuity.

**Real-time Updates**: Immediate UI updates with optimistic updates and proper error handling.

**Cart Features**: Quantity management, item removal, total calculation, and persistent storage.

# External Dependencies

## Payment Processors

**NOWPayments**: Cryptocurrency payment integration supporting multiple digital currencies.

**MaxelPay**: Traditional payment methods including credit cards and bank transfers.

**Future Integrations**: Planned support for Transak and Guardarian for fiat-to-crypto conversions.

## Authentication Services

**Firebase Authentication**: Google OAuth provider with redirect flow for seamless user authentication.

## Database Services

**Neon Database**: PostgreSQL hosting with serverless architecture using `@neondatabase/serverless` driver.

**Drizzle ORM**: Type-safe database operations with migration support and schema validation.

## Development Tools

**Replit Integration**: Custom Vite plugins for development environment integration and error overlay.

**Build System**: Vite for frontend bundling and esbuild for backend compilation.

## UI Dependencies

**Radix UI**: Comprehensive primitive component library for accessible UI elements.

**Tailwind CSS**: Utility-first CSS framework with custom design system implementation.

**Lucide React**: Icon library providing consistent iconography throughout the application.

## Third-party Services

**Unsplash**: Product image hosting and management for demo content.

**IP Geolocation**: Browser-based and IP-based language detection for automatic localization.