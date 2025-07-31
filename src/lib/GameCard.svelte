<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let title: string = '';
  export let description: string = '';
  export let icon: string = '🎮';
  
  const dispatch = createEventDispatcher();
  
  let isHovered = false;
  let isFocused = false;
  
  function handleClick() {
    dispatch('select');
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      dispatch('select');
    }
  }
</script>

<div 
  class="card" 
  class:hover={isHovered}
  class:focus={isFocused}
  class:focus-visible={isFocused}
  on:click={handleClick}
  on:mouseenter={() => isHovered = true}
  on:mouseleave={() => isHovered = false}
  on:focus={() => isFocused = true}
  on:blur={() => isFocused = false}
  tabindex="0"
  on:keydown={handleKeydown}
>
  <div class="card-content">
    <div class="icon">{icon}</div>
    <h3 class="title">{title}</h3>
    <p class="description">{description}</p>
  </div>
</div>

<style>
  .card {
    background: linear-gradient(145deg, #2a2a3e, #1e1e2e);
    border-radius: 16px;
    padding: 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    border: 2px solid transparent;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    min-width: 250px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .card::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(74, 158, 255, 0.2) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }
  
  .card:hover,
  .card:focus {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 2px #4a9eff, 0 0 30px rgba(74, 158, 255, 0.5);
    border-color: #4a9eff;
  }
  
  .card:hover::before,
  .card:focus::before {
    opacity: 1;
    animation: rotate 4s linear infinite;
  }
  
  .card:focus {
    outline: none;
  }
  
  .card:focus-visible {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 3px #4a9eff, 0 0 0 6px rgba(74, 158, 255, 0.5);
  }
  
  .card-content {
    position: relative;
    z-index: 1;
    width: 100%;
  }
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    filter: drop-shadow(0 0 10px rgba(74, 158, 255, 0.5));
    transition: transform 0.3s ease;
  }
  
  .card:hover .icon {
    transform: scale(1.2) rotate(10deg);
  }
  
  .title {
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
    color: #fff;
    text-shadow: 0 0 10px rgba(74, 158, 255, 0.5);
  }
  
  .description {
    font-size: 1rem;
    color: #b0b0b0;
    margin: 0;
    line-height: 1.5;
  }
  
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  @media (max-width: 768px) {
    .card {
      min-width: 200px;
      padding: 1.5rem;
    }
    
    .icon {
      font-size: 2.5rem;
    }
    
    .title {
      font-size: 1.3rem;
    }
  }
</style>