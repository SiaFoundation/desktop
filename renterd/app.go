package main

import (
	"archive/zip"
	"bufio"
	"bytes"
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"syscall"
	"time"

	"github.com/google/go-github/v53/github"
	wruntime "github.com/wailsapp/wails/v2/pkg/runtime"
	"go.sia.tech/core/wallet"
	"go.sia.tech/renterd/config"
	"gopkg.in/yaml.v3"
)

// App struct
type App struct {
	ctx context.Context

	cfg     config.Config
	process *exec.Cmd
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// GenerateSeed generates a new seed phrase
func (a *App) GenerateSeed() string {
	return wallet.NewSeedPhrase()
}

// LoadConfig loads the config file
func (a *App) LoadConfig() (config.Config, error) {
	f, err := os.Open(filepath.Join(dataPath(), "config.yaml"))
	if err != nil {
		return config.Config{}, fmt.Errorf("failed to open config file: %w", err)
	}
	defer f.Close()
	dec := yaml.NewDecoder(f)

	var cfg config.Config
	if err := dec.Decode(&cfg); err != nil {
		return config.Config{}, fmt.Errorf("failed to decode config file: %w", err)
	}
	return cfg, nil
}

// ValidConfig returns true if the config is valid
func (a *App) ValidConfig(cfg config.Config) bool {
	var seed [32]byte
	err := wallet.SeedFromPhrase(&seed, cfg.Seed)
	return err == nil && cfg.Directory != "" && cfg.HTTP.Password != ""
}

// NeedsDownload returns true if the app needs to be downloaded
func (a *App) NeedsDownload() bool {
	_, err := os.Stat(execFilePath())
	return err != nil
}

// DownloadRelease downloads the latest renterd release
func (a *App) DownloadRelease() error {
	client := github.NewClient(nil)
	release, _, err := client.Repositories.GetLatestRelease(context.Background(), "SiaFoundation", "renterd")
	if err != nil {
		return fmt.Errorf("failed to get latest release: %w", err)
	}
	for _, asset := range release.Assets {
		if asset.GetName() == releaseAsset() {
			return downloadReleaseBinary(asset.GetBrowserDownloadURL(), execFilePath())
		}
	}
	return fmt.Errorf("failed to find release asset")
}

// SaveConfig saves the config
func (a *App) SaveConfig(config config.Config) error {
	// validate the recovery phrase
	var seed [32]byte
	if err := wallet.SeedFromPhrase(&seed, config.Seed); err != nil {
		return fmt.Errorf("invalid recovery phrase: %w", err)
	}

	// set the data dir if it's not set
	if len(config.Directory) == 0 {
		config.Directory = dataPath()
	}
	// create the data directory
	if err := os.MkdirAll(dataPath(), 0775); err != nil {
		return fmt.Errorf("failed to create data directory: %w", err)
	}
	// write the config file
	f, err := os.Create(configFilePath())
	if err != nil {
		return fmt.Errorf("failed to create config file: %w", err)
	}
	defer f.Close()
	enc := yaml.NewEncoder(f)
	return enc.Encode(config)
}

func (a *App) OpenBrowser(addr string) error {
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

// Start starts renterd in the background
func (a *App) Start() error {
	if a.process != nil {
		a.process.Process.Signal(syscall.SIGQUIT)
		a.process.Process.Wait()
		return nil
	}
	// setup the command
	cmd := exec.Command(execFilePath())
	cmd.Env = append(cmd.Env, "RENTERD_CONFIG_FILE="+configFilePath())
	cmd.Dir = dataPath()
	r, w := io.Pipe()
	cmd.Stdout = w
	cmd.Stderr = w
	// start the process
	if err := cmd.Start(); err != nil {
		return fmt.Errorf("failed to start: %w", err)
	} else if err := a.OpenBrowser("http://localhost:9980"); err != nil {
		return fmt.Errorf("failed to open browser: %w", err)
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
			log.Println("exited:", err)
		}
	}()
	return nil
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	if a.NeedsDownload() {
		if err := a.DownloadRelease(); err != nil {
			log.Println("failed to download release:", err)
		}
	}

	cfg, err := a.LoadConfig()
	if err != nil {
		log.Println("failed to load config:", err)
		return
	} else if !a.ValidConfig(cfg) {
		return
	}
	a.cfg = cfg
	if err := a.Start(); err != nil {
		log.Println("failed to start:", err)
	}
}

func (a *App) shutdown(ctx context.Context) {
	if a.process != nil && a.process.Process != nil {
		if err := a.process.Process.Kill(); err != nil {
			log.Println("failed to kill:", err)
		}
	}
}

func downloadReleaseBinary(assetUrl, binFP string) error {
	client := &http.Client{
		Timeout: 10 * time.Second,
	}
	resp, err := client.Get(assetUrl)
	if err != nil {
		return fmt.Errorf("failed to download release binary: %w", err)
	}
	defer resp.Body.Close()

	buf, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response body: %w", err)
	}
	r := bytes.NewReader(buf)
	zr, err := zip.NewReader(r, int64(len(buf)))
	if err != nil {
		return fmt.Errorf("failed to create zip reader: %w", err)
	}

	var binName string
	switch runtime.GOOS {
	case "windows":
		binName = "renterd.exe"
	default:
		binName = "renterd"
	}

	zf, err := zr.Open(binName)
	if err != nil {
		return fmt.Errorf("failed to open binary in zip: %w", err)
	}
	defer zf.Close()

	binDir := filepath.Dir(binFP)
	if err := os.MkdirAll(binDir, 0775); err != nil {
		return fmt.Errorf("failed to create binary directory: %w", err)
	}

	f, err := os.OpenFile(binFP, os.O_CREATE|os.O_WRONLY, 0775)
	if err != nil {
		return fmt.Errorf("failed to create binary file: %w", err)
	}
	defer f.Close()

	_, err = io.Copy(f, zf)
	return err
}

func execFilePath() string {
	var binaryName string
	switch runtime.GOOS {
	case "windows":
		binaryName = "renterd.exe"
	default:
		binaryName = "renterd"
	}
	return filepath.Join(dataPath(), "bin", binaryName)
}

func releaseAsset() string {
	return fmt.Sprintf("renterd_mainnet_%s_%s.zip", runtime.GOOS, runtime.GOARCH)
}

func configFilePath() string {
	return filepath.Join(dataPath(), "config.yaml")
}

func dataPath() string {
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
