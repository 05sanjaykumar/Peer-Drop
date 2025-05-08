package main

import (
	"github.com/gorilla/websocket"
)


type Client struct {
	ID   string
	Conn *websocket.Conn
}

type SignalMessage struct {
	Type string `json:"type"`
	From string `json:"from"`
	To      string      `json:"to"`
	Payload interface{} `json:"payload"`
}