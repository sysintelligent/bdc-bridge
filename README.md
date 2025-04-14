# BDC Bridge

A tool between developers and complex backend infrastructure., inspired by Argo CD. It gives developers the edge they need to succeed while simplifying the platform complexities.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Ports Used](#ports-used)
3. [Development Setup](#development-setup)
   - [Prerequisites](#prerequisites)
   - [Building and Running](#building-and-running)
     - [UI Development](#ui-development)
     - [Building and Deploying UI](#building-and-deploying-ui)
     - [Server](#server)
     - [CLI](#cli)
4. [Local Testing Setup](#local-testing-setup)
   - [Build and Deploy the UI](#1-build-and-deploy-the-ui)
   - [Start the Server](#2-start-the-server)
   - [Use the CLI](#3-use-the-cli)
   - [Testing the API](#testing-the-api)
   - [Authentication](#authentication)
   - [Stopping the Services](#stopping-the-services)
5. [UI Technology Stack](#ui-technology-stack)
6. [App Router Configuration and Development](#app-router-configuration-and-development)
   - [Starting Page and Routing](#starting-page-and-routing)
   - [Adding New Routes](#adding-new-routes)
   - [Creating New UI Components](#creating-new-ui-components)
   - [Best Practices](#best-practices)
7. [Contributing](#contributing)
8. [License](#license)

## Project Structure

The project is organized into three main components:

1. **UI**: A Next.js-based front-end built with TypeScript and shadcn UI (powered by Tailwind CSS)
2. **CMD**: A Go-based command-line interface using Cobra
3. **Server**: A Go-based backend server with REST and gRPC endpoints

```
bdc-bridge/
├── ui/                # Next.js TypeScript frontend with shadcn UI
│   ├── app/           # Next.js App Router pages and layouts
│   ├── components/    # Reusable UI components
│   └── lib/           # Utility functions and shared code
├── cmd/               # CLI implementation using Cobra
└── server/            # Backend server implementation
    ├── api/           # REST and gRPC API definitions
    ├── auth/          # Authentication and RBAC
    ├── kubernetes/    # Kubernetes client integration
    └── static/        # Built UI files served by the server
```

## Ports Used

The application uses the following ports:

| Component     | Port  | Protocol | URL                     | Description                       |
|--------------|-------|----------|-------------------------|-----------------------------------|
| Server (HTTP) | 8080  | HTTP     | http://localhost:8080   | REST API and UI                  |
| Server (gRPC) | 9090  | gRPC     | localhost:9090          | gRPC API                         |
| UI Dev Server | 3000  | HTTP     | http://localhost:3000   | Next.js development server       |

## Development Setup

### Prerequisites

- Go 1.19+
- Node.js 18+ (recommended for Next.js 14)
- npm 9+ or yarn
- Docker (optional, for containerized development)
- Minikube v1.32+ or equivalent local Kubernetes cluster

### Building and Running

#### UI Development

For UI development, you can use the Next.js development server:

```bash
cd ui
npm install
npm run dev
```

The UI development server will be available at http://localhost:3000

The UI is built with:
- Next.js 14 with App Router
- TypeScript
- shadcn UI components
- Tailwind CSS for styling
- Redux Toolkit for state management

Key features:
- Server-side rendering (SSR) and static site generation (SSG)
- App Router for improved routing and layouts
- API routes support
- Built-in routing system
- Automatic code splitting
- Image optimization
- TypeScript support out of the box
- Server Components for improved performance
- Streaming and Suspense for better loading states

#### Building and Deploying UI

To build and deploy the UI to the server:

```bash
# From the project root
./deploy-ui.sh
```

This script:
1. Builds the Next.js application with production settings
2. Copies the built files to server/static directory
3. Restarts the server if it's already running

If you need to install dependencies along with deployment:

```bash
./deploy-ui.sh --install
```

#### Server

```bash
cd server
go mod tidy
go run main.go
```

The server will start and listen on:
- HTTP (UI & API): http://localhost:8080
- gRPC: localhost:9090

#### CLI

```bash
cd cmd/bdc-cli
go build -o bdc-cli
```

To open the dashboard in your browser:
```bash
./bdc-cli admin dashboard
```

## Local Testing Setup

To test the complete application locally:

### 1. Build and Deploy the UI

```bash
# From the project root
./deploy-ui.sh
```

### 2. Start the Server

```bash
cd server
go mod tidy
go run main.go
```

The server will start and be available at:
- http://localhost:8080 (UI and HTTP API)
- localhost:9090 (gRPC)

### 3. Use the CLI

```bash
cd cmd/bdc-cli
go build -o bdc-cli
# Open the dashboard in your browser
./bdc-cli admin dashboard
```

### Testing the API

You can test the server's REST API using curl:

```bash
# Get all applications (admin access)
curl -H "Authorization: Bearer admin-token" http://localhost:8080/api/applications

# Get a specific application
curl -H "Authorization: Bearer admin-token" http://localhost:8080/api/applications/frontend

# Check server health
curl http://localhost:8080/health

# Test with regular user token (limited permissions)
curl -H "Authorization: Bearer demo-token" http://localhost:8080/api/applications
```

### Authentication

The server supports two test tokens:
- `admin-token`: Full access to all endpoints
- `demo-token`: Read-only access to applications and settings

### Stopping the Services

When you're done testing, you can stop the services by pressing Ctrl+C in each terminal window, or by finding and killing the processes:

```bash
ps aux | grep "go run" # Find the server process
kill <PID> # Replace <PID> with the process ID you want to stop
```

## UI Technology Stack

The UI is built with:
- Next.js 14 with App Router
- TypeScript
- shadcn UI components (based on Radix UI primitives)
- Tailwind CSS for styling
- Redux Toolkit for state management
- Server Components and Client Components
- React Server Components for improved performance
- Streaming and Suspense for better loading states
- Built-in routing with App Router
- API Routes for backend functionality
- Lucide React for icons

The UI supports both light and dark modes through a theme toggle and uses Next.js's built-in features for:
- Server-side rendering
- Static site generation
- Incremental static regeneration
- API routes
- Image optimization
- Font optimization
- Script optimization

## App Router Configuration and Development

### Starting Page and Routing

The application uses Next.js App Router for routing. The main entry points are:

```
ui/
├── app/
│   ├── page.tsx           # Home page (/)
│   ├── layout.tsx         # Root layout
│   ├── dashboard/         # Dashboard routes
│   │   ├── page.tsx      # /dashboard
│   │   └── [id]/         # Dynamic routes
│   │       └── page.tsx  # /dashboard/[id]
│   └── settings/         # Settings routes
│       └── page.tsx      # /settings
```

The starting page (`/`) is defined in `app/page.tsx`. The root layout in `app/layout.tsx` provides the common structure for all pages.

### Adding New Routes

To add a new route:

1. Create a new directory in `app/` for your route
2. Add a `page.tsx` file inside the directory
3. The route will be automatically available based on the directory structure

Example for adding a new route `/applications`:

```bash
mkdir -p ui/app/applications
touch ui/app/applications/page.tsx
```

### Creating New UI Components

To add a new UI component:

1. Create the component file in the appropriate directory:
   ```bash
   # For shared components
   touch ui/components/ui/your-component.tsx
   
   # For page-specific components
   touch ui/app/your-page/your-component.tsx
   ```

2. Basic component template:
   ```tsx
   // ui/components/ui/your-component.tsx
   'use client'  // Add this if the component needs client-side interactivity
   
   import { FC } from 'react'
   
   interface YourComponentProps {
     // Define your props here
   }
   
   export const YourComponent: FC<YourComponentProps> = ({ /* props */ }) => {
     return (
       // Your component JSX
     )
   }
   ```

3. For server components (default in App Router):
   - Omit the 'use client' directive
   - Use async/await for data fetching
   - Can't use hooks or browser APIs

4. For client components:
   - Add 'use client' directive at the top
   - Can use hooks and browser APIs
   - Use for interactive elements

### Best Practices

1. **Component Organization**:
   - Place shared components in `components/ui/`
   - Place page-specific components in their respective page directories
   - Use the `lib/` directory for utilities and helpers

2. **Data Fetching**:
   - Use Server Components for data fetching when possible
   - Implement loading states using Suspense
   - Handle errors with error boundaries

3. **State Management**:
   - Use React Context for theme and global state
   - Use Redux Toolkit for complex state management
   - Consider using React Query for server state

4. **Styling**:
   - Use Tailwind CSS for styling
   - Follow the shadcn UI component patterns
   - Maintain consistent spacing and typography

Example of a complete page with components:

```tsx
// ui/app/dashboard/page.tsx
import { Suspense } from 'react'
import { DashboardHeader } from './components/dashboard-header'
import { DashboardContent } from './components/dashboard-content'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default async function DashboardPage() {
  return (
    <div className="container mx-auto p-4">
      <DashboardHeader />
      <Suspense fallback={<LoadingSpinner />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}
```

## Contributing

Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for details on how to contribute to this project.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details. 