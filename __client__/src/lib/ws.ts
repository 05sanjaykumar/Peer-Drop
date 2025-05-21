let socket: WebSocket;

export function connectSocket(peerId: string, onMessage: (data:any)=>void) {
    socket = new WebSocket("ws://localhost:8080/ws")

    socket.addEventListener("open",()=>{
        console.log("Connected to signaling server");
        socket.send(JSON.stringify({
			type: "join",
			from: peerId
		}));
    });

    socket.addEventListener("message", (event)=>{
        const data = JSON.parse(event.data);
        onMessage(data);
    })
}

export function sendSignal(message: any) {
	socket?.send(JSON.stringify(message));
}