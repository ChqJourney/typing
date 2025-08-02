<script lang="ts">
  import { onMount } from 'svelte';
  import { ScoreManager } from './scoreManager';

  let { visible = $bindable(false) } = $props();
  
  let activeTab = $state('typing');
  let scores = $state<{[key: string]: any[]}>({});
  let currentUser = $state(ScoreManager.getCurrentUser());
  
  const games = [
    { id: 'typing', name: '打字游戏' }
  ];
  
  onMount(() => {
    loadScores();
  });
  
  function loadScores() {
    const allScores = ScoreManager.getAllScores();
    
    // Group scores by game
    scores = {};
    for (const game of games) {
      scores[game.id] = allScores
        .filter(score => score.gameName === game.id)
        .map(score => ({
          ...score,
          scoreData: JSON.parse(score.score)
        }))
        .sort((a, b) => b.scoreData.finalScore - a.scoreData.finalScore);
    }
  }
  
  function formatDate(timestamp: number) {
    return new Date(timestamp).toLocaleString('zh-CN');
  }
  
  function closeScoreboard() {
    visible = false;
  }
  
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeScoreboard();
    }
  }
</script>

{#if visible}
  <div class="overlay" on:keydown={handleKeyDown}>
    <div class="scoreboard-modal">
      <div class="modal-header">
        <h2>🏆 排行榜</h2>
        <button class="close-btn" on:click={closeScoreboard} aria-label="关闭">×</button>
      </div>
      
      <div class="tabs">
        {#each games as game (game.id)}
          <button 
            class="tab-btn" 
            class:active={activeTab === game.id}
            on:click={() => activeTab = game.id}
          >
            {game.name}
          </button>
        {/each}
      </div>
      
      <div class="tab-content">
        {#if scores[activeTab]}
          <div class="rankings">
            <h3>所有用户排行榜</h3>
            {#if scores[activeTab].length > 0}
              <div class="ranking-list">
                {#each scores[activeTab].slice(0, 10) as score, i}
                  <div class="ranking-item" class:current-user={currentUser && score.username === currentUser.username}>
                    <div class="rank">#{i + 1}</div>
                    <div class="user-info">
                      <span class="username">{score.username}</span>
                      <span class="timestamp">{formatDate(score.timestamp)}</span>
                    </div>
                    <div class="score">
                      {score.scoreData.finalScore} 分
                      <span class="level">第{score.scoreData.levelReached}关</span>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <p class="no-scores">暂无记录</p>
            {/if}
          </div>
          
          {#if currentUser}
            <div class="user-records">
              <h3>{currentUser.username} 的记录</h3>
              {#if scores[activeTab].filter(s => s.username === currentUser.username).length > 0}
                <div class="record-list">
                  {#each scores[activeTab].filter(s => s.username === currentUser.username).slice(0, 5) as score}
                    <div class="record-item">
                      <div class="record-score">
                        <span class="score-value">{score.scoreData.finalScore} 分</span>
                        <span class="level">第{score.scoreData.levelReached}关</span>
                        {#if score.scoreData.won}
                          <span class="status won">通关</span>
                        {:else}
                          <span class="status lost">失败</span>
                        {/if}
                      </div>
                      <div class="record-time">{formatDate(score.timestamp)}</div>
                    </div>
                  {/each}
                </div>
              {:else}
                <p class="no-scores">暂无记录</p>
              {/if}
            </div>
          {/if}
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  }
  
  .scoreboard-modal {
    background: linear-gradient(135deg, #2a2a3e 0%, #1e1e2e 100%);
    border-radius: 16px;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow: hidden;
    border: 2px solid #4a9eff;
    box-shadow: 0 0 50px rgba(74, 158, 255, 0.3);
    display: flex;
    flex-direction: column;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid rgba(74, 158, 255, 0.3);
  }
  
  .modal-header h2 {
    margin: 0;
    font-size: 1.8rem;
    background: linear-gradient(45deg, gold, #ffd700);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .close-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid #4a9eff;
    color: white;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .close-btn:hover {
    background: rgba(255, 0, 0, 0.3);
    scale: 1.05;
    /* transform: rotate(90deg); */
  }
  
  .tabs {
    display: flex;
    border-bottom: 1px solid rgba(74, 158, 255, 0.3);
    padding: 0 1.5rem;
    background: rgba(30, 30, 46, 0.7);
  }
  
  .tab-btn {
    background: none;
    border: none;
    padding: 1rem 1.5rem;
    color: #b0b0b0;
    font-size: 1.1rem;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: all 0.3s;
  }
  
  .tab-btn.active {
    color: #4a9eff;
    border-bottom: 3px solid #4a9eff;
  }
  
  .tab-btn:hover:not(.active) {
    color: #fff;
    background: rgba(74, 158, 255, 0.1);
  }
  
  .tab-content {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
  }
  
  .rankings, .user-records {
    margin-bottom: 2rem;
  }
  
  .rankings h3, .user-records h3 {
    color: #fff;
    margin-top: 0;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(74, 158, 255, 0.3);
  }
  
  .ranking-list, .record-list {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .ranking-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    background: rgba(42, 42, 62, 0.5);
    border-radius: 8px;
    border: 1px solid rgba(74, 158, 255, 0.2);
    transition: all 0.2s;
  }
  
  .ranking-item:hover {
    background: rgba(74, 158, 255, 0.2);
    border-color: rgba(74, 158, 255, 0.5);
  }
  
  .ranking-item.current-user {
    background: rgba(74, 158, 255, 0.3);
    border: 1px solid #4a9eff;
    box-shadow: 0 0 10px rgba(74, 158, 255, 0.3);
  }
  
  .rank {
    font-size: 1.2rem;
    font-weight: bold;
    width: 40px;
    text-align: center;
    color: gold;
  }
  
  .user-info {
    flex: 1;
  }
  
  .username {
    font-weight: 500;
    color: #fff;
    display: block;
  }
  
  .timestamp {
    font-size: 0.8rem;
    color: #b0b0b0;
  }
  
  .score {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-weight: bold;
    color: #4affa8;
  }
  
  .level {
    font-size: 0.8rem;
    color: #b0b0b0;
    font-weight: normal;
  }
  
  .record-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem;
    background: rgba(42, 42, 62, 0.5);
    border-radius: 8px;
    border: 1px solid rgba(74, 158, 255, 0.2);
    margin-bottom: 0.5rem;
  }
  
  .record-score {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  
  .score-value {
    font-weight: bold;
    color: #4affa8;
  }
  
  .status {
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
  }
  
  .status.won {
    background: rgba(74, 255, 168, 0.2);
    color: #4affa8;
  }
  
  .status.lost {
    background: rgba(255, 74, 74, 0.2);
    color: #ff4a4a;
  }
  
  .record-time {
    color: #b0b0b0;
    font-size: 0.9rem;
  }
  
  .no-scores {
    text-align: center;
    color: #b0b0b0;
    font-style: italic;
    padding: 2rem;
  }
  
  @media (max-width: 768px) {
    .scoreboard-modal {
      width: 95%;
      height: 90vh;
    }
    
    .modal-header {
      padding: 1rem;
    }
    
    .modal-header h2 {
      font-size: 1.5rem;
    }
    
    .tabs {
      padding: 0 1rem;
      overflow-x: auto;
    }
    
    .tab-btn {
      padding: 0.8rem 1rem;
      font-size: 1rem;
      white-space: nowrap;
    }
    
    .tab-content {
      padding: 1rem;
    }
    
    .ranking-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
    
    .rank {
      align-self: flex-start;
    }
    
    .score {
      align-items: flex-start;
    }
    
    .record-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
    
    .record-score {
      width: 100%;
      justify-content: space-between;
    }
  }
</style>