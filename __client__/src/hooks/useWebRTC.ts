// src/hooks/useWebRTC.ts
import { useRef, useState } from 'react';
import {
  createPeer,
  createOffer,
  handleAnswer,
  handleOffer,
  addIceCandidate,
  getDataChannel,
} from '../lib/webrtc';

import { connectSocket, sendSignal } from '../lib/ws';


export function useWebRTC(peerId: string, onMessage: (msg: string) => void) {
    const [channelReady, setChannelReady] = useState(false);
    const [connected, setConnected] = useState(false);

    function  handleSignal(signal: any) {
        if(signal.type === 'offer')
        {
            createPeer(false,onMessage, sendSignal, () => setChannelReady(true));
            handleOffer(signal.payload, sendSignal, peerId, signal.from);
        }
        else if (signal.type === 'answer') 
        {
            handleAnswer(signal.payload);
        } 
        else if (signal.type === 'candidate') 
        {
            addIceCandidate(signal.payload);
        }
    }

    const connect = () => {
        connectSocket(peerId, handleSignal);
        setConnected(true);
    };

    const startConnection = async (targetId: string) => {
        createPeer(true, onMessage, sendSignal, () => setChannelReady(true));
        await createOffer(sendSignal, peerId, targetId);
    };

    const sendMessage = (msg: string) => {
        getDataChannel()?.send(msg);
    };

     return {
        connect,
        startConnection,
        sendMessage,
        channelReady,
        connected,
    };

}