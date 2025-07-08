## 🧠 OVERVIEW: WebRTC + Signaling Flow in PeerDrop

We’ll break this into **6 stages**, each clear and atomic:

---

### 🟢 1. **User Joins a Room**

* Room page is accessed: `http://localhost:3000/room/<roomId>`
* Profile is checked and loaded (`db.profiles.get("me")`)
* Room is checked and loaded from Dexie (`db.rooms.get(roomId)`)
* User is added to room participants if not already there
* At this point, the user has a:

  * `roomId`
  * `peerId` (from their profile)
  * List of other `participants`

→ **Now we’re ready to try to connect to other peers**

---

### 🛰️ 2. **Connect to Signaling Server**

* We establish a WebSocket connection via `ws.ts`
* Immediately send a `join` message:

```json
{
  type: "join",
  from: "my-peer-id"
}
```

* Server registers this client and can now relay messages

→ All further signaling messages (`offer`, `answer`, `candidate`) will be routed through this WebSocket

---

### 📡 3. **Start Signaling to Other Participants**

For every other participant in the room:

* **If my ID < their ID**, I will:

  * Create a new RTCPeerConnection
  * Create an SDP offer
  * Send this offer over WebSocket:

```json
{
  type: "offer",
  from: "my-peer-id",
  to: "their-peer-id",
  payload: { sdp }
}
```

* If **my ID > theirs**, I wait to receive an offer

→ This ensures only one peer initiates the connection (avoids duplication)

---

### 🛠️ 4. **Exchange WebRTC Signaling Data**

**Peer A sends offer → Peer B responds with:**

* An SDP answer (`type: "answer"`)
* Then both peers exchange ICE candidates (`type: "candidate"`)

At this stage:

* `RTCPeerConnection` objects are set up
* `setRemoteDescription`, `addIceCandidate`, etc. are called as needed

→ WebRTC handles NAT traversal via ICE and STUN servers

---

### 🔗 5. **Establish Data Channel (or Media)**

* The **initiator (the offerer)** creates a `RTCDataChannel`
* The **responder (the answerer)** receives it via `ondatachannel`
* They can now send files or messages peer-to-peer using:

```ts
dataChannel.send("some binary or text data");
```

→ Connection is now **peer-to-peer** and no longer needs signaling

---

### 🧼 6. **Handle Disconnect / Cleanup (Later)**

Eventually we’ll want to:

* Remove participants from Dexie when they leave
* Close connections
* Maybe broadcast leave messages

---

## 🧱 Architecture Summary (Responsibility Split)

| Component             | Responsibility                                           |
| --------------------- | -------------------------------------------------------- |
| `Room.tsx`            | UI, gets profile/room context                            |
| `ws.ts`               | Connects to signaling server                             |
| `lib/webrtc.ts`       | Manages all PeerConnection logic per peer                |
| `useWebRTC.ts`        | React hook for orchestrating lifecycle and storing state |
| WebSocket Server (Go) | Routes signaling messages from `from` → `to`             |

---

## 🧭 Flowchart Summary (1-on-1 case):

```
+----------------+          +----------------+
|   Peer A       |  <--->   |    Peer B      |
| (ID: abc)      |          | (ID: xyz)      |
+----------------+          +----------------+
        |                          |
        |  Join Room               |
        |------------------------>|
        |                          |
        |---- WebSocket Join ---->|
        |                          |
        |<--- WebSocket Join -----|
        |                          |
        |---- createOffer -------->|
        |                          |
        |<--- sendAnswer ----------|
        |                          |
        |<--> ICE candidates <---->|
        |                          |
        |<==== P2P connection ====→|
```

---

## ✅ Next Step

If this plan looks solid to you, here’s what we’d start coding next (step-by-step):

1. \[`lib/webrtc.ts`] — Core peer connection logic
2. \[`useWebRTC.ts`] — Hook to manage per-peer state & integrate into React
3. \[`Room.tsx`] — Hook up WebSocket + WebRTC connection logic on room load
