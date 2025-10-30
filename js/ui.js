/**
 * UI Module - Swim Developer Assistant
 * UI components rendering and management
 * 
 * Based on PAGE_SPECS.md and DESIGN_SYSTEM.md
 */

const UI = {
  /**
   * Show notification
   */
  showNotification(message, type = 'info', duration = 3000) {
    const container = document.getElementById('notificationContainer');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.setAttribute('data-type', type);

    const typeIcons = {
      success: '✅',
      warning: '⚠️',
      error: '❌',
      info: 'ℹ️'
    };

    const typeTitles = {
      success: '성공',
      warning: '경고',
      error: '오류',
      info: '알림'
    };

    notification.innerHTML = `
      <div class="notification__header">
        <span class="notification__title">${typeIcons[type]} ${typeTitles[type]}</span>
        <button class="notification__close">✕</button>
      </div>
      <div class="notification__message">${message}</div>
    `;

    container.appendChild(notification);

    // Close button handler
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => {
      notification.remove();
    });

    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
      }, duration);
    }
  },

  /**
   * Show loading overlay
   */
  showLoading(targetId = 'previewLoading') {
    const loading = document.getElementById(targetId);
    if (loading) {
      loading.style.display = 'flex';
    }
  },

  /**
   * Hide loading overlay
   */
  hideLoading(targetId = 'previewLoading') {
    const loading = document.getElementById(targetId);
    if (loading) {
      loading.style.display = 'none';
    }
  },

  /**
   * Update connection status indicators
   */
  updateConnectionStatus(service, status) {
    // Update top toolbar status
    const topStatus = document.getElementById(`${service}Status`);
    if (topStatus) {
      topStatus.setAttribute('data-status', status);
    }

    // Update footer status
    const footerDot = document.getElementById(`${service}Dot`);
    if (footerDot) {
      footerDot.setAttribute('data-status', status);
    }
  },

  /**
   * Render chat message
   */
  renderChatMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message';
    messageDiv.setAttribute('data-message-type', message.type || 'user');

    const avatarMap = {
      user: 'U',
      gemini: 'G',
      system: 'S'
    };

    const time = new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    messageDiv.innerHTML = `
      <div class="chat-message__avatar">${avatarMap[message.type] || 'S'}</div>
      <div class="chat-message__content">
        <div class="chat-message__header">
          <span class="chat-message__name">${message.name || 'User'}</span>
          <span class="chat-message__time">${time}</span>
        </div>
        <div class="chat-message__text">${message.text}</div>
        ${message.info ? `<div class="chat-message__info">${message.info}</div>` : ''}
      </div>
    `;

    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    const chatArea = document.getElementById('chatArea');
    if (chatArea) {
      chatArea.scrollTop = chatArea.scrollHeight;
    }

    // Save to storage
    Storage.ChatHistory.saveMessage(message);
  },

  /**
   * Clear chat messages
   */
  clearChat() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
      chatMessages.innerHTML = '';
    }
  },

  /**
   * Render location tag
   */
  renderLocationTag(location, index) {
    const locationTags = document.getElementById('locationTags');
    if (!locationTags) return;

    locationTags.style.display = 'flex';

    const tag = document.createElement('div');
    tag.className = 'location-tag';
    tag.setAttribute('data-index', index);

    tag.innerHTML = `
      <span>${location}</span>
      <button class="location-tag__remove" data-index="${index}">✕</button>
    `;

    locationTags.appendChild(tag);

    // Remove button handler
    const removeBtn = tag.querySelector('.location-tag__remove');
    removeBtn.addEventListener('click', () => {
      this.removeLocationTag(index);
    });
  },

  /**
   * Remove location tag
   */
  removeLocationTag(index) {
    const locationTags = document.getElementById('locationTags');
    if (!locationTags) return;

    const tag = locationTags.querySelector(`[data-index="${index}"]`);
    if (tag) {
      tag.remove();
    }

    // Remove from storage
    Storage.SelectedElements.remove(index);

    // Hide container if empty
    if (locationTags.children.length === 0) {
      locationTags.style.display = 'none';
    }
  },

  /**
   * Clear all location tags
   */
  clearLocationTags() {
    const locationTags = document.getElementById('locationTags');
    if (locationTags) {
      locationTags.innerHTML = '';
      locationTags.style.display = 'none';
    }
    Storage.SelectedElements.clear();
  },

  /**
   * Render history item
   */
  renderHistoryItem(item) {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    // Remove empty state
    const emptyState = historyList.querySelector('.empty-state');
    if (emptyState) {
      emptyState.remove();
    }

    const itemDiv = document.createElement('div');
    itemDiv.className = 'history-item';
    itemDiv.setAttribute('data-id', item.id);
    itemDiv.setAttribute('data-category', item.category);

    const categoryText = {
      ui: 'UI',
      function: '기능',
      style: '스타일',
      bug: '버그',
      other: '기타'
    };

    itemDiv.innerHTML = `
      <div class="history-item__header">
        <span class="history-item__category" data-category="${item.category}">
          ${categoryText[item.category] || item.category}
        </span>
        <span class="history-item__time">${item.date}</span>
      </div>
      <div class="history-item__text">
        <strong>${item.location}</strong><br>
        ${item.text}
      </div>
    `;

    historyList.insertBefore(itemDiv, historyList.firstChild);
  },

  /**
   * Load and render all history items
   */
  loadHistoryItems(category = 'all') {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    historyList.innerHTML = '';

    const items = category === 'all' 
      ? Storage.History.loadAll()
      : Storage.History.filterByCategory(category);

    if (items.length === 0) {
      historyList.innerHTML = `
        <div class="empty-state">
          <p>히스토리가 없습니다.</p>
          <p class="empty-state__hint">채팅창에서 [복사] 버튼을 클릭하면 자동으로 기록됩니다.</p>
        </div>
      `;
      return;
    }

    items.reverse().forEach(item => {
      this.renderHistoryItem(item);
    });
  },

  /**
   * Toggle history panel
   */
  toggleHistoryPanel() {
    const historyPanel = document.getElementById('historyPanel');
    const historyBtn = document.getElementById('btnHistory');
    
    if (!historyPanel || !historyBtn) return;

    const isOpen = historyPanel.classList.contains('open');

    if (isOpen) {
      historyPanel.classList.remove('open');
      historyPanel.setAttribute('aria-hidden', 'true');
      historyBtn.querySelector('.btn-text').textContent = '히스토리';
    } else {
      historyPanel.classList.add('open');
      historyPanel.setAttribute('aria-hidden', 'false');
      historyBtn.querySelector('.btn-text').textContent = '미리보기';
      this.loadHistoryItems();
    }
  },

  /**
   * Show settings modal
   */
  showSettingsModal() {
    const modalContainer = document.getElementById('modalContainer');
    if (!modalContainer) return;

    const settings = Storage.Settings.loadAll();

    const modalHTML = `
      <div class="modal-overlay" id="settingsModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>설정</h2>
            <button class="btn-close" id="btnCloseSettings">✕</button>
          </div>
          <div class="modal-body">
            <!-- Gemini API -->
            <div class="settings-section">
              <h3>Gemini API</h3>
              <div class="settings-field">
                <label for="geminiApiKey">API 키</label>
                <input type="password" class="input-text" id="geminiApiKey" 
                       value="${settings.geminiApiKey || ''}" 
                       placeholder="Gemini API 키를 입력하세요">
              </div>
              <button class="btn-secondary btn-sm" id="btnTestGemini">연결 테스트</button>
              <a href="https://makersuite.google.com/app/apikey" target="_blank" 
                 style="margin-left: 12px; font-size: 12px;">API 키 발급 →</a>
            </div>

            <!-- GitHub -->
            <div class="settings-section">
              <h3>GitHub Repository</h3>
              <div class="settings-field">
                <label for="githubRepoUrl">Repository URL</label>
                <input type="text" class="input-text" id="githubRepoUrl" 
                       value="${settings.githubRepoUrl || ''}" 
                       placeholder="https://github.com/username/repo">
              </div>
              <div class="settings-field">
                <label for="githubToken">Personal Access Token</label>
                <input type="password" class="input-text" id="githubToken" 
                       value="${settings.githubToken || ''}" 
                       placeholder="GitHub Token">
              </div>
              <button class="btn-secondary btn-sm" id="btnTestGithub">연결 테스트</button>
              <a href="https://github.com/settings/tokens" target="_blank" 
                 style="margin-left: 12px; font-size: 12px;">Token 발급 →</a>
            </div>

            <!-- Collaboration GitHub -->
            <div class="settings-section">
              <h3>협업 GitHub (선택)</h3>
              <div class="settings-field">
                <label for="collabGithubRepoUrl">Repository URL</label>
                <input type="text" class="input-text" id="collabGithubRepoUrl" 
                       value="${settings.collabGithubRepoUrl || ''}" 
                       placeholder="https://github.com/team/project">
              </div>
              <div class="settings-field">
                <label for="collabGithubToken">Personal Access Token</label>
                <input type="password" class="input-text" id="collabGithubToken" 
                       value="${settings.collabGithubToken || ''}" 
                       placeholder="GitHub Token">
              </div>
            </div>

            <!-- Theme -->
            <div class="settings-section">
              <h3>테마</h3>
              <div class="settings-field-row">
                <label>다크 모드</label>
                <label class="toggle">
                  <input type="checkbox" id="darkMode" ${settings.theme === 'dark' ? 'checked' : ''}>
                  <span class="toggle__slider"></span>
                </label>
              </div>
            </div>

            <!-- Font Size -->
            <div class="settings-section">
              <h3>폰트 크기</h3>
              <div class="settings-field">
                <div style="display: flex; gap: 12px;">
                  <button class="btn-secondary btn-sm font-size-btn ${settings.fontSize === 'small' ? 'active' : ''}" 
                          data-size="small">작게</button>
                  <button class="btn-secondary btn-sm font-size-btn ${settings.fontSize === 'medium' ? 'active' : ''}" 
                          data-size="medium">보통</button>
                  <button class="btn-secondary btn-sm font-size-btn ${settings.fontSize === 'large' ? 'active' : ''}" 
                          data-size="large">크게</button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" id="btnCancelSettings">취소</button>
            <button class="btn-primary" id="btnSaveSettings">저장</button>
          </div>
        </div>
      </div>
    `;

    modalContainer.innerHTML = modalHTML;

    // Event handlers
    document.getElementById('btnCloseSettings').addEventListener('click', () => this.closeModal());
    document.getElementById('btnCancelSettings').addEventListener('click', () => this.closeModal());
    document.getElementById('btnSaveSettings').addEventListener('click', () => this.saveSettings());
    document.getElementById('btnTestGemini').addEventListener('click', () => this.testGeminiConnection());
    document.getElementById('btnTestGithub').addEventListener('click', () => this.testGithubConnection());

    // Dark mode toggle
    document.getElementById('darkMode').addEventListener('change', (e) => {
      const theme = e.target.checked ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
    });

    // Font size buttons
    document.querySelectorAll('.font-size-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.font-size-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const size = e.target.getAttribute('data-size');
        document.documentElement.setAttribute('data-font-size', size);
      });
    });

    // Close on overlay click
    document.querySelector('.modal-overlay').addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        this.closeModal();
      }
    });
  },

  /**
   * Close modal
   */
  closeModal() {
    const modalContainer = document.getElementById('modalContainer');
    if (modalContainer) {
      modalContainer.innerHTML = '';
    }
  },

  /**
   * Save settings
   */
  saveSettings() {
    const geminiApiKey = document.getElementById('geminiApiKey').value.trim();
    const githubRepoUrl = document.getElementById('githubRepoUrl').value.trim();
    const githubToken = document.getElementById('githubToken').value.trim();
    const collabGithubRepoUrl = document.getElementById('collabGithubRepoUrl').value.trim();
    const collabGithubToken = document.getElementById('collabGithubToken').value.trim();
    const theme = document.getElementById('darkMode').checked ? 'dark' : 'light';
    const fontSize = document.querySelector('.font-size-btn.active').getAttribute('data-size');

    console.log('💾 Saving settings...', {
      geminiApiKey: geminiApiKey ? '***' + geminiApiKey.slice(-4) : 'empty',
      githubRepoUrl,
      theme,
      fontSize
    });

    const saveResults = {
      gemini: Storage.Settings.saveGeminiApiKey(geminiApiKey),
      githubUrl: Storage.Settings.saveGithubRepoUrl(githubRepoUrl),
      githubToken: Storage.Settings.saveGithubToken(githubToken),
      collabUrl: Storage.Settings.saveCollabGithubRepoUrl(collabGithubRepoUrl),
      collabToken: Storage.Settings.saveCollabGithubToken(collabGithubToken),
      theme: Storage.Settings.saveTheme(theme),
      fontSize: Storage.Settings.saveFontSize(fontSize)
    };

    console.log('💾 Save results:', saveResults);

    // Verify saved values
    const loaded = Storage.Settings.loadAll();
    console.log('✅ Loaded after save:', {
      geminiApiKey: loaded.geminiApiKey ? '***' + loaded.geminiApiKey.slice(-4) : 'empty',
      githubRepoUrl: loaded.githubRepoUrl,
      theme: loaded.theme,
      fontSize: loaded.fontSize
    });

    this.showNotification('설정이 저장되었습니다.', 'success');
    this.closeModal();

    // Trigger app to reload connections
    if (typeof App !== 'undefined' && App.checkConnections) {
      App.checkConnections();
    }
  },

  /**
   * Test Gemini connection
   */
  async testGeminiConnection() {
    const apiKey = document.getElementById('geminiApiKey').value.trim();
    
    if (!apiKey) {
      this.showNotification('API 키를 입력하세요.', 'warning');
      return;
    }

    this.showNotification('연결 테스트 중...', 'info', 0);

    try {
      const result = await API.Gemini.testConnection(apiKey);
      
      if (result.success) {
        this.showNotification('✅ Gemini API 연결 성공!', 'success');
      } else {
        this.showNotification(`❌ 연결 실패: ${result.message}`, 'error');
      }
    } catch (error) {
      this.showNotification(`❌ 연결 실패: ${error.message}`, 'error');
    }
  },

  /**
   * Test GitHub connection
   */
  async testGithubConnection() {
    const repoUrl = document.getElementById('githubRepoUrl').value.trim();
    const token = document.getElementById('githubToken').value.trim();
    
    if (!repoUrl || !token) {
      this.showNotification('Repository URL과 Token을 입력하세요.', 'warning');
      return;
    }

    this.showNotification('연결 테스트 중...', 'info', 0);

    try {
      const result = await API.GitHub.testConnection(repoUrl, token);
      
      if (result.success) {
        this.showNotification('✅ GitHub 연결 성공!', 'success');
      } else {
        this.showNotification(`❌ 연결 실패: ${result.message}`, 'error');
      }
    } catch (error) {
      this.showNotification(`❌ 연결 실패: ${error.message}`, 'error');
    }
  },

  /**
   * Show prompt popup
   */
  showPromptPopup() {
    const popupContainer = document.getElementById('popupContainer');
    if (!popupContainer) return;

    const prompt = Storage.Settings.loadPrompt();

    const popupHTML = `
      <div class="modal-overlay">
        <div class="popup-prompt">
          <div class="popup-prompt__header">
            <h3>프롬프트 설정</h3>
          </div>
          <textarea class="textarea popup-prompt__textarea" id="promptText">${prompt}</textarea>
          <div class="popup-prompt__actions">
            <button class="btn-secondary" id="btnCancelPrompt">취소</button>
            <button class="btn-primary" id="btnSavePrompt">저장</button>
          </div>
        </div>
      </div>
    `;

    popupContainer.innerHTML = popupHTML;

    document.getElementById('btnCancelPrompt').addEventListener('click', () => {
      popupContainer.innerHTML = '';
    });

    document.getElementById('btnSavePrompt').addEventListener('click', () => {
      const newPrompt = document.getElementById('promptText').value;
      Storage.Settings.savePrompt(newPrompt);
      this.showNotification('프롬프트가 저장되었습니다.', 'success');
      popupContainer.innerHTML = '';
    });

    // Close on overlay click
    document.querySelector('.modal-overlay').addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        popupContainer.innerHTML = '';
      }
    });
  },

  /**
   * Update URL display
   */
  updateUrlDisplay(url) {
    const urlDisplay = document.getElementById('currentUrl');
    if (urlDisplay) {
      urlDisplay.textContent = url || '-';
    }
  },

  /**
   * Update GitHub repo labels
   */
  updateGithubLabels() {
    const githubRepoUrl = Storage.Settings.loadGithubRepoUrl();
    const collabRepoUrl = Storage.Settings.loadCollabGithubRepoUrl();

    const githubLabel = document.getElementById('githubRepoLabel');
    const collabLabel = document.getElementById('collabRepoLabel');

    if (githubLabel) {
      githubLabel.textContent = githubRepoUrl 
        ? `저장소: ${githubRepoUrl.split('/').pop()}`
        : '저장소: -';
    }

    if (collabLabel) {
      collabLabel.textContent = collabRepoUrl 
        ? `협업: ${collabRepoUrl.split('/').pop()}`
        : '협업: -';
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UI;
}
