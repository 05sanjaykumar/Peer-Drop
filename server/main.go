
package main

import (
	"fmt"
	"log"
	"net/http"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func wsHandler(w http.ResponseWriter, r *http.Request){

}
func main() {
	http.HandleFunc("/ws",wsHandler)
	log.Println("WebSocket server started on :8080")
}
