package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"
	"time"

	"github.com/sysintelligent/bdc-bridge/server/api"
	"github.com/sysintelligent/bdc-bridge/server/auth"
	"github.com/sysintelligent/bdc-bridge/server/kubernetes"
	"google.golang.org/grpc"
)

const (
	httpPort = 8080
	grpcPort = 9090
)

func main() {
	// Set up logger
	logger := log.New(os.Stdout, "BDC-SERVER: ", log.LstdFlags|log.Lshortfile)
	logger.Println("Starting BDC Bridge server...")

	// Initialize Kubernetes client
	k8sClient, err := kubernetes.NewClient()
	if err != nil {
		logger.Fatalf("Failed to create Kubernetes client: %v", err)
	}
	logger.Println("Kubernetes client initialized")

	// Initialize auth service
	authService := auth.NewService()
	logger.Println("Auth service initialized")

	// Create context that listens for the interrupt signal
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	// Start HTTP server
	httpServer := startHTTPServer(logger, k8sClient, authService)
	logger.Printf("HTTP server listening on port %d", httpPort)

	// Start gRPC server
	grpcServer := startGRPCServer(logger, k8sClient, authService)
	logger.Printf("gRPC server listening on port %d", grpcPort)

	// Wait for interrupt signal
	<-ctx.Done()
	logger.Println("Shutdown signal received")

	// Create a timeout context for graceful shutdown
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Shutdown HTTP server
	if err := httpServer.Shutdown(shutdownCtx); err != nil {
		logger.Printf("HTTP server shutdown error: %v", err)
	}

	// Shutdown gRPC server
	grpcServer.GracefulStop()

	logger.Println("Server shutdown complete")
}

func startHTTPServer(logger *log.Logger, k8sClient *kubernetes.Client, authService *auth.Service) *http.Server {
	// Create REST API handler
	apiHandler := api.NewRESTHandler(k8sClient, authService)

	// Create HTTP server
	mux := http.NewServeMux()
	mux.Handle("/api/", http.StripPrefix("/api", apiHandler))
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, "OK")
	})

	// Serve static files from the static directory
	staticDir := "./static"
	if _, err := os.Stat(staticDir); os.IsNotExist(err) {
		logger.Printf("Static directory %s does not exist, UI will not be served", staticDir)
	} else {
		fs := http.FileServer(http.Dir(staticDir))
		mux.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			logger.Printf("Serving request for path: %s", r.URL.Path)

			// Skip API routes
			if strings.HasPrefix(r.URL.Path, "/api/") {
				http.NotFound(w, r)
				return
			}

			// Handle Next.js static files
			if strings.HasPrefix(r.URL.Path, "/_next/") {
				// Try to serve from _next directory first
				path := filepath.Join(staticDir, r.URL.Path)
				if _, err := os.Stat(path); err == nil {
					fs.ServeHTTP(w, r)
					return
				}

				// Try to serve from .next directory if not found in _next
				path = filepath.Join(staticDir, ".next", strings.TrimPrefix(r.URL.Path, "/_next/"))
				if _, err := os.Stat(path); err == nil {
					http.ServeFile(w, r, path)
					return
				}
			}

			// Try to serve static files from public directory
			if r.URL.Path != "/" {
				publicPath := filepath.Join(staticDir, r.URL.Path)
				if _, err := os.Stat(publicPath); err == nil {
					fs.ServeHTTP(w, r)
					return
				}
			}

			// For all other paths, serve index.html
			indexPath := filepath.Join(staticDir, "index.html")
			if _, err := os.Stat(indexPath); err == nil {
				http.ServeFile(w, r, indexPath)
				return
			}

			// If index.html doesn't exist, return 404
			http.NotFound(w, r)
		}))
		logger.Printf("Serving UI from %s", staticDir)
	}

	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", httpPort),
		Handler: mux,
	}

	// Start HTTP server in a goroutine
	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatalf("HTTP server error: %v", err)
		}
	}()

	return server
}

func startGRPCServer(logger *log.Logger, k8sClient *kubernetes.Client, authService *auth.Service) *grpc.Server {
	// Create gRPC server
	server := grpc.NewServer(
		grpc.UnaryInterceptor(auth.GRPCAuthInterceptor(authService)),
	)

	// Register gRPC services
	api.RegisterGRPCServices(server, k8sClient)

	// Start gRPC server in a goroutine
	go func() {
		lis, err := net.Listen("tcp", fmt.Sprintf(":%d", grpcPort))
		if err != nil {
			logger.Fatalf("Failed to listen for gRPC: %v", err)
		}
		if err := server.Serve(lis); err != nil {
			logger.Fatalf("gRPC server error: %v", err)
		}
	}()

	return server
}
