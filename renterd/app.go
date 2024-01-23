package main

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"syscall"

	wruntime "github.com/wailsapp/wails/v2/pkg/runtime"
	"go.uber.org/zap"
)

// App struct
type App struct {
	ctx context.Context

	log     *zap.Logger
	process *exec.Cmd
}

func (a *App) OpenBrowser() {
	cfg, err := a.GetConfig()
	if err != nil {
		a.log.Debug("failed to get config", zap.Error(err))
		return
	}
	addr := "http://" + cfg.HTTP.Address
	wruntime.BrowserOpenURL(a.ctx, addr)
}

func (a *App) Open(path string) error {
	switch runtime.GOOS {
	case "linux":
		return exec.Command("xdg-open", path).Start()
	case "windows":
		return exec.Command("rundll32", "url.dll,FileProtocolHandler", path).Start()
	case "darwin":
		return exec.Command("open", path).Start()
	default:
		return fmt.Errorf("unsupported platform")
	}
}

// StartDaemon starts renterd in the background
func (a *App) StartDaemon(open bool) error {
	log := a.log.Named("daemon")
	a.StopDaemon()

	// setup the command
	cmd := exec.Command(a.binaryFilePath())
	// cmd := exec.Command(a.binaryFilePath(), "-env")
	cmd.Env = append(cmd.Env, "RENTERD_CONFIG_FILE="+a.ConfigAndBinaryPath())
	cfg, err := a.GetConfig()
	if err != nil {
		return fmt.Errorf("failed to start renterd: %w", err)
	}
	cmd.Dir = cfg.Directory
	r, w := io.Pipe()
	cmd.Stdout = w
	cmd.Stderr = w
	// start the process
	if err := cmd.Start(); err != nil {
		return fmt.Errorf("failed to start renterd: %w", err)
	}
	if open {
		a.OpenBrowser()
	}
	a.process = cmd

	go func() {
		br := bufio.NewReader(r)
		for str, err := br.ReadString('\n'); err == nil; str, err = br.ReadString('\n') {
			log.Debug("stdout", zap.String("line", str))
			wruntime.EventsEmit(a.ctx, "process", ProcessEvent{
				Type: "log",
				Data: str,
			})
		}
	}()

	go func() {
		if err := cmd.Wait(); err != nil {
			log.Debug("exited", zap.Error(err))
		}
	}()
	return nil
}

func (a *App) StopDaemon() error {
	if a.process == nil {
		return fmt.Errorf("daemon is not running")
	}

	if err := a.process.Process.Signal(syscall.SIGINT); err != nil {
		// Handle specific 'no child processes' error
		if strings.Contains(err.Error(), "no child processes") {
			a.process = nil
			return nil // Process is already stopped
		}
		return fmt.Errorf("failed to stop daemon: %w", err)
	}

	if _, err := a.process.Process.Wait(); err != nil {
		if strings.Contains(err.Error(), "no child processes") {
			a.process = nil
			return nil // Process is already stopped
		}
		return fmt.Errorf("error waiting for daemon to stop: %w", err)
	}

	a.process = nil
	return nil
}

func (a *App) IsDaemonRunning() bool {
	if a.process == nil {
		return false
	}

	// Check if the process has exited
	if a.process.ProcessState != nil && a.process.ProcessState.Exited() {
		return false
	}

	return true
}

// DataDirectory returns the directory for storing app data
func DataDirectory() string {
	switch runtime.GOOS {
	case "windows":
		return filepath.Join(os.Getenv("APPDATA"), "renterd")
	case "darwin":
		return filepath.Join(os.Getenv("HOME"), "Library", "Application Support", "renterd")
	case "linux":
		return filepath.Join(os.Getenv("HOME"), ".config", "renterd")
	default:
		panic("unsupported operating system")
	}
}

// NewApp creates a new App application struct
func NewApp(log *zap.Logger) *App {
	return &App{log: log}
}
