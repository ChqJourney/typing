<script lang="ts">
  import { onMount } from 'svelte';
  import HomePage from './lib/HomePage.svelte';
  import TypingGame from './lib/typing/TypingGame.svelte';
  
  let currentView: 'home' | 'typing' = 'home';
  
  function handleGameSelect(event: CustomEvent) {
    const { gameId } = event.detail;
    if (gameId === 'typing') {
      currentView = 'typing';
    }
  }
  
  function handleGameExit() {
    currentView = 'home';
  }
  
  onMount(() => {
    // Handle keyboard navigation
    function handleKeyDown(event: KeyboardEvent) {
      // Global keyboard shortcuts can be added here
    }
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
</script>

<main>
  {#if currentView === 'home'}
    <HomePage on:gameSelect={handleGameSelect} />
  {:else if currentView === 'typing'}
    <TypingGame on:exit={handleGameExit} />
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #1e1e2e 0%, #2d2d3a 100%);
    color: #ffffff;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    overflow-x: hidden;
  }

  main {
    width: 100%;
    min-height: 100vh;
  }
</style>