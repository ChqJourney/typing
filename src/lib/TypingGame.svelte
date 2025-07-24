<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import FallingLetter from './FallingLetter.svelte';
  import Bullet from './Bullet.svelte';
  import GameStats from './GameStats.svelte';
  import GameOverModal from './GameOverModal.svelte';
  import LevelCompleteModal from './LevelCompleteModal.svelte';

  interface Letter {
    id: string;
    char: string;
    x: number;
    y: number;
    speed: number;
    destroyed: boolean;
    targeted: boolean; // 新增：标记是否被瞄准
  }

  interface BulletData {
    id: string;
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    char: string;
    targetLetterId: string; // 新增：目标字母ID
    createdTime: number; // 新增：创建时间，用于清理超时子弹
  }

  interface Explosion {
    id: string;
    x: number;
    y: number;
  }

  // 游戏状态
  let gameRunning = false;
  let currentLevel = 1;
  let score = 0;
  let levelScore = 0; // 新增：当前关卡得分
  let missedLetters = 0;
  let levelStartTime = 0;
  let elapsedTime = 0;
  let gameOver = false;
  let gameWon = false;
  let levelComplete = false; // 新增：关卡完成状态
  
  // 游戏配置
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 600;
  const LEVEL_DURATION = 30000; // 30秒
  const MAX_MISSED = 3;
  const MAX_LEVEL = 10;
  
  // 游戏对象
  let letters: Letter[] = [];
  let bullets: BulletData[] = [];
  let explosions: Explosion[] = [];
  
  // 定时器
  let gameLoop: number;
  let letterSpawner: number;
  let timeUpdater: number;

  // 获取当前关卡配置
  function getLevelConfig(level: number) {
    return {
      spawnRate: Math.max(2000 - (level - 1) * 150, 500), // 字母生成间隔
      fallSpeed: 1 + (level - 1) * 0.5, // 基础下落速度
      letterCount: Math.min(5 + level * 2, 20) // 每关字母数量上限
    };
  }

  // 生成随机字母
  function generateLetter(): Letter {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const config = getLevelConfig(currentLevel);
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      char: chars[Math.floor(Math.random() * chars.length)],
      x: Math.random() * (GAME_WIDTH - 80) + 15, // 调整边界：留出更多空间防止字母被切断
      y: -50,
      speed: config.fallSpeed + Math.random() * 0.5,
      destroyed: false,
      targeted: false
    };
  }

  // 创建子弹
  function createBullet(targetLetter: Letter) {
    const bullet: BulletData = {
      id: Math.random().toString(36).substr(2, 9),
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT - 50,
      targetX: targetLetter.x + 25,
      targetY: targetLetter.y + 25,
      char: targetLetter.char,
      targetLetterId: targetLetter.id,
      createdTime: Date.now()
    };
    bullets = [...bullets, bullet];
  }

  // 创建爆炸效果
  function createExplosion(x: number, y: number) {
    const explosion: Explosion = {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y
    };
    explosions = [...explosions, explosion];
    
    // 3秒后移除爆炸效果
    setTimeout(() => {
      explosions = explosions.filter(e => e.id !== explosion.id);
    }, 500);
  }

  // 处理键盘输入
  function handleKeyPress(event: KeyboardEvent) {
    if (!gameRunning || gameOver || levelComplete) return;
    
    const key = event.key.toUpperCase();
    const targetLetter = letters.find(letter => 
      letter.char === key && !letter.destroyed && !letter.targeted
    );
    
    if (targetLetter) {
      targetLetter.targeted = true; // 标记为被瞄准，但不立即销毁
      createBullet(targetLetter);
      const points = 10 * currentLevel;
      score += points;
      levelScore += points;
    }
  }

  // 更新游戏状态
  function updateGame() {
    // 更新字母位置
    letters = letters.map(letter => {
      if (!letter.destroyed) {
        letter.y += letter.speed;
        
        // 字母掉到底部
        if (letter.y > GAME_HEIGHT) {
          if (!letter.targeted) { // 只有未被瞄准的字母才算遗漏
            missedLetters++;
            
            if (missedLetters >= MAX_MISSED) {
              endGame(false);
            }
          }
          letter.destroyed = true;
        }
      }
      return letter;
    });

    // 移除已销毁的字母
    letters = letters.filter(letter => letter.y <= GAME_HEIGHT);

    // 更新子弹
    bullets = bullets.map(bullet => {
      // 清理超时的子弹（2秒后自动清理）
      if (Date.now() - bullet.createdTime > 2000) {
        return null;
      }
      
      // 找到目标字母，动态更新目标位置
      const targetLetter = letters.find(l => l.id === bullet.targetLetterId);
      if (!targetLetter || targetLetter.destroyed) {
        // 目标字母已经不存在，移除子弹
        return null;
      }
      
      // 动态更新目标位置
      bullet.targetX = targetLetter.x + 25;
      bullet.targetY = targetLetter.y + 25;
      
      const dx = bullet.targetX - bullet.x;
      const dy = bullet.targetY - bullet.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // 增加碰撞检测范围，防止跳过目标
      if (distance < 25) {
        // 子弹到达目标，创建爆炸并销毁对应字母
        createExplosion(bullet.targetX, bullet.targetY);
        
        // 销毁目标字母
        targetLetter.destroyed = true;
        
        return null;
      }
      
      const speed = 12; // 适中的速度，既快又准确
      bullet.x += (dx / distance) * speed;
      bullet.y += (dy / distance) * speed;
      
      return bullet;
    }).filter(Boolean) as BulletData[];
  }

  // 生成字母
  function spawnLetter() {
    if (!gameRunning || gameOver) return;
    
    const config = getLevelConfig(currentLevel);
    if (letters.filter(l => !l.destroyed).length < config.letterCount) {
      letters = [...letters, generateLetter()];
    }
  }

  // 更新时间
  function updateTime() {
    if (!gameRunning || gameOver || levelComplete) return;
    
    elapsedTime = Date.now() - levelStartTime;
    
    if (elapsedTime >= LEVEL_DURATION) {
      completeLevel();
    }
  }

  // 完成关卡
  function completeLevel() {
    gameRunning = false;
    levelComplete = true;
    
    clearInterval(gameLoop);
    clearInterval(letterSpawner);
    clearInterval(timeUpdater);
  }

  // 继续下一关
  function continueToNextLevel() {
    if (currentLevel >= MAX_LEVEL) {
      endGame(true);
      return;
    }
    
    currentLevel++;
    levelComplete = false;
    levelScore = 0;
    levelStartTime = Date.now();
    elapsedTime = 0;
    missedLetters = 0;
    letters = [];
    bullets = [];
    explosions = [];
    
    // 重新启动游戏循环
    gameRunning = true;
    gameLoop = setInterval(updateGame, 16);
    letterSpawner = setInterval(spawnLetter, getLevelConfig(currentLevel).spawnRate);
    timeUpdater = setInterval(updateTime, 100);
  }

  // 下一关 (旧函数，现在用于自动进入下一关)
  function nextLevel() {
    completeLevel();
  }

  // 开始游戏
  function startGame() {
    gameRunning = true;
    gameOver = false;
    gameWon = false;
    levelComplete = false;
    currentLevel = 1;
    score = 0;
    levelScore = 0;
    missedLetters = 0;
    levelStartTime = Date.now();
    elapsedTime = 0;
    letters = [];
    bullets = [];
    explosions = [];
    
    gameLoop = setInterval(updateGame, 16); // 60 FPS
    letterSpawner = setInterval(spawnLetter, getLevelConfig(1).spawnRate);
    timeUpdater = setInterval(updateTime, 100);
  }

  // 结束游戏
  function endGame(won: boolean) {
    gameRunning = false;
    gameOver = true;
    gameWon = won;
    
    clearInterval(gameLoop);
    clearInterval(letterSpawner);
    clearInterval(timeUpdater);
  }

  // 重新开始游戏
  function restartGame() {
    startGame();
  }

  // 响应关卡变化，更新字母生成频率
  $: if (gameRunning && !gameOver && !levelComplete) {
    clearInterval(letterSpawner);
    letterSpawner = setInterval(spawnLetter, getLevelConfig(currentLevel).spawnRate);
  }

  onMount(() => {
    document.addEventListener('keydown', handleKeyPress);
  });

  onDestroy(() => {
    document.removeEventListener('keydown', handleKeyPress);
    clearInterval(gameLoop);
    clearInterval(letterSpawner);
    clearInterval(timeUpdater);
  });
