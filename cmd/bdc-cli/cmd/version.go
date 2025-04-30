package cmd

import (
	"fmt"
	"os/exec"
	"strings"

	"github.com/spf13/cobra"
)

// versionCmd represents the version command
var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print the version number of bdc-cli",
	Long:  `Print the version number of bdc-cli`,
	Run: func(cmd *cobra.Command, args []string) {
		version, err := getVersion()
		if err != nil {
			fmt.Printf("Error getting version: %v\n", err)
			return
		}
		fmt.Printf("bdc-cli version %s\n", version)
	},
}

func init() {
	rootCmd.AddCommand(versionCmd)
}

func getVersion() (string, error) {
	cmd := exec.Command("git", "describe", "--tags", "--abbrev=0")
	output, err := cmd.Output()
	if err != nil {
		return "", err
	}
	version := strings.TrimSpace(string(output))
	// Remove 'v' prefix if present
	if strings.HasPrefix(version, "v") {
		version = version[1:]
	}
	return version, nil
}
