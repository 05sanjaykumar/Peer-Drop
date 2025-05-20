// src/lib/webrtc.ts

let peerConnection: RTCPeerConnection;
let dataChannel: RTCDataChannel;
let dataChannelGlobal: RTCDataChannel | null = null;

let candidateQueue: RTCIceCandidateInit[] = [];
let remoteSet = false;

const config: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

export function createPeer(
  isInitiator: boolean,
  onData: (msg: string) => void,
  sendSignal: (msg: any) => void,
  onDataChannelOpen: () => void
) {
  peerConnection = new RTCPeerConnection(config);

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      sendSignal({
        type: "candidate",
        payload: event.candidate
      });
    }
  };
    peerConnection.oniceconnectionstatechange = () => {
    console.log("ICE state:", peerConnection.iceConnectionState);
  };

  peerConnection.onconnectionstatechange = () => {
    console.log("Peer connection state:", peerConnection.connectionState);
  };


  if (isInitiator) {
    dataChannel = peerConnection.createDataChannel("chat");
    setupDataChannel(dataChannel, onData, onDataChannelOpen);
  } else {
    peerConnection.ondatachannel = (event) => {
      dataChannel = event.channel;
      setupDataChannel(dataChannel, onData, onDataChannelOpen);
    };
  }

  dataChannelGlobal = dataChannel;


  return peerConnection;
}

function setupDataChannel(
  channel: RTCDataChannel,
  onData: (msg: string) => void,
  onOpen: () => void
) {
  channel.onopen = () => {
    console.log("Data channel open");
    onOpen();
  };

  channel.onmessage = (event) => {
    console.log("Message from peer:", event.data);
    onData(event.data);
  };
}

export async function createOffer(
  sendSignal: (msg: any) => void,
  from: string,
  to: string
) {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  sendSignal({
    type: "offer",
    from,
    to,
    payload: offer
  });
}

export async function handleOffer(
  offer: RTCSessionDescriptionInit,
  sendSignal: (msg: any) => void,
  from: string,
  to: string
) {
  console.log("[WebRTC] Received Offer");

  // Set remote description first
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

  // ✅ Mark remote set (for ICE candidate queuing)
  remoteSet = true;

  // ✅ Flush queued ICE candidates
  for (const c of candidateQueue) {
    await addIceCandidate(c);
  }
  candidateQueue = [];

  // Create and send answer
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  console.log("[WebRTC] Sending Answer");

  sendSignal({
    type: "answer",
    from,
    to,
    payload: answer
  });
}

export async function handleAnswer(answer: RTCSessionDescriptionInit) {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

export async function addIceCandidate(candidate: RTCIceCandidateInit) {
  if (!remoteSet) {
    candidateQueue.push(candidate);
    return;
  }
  await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
}

export function getDataChannel() {
  return dataChannelGlobal;
}