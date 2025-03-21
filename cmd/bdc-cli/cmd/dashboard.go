package cmd

import (
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"time"

	"github.com/spf13/cobra"
)

var (
	port        int
	openBrowser bool
)

// dashboardCmd represents the dashboard command
var dashboardCmd = &cobra.Command{
	Use:   "dashboard",
	Short: "Start a local dashboard server",
	Long: `Start a local dashboard server that serves the DMI CLI UI.
	
This command starts a local HTTP server that serves the DMI CLI UI,
allowing you to manage your applications through a web interface.`,
	Run: func(cmd *cobra.Command, args []string) {
		startDashboard()
	},
}

func init() {
	adminCmd.AddCommand(dashboardCmd)

	// Here you will define your flags and configuration settings.
	dashboardCmd.Flags().IntVarP(&port, "port", "p", 8081, "Port to run the dashboard server on")
	dashboardCmd.Flags().BoolVarP(&openBrowser, "open", "o", true, "Open the dashboard in the default browser")
}

func startDashboard() {
	// This function starts the dashboard server and serves the React UI

	addr := fmt.Sprintf("localhost:%d", port)
	url := fmt.Sprintf("http://%s", addr)

	fmt.Printf("Using port: %d\n", port) // Add debug line to confirm port value

	// Get the current working directory
	cwd, err := os.Getwd()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error getting current directory: %s\n", err)
		os.Exit(1)
	}

	// Try to find the UI build directory
	// First, check if we're in the project root
	uiBuildPath := filepath.Join(cwd, "ui", "build")
	if _, err := os.Stat(uiBuildPath); os.IsNotExist(err) {
		// If not found, try going up one directory (in case we're in cmd/bdc-cli)
		uiBuildPath = filepath.Join(cwd, "..", "..", "ui", "build")
		if _, err := os.Stat(uiBuildPath); os.IsNotExist(err) {
			// If still not found, serve the placeholder
			fmt.Println("Warning: React UI build not found. Serving placeholder instead.")
			fmt.Println("To serve the actual UI, run 'cd ui && npm run build' first.")

			// Create a simple HTTP server with placeholder
			http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
				fmt.Fprintf(w, "DMI CLI Dashboard Server\n")
				fmt.Fprintf(w, "This is a placeholder for the actual dashboard UI.\n")
				fmt.Fprintf(w, "In a real implementation, this would serve the React UI.\n")
				fmt.Fprintf(w, "To see the actual UI, run 'cd ui && npm run build' first, then run this command again.")
			})
		} else {
			setupFileServer(uiBuildPath)
		}
	} else {
		setupFileServer(uiBuildPath)
	}

	// Start the server in a goroutine
	go func() {
		fmt.Printf("Starting dashboard server at %s\n", url)
		if err := http.ListenAndServe(addr, nil); err != nil {
			fmt.Fprintf(os.Stderr, "Error starting dashboard server: %s\n", err)
			os.Exit(1)
		}
	}()

	// Open the browser if requested
	if openBrowser {
		time.Sleep(100 * time.Millisecond) // Give the server a moment to start
		openURL(url)
	}

	// Keep the main goroutine alive
	select {}
}

// setupFileServer configures the HTTP handlers for serving the React SPA
func setupFileServer(uiBuildPath string) {
	fmt.Printf("Serving React UI from %s\n", uiBuildPath)

	// Create a simple file server to serve all files from the build directory
	fs := http.FileServer(http.Dir(uiBuildPath))

	// Handle all requests
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Add cache-control headers to prevent browser caching
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		w.Header().Set("Pragma", "no-cache")
		w.Header().Set("Expires", "0")

		// Log the request path for debugging
		fmt.Printf("Received request for: %s\n", r.URL.Path)

		// Try to serve the file directly
		filePath := filepath.Join(uiBuildPath, r.URL.Path)
		_, err := os.Stat(filePath)

		// If it's a static file that exists, serve it directly
		if err == nil {
			fs.ServeHTTP(w, r)
			return
		}

		// For any path that doesn't exist as a file, serve index.html
		http.ServeFile(w, r, filepath.Join(uiBuildPath, "index.html"))
	})
}

// openURL opens the specified URL in the default browser
func openURL(url string) {
	var err error

	switch runtime.GOOS {
	case "linux":
		err = exec.Command("xdg-open", url).Start()
	case "windows":
		err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "darwin":
		err = exec.Command("open", url).Start()
	default:
		err = fmt.Errorf("unsupported platform")
	}

	if err != nil {
		fmt.Fprintf(os.Stderr, "Error opening browser: %s\n", err)
	}
}
