<script lang="ts">
  import { onMount } from 'svelte';
  import { connectSocket, sendSignal } from '$lib/ws';

  let peerId = '';
	let connected = false;
	let messages: string[] = [];

  function connect() {
		if (!peerId) {
			alert("Enter your Peer ID first!");
			return;
		}

		connectSocket(peerId, (data) => {
			console.log("Received:", data);
			messages.push(JSON.stringify(data, null, 2));
		});

		connected = true;
	}
</script>

<main>
  <h1 class="text-xl font-bold mb-4">🛰️ PeerDrop Signaling Test</h1>
  {#if !connected}
  <input
			placeholder="Enter your peer ID"
			bind:value={peerId}
			class="border p-2 rounded mr-2"
		/>
    <button on:click={connect} class="bg-blue-500 text-white px-4 py-2 rounded">
			Connect
		</button>
    {:else}
		<p class="text-green-600">Connected as <strong>{peerId}</strong></p>
	{/if}

	<div class="mt-4">
		<h2 class="font-semibold">Incoming Messages:</h2>
		<pre class="bg-gray-100 p-2 rounded overflow-auto max-h-64">{messages.join('\n\n')}</pre>
	</div>
</main>

<style>
  input, button {
		font-size: 1rem;
	}
</style>