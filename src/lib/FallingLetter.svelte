<script lang="ts">
  export let letter: {
    id: string;
    char: string;
    x: number;
    y: number;
    speed: number;
    destroyed: boolean;
    targeted: boolean;
  };
</script>

<div 
  class="falling-letter" 
  class:targeted={letter.targeted}
  style="left: {letter.x}px; top: {letter.y}px;"
>
  <div class="letter-content">
    {letter.char}
  </div>
  <div class="letter-glow"></div>
</div>

<style>
  .falling-letter {
    position: absolute;
    width: 50px;
    height: 50px;
    pointer-events: none;
    animation: fall 0.1s ease-in;
  }

  .letter-content {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    font-weight: bold;
    color: #ffffff;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    border: 2px solid #ff9ff3;
    border-radius: 10px;
    box-shadow: 
      0 4px 15px rgba(255, 107, 107, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    z-index: 2;
    animation: letterFloat 2s ease-in-out infinite alternate;
  }

  .letter-glow {
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background: radial-gradient(circle, rgba(255, 107, 107, 0.3) 0%, transparent 70%);
    border-radius: 15px;
    z-index: 1;
    animation: glow 1.5s ease-in-out infinite alternate;
  }

  @keyframes fall {
    from {
      transform: translateY(-5px);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes letterFloat {
    0% {
      transform: scale(1) rotate(-1deg);
    }
    100% {
      transform: scale(1.05) rotate(1deg);
    }
  }

  .falling-letter.targeted .letter-content {
    background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
    border-color: #ffeb3b;
    animation: targetPulse 0.3s ease-in-out infinite alternate;
  }

  .falling-letter.targeted .letter-glow {
    background: radial-gradient(circle, rgba(255, 193, 7, 0.5) 0%, transparent 70%);
  }

  @keyframes targetPulse {
    0% {
      transform: scale(1) rotate(-1deg);
      box-shadow: 
        0 4px 15px rgba(255, 193, 7, 0.6),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
    100% {
      transform: scale(1.1) rotate(1deg);
      box-shadow: 
        0 6px 20px rgba(255, 193, 7, 0.8),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }
  }

  @keyframes glow {
    0% {
      opacity: 0.5;
      transform: scale(1);
    }
    100% {
      opacity: 0.8;
      transform: scale(1.1);
    }
  }
</style>
