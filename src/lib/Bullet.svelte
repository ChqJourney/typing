<script lang="ts">
  export let bullet: {
    id: string;
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    char: string;
  };
</script>

<div 
  class="bullet" 
  style="left: {bullet.x}px; top: {bullet.y}px;"
>
  <div class="bullet-core"></div>
  <div class="bullet-trail"></div>
</div>

<style>
  .bullet {
    position: absolute;
    width: 8px;
    height: 20px;
    pointer-events: none;
    z-index: 10;
  }

  .bullet-core {
    position: absolute;
    width: 6px;
    height: 18px;
    background: linear-gradient(180deg, #4af0ff 0%, #0099ff 100%);
    border-radius: 3px;
    box-shadow: 
      0 0 10px rgba(74, 240, 255, 0.8),
      0 0 20px rgba(74, 240, 255, 0.4);
    animation: bulletPulse 0.1s ease-in-out infinite alternate;
  }

  .bullet-trail {
    position: absolute;
    top: 18px;
    left: 1px;
    width: 4px;
    height: 15px;
    background: linear-gradient(180deg, rgba(74, 240, 255, 0.6) 0%, transparent 100%);
    border-radius: 2px;
    animation: trail 0.1s ease-in-out infinite;
  }

  @keyframes bulletPulse {
    0% {
      transform: scale(1);
      box-shadow: 
        0 0 10px rgba(74, 240, 255, 0.8),
        0 0 20px rgba(74, 240, 255, 0.4);
    }
    100% {
      transform: scale(1.1);
      box-shadow: 
        0 0 15px rgba(74, 240, 255, 1),
        0 0 25px rgba(74, 240, 255, 0.6);
    }
  }

  @keyframes trail {
    0% {
      opacity: 0.8;
      transform: scaleY(1);
    }
    100% {
      opacity: 0.4;
      transform: scaleY(0.8);
    }
  }
</style>
