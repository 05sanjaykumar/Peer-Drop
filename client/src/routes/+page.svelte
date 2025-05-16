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
  let remotePeerId = '';
  let connected = false;
  let messages: string[] = [];
  let inputMessage = '';

    onMount(() => {
    connectSocket(peerId, async (data) => {
      console.log("SIGNAL RECEIVED:", data);

      switch (data.type) {
        case 'offer':
          await createPeer(false, handleData, sendSignal);
          await handleOffer(data.payload, sendSignal, peerId, data.from);
          break;

        case 'answer':
          await handleAnswer(data.payload);
          break;

        case 'candidate':
          await addIceCandidate(data.payload);
          break;

        default:
          console.warn("Unknown message type", data);
      }
    });
  });

  function handleData(msg: string) {
    messages = [...messages, `Peer: ${msg}`];
  }

  async function connectToPeer() {
    if (!remotePeerId) {
      alert("Enter remote peer ID!");
      return;
    }

    await createPeer(true, handleData, sendSignal);
    await createOffer(sendSignal, peerId, remotePeerId);
    connected = true;
  }

  function sendMessage() {
    if (!inputMessage) return;

    messages = [...messages, `You: ${inputMessage}`];
    // Send via WebRTC data channel
    window.dataChannel?.send(inputMessage); // optional: expose globally or use closure
    inputMessage = '';
  }

</script>


<!-- UI Layout -->
<div class="p-4 space-y-4">
  <div>
  <label for="your-id">Your Peer ID</label>
  <input id="your-id" bind:value={peerId} class="border p-1" />
</div>

<div>
  <label for="remote-id">Connect to Peer ID</label>
  <input id="remote-id" bind:value={remotePeerId} class="border p-1" />
</div>

<div>
  <label for="message">Send Message</label>
  <input id="message" bind:value={inputMessage} class="border p-1" />
</div>

  <div class="mt-4">
    <h2>Chat</h2>
    <div class="border p-2 h-40 overflow-y-auto">
      {#each messages as msg}
        <div>{msg}</div>
      {/each}
    </div>
  </div>
</div>