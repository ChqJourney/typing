export interface ScoreRecord {
  username: string;
  gameName: string;
  score: string; // JSON string format
  timestamp: number; // Unix timestamp
}

export interface User {
  username: string;
}

export class ScoreManager {
  private static readonly USER_KEY = 'typing_game_user';
  private static readonly SCORES_KEY = 'typing_game_scores';

  // Get current user
  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Set current user
  static setCurrentUser(username: string): void {
    const user: User = { username };
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Remove current user
  static removeCurrentUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  // Save score
  static saveScore(gameName: string, score: any): void {
    const user = this.getCurrentUser();
    if (!user) return;

    const scoreRecord: ScoreRecord = {
      username: user.username,
      gameName,
      score: JSON.stringify(score),
      timestamp: Date.now()
    };

    const scores = this.getAllScores();
    scores.push(scoreRecord);
    localStorage.setItem(this.SCORES_KEY, JSON.stringify(scores));
  }

  // Get all scores
  static getAllScores(): ScoreRecord[] {
    const scoresStr = localStorage.getItem(this.SCORES_KEY);
    return scoresStr ? JSON.parse(scoresStr) : [];
  }

  // Get scores for a specific user
  static getUserScores(username: string): ScoreRecord[] {
    const scores = this.getAllScores();
    return scores.filter(score => score.username === username);
  }

  // Get scores for current user
  static getCurrentUserScores(): ScoreRecord[] {
    const user = this.getCurrentUser();
    if (!user) return [];
    return this.getUserScores(user.username);
  }

  // Get scores for a specific game
  static getGameScores(gameName: string): ScoreRecord[] {
    const scores = this.getAllScores();
    return scores.filter(score => score.gameName === gameName);
  }
}