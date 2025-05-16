// src/lib/webrtc.ts

let peerConnection: RTCPeerConnection;
let dataChannel: RTCDataChannel;

const config: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

export function createPeer(
  isInitiator: boolean,
  onData: (msg: string) => void,
  sendSignal: (msg: any) => void
) {
  peerConnection = new RTCPeerConnection(config);

  // ICE candidate handler
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      sendSignal({
        type: "candidate",
        payload: event.candidate
      });
    }
  };

  // DataChannel setup
  if (isInitiator) {
    dataChannel = peerConnection.createDataChannel("chat");
    setupDataChannel(dataChannel, onData);
  } else {
    peerConnection.ondatachannel = (event) => {
      dataChannel = event.channel;
      setupDataChannel(dataChannel, onData);
    };
  }

  // expose for sending messages
  window['dataChannel'] = dataChannel;

  return peerConnection;
}

function setupDataChannel(
  channel: RTCDataChannel,
  onData: (msg: string) => void
) {
  channel.onopen = () => console.log("Data channel open");
  channel.onmessage = (event) => onData(event.data);
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
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

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
  await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
}
