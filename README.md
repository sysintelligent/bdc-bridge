# BDC Bridge

A tool between developers and complex backend infrastructure., inspired by Argo CD. It gives developers the edge they need to succeed while simplifying the platform complexities.

## Project Structure

The project is organized into three main components:

1. **UI**: A Next.js-based front-end built with TypeScript and shadcn UI (powered by Tailwind CSS)
2. **CMD**: A Go-based command-line interface using Cobra
3. **Server**: A Go-based backend server with REST and gRPC endpoints

```
bdc-bridge/
├── ui/                # React TypeScript frontend with shadcn UI
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

## Development Setup

### Prerequisites

- Go 1.19+
- Node.js 16+
- npm 8+
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
- Server-side rendering capabilities
- API routes support
- Built-in routing system
- Automatic code splitting
- Image optimization
- TypeScript support out of the box

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
- React 18 with TypeScript
- shadcn UI components (based on Radix UI primitives)
- Tailwind CSS for styling
- Redux Toolkit for state management
- React Router for navigation
- Lucide React for icons

The UI supports both light and dark modes through a theme toggle.

## Contributing

Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for details on how to contribute to this project.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details. 