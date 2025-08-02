<script lang="ts">
  import { onMount } from 'svelte';
  import { ScoreManager } from './scoreManager';

  let currentUser = $state(ScoreManager.getCurrentUser());
  let isEditing = $state(false);
  let usernameInput = $state('');
  let showForm = $state(false);

  onMount(() => {
    currentUser = ScoreManager.getCurrentUser();
  });

  function startEdit() {
    isEditing = true;
    usernameInput = currentUser?.username || '';
  }

  function saveUsername() {
    if (usernameInput.trim()) {
      ScoreManager.setCurrentUser(usernameInput.trim());
      currentUser = ScoreManager.getCurrentUser();
    }
    isEditing = false;
    showForm = false;
  }

  function logout() {
    ScoreManager.removeCurrentUser();
    currentUser = null;
    isEditing = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      saveUsername();
    } else if (event.key === 'Escape') {
      isEditing = false;
      showForm = false;
    }
  }
  
  function openScoreboard() {
    const event = new CustomEvent('openScoreboard');
    window.dispatchEvent(event);
  }
</script>

<div class="user-info">
  <div class="user-controls">
    <button class="scoreboard-btn" on:click={openScoreboard} title="查看排行榜">🏆</button>
    
    {#if currentUser}
      <div class="user-profile">
        <span class="username" on:click={startEdit}>{currentUser.username}</span>
        <button class="logout-btn" on:click={logout} aria-label="Logout">🚪</button>
      </div>
    {:else}
      {#if showForm}
        <div class="username-form">
          <input
            type="text"
            bind:value={usernameInput}
            placeholder="输入用户名"
            on:keydown={handleKeydown}
            autofocus
          />
          <button class="save-btn" on:click={saveUsername}>保存</button>
          <button class="cancel-btn" on:click={() => showForm = false}>取消</button>
        </div>
      {:else}
        <button class="login-btn" on:click={() => showForm = true}>登录</button>
      {/if}
    {/if}
  </div>
</div>

<style>
  .user-info {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 100;
  }
  
  .user-controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .scoreboard-btn {
    background: rgba(255, 215, 0, 0.2);
    border: 1px solid gold;
    color: gold;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  
  .scoreboard-btn:hover {
    background: rgba(255, 215, 0, 0.4);
    transform: scale(1.1);
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(74, 158, 255, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 50px;
    border: 1px solid #4a9eff;
  }

  .username {
    cursor: pointer;
    font-weight: 500;
    color: #fff;
    transition: opacity 0.2s;
  }

  .username:hover {
    opacity: 0.8;
  }

  .logout-btn {
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
  }

  .logout-btn:hover {
    transform: scale(1.1);
  }

  .username-form {
    display: flex;
    gap: 0.5rem;
    background: rgba(42, 42, 62, 0.9);
    padding: 0.8rem;
    border-radius: 8px;
    border: 1px solid #4a9eff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  input {
    background: rgba(30, 30, 46, 0.8);
    border: 1px solid #4a9eff;
    border-radius: 4px;
    padding: 0.5rem;
    color: #fff;
    font-size: 1rem;
  }

  input:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(74, 158, 255, 0.5);
  }

  button {
    background: linear-gradient(45deg, #4a9eff, #2196f3);
    border: none;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;
  }

  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(74, 158, 255, 0.3);
  }

  .cancel-btn {
    background: rgba(255, 255, 255, 0.1);
  }

  .login-btn {
    background: rgba(74, 158, 255, 0.3);
    border: 1px solid #4a9eff;
    padding: 0.5rem 1rem;
    border-radius: 50px;
    color: #fff;
    font-weight: 500;
  }

  .login-btn:hover {
    background: rgba(74, 158, 255, 0.5);
  }

  @media (max-width: 768px) {
    .user-info {
      top: 10px;
      right: 10px;
    }
    
    .user-controls {
      flex-direction: column;
      align-items: flex-end;
    }
    
    .username-form {
      flex-direction: column;
      width: 100%;
    }
    
    input {
      width: 100%;
    }
  }
</style>