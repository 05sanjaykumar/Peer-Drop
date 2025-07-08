// src/lib/webrtc.ts

type SignalMessage = {
  type: "offer" | "answer" | "candidate";
  from: string;
  to: string;
  payload: any;
};

type WebRTCEvents = {
  onConnected?: () => void;
  onDataChannelMessage?: (msg: string) => void;
};

export function createPeerConnection(
  myId: string,
  peerId: string,
  sendSignal: (msg: SignalMessage) => void,
  events?: WebRTCEvents
): {
  handleSignal: (msg: SignalMessage) => void;
  sendMessage: (text: string) => void;
  close: () => void;
}
