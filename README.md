# BDC Bridge

A tool between developers and complex backend infrastructure., inspired by Argo CD. It gives developers the edge they need to succeed while simplifying the platform complexities.

## Project Structure

The project is organized into three main components:

1. **UI**: A React-based front-end built with TypeScript and shadcn UI (powered by Tailwind CSS)
2. **CMD**: A Go-based command-line interface using Cobra
3. **Server**: A Go-based backend server with REST and gRPC endpoints

```
bdc-bridge/
├── ui/                 # React TypeScript frontend with shadcn UI
├── cmd/                # CLI implementation using Cobra
└── server/             # Backend server implementation
    ├── api/            # REST and gRPC API definitions
    ├── auth/           # Authentication and RBAC
    └── kubernetes/     # Kubernetes client integration
```

## Development Setup

### Prerequisites

- Go 1.19+
- Node.js 16+
- npm 8+
- Docker (optional, for containerized development)
- Minikube v1.32+ or equivalent local Kubernetes cluster

### Building and Running

#### UI

```bash
cd ui
npm install
npm start
```

The UI will be available at http://localhost:3000

#### Server

```bash
cd server
go mod tidy
go run main.go
```

The server will start on http://localhost:8080

#### CLI

```bash
cd cmd/bdc-cli
go build -o bdc-cli
./bdc-cli admin dashboard
```

This will start a local dashboard server.

## Local Testing Setup

To test the complete application locally, you'll need to run all three components simultaneously. Here's how to set it up:

### 1. Start the Server

```bash
# From the project root
cd server
go mod tidy
go run main.go
```

The server will start and listen on:
- HTTP: http://localhost:8080
- gRPC: localhost:9090

### 2. Start the UI

In a new terminal:

```bash
# From the project root
cd ui
npm install
npm start
```

The React development server will start and the UI will be available at http://localhost:3000.

### 3. Build and Run the CLI

In a new terminal:

```bash
# From the project root
cd cmd/bdc-cli
go build -o bdc-cli
# Run the dashboard on a different port to avoid conflict with the server
./bdc-cli admin dashboard --port 8081
```

The CLI dashboard will be available at http://localhost:8081.

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
ps aux | grep "npm start" # Find the UI process
ps aux | grep "bdc-cli admin dashboard" # Find the CLI dashboard process
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

## UI Development and Deployment

### Development Workflow

For UI development, you can use the standard React development server:

```bash
cd ui
npm install
npm start
```

The UI will be available at http://localhost:3000

### UI Rebuild and Deployment Process

After making changes to UI components, you can use the automated deployment script to rebuild and update the production version:

```bash
# From the project root
./deploy-ui.sh
```

This script:
1. Navigates to the UI directory
2. Builds the UI with production settings
3. Copies the built files to the server's static directory
4. Restarts the server if it's already running

If you need to install dependencies along with deployment:

```bash
./deploy-ui.sh --install
```

The updated UI will be accessible at http://localhost:8080 after deployment.

### Manually Rebuilding and Deploying UI

If you prefer to manually control the process:

1. Build the UI:
   ```bash
   cd ui
   npm run build
   ```

2. The built files will be in the `ui/build` directory. Copy them to the server's static directory:
   ```bash
   mkdir -p ../server/static
   cp -R build/* ../server/static/
   ```

3. Restart the server to see the changes:
   ```bash
   cd ../server
   go run main.go
   ```

## Contributing

Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for details on how to contribute to this project.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details. 