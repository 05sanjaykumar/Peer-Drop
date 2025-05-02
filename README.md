# 📡 PeerDrop

**PeerDrop** is a secure, real-time peer-to-peer (P2P) file sharing and chat application built with modern technologies like **SvelteKit**, **Go**, **WebRTC**, and **Docker**.

> 🔥 Real-time. 🔐 End-to-end encrypted. ⚙️ Fully containerized.

---

## 🚀 Features

- 🔌 Real-time P2P communication via **WebRTC**
- 🧭 Signaling server built in **Go** with **WebSocket**
- 🗂 Secure file transfer using **AES-GCM encryption**
- 💬 Encrypted chat over `RTCDataChannel`
- 🆔 Optional ECC keypair identity system
- 🛠 Dockerized setup for client & server
- 📦 Easy to run, test, and deploy

---

## 📦 Tech Stack

| Layer      | Tech                           | Purpose                          |
| ---------- | ------------------------------ | -------------------------------- |
| Frontend   | [SvelteKit](https://kit.svelte.dev/) | Reactive UI + routing            |
| Backend    | [Go](https://go.dev/)          | Signaling server                 |
| Networking | WebSocket + WebRTC             | Real-time P2P transport          |
| Security   | AES-GCM, PBKDF2, ECC (opt-in)  | End-to-end encryption            |
| DevOps     | Docker + Docker Compose        | Containerized app infrastructure |

---

## 📁 Project Structure

```

peerdrop/
├── client/                 # SvelteKit frontend
│   ├── src/
│   │   ├── routes/         # Pages (UI)
│   │   ├── lib/            # Encryption, WebRTC logic
│   └── static/             # Public files
├── server/                 # Go signaling server
│   ├── main.go
│   ├── handlers.go
│   └── Dockerfile
├── docker-compose.yml      # Full stack orchestration
└── README.md               # You're here!

````

---

## 🛠 Setup & Development

### Prerequisites

- Go (>=1.20)
- Node.js (>=18) + pnpm
- Docker + Docker Compose

---

### 🧑‍💻 Local Dev

#### 1. Clone the Repo

```bash
git clone https://github.com/05sanjaykumar/Peer-Drop.git
cd peerdrop
````

#### 2. Run Signaling Server (Go)

```bash
cd server
go run main.go
```

#### 3. Run SvelteKit Client

```bash
cd client
pnpm install
pnpm dev
```

Visit: `http://localhost:5173`

---

## 🐳 Docker Deployment

To run the whole app using Docker:

```bash
docker-compose up --build
```

Frontend: `http://localhost:3000`
Backend (WebSocket): `ws://localhost:8080/ws`

---

## 🔐 Security Model

* **Files & Chat** encrypted with **AES-GCM**
* Optional ECC keypair generation for identity
* Fingerprints can be used to verify user authenticity

---

## 📌 Roadmap

* [x] WebSocket signaling server in Go
* [x] SvelteKit frontend + WebRTC handshake
* [ ] Encrypted file transfer
* [ ] Encrypted chat
* [ ] ECC keypair identity system
* [ ] Drag & drop upload, file previews
* [ ] Docker production deployment

---

## 🧠 Learnings & Concepts

* WebRTC, ICE, SDP, STUN
* Real-time messaging protocols
* Cryptographic key exchange
* Concurrency with Go
* SvelteKit UI + reactive state
* Docker container orchestration

---

## 🤝 Contributing

Want to improve or extend PeerDrop? PRs are welcome! Please open an issue for major feature discussions.

---

## 📖 License

MIT © 2025 Sanjay

---

## 🌍 Credits

This project is a hands-on learning initiative to explore the intersection of **networking**, **frontend frameworks**, **cryptography**, and **real-time systems**.

Built with ❤️ by [@yourusername](https://github.com/yourusername)


