package cmd

import (
	"fmt"
	"os"
	"os/exec"
	"runtime"

	"github.com/spf13/cobra"
)

var (
	openBrowser bool
)

// dashboardCmd represents the dashboard command
var dashboardCmd = &cobra.Command{
	Use:   "dashboard",
	Short: "Open the BDC Bridge dashboard",
	Long: `Open the BDC Bridge dashboard in your default browser.
	
This command opens the main BDC Bridge dashboard UI in your default browser.`,
	Run: func(cmd *cobra.Command, args []string) {
		openDashboard()
	},
}

func init() {
	adminCmd.AddCommand(dashboardCmd)
	dashboardCmd.Flags().BoolVarP(&openBrowser, "open", "o", true, "Open the dashboard in the default browser")
}

func openDashboard() {
	url := "http://localhost:8080"
	fmt.Printf("Opening dashboard at %s\n", url)

	if openBrowser {
		openURL(url)
	} else {
		fmt.Printf("Dashboard is available at %s\n", url)
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
