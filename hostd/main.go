package main

import (
	"context"
	"embed"
	"log"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	wruntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

//go:embed all:frontend/out
var assets embed.FS

const (
	openBrowserOnStart = false
)

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:     "hostd",
		Width:     500,
		Height:    700,
		MinWidth:  500,
		MinHeight: 600,
		MaxWidth:  500,
		MaxHeight: 800,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour:  &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:         app.startup,
		OnShutdown:        app.shutdown,
		HideWindowOnClose: true,
		StartHidden:       false,
		Menu:              Menu(app),
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
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

	go func() {
		wruntime.EventsOn(a.ctx, "*", func(optionalData ...interface{}) {
			log.Println("event:", optionalData)
		})
	}()

	if !a.IsConfigured() {
		wruntime.WindowShow(ctx)
	} else {
		wruntime.WindowShow(ctx)
		if err := a.StartDaemon(openBrowserOnStart); err != nil {
			log.Println("failed to start hostd:", err)
		}
	}
}

func (a *App) shutdown(ctx context.Context) {
	if a.process != nil && a.process.Process != nil {
		if err := a.process.Process.Kill(); err != nil {
			log.Println("failed to kill hostd:", err)
		}
	}
}
