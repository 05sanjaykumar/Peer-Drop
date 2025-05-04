<script lang="ts">
    let ws: WebSocket | null = null;
    let messages: string[] = []
  
    function connect() {
      ws = new WebSocket("ws://localhost:8080/ws");
  
      ws.onmessage = (event) => {
        messages = [...messages, `Received: ${event.data}`];
      };
  
      ws.onopen = () => {
        messages = [...messages, "Connected to WebSocket"];
        ws.send("Hello from Svelte!");
      };
    }
  </script>
  
  <button on:click={connect}>Connect to WebSocket</button>
  
  <ul>
    {#each messages as msg}
      <li>{msg}</li>
    {/each}
  </ul>
  