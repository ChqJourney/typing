<script lang="ts">
  export let currentLevel: number;
  export let score: number;
  export let missedLetters: number;
  export let elapsedTime: number;
  export let levelDuration: number;
  export let maxMissed: number;

  $: progress = (elapsedTime / levelDuration) * 100;
  $: remainingTime = Math.max(0, Math.ceil((levelDuration - elapsedTime) / 1000));
  $: healthPercentage = ((maxMissed - missedLetters) / maxMissed) * 100;
</script>

<div class="stats-panel">
  <div class="stats-header">
    <h2>游戏统计</h2>
  </div>

  <div class="stat-item">
    <div class="stat-label">关卡</div>
    <div class="stat-value level">
      {currentLevel}/10
    </div>
  </div>

  <div class="stat-item">
    <div class="stat-label">得分</div>
    <div class="stat-value score">
      {score.toLocaleString()}
    </div>
  </div>

  <div class="stat-item">
    <div class="stat-label">剩余时间</div>
    <div class="stat-value time">
      {remainingTime}s
    </div>
    <div class="progress-bar">
      <div class="progress-fill" style="width: {progress}%"></div>
    </div>
  </div>

  <div class="stat-item">
    <div class="stat-label">生命值</div>
    <div class="health-bar">
      <div class="health-fill" style="width: {healthPercentage}%"></div>
      <div class="health-text">
        {maxMissed - missedLetters}/{maxMissed}
      </div>
    </div>
  </div>

  <div class="tips">
    <h3>操作提示</h3>
    <p>• 快速按下字母键击毁下落的字母</p>
    <p>• 错过 {maxMissed} 个字母游戏结束</p>
    <p>• 每关持续 30 秒</p>
    <p>• 越高级的关卡速度越快</p>
  </div>
</div>

<style>
  .stats-panel {
    min-width: 250px;
    background: linear-gradient(135deg, #2a2a3e 0%, #3a3a4e 100%);
    border: 2px solid #4a9eff;
    border-radius: 15px;
    padding: 1.5rem;
    box-shadow: 
      0 0 30px rgba(74, 158, 255, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .stats-header {
    text-align: center;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #4a9eff;
    padding-bottom: 1rem;
  }

  .stats-header h2 {
    margin: 0;
    font-size: 1.5rem;
    background: linear-gradient(45deg, #4a9eff, #64b5f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .stat-item {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
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
    font-size: 1.8rem;
    font-weight: bold;
    text-align: center;
  }

  .stat-value.level {
    color: #4a9eff;
    text-shadow: 0 0 10px rgba(74, 158, 255, 0.5);
  }

  .stat-value.score {
    color: #4caf50;
    text-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
  }

  .stat-value.time {
    color: #ff9800;
    text-shadow: 0 0 10px rgba(255, 152, 0, 0.5);
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
    margin-top: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4a9eff 0%, #ff9800 100%);
    border-radius: 4px;
    transition: width 0.3s ease;
    box-shadow: 0 0 10px rgba(74, 158, 255, 0.5);
  }

  .health-bar {
    position: relative;
    width: 100%;
    height: 30px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .health-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(90deg, #f44336 0%, #ff9800 50%, #4caf50 100%);
    border-radius: 15px;
    transition: width 0.3s ease;
    box-shadow: 0 0 15px rgba(76, 175, 80, 0.5);
  }

  .health-text {
    position: relative;
    z-index: 1;
    color: white;
    font-weight: bold;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  }

  .tips {
    margin-top: 2rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 10px;
    border: 1px solid rgba(74, 158, 255, 0.2);
  }

  .tips h3 {
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    color: #4a9eff;
  }

  .tips p {
    margin: 0.5rem 0;
    font-size: 0.85rem;
    color: #b0b0b0;
    line-height: 1.4;
  }
</style>
