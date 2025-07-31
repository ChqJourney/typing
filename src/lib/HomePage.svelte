<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import GameCard from './GameCard.svelte';
  import UserInfo from './UserInfo.svelte';
  
  const dispatch = createEventDispatcher();
  
  interface Game {
    id: string;
    title: string;
    description: string;
    icon: string;
  }
  
  const games: Game[] = [
    {
      id: 'typing',
      title: '打字游戏',
      description: '字母从上方掉落，快速按下对应按键击毁它们！挑战你的打字速度和反应能力。',
      icon: '⌨️'
    }
    // 可以在这里添加更多游戏
    // {
    //   id: 'game2',
    //   title: '游戏2',
    //   description: '游戏2的描述',
    //   icon: '🎮'
    // }
  ];
  
  function handleGameSelect(gameId: string) {
    dispatch('gameSelect', { gameId });
  }
</script>

<div class="container">
  <UserInfo />
  <header>
    <h1>游戏集合</h1>
    <p>选择一个游戏开始玩耍</p>
  </header>
  
  <div class="games-grid">
    {#each games as game (game.id)}
      <GameCard 
        title={game.title} 
        description={game.description} 
        icon={game.icon}
        on:select={() => handleGameSelect(game.id)}
      />
    {/each}
  </div>
</div>

<style>
  .container {
    width: 100%;
    min-height: 100vh;
    padding: 2rem;
    background: radial-gradient(ellipse at center, #2a2a3e 0%, #1e1e2e 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  
  header {
    text-align: center;
    margin-bottom: 3rem;
    padding-top: 2rem;
  }
  
  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    background: linear-gradient(45deg, #4a9eff, #64b5f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 20px rgba(74, 158, 255, 0.3);
  }
  
  header p {
    font-size: 1.2rem;
    color: #b0b0b0;
  }
  
  .games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
    width: 100%;
    max-width: 1200px;
    padding: 1rem;
  }
  
  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }
    
    h1 {
      font-size: 2rem;
    }
    
    header p {
      font-size: 1rem;
    }
    
    .games-grid {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
    }
  }
</style>