package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"runtime"

	"go.sia.tech/core/wallet"
	"go.sia.tech/hostd/config"
	"gopkg.in/yaml.v3"
)

// IsConfigured returns false if the app needs to be configured
func (a *App) IsConfigured() bool {
	cfg, err := a.GetConfig()
	if err != nil {
		return false
	}
	var seed [32]byte
	if err := wallet.SeedFromPhrase(&seed, cfg.RecoveryPhrase); err != nil {
		log.Println("invalid recovery phrase:", err)
		return false
	}
	return cfg.Directory != "" && cfg.HTTP.Password != ""
}

// SaveConfig saves the config
func (a *App) SaveConfig(config config.Config) error {
	// validate the recovery phrase
	var seed [32]byte
	if err := wallet.SeedFromPhrase(&seed, config.RecoveryPhrase); err != nil {
		return fmt.Errorf("invalid recovery phrase: %w", err)
	}

	if config.HTTP.Password == "" {
		return fmt.Errorf("API password must be set")
	}

	// set the data dir if it's not set
	if len(config.Directory) == 0 {
		config.Directory = a.DefaultDataPath()
	}
	// create the data directory
	if err := os.MkdirAll(config.Directory, 0775); err != nil {
		return fmt.Errorf("failed to create data directory: %w", err)
	}
	// create the config directory
	if err := os.MkdirAll(a.ConfigAndBinaryDirectoryPath(), 0775); err != nil {
		return fmt.Errorf("failed to create config directory: %w", err)
	}
	// write the config file
	f, err := os.Create(filepath.Join(a.ConfigAndBinaryDirectoryPath(), "config.yaml"))
	if err != nil {
		return fmt.Errorf("failed to create config file: %w", err)
	}
	defer f.Close()
	enc := yaml.NewEncoder(f)
	return enc.Encode(config)
}

func (a *App) GetConfig() (config.Config, error) {
	f, err := os.Open(filepath.Join(a.ConfigAndBinaryDirectoryPath(), "config.yaml"))
	if err != nil {
		log.Println("failed to open config file:", err)
		return config.Config{}, err
	}
	defer f.Close()
	dec := yaml.NewDecoder(f)

	var cfg config.Config
	if err := dec.Decode(&cfg); err != nil {
		log.Println("failed to decode config file:", err)
		return config.Config{}, err
	}
	return cfg, nil
}

// ConfigAndBinaryDirectoryPath is where the config file and the binary are location.
func (a *App) ConfigAndBinaryDirectoryPath() string {
	switch runtime.GOOS {
	case "windows":
		return filepath.Join(os.Getenv("APPDATA"), "hostd")
	case "darwin":
		return filepath.Join(os.Getenv("HOME"), "Library", "Application Support", "hostd")
	case "linux":
		return filepath.Join(os.Getenv("HOME"), ".config", "hostd")
	default:
		panic("unsupported operating system")
	}
}

func (a *App) ConfigAndBinaryPath() string {
	return filepath.Join(a.ConfigAndBinaryDirectoryPath(), "config.yaml")
}

// DefaultDataPath is the default data path, which can be changed in the config.
func (a *App) DefaultDataPath() string {
	return a.ConfigAndBinaryDirectoryPath()
}

func (a *App) OpenDataDirectory() {
	cfg, err := a.GetConfig()
	if err != nil {
		a.Open(a.DefaultDataPath())
	} else {
		a.Open(cfg.Directory)
	}
}

func (a *App) OpenConfigDirectory() {
	path := a.ConfigAndBinaryDirectoryPath()
	a.Open(path)
}

func (a *App) OpenConfigFile() {
	path := a.ConfigAndBinaryPath()
	a.Open(path)
}

// GenerateSeed generates a new seed phrase
func (a *App) GenerateSeed() string {
	return wallet.NewSeedPhrase()
}

func (a *App) IsValidPhrase(phrase string) bool {
	var seed [32]byte
	err := wallet.SeedFromPhrase(&seed, phrase)
	return err == nil
}
