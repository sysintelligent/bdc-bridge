package cmd

import (
	"fmt"
	"net/http"
	"os"
	"os/exec"
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
	dashboardCmd.Flags().IntVarP(&port, "port", "p", 8080, "Port to run the dashboard server on")
	dashboardCmd.Flags().BoolVarP(&openBrowser, "open", "o", true, "Open the dashboard in the default browser")
}

func startDashboard() {
	// This is a placeholder function that would normally start the dashboard server
	// In a real implementation, this would serve the UI and connect to the backend

	addr := fmt.Sprintf("localhost:%d", port)
	url := fmt.Sprintf("http://%s", addr)

	// Create a simple HTTP server
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "DMI CLI Dashboard Server\n")
		fmt.Fprintf(w, "This is a placeholder for the actual dashboard UI.\n")
		fmt.Fprintf(w, "In a real implementation, this would serve the React UI.\n")
	})

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
