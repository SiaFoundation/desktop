package main

import (
	"context"
	"embed"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	wruntime "github.com/wailsapp/wails/v2/pkg/runtime"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

//go:embed all:frontend/out
var assets embed.FS

const (
	openBrowserOnStart = false
)

func main() {
	if err := os.MkdirAll(DataDirectory(), 0755); err != nil {
		panic(err)
	}

	cfg := zap.NewProductionEncoderConfig()
	cfg.TimeKey = "" // prevent duplicate timestamps
	cfg.EncodeTime = zapcore.RFC3339TimeEncoder
	cfg.EncodeDuration = zapcore.StringDurationEncoder
	cfg.EncodeLevel = zapcore.CapitalLevelEncoder
	cfg.StacktraceKey = ""
	cfg.CallerKey = ""
	encoder := zapcore.NewConsoleEncoder(cfg)

	fileWriter, closeFn, err := zap.Open(filepath.Join(DataDirectory(), "ui.log"))
	if err != nil {
		panic(err)
	}
	defer closeFn()

	core := zapcore.NewCore(encoder, fileWriter, zapcore.DebugLevel)
	log := zap.New(core, zap.AddCaller())

	// Create an instance of the app structure
	app := NewApp(log.Named("app"))

	// Create application with options
	err = wails.Run(&options.App{
		Title:     "renterd",
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
			a.log.Error("failed to download release", zap.Error(err))
		}
	}

	go func() {
		wruntime.EventsOn(a.ctx, "*", func(optionalData ...interface{}) {
			a.log.Debug("event received", zap.Any("event", optionalData[0]), zap.Any("data", optionalData))
		})
	}()

	if !a.IsConfigured() {
		wruntime.WindowShow(ctx)
	} else {
		wruntime.WindowShow(ctx)
		if err := a.StartDaemon(openBrowserOnStart); err != nil {
			a.log.Error("failed to start daemon", zap.Error(err))
		}
	}
}

func (a *App) shutdown(ctx context.Context) {
	if a.process != nil && a.process.Process != nil {
		if err := a.process.Process.Kill(); err != nil {
			a.log.Error("failed to kill daemon", zap.Error(err))
		}
	}
}
