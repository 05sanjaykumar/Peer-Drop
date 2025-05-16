import { sendSignal } from '$lib/ws';

let peerConnection: RTCPeerConnection;
let localPeerId: string;
let remotePeerId: string;

export function initWebRTC(localId: string, remoteId: string){
  localPeerId = localId;
  remotePeerId = remoteId;
  
  peerConnection = new RTCPeerConnection({
		iceServers: [
			{ urls: 'stun:stun.l.google.com:19302' }
		]
	});


  peerConnection.onicecandidate = (event) => {
		if (event.candidate) {
			sendSignal({
				type: 'candidate',
				from: localPeerId,
				to: remotePeerId,
				payload: event.candidate
			});
		}
	};

  peerConnection.ontrack = (event) =>{
      console.log("Track received:", event.streams[0]);
  };
  return peerConnection;

}

export async function createOffer() {
	const offer = await peerConnection.createOffer();
	await peerConnection.setLocalDescription(offer);

	sendSignal({
		type: 'offer',
		from: localPeerId,
		to: remotePeerId,
		payload: offer
	});
}

export async function createAnswer(offer: RTCSessionDescriptionInit) {
	await peerConnection.setRemoteDescription(offer);
	const answer = await peerConnection.createAnswer();
	await peerConnection.setLocalDescription(answer);

	sendSignal({
		type: 'answer',
		from: localPeerId,
		to: remotePeerId,
		payload: answer
	});
}

export async function handleAnswer(answer: RTCSessionDescriptionInit) {
	await peerConnection.setRemoteDescription(answer);
}

export function addCandidate(candidate: RTCIceCandidateInit) {
	peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
}