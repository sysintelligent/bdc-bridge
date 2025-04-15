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
	openBrowser bool
	port        int
)

// dashboardCmd represents the dashboard command
var dashboardCmd = &cobra.Command{
	Use:   "dashboard",
	Short: "Open the BDC Bridge dashboard",
	Long: `Open the BDC Bridge dashboard in your default browser.
	
This command starts the Next.js development server if it's not running
and opens the main BDC Bridge dashboard UI in your default browser.`,
	Run: func(cmd *cobra.Command, args []string) {
		startDashboard()
	},
}

func init() {
	adminCmd.AddCommand(dashboardCmd)
	dashboardCmd.Flags().BoolVarP(&openBrowser, "open", "o", true, "Open the dashboard in the default browser")
	dashboardCmd.Flags().IntVarP(&port, "port", "p", 3000, "Port to run the dashboard on")
}

func startDashboard() {
	// Check if the dashboard is already running
	if !isDashboardRunning() {
		fmt.Println("Starting dashboard server...")
		startDashboardServer()
		// Wait for the server to start
		time.Sleep(2 * time.Second)
	}

	url := fmt.Sprintf("http://localhost:%d", port)
	fmt.Printf("Opening dashboard at %s\n", url)

	if openBrowser {
		openURL(url)
	} else {
		fmt.Printf("Dashboard is available at %s\n", url)
	}
}

func isDashboardRunning() bool {
	resp, err := http.Get(fmt.Sprintf("http://localhost:%d/health", port))
	if err != nil {
		return false
	}
	defer resp.Body.Close()
	return resp.StatusCode == http.StatusOK
}

func startDashboardServer() {
	// Change to the UI directory
	uiDir := "../../ui"
	if err := os.Chdir(uiDir); err != nil {
		fmt.Printf("Error changing to UI directory: %v\n", err)
		return
	}

	// Start the Next.js development server
	cmd := exec.Command("npm", "run", "dev")
	cmd.Env = append(os.Environ(), "PORT="+fmt.Sprintf("%d", port))
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Start(); err != nil {
		fmt.Printf("Error starting dashboard server: %v\n", err)
		return
	}

	// Change back to the original directory
	if err := os.Chdir("../.."); err != nil {
		fmt.Printf("Error changing back to original directory: %v\n", err)
	}
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
