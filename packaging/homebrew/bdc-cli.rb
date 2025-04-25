class BdcCli < Formula
  desc "A tool between developers and complex backend infrastructure"
  homepage "https://github.com/sysintelligent/bdc-bridge"
  url "https://github.com/sysintelligent/bdc-bridge/archive/v1.0.4.tar.gz"
  sha256 "79741de3ef7027f2d6dcff44c8ec6eed0968b32ad43d816a62b2f6881bd0dc2e"

  depends_on "go" => :build
  depends_on "node" => :build
  depends_on "npm" => :build

  def install
    # Build the Go binary
    system "go", "build", "-ldflags", "-X 'github.com/sysintelligent/bdc-bridge/cmd/bdc-cli/cmd.Version=#{version}'", "-o", "bdc-cli-bin", "./cmd/bdc-cli"
    libexec.install "bdc-cli-bin"
    
    # Create a wrapper script that sets up the user's home directory for UI files
    wrapper_script = "#!/bin/bash\n\n"
    wrapper_script += "# Create user home directory for bdc-cli if it doesn't exist\n"
    wrapper_script += "USER_BDC_DIR=\"${HOME}/.bdc-cli\"\n"
    wrapper_script += "USER_UI_DIR=\"${USER_BDC_DIR}/ui\"\n\n"
    wrapper_script += "if [ ! -d \"${USER_UI_DIR}\" ]; then\n"
    wrapper_script += "  mkdir -p \"${USER_UI_DIR}\"\n"
    wrapper_script += "  echo \"Setting up BDC CLI for first use...\"\n\n"
    wrapper_script += "  # Copy all the UI files\n"
    wrapper_script += "  if [ -d \"#{libexec}/ui-files\" ]; then\n"
    wrapper_script += "    cp -R \"#{libexec}/ui-files/\"* \"${USER_UI_DIR}/\" 2>/dev/null || true\n\n"
    wrapper_script += "    # Copy hidden files and directories\n"
    wrapper_script += "    if [ -d \"#{libexec}/ui-files/.next\" ]; then\n"
    wrapper_script += "      mkdir -p \"${USER_UI_DIR}/.next\"\n"
    wrapper_script += "      cp -R \"#{libexec}/ui-files/.next/\"* \"${USER_UI_DIR}/.next/\" 2>/dev/null || true\n"
    wrapper_script += "    fi\n\n"
    wrapper_script += "    # Install dependencies\n"
    wrapper_script += "    echo \"Installing Node.js dependencies...\"\n"
    wrapper_script += "    cd \"${USER_UI_DIR}\"\n"
    wrapper_script += "    npm install --quiet\n"
    wrapper_script += "  else\n"
    wrapper_script += "    echo \"Warning: UI files not found. Some features may not work correctly.\"\n"
    wrapper_script += "  fi\n"
    wrapper_script += "fi\n\n"
    wrapper_script += "# Set environment variable to point to user's UI directory\n"
    wrapper_script += "export BDC_UI_PATH=\"${USER_UI_DIR}\"\n\n"
    wrapper_script += "# Execute the main binary\n"
    wrapper_script += "exec \"#{libexec}/bdc-cli-bin\" \"$@\"\n"
    
    (bin/"bdc-cli").write(wrapper_script)
    
    # Ensure the script is executable
    chmod 0755, bin/"bdc-cli"

    # Install UI files to a temporary location in libexec
    mkdir_p "#{libexec}/ui-files"
    
    # Build and install UI files
    cd "ui" do
      system "npm", "install", "--quiet"
      system "npm", "run", "build"
      
      # Copy UI files with error handling
      Dir.glob(".next/**/*").each do |file|
        next if File.directory?(file)
        target = "#{libexec}/ui-files/#{file}"
        FileUtils.mkdir_p(File.dirname(target))
        FileUtils.cp(file, target)
      end
      
      # Copy other necessary files
      ["public", "src", "package.json", "next.config.js", "tsconfig.json", 
       "tailwind.config.js", "postcss.config.js", "next-env.d.ts", 
       "components.json"].each do |file|
        if File.exist?(file)
          if File.directory?(file)
            FileUtils.cp_r(file, "#{libexec}/ui-files/")
          else
            FileUtils.cp(file, "#{libexec}/ui-files/")
          end
        end
      end
    end
    
    # Create a default configuration file
    config_content = "{\n  \"ui_path\": \"${HOME}/.bdc-cli/ui\"\n}\n"
    (etc/"bdc-cli.conf").write(config_content)
  end

  test do
    system "#{bin}/bdc-cli", "version"
  end
end 