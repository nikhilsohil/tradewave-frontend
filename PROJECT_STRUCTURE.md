# Tradewave Frontend Documentation

Welcome to the Tradewave Frontend project! This guide will help new developers understand the project structure, setup, and development workflow.

## Overview
Tradewave Frontend is a modern React-based web application for managing categories, products, retailers, staff, and authentication. It uses TypeScript, Vite, and a modular folder structure for scalability and maintainability.

## Getting Started

### 1. Prerequisites
- Node.js (LTS recommended)
- npm, yarn, or bun (choose one)

### 2. Installation
Clone the repository and install dependencies:
```bash
# Clone the repo
git clone <repo-url>
cd tradewave-frontend
# Install dependencies (choose one)
npm install
yarn install
bun install
```

### 3. Environment Setup
Copy `.env.example` to `.env` and update variables as needed (API URLs, etc).

### 4. Running the App
```bash
npm run dev
# or
yarn dev
# or
bun run dev
```
The app will be available at `http://localhost:5173` (default Vite port).

## Folder Structure & Purpose

- **public/**: Static assets (icons, manifest, etc.)
- **src/**: Main source code
	- **components/**: Reusable UI and feature components
		- **ui/**: Common UI primitives (Button, Dialog, Table, etc.) 
		- **common/**: Shared feature components (headers, pagination, etc.)
		- **Categories/**, **products/**: Domain-specific components
	- **hooks/**: Custom React hooks
	- **integrations/**: Third-party integrations (e.g., TanStack Query)
	- **lib/**: Utility functions
	- **providers/**: React context providers (e.g., authentication)
	- **routes/**: Page components and route definitions
		- **_protected/**: Protected routes (require authentication)
		- **auth/**: Authentication-related pages
	- **services/**: API calls, configuration, and type definitions
		- **api/**: API modules for each domain (categories, products, etc.)
		- **types/**: TypeScript types for API and domain models
	- **styles.css**: Global styles

## Key Concepts

### Services
- All API interactions are handled in `src/services/api/`. Each file corresponds to a domain (e.g., `categories.ts`, `products.tsx`).
- API base URLs and config are managed in `src/services/config.ts` using environment variables.
- Type definitions for API responses and models are in `src/services/types/`.

### Routing
- All routes are defined in `src/routes/`.
- Public routes (e.g., login) are outside `_protected/`.
- Protected routes are inside `_protected/` and require authentication.
- Route guards and redirection logic are implemented in protected route components or wrappers.

### Authentication
- The authentication context is implemented in `src/providers/auth.tsx`.
- It manages user state, login/logout, and provides authentication status to the app.
- Used to protect routes and control UI based on user roles.

### Styling
- Global styles are in `src/styles.css`.
- UI components in `src/components/ui/` have their own styles, using CSS modules or styled-components approach.
- The UI library provides reusable, styled primitives for consistent design.

## Development Workflow
1. Create a new feature/component in the appropriate folder.
2. Use TypeScript for type safety.
3. For new API endpoints, add a module in `src/services/api/` and update types in `src/services/types/`.
4. Add or update routes in `src/routes/`.
5. Use the authentication context for protected features.
6. Test your changes locally before pushing.

## Environment Variables
- Store API URLs and sensitive settings in `.env` (not committed to version control).

## Contribution Guidelines
- Follow existing code style and naming conventions.
- Write clear, maintainable code and add comments where necessary.
- Test features before submitting pull requests.

---

For more details, explore the source code and refer to comments in each module. If you have questions, ask the project maintainers.
