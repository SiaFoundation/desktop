package main

import (
	"archive/zip"
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"time"

	"github.com/google/go-github/v53/github"
	"go.sia.tech/renterd/bus"
)

// NeedsDownload returns true if the app needs to be downloaded
func (a *App) NeedsDownload() bool {
	_, err := os.Stat(a.binaryFilePath())
	return err != nil
}

func (a *App) GetInstalledVersion() (string, error) {
	cfg, err := a.GetConfig()
	if err != nil {
		return "", err
	}
	client := bus.NewClient(cfg.HTTP.Address, cfg.HTTP.Password)
	state, err := client.State()
	if err != nil {
		return "", err
	}
	return state.Version, nil
}

func (a *App) GetLatestVersion() (string, error) {
	client := github.NewClient(nil)
	release, _, err := client.Repositories.GetLatestRelease(context.Background(), "SiaFoundation", "renterd")
	if err != nil {
		return "", fmt.Errorf("failed to get latest release: %w", err)
	}
	return *release.TagName, nil
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
			return downloadReleaseBinary(asset.GetBrowserDownloadURL(), a.binaryFilePath())
		}
	}
	fmt.Println("release name:", release.Name)
	fmt.Println("release tag:", release.TagName)
	return fmt.Errorf("failed to find release asset")
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

func (a *App) binaryFilePath() string {
	var binaryName string
	switch runtime.GOOS {
	case "windows":
		binaryName = "renterd.exe"
	default:
		binaryName = "renterd"
	}
	return filepath.Join(a.ConfigAndBinaryDirectoryPath(), "bin", binaryName)
}

func releaseAsset() string {
	return fmt.Sprintf("renterd_%s_%s.zip", runtime.GOOS, runtime.GOARCH)
}
