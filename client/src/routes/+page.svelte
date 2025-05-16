<script lang="ts">
	import { onMount } from 'svelte';
	import { connectSocket, sendSignal } from '$lib/ws';
	import {
		createPeer,
		createOffer,
		handleOffer,
		handleAnswer,
		addIceCandidate
	} from '$lib/webrtc';

	let peerId = '';
	let targetId = '';
	let connected = false;
	let isInitiator = false;
	let message = '';
	let chatLog: string[] = [];

	function log(msg: string) {
		chatLog = [...chatLog, msg];
	}

	function connect() {
		if (!peerId) {
			alert("Enter your ID");
			return;
		}
		connectSocket(peerId, async (data) => {
			if (data.type === 'offer') {
				await createPeer(false, handleMessage, sendSignal);
				await handleOffer(data.payload, sendSignal, peerId, data.from);
			} else if (data.type === 'answer') {
				await handleAnswer(data.payload);
			} else if (data.type === 'candidate') {
				await addIceCandidate(data.payload);
			}
		});
		connected = true;
		log(`Connected as ${peerId}`);
	}

	async function call() {
		if (!targetId) {
			alert("Enter target ID");
			return;
		}
		isInitiator = true;
		createPeer(true, handleMessage, sendSignal);
		await createOffer(sendSignal, peerId, targetId);
		log(`Calling ${targetId}...`);
	}

	function handleMessage(msg: string) {
		log(`Peer: ${msg}`);
	}

	function sendMessage() {
		if (!message.trim()) return;
		log(`You: ${message}`);
		// Send over datachannel
		window['dataChannel']?.send(message);
		message = '';
	}
</script>

<main>
	<h1>🧪 PeerDrop WebRTC</h1>

	<div>
		<label>🆔 Your ID: <input bind:value={peerId} /></label>
		<button on:click={connect} disabled={connected}>Connect</button>
	</div>

	{#if connected}
		<div>
			<label>🎯 Target Peer ID: <input bind:value={targetId} /></label>
			<button on:click={call}>Call</button>
		</div>

		<div>
			<label>💬 Message: <input bind:value={message} /></label>
			<button on:click={sendMessage}>Send</button>
		</div>
	{/if}

	<h2>📜 Chat Log</h2>
	<pre>{chatLog.join('\n')}</pre>
</main>
