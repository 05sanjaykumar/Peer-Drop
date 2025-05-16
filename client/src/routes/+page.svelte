<script lang="ts">
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
  let messages: string[] = [];
  let newMessage = '';

  let isInitiator = false;
  let channelReady = false;

  function connect() {
    if (!peerId) {
      alert("Enter your Peer ID first!");
      return;
    }

    connectSocket(peerId, async (signal) => {
      console.log("Received signal", signal);

      if (signal.type === "offer") {
        createPeer(false, onData, sendSignal, onDataChannelOpen);
        await handleOffer(signal.payload, sendSignal, peerId, signal.from);
      } else if (signal.type === "answer") {
        await handleAnswer(signal.payload);
      } else if (signal.type === "candidate") {
        await addIceCandidate(signal.payload);
      }
    });

    connected = true;
  }

  async function startConnection() {
    if (!targetId) {
      alert("Enter target peer ID to connect");
      return;
    }
    isInitiator = true;
    createPeer(true, onData, sendSignal, onDataChannelOpen);
    await createOffer(sendSignal, peerId, targetId);
  }

  function sendMessage() {
    if (!newMessage.trim() || !channelReady) return;

    messages = [...messages, `You: ${newMessage}`];
    (window as any).dataChannel.send(newMessage);
    newMessage = '';
  }

  function onData(msg: string) {
    messages = [...messages, `Peer: ${msg}`];
  }

  function onDataChannelOpen() {
    console.log("Data channel open!");
    channelReady = true;
  }
</script>

<h2>Peer-to-Peer Chat</h2>

<div>
  <label>
    Your ID:
    <input bind:value={peerId} placeholder="e.g. alice" />
  </label>
  <button on:click={connect} disabled={connected}>Connect</button>
</div>

{#if connected}
  <div style="margin-top: 1rem;">
    <label>
      Peer to connect:
      <input bind:value={targetId} placeholder="e.g. bob" />
    </label>
    <button on:click={startConnection} disabled={!targetId}>Start Chat</button>
  </div>
{/if}

{#if messages.length > 0}
  <h3>Messages:</h3>
  <ul>
    {#each messages as msg}
      <li>{msg}</li>
    {/each}
  </ul>
{/if}

{#if connected}
  <div>
    <input
      bind:value={newMessage}
      on:keydown={(e) => e.key === 'Enter' && sendMessage()}
      placeholder="Type your message..."
    />
    <button on:click={sendMessage} disabled={!channelReady}>Send</button>
  </div>
{/if}
