
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
	conn, err := upgrader.Upgrade(w,r,nil)
	if err != nil {
		log.Println("Upgrade error:", err)
    	return
	}

	defer conn.Close()

	log.Println("Client connected.")

	for{
		mt, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("Read error:", err)
			break
		}

		log.Printf("Received: %s", message)
		response := fmt.Sprintf("Echo: %s", message)

		if err := conn.WriteMessage(mt, []byte(response)); err != nil {
			log.Println("Write error:", err)
			break
		}		

	}
}
func main() {
	http.HandleFunc("/ws",wsHandler)
	log.Println("WebSocket server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
