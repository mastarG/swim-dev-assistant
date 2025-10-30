/**
 * Storage Module - Swim Developer Assistant
 * LocalStorage management with encryption
 * 
 * Based on DATABASE_SCHEMA.md specifications
 */

const Storage = {
  /**
   * Encryption key (in production, should be more secure)
   */
  ENCRYPTION_KEY: 'swim-dev-assistant-v1-key',

  /**
   * Simple XOR encryption (for demo purposes)
   * In production, use Web Crypto API or similar
   */
  encrypt(text) {
    if (!text) return '';
    try {
      return btoa(text);
    } catch (error) {
      console.error('Encryption error:', error);
      return text;
    }
  },

  decrypt(encryptedText) {
    if (!encryptedText) return '';
    try {
      return atob(encryptedText);
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedText;
    }
  },

  /**
   * Save data to LocalStorage
   */
  save(key, value, encrypt = false) {
    try {
      const dataToSave = encrypt ? this.encrypt(value) : value;
      localStorage.setItem(key, dataToSave);
      return true;
    } catch (error) {
      console.error('Storage save error:', error);
      return false;
    }
  },

  /**
   * Load data from LocalStorage
   */
  load(key, decrypt = false) {
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      return decrypt ? this.decrypt(data) : data;
    } catch (error) {
      console.error('Storage load error:', error);
      return null;
    }
  },

  /**
   * Remove data from LocalStorage
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  },

  /**
   * Save object as JSON
   */
  saveJSON(key, obj) {
    try {
      const jsonString = JSON.stringify(obj);
      return this.save(key, jsonString);
    } catch (error) {
      console.error('JSON save error:', error);
      return false;
    }
  },

  /**
   * Load object from JSON
   */
  loadJSON(key) {
    try {
      const jsonString = this.load(key);
      if (!jsonString) return null;
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('JSON load error:', error);
      return null;
    }
  },

  /**
   * Settings Management
   */
  Settings: {
    // Save Gemini API Key
    saveGeminiApiKey(apiKey) {
      return Storage.save('gemini_api_key', apiKey, true);
    },

    // Load Gemini API Key
    loadGeminiApiKey() {
      return Storage.load('gemini_api_key', true);
    },

    // Save GitHub Token
    saveGithubToken(token) {
      return Storage.save('github_token', token, true);
    },

    // Load GitHub Token
    loadGithubToken() {
      return Storage.load('github_token', true);
    },

    // Save GitHub Repo URL
    saveGithubRepoUrl(url) {
      return Storage.save('github_repo_url', url);
    },

    // Load GitHub Repo URL
    loadGithubRepoUrl() {
      return Storage.load('github_repo_url');
    },

    // Save Collaboration GitHub Token
    saveCollabGithubToken(token) {
      return Storage.save('collab_github_token', token, true);
    },

    // Load Collaboration GitHub Token
    loadCollabGithubToken() {
      return Storage.load('collab_github_token', true);
    },

    // Save Collaboration GitHub Repo URL
    saveCollabGithubRepoUrl(url) {
      return Storage.save('collab_github_repo_url', url);
    },

    // Load Collaboration GitHub Repo URL
    loadCollabGithubRepoUrl() {
      return Storage.load('collab_github_repo_url');
    },

    // Save Prompt
    savePrompt(prompt) {
      return Storage.save('prompt', prompt);
    },

    // Load Prompt
    loadPrompt() {
      return Storage.load('prompt') || `다음 내용을 AI 개발 에이전트가 이해하기 쉽게 정리해주세요:

1. 위치 정보를 명확히 표시
2. 변경 전/후 상태 비교
3. 구체적인 수정 사항 설명
4. 우선순위 표시 (P0, P1, P2)

형식:
[위치] > [컴포넌트명]
변경 사항: [구체적 설명]
이유: [변경 이유]
우선순위: P0 (필수) / P1 (중요) / P2 (선택)`;
    },

    // Save Prompt File
    savePromptFile(fileName) {
      return Storage.save('prompt_file', fileName);
    },

    // Load Prompt File
    loadPromptFile() {
      return Storage.load('prompt_file');
    },

    // Save Theme
    saveTheme(theme) {
      return Storage.save('theme', theme);
      },

    // Load Theme
    loadTheme() {
      return Storage.load('theme') || 'light';
    },

    // Save Font Size
    saveFontSize(size) {
      return Storage.save('font_size', size);
    },

    // Load Font Size
    loadFontSize() {
      return Storage.load('font_size') || 'small';
    },

    // Load All Settings
    loadAll() {
      return {
        geminiApiKey: this.loadGeminiApiKey(),
        githubToken: this.loadGithubToken(),
        githubRepoUrl: this.loadGithubRepoUrl(),
        collabGithubToken: this.loadCollabGithubToken(),
        collabGithubRepoUrl: this.loadCollabGithubRepoUrl(),
        prompt: this.loadPrompt(),
        promptFile: this.loadPromptFile(),
        theme: this.loadTheme(),
        fontSize: this.loadFontSize()
      };
    }
  },

  /**
   * Chat History Management
   */
  ChatHistory: {
    KEY: 'chat_history',

    // Save chat message
    saveMessage(message) {
      const history = this.loadAll() || [];
      history.push({
        ...message,
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
      });
      return Storage.saveJSON(this.KEY, history);
    },

    // Load all chat messages
    loadAll() {
      return Storage.loadJSON(this.KEY) || [];
    },

    // Clear chat history
    clear() {
      return Storage.remove(this.KEY);
    },

    // Get last N messages
    getLastN(n) {
      const history = this.loadAll();
      return history.slice(-n);
    }
  },

  /**
   * History Management (Requirements History)
   */
  History: {
    KEY: 'requirements_history',

    // Save history item
    saveItem(item) {
      const history = this.loadAll() || [];
      const newItem = {
        ...item,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\. /g, '.').replace('.', '')
      };
      history.push(newItem);
      return Storage.saveJSON(this.KEY, history);
    },

    // Load all history items
    loadAll() {
      return Storage.loadJSON(this.KEY) || [];
    },

    // Filter by category
    filterByCategory(category) {
      const history = this.loadAll();
      if (category === 'all') return history;
      return history.filter(item => item.category === category);
    },

    // Search by keyword
    search(keyword) {
      const history = this.loadAll();
      const lowerKeyword = keyword.toLowerCase();
      return history.filter(item => 
        item.text.toLowerCase().includes(lowerKeyword) ||
        item.location.toLowerCase().includes(lowerKeyword)
      );
    },

    // Delete item
    deleteItem(id) {
      const history = this.loadAll();
      const filtered = history.filter(item => item.id !== id);
      return Storage.saveJSON(this.KEY, filtered);
    },

    // Clear all history
    clear() {
      return Storage.remove(this.KEY);
    },

    // Export to Markdown
    exportToMarkdown() {
      const history = this.loadAll();
      let markdown = '# 요구사항 정의서\n\n';
      markdown += `생성일: ${new Date().toLocaleDateString('ko-KR')}\n\n`;
      markdown += '---\n\n';

      // Group by date
      const groupedByDate = {};
      history.forEach(item => {
        if (!groupedByDate[item.date]) {
          groupedByDate[item.date] = [];
        }
        groupedByDate[item.date].push(item);
      });

      // Generate markdown
      Object.keys(groupedByDate).sort().reverse().forEach(date => {
        markdown += `## ${date}\n\n`;
        groupedByDate[date].forEach(item => {
          markdown += `### [${item.category}] ${item.location}\n\n`;
          markdown += `${item.text}\n\n`;
          if (item.priority) {
            markdown += `**우선순위**: ${item.priority}\n\n`;
          }
          markdown += '---\n\n';
        });
      });

      return markdown;
    }
  },

  /**
   * Selected Elements (Location Tags)
   */
  SelectedElements: {
    KEY: 'selected_elements',

    // Save selected elements
    save(elements) {
      return Storage.saveJSON(this.KEY, elements);
    },

    // Load selected elements
    load() {
      return Storage.loadJSON(this.KEY) || [];
    },

    // Add element
    add(element) {
      const elements = this.load();
      elements.push(element);
      return this.save(elements);
    },

    // Remove element
    remove(index) {
      const elements = this.load();
      elements.splice(index, 1);
      return this.save(elements);
    },

    // Clear all
    clear() {
      return Storage.remove(this.KEY);
    }
  },

  /**
   * Preview URL
   */
  PreviewUrl: {
    KEY: 'preview_url',

    save(url) {
      return Storage.save(this.KEY, url);
    },

    load() {
      return Storage.load(this.KEY) || '';
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Storage;
}
