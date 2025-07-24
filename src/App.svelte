<script lang="ts">
  import TypingGame from './lib/TypingGame.svelte'
</script>

<main>
  <TypingGame />
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #1e1e2e 0%, #2d2d3a 100%);
    color: #ffffff;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    overflow: hidden;
  }

  main {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px; /* 添加一些内边距确保边框可见 */
    box-sizing: border-box;
  }
</style>
