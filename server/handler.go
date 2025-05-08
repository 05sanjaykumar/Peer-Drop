package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var (
	clients   = make(map[string]*Client)
	clientsMu sync.RWMutex
	upgrader  = websocket.Upgrader{}
)

func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}

	var currentClient *Client

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil { // if No error then skip
			log.Println("Read error:", err)
			if currentClient != nil {
				removeClient(currentClient.ID)
			}
			return
		}

		var signal SignalMessage
		if err := json.Unmarshal(msg, &signal); err != nil {
			log.Println("Unmarshal error:", err)
			continue
		}

		switch signal.Type {
		case "join":
			clientID := signal.From
			currentClient = &Client{ID: clientID, Conn: conn}
			registerClient(currentClient)
			log.Printf("Peer %s joined", clientID)

		case "offer", "answer", "candidate":
			forwardMessage(signal)
		default:
			log.Println("Unknown signal type:", signal.Type)
		}
	}
}


func registerClient(c *Client) {
	clientsMu.Lock()
	defer clientsMu.Unlock()
	clients[c.ID] = c
}

func removeClient(id string) {
	clientsMu.Lock()
	defer clientsMu.Unlock()
	delete(clients, id)
	log.Printf("Peer %s disconnected", id)
}

func forwardMessage(msg SignalMessage) {
	clientsMu.RLock()
	defer clientsMu.RUnlock()

	target, ok := clients[msg.To]
	if !ok {
		log.Printf("Peer %s not found", msg.To)
		return
	}

	if err := target.Conn.WriteJSON(msg); err != nil {
		log.Println("Write error:", err)
	}
}
