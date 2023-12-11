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

// GenerateSeed generates a new seed phrase
func (a *App) GenerateSeed() string {
	return wallet.NewSeedPhrase()
}

// NeedsConfig returns true if the app needs to be configured
func (a *App) NeedsConfig() bool {
	f, err := os.Open(filepath.Join(dataPath(), "config.yaml"))
	if err != nil {
		log.Println("failed to open config file:", err)
		return true
	}
	defer f.Close()
	dec := yaml.NewDecoder(f)

	var cfg config.Config
	if err := dec.Decode(&cfg); err != nil {
		log.Println("failed to decode config file:", err)
		return true
	}

	var seed [32]byte
	if err := wallet.SeedFromPhrase(&seed, cfg.RecoveryPhrase); err != nil {
		log.Println("invalid recovery phrase:", err)
		return true
	}
	log.Println(len(cfg.Directory))
	return cfg.Directory == "" || cfg.HTTP.Password == ""
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

func configFilePath() string {
	return filepath.Join(dataPath(), "config.yaml")
}

func dataPath() string {
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
