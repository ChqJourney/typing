<script lang="ts">
  export let currentLevel: number;
  export let score: number;
  export let levelScore: number;
  export let onContinue: () => void;
  export let onRestart: () => void;
</script>

<div class="modal-overlay">
  <div class="modal-content">
    <div class="level-icon">
      🎯
    </div>

    <h1 class="level-title">
      第 {currentLevel} 关完成！
    </h1>

    <div class="level-stats">
      <div class="stat">
        <div class="stat-label">本关得分</div>
        <div class="stat-value level-score">{levelScore.toLocaleString()}</div>
      </div>
      
      <div class="stat">
        <div class="stat-label">总得分</div>
        <div class="stat-value total-score">{score.toLocaleString()}</div>
      </div>
    </div>

    <div class="level-message">
      <p>🎉 恭喜完成第 {currentLevel} 关！</p>
      <p>准备好挑战下一关了吗？难度会继续增加哦！</p>
    </div>

    <div class="action-buttons">
      <button class="continue-btn" on:click={onContinue}>
        继续下一关
      </button>
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
    border: 3px solid #4caf50;
    border-radius: 25px;
    padding: 3rem;
    text-align: center;
    max-width: 500px;
    width: 90%;
    box-shadow: 
      0 0 50px rgba(76, 175, 80, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    animation: slideIn 0.5s ease-out;
  }

  .level-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: bounce 1s ease-in-out infinite alternate;
  }

  .level-title {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    background: linear-gradient(45deg, #4caf50, #8bc34a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .level-stats {
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
    border: 1px solid rgba(76, 175, 80, 0.3);
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

  .stat-value.level-score {
    color: #ffc107;
    text-shadow: 0 0 15px rgba(255, 193, 7, 0.5);
  }

  .stat-value.total-score {
    color: #4caf50;
    text-shadow: 0 0 15px rgba(76, 175, 80, 0.5);
  }

  .level-message {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 15px;
    border: 1px solid rgba(76, 175, 80, 0.2);
  }

  .level-message p {
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

  .continue-btn {
    background: linear-gradient(45deg, #4caf50, #8bc34a);
    border: none;
    color: white;
    padding: 1rem 2.5rem;
    font-size: 1.3rem;
    font-weight: bold;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .continue-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.6);
    background: linear-gradient(45deg, #66bb6a, #9ccc65);
  }

  .restart-btn {
    background: linear-gradient(45deg, #757575, #9e9e9e);
    border: none;
    color: white;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: bold;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(117, 117, 117, 0.4);
  }

  .restart-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(117, 117, 117, 0.6);
    background: linear-gradient(45deg, #9e9e9e, #bdbdbd);
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