</script>

<div class="game-container">
  <div class="game-area" style="width: {GAME_WIDTH}px; height: {GAME_HEIGHT}px;">
    <!-- 游戏场景 -->
    <div class="scene">
      <!-- 下落的字母 -->
      {#each letters as letter (letter.id)}
        {#if !letter.destroyed}
          <FallingLetter {letter} />
        {/if}
      {/each}

      <!-- 子弹 -->
      {#each bullets as bullet (bullet.id)}
        <Bullet {bullet} />
      {/each}

      <!-- 爆炸效果 -->
      {#each explosions as explosion (explosion.id)}
        <div 
          class="explosion" 
          style="left: {explosion.x}px; top: {explosion.y}px;"
        >
          💥
        </div>
      {/each}

      <!-- 发射器 -->
      <div class="launcher">
        🚀
      </div>
    </div>
  </div>

  <!-- 游戏统计面板 -->
  <GameStats 
    {currentLevel}
    {score}
    {missedLetters}
    {elapsedTime}
    levelDuration={LEVEL_DURATION}
    maxMissed={MAX_MISSED}
  />

  <!-- 开始游戏按钮 -->
  {#if !gameRunning && !gameOver && !levelComplete}
    <div class="start-overlay">
      <div class="start-content">
        <h1>打字游戏</h1>
        <p>字母从上方掉落，快速按下对应按键击毁它们！</p>
        <p>每关30秒，错过3个字母即失败</p>
        <button on:click={startGame} class="start-btn">开始游戏</button>
      </div>
    </div>
  {/if}

  <!-- 关卡完成模态框 -->
  {#if levelComplete}
    <LevelCompleteModal 
      {currentLevel}
      {score}
      {levelScore}
      onContinue={continueToNextLevel}
      onRestart={restartGame}
    />
  {/if}

  <!-- 游戏结束模态框 -->
  {#if gameOver}
    <GameOverModal 
      {gameWon}
      {score}
      {currentLevel}
      onRestart={restartGame}
    />
  {/if}
</div>

<style>
  .game-container {
    display: flex;
    gap: 2rem;
    align-items: center;
    padding: 2rem;
    min-height: 100vh;
    background: radial-gradient(ellipse at center, #2a2a3e 0%, #1e1e2e 100%);
  }

  .game-area {
    position: relative;
    background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    border: 3px solid #4a9eff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 
      0 0 30px rgba(74, 158, 255, 0.3),
      inset 0 0 20px rgba(0, 0, 0, 0.3);
    /* 确保边框完全可见 */
    /* margin-top: 150px; */
  }

  .scene {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .launcher {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 2rem;
    filter: drop-shadow(0 0 10px #4a9eff);
    animation: pulse 2s ease-in-out infinite alternate;
  }

  .explosion {
    position: absolute;
    font-size: 2rem;
    animation: explode 0.5s ease-out forwards;
    pointer-events: none;
    z-index: 100;
  }

  .start-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .start-content {
    text-align: center;
    background: linear-gradient(135deg, #2a2a3e 0%, #3a3a4e 100%);
    padding: 3rem;
    border-radius: 20px;
    border: 2px solid #4a9eff;
    box-shadow: 0 0 50px rgba(74, 158, 255, 0.3);
  }

  .start-content h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    background: linear-gradient(45deg, #4a9eff, #64b5f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .start-content p {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: #b0b0b0;
  }

  .start-btn {
    background: linear-gradient(45deg, #4a9eff, #2196f3);
    border: none;
    color: white;
    padding: 1rem 2rem;
    font-size: 1.5rem;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(74, 158, 255, 0.3);
  }

  .start-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(74, 158, 255, 0.4);
  }

  @keyframes pulse {
    0% { transform: translateX(-50%) scale(1); }
    100% { transform: translateX(-50%) scale(1.1); }
  }

  @keyframes explode {
    0% {
      transform: scale(0.5);
      opacity: 1;
    }
    50% {
      transform: scale(1.5);
      opacity: 0.8;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }
</style>
