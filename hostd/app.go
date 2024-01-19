package main

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"log"
	"os/exec"
	"runtime"
	"strings"
	"syscall"

	wruntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context

	process *exec.Cmd
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

func (a *App) OpenBrowser() {
	cfg, err := a.GetConfig()
	if err != nil {
		log.Println("failed to get config:", err)
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

// StartDaemon starts hostd in the background
func (a *App) StartDaemon(open bool) error {
	a.StopDaemon()

	// setup the command
	cmd := exec.Command(a.binaryFilePath(), "-env")
	cmd.Env = append(cmd.Env, "HOSTD_CONFIG_FILE="+a.ConfigAndBinaryPath())
	cfg, err := a.GetConfig()
	if err != nil {
		return fmt.Errorf("failed to start hostd: %w", err)
	}
	cmd.Dir = cfg.Directory
	r, w := io.Pipe()
	cmd.Stdout = w
	cmd.Stderr = w
	// start the process
	if err := cmd.Start(); err != nil {
		return fmt.Errorf("failed to start hostd: %w", err)
	}
	if open {
		a.OpenBrowser()
	}
	a.process = cmd

	go func() {
		br := bufio.NewReader(r)
		for str, err := br.ReadString('\n'); err == nil; str, err = br.ReadString('\n') {
			log.Println(str)
			wruntime.EventsEmit(a.ctx, "process", ProcessEvent{
				Type: "log",
				Data: str,
			})
		}
	}()

	go func() {
		if err := cmd.Wait(); err != nil {
			log.Println("hostd exited:", err)
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
