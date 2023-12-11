package main

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"log"
	"os/exec"
	"runtime"
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

func (a *App) OpenBrowser() error {
	addr := "http://localhost:9980"
	switch runtime.GOOS {
	case "linux":
		return exec.Command("xdg-open", addr).Start()
	case "windows":
		return exec.Command("rundll32", "url.dll,FileProtocolHandler", addr).Start()
	case "darwin":
		return exec.Command("open", addr).Start()
	default:
		return fmt.Errorf("unsupported platform")
	}
}

// StartDaemon starts hostd in the background
func (a *App) StartDaemon(open bool) error {
	if a.process != nil {
		a.process.Process.Signal(syscall.SIGINT)
		return nil
	}
	// setup the command
	cmd := exec.Command(execFilePath(), "-env")
	cmd.Env = append(cmd.Env, "HOSTD_CONFIG_FILE="+configFilePath())
	cmd.Dir = dataPath()
	r, w := io.Pipe()
	cmd.Stdout = w
	cmd.Stderr = w
	// start the process
	if err := cmd.Start(); err != nil {
		return fmt.Errorf("failed to start hostd: %w", err)
	}
	if open {
		if err := a.OpenBrowser(); err != nil {
			return fmt.Errorf("failed to open browser: %w", err)
		}
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
