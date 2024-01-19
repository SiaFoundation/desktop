package main

type ProcessEvent struct {
	Type string `json:"type"`
	Data any    `json:"data"`
}
