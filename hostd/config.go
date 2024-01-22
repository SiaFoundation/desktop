package main

import (
	"fmt"
	"os"
	"path/filepath"

	"go.sia.tech/core/wallet"
	"go.sia.tech/hostd/config"
	"go.uber.org/zap"
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
		a.log.Error("invalid recovery phrase", zap.Error(err))
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
		a.log.Error("failed to open config file", zap.Error(err))
		return config.Config{}, fmt.Errorf("failed to open config file: %w", err)
	}
	defer f.Close()
	dec := yaml.NewDecoder(f)

	var cfg config.Config
	if err := dec.Decode(&cfg); err != nil {
		a.log.Error("failed to decode config file", zap.Error(err))
		return config.Config{}, fmt.Errorf("failed to decode config file: %w", err)
	}
	return cfg, nil
}

// ConfigAndBinaryDirectoryPath is where the config file and the binary are location.
func (a *App) ConfigAndBinaryDirectoryPath() string {
	return DataDirectory()
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
