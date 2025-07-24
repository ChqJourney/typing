<script lang="ts">
  export let gameWon: boolean;
  export let score: number;
  export let currentLevel: number;
  export let onRestart: () => void;
</script>

<div class="modal-overlay">
  <div class="modal-content">
    <div class="result-icon">
      {#if gameWon}
        🏆
      {:else}
        💀
      {/if}
    </div>

    <h1 class="result-title">
      {#if gameWon}
        恭喜通关！
      {:else}
        游戏结束
      {/if}
    </h1>

    <div class="result-stats">
      <div class="stat">
        <div class="stat-label">最终得分</div>
        <div class="stat-value score">{score.toLocaleString()}</div>
      </div>
      
      <div class="stat">
        <div class="stat-label">到达关卡</div>
        <div class="stat-value level">{currentLevel}/10</div>
      </div>
    </div>

    <div class="result-message">
      {#if gameWon}
        <p>🎉 太棒了！你成功完成了所有10关！</p>
        <p>你的反应速度和打字技巧都非常出色！</p>
      {:else}
        <p>💪 不要灰心，继续练习会更好的！</p>
        <p>每一次失败都是成功的垫脚石！</p>
      {/if}
    </div>

    <div class="action-buttons">
      <button class="restart-btn" on:click={onRestart}>
        重新开始
      </button>
    </div>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: fadeIn 0.3s ease-out;
  }

  .modal-content {
    background: linear-gradient(135deg, #2a2a3e 0%, #3a3a4e 100%);
    border: 3px solid #4a9eff;
    border-radius: 25px;
    padding: 3rem;
    text-align: center;
    max-width: 500px;
    width: 90%;
    box-shadow: 
      0 0 50px rgba(74, 158, 255, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    animation: slideIn 0.5s ease-out;
  }

  .result-icon {
    font-size: 5rem;
    margin-bottom: 1rem;
    animation: bounce 1s ease-in-out infinite alternate;
  }

  .result-title {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    background: linear-gradient(45deg, #4a9eff, #64b5f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .result-stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: 2rem;
    gap: 2rem;
  }

  .stat {
    flex: 1;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    border: 1px solid rgba(74, 158, 255, 0.3);
  }

  .stat-label {
    font-size: 0.9rem;
    color: #b0b0b0;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: bold;
  }

  .stat-value.score {
    color: #4caf50;
    text-shadow: 0 0 15px rgba(76, 175, 80, 0.5);
  }

  .stat-value.level {
    color: #4a9eff;
    text-shadow: 0 0 15px rgba(74, 158, 255, 0.5);
  }

  .result-message {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 15px;
    border: 1px solid rgba(74, 158, 255, 0.2);
  }

  .result-message p {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #e0e0e0;
    margin: 0.5rem 0;
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  .restart-btn {
    background: linear-gradient(45deg, #4a9eff, #2196f3);
    border: none;
    color: white;
    padding: 1rem 2.5rem;
    font-size: 1.3rem;
    font-weight: bold;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(74, 158, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .restart-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(74, 158, 255, 0.6);
    background: linear-gradient(45deg, #64b5f6, #42a5f5);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-50px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes bounce {
    0% {
      transform: scale(1) rotate(-5deg);
    }
    100% {
      transform: scale(1.1) rotate(5deg);
    }
  }
</style>
