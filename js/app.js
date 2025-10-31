/**
 * Main App Module - Swim Developer Assistant
 * Application initialization and main logic
 * 
 * Based on PRD.md and PAGE_SPECS.md specifications
 */

const App = {
  // State
  state: {
    mode: 'click', // 'click' or 'screen'
    isResizing: false,
    isSelecting: false,
    selectedElements: [],
    selectionStart: { x: 0, y: 0 },
    pressTimer: null,
    connections: {
      gemini: false,
      github: false,
      collab: false
    }
  },

  /**
   * Initialize application
   */
  init() {
    console.log('🏊 Swim Developer Assistant - Initializing...');

    // Load saved settings
    this.loadSettings();

    // Initialize UI
    this.initializeUI();

    // Setup event listeners
    this.setupEventListeners();

    // Check connections
    this.checkConnections();

    // Load preview URL
    this.loadPreviewUrl();

    console.log('✅ Application initialized successfully');
  },

  /**
   * Load saved settings
   */
  loadSettings() {
    const settings = Storage.Settings.loadAll();

    // Apply theme
    document.documentElement.setAttribute('data-theme', settings.theme);

    // Apply font size
    document.documentElement.setAttribute('data-font-size', settings.fontSize);

    // Update UI labels
    UI.updateGithubLabels();
  },

  /**
   * Initialize UI components
   */
  initializeUI() {
    // Set initial mode
    this.setMode('click');

    // Load chat history
    const chatHistory = Storage.ChatHistory.loadAll();
    chatHistory.forEach(msg => {
      UI.renderChatMessage(msg);
    });

    // Load selected elements
    const selectedElements = Storage.SelectedElements.load();
    selectedElements.forEach((el, index) => {
      UI.renderLocationTag(el, index);
    });
  },

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    console.log('🔧 Setting up event listeners...');

    // Top navigation buttons
    document.getElementById('btnHistory')?.addEventListener('click', () => {
      console.log('📋 History button clicked');
      UI.toggleHistoryPanel();
    });
    document.getElementById('btnSettings')?.addEventListener('click', () => {
      console.log('⚙️ Settings button clicked');
      UI.showSettingsModal();
    });

    // URL input and load button
    document.getElementById('btnLoadUrl')?.addEventListener('click', () => {
      console.log('🔗 Load URL button clicked');
      this.loadUrlFromInput();
    });
    const urlInput = document.getElementById('urlInput');
    urlInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        console.log('⏎ Enter pressed in URL input');
        this.loadUrlFromInput();
      }
    });

    // Preview panel toolbar buttons
    document.getElementById('btnClickMode')?.addEventListener('click', () => {
      console.log('👆 Click mode button clicked');
      this.setMode('click');
    });
    document.getElementById('btnScreenMode')?.addEventListener('click', () => {
      console.log('📐 Screen mode button clicked');
      this.setMode('screen');
    });
    document.getElementById('btnRefresh')?.addEventListener('click', () => {
      console.log('🔄 Refresh button clicked');
      this.refreshPreview();
    });

    // Input panel buttons
    document.getElementById('btnPrompt')?.addEventListener('click', () => {
      console.log('✨ Prompt button clicked');
      UI.showPromptPopup();
    });
    document.getElementById('btnAttach')?.addEventListener('click', () => {
      console.log('📎 Attach button clicked');
      this.attachFile();
    });
    document.getElementById('btnSend')?.addEventListener('click', () => {
      console.log('📤 Send button clicked');
      this.sendMessage();
    });
    document.getElementById('btnCopy')?.addEventListener('click', () => {
      console.log('📋 Copy button clicked');
      this.copyResult();
    });

    // Message input
    const messageInput = document.getElementById('messageInput');
    messageInput?.addEventListener('input', () => {
      const btnSend = document.getElementById('btnSend');
      if (btnSend) {
        btnSend.disabled = messageInput.value.trim().length === 0;
      }
    });

    // Enter key to send (Ctrl+Enter or Cmd+Enter)
    messageInput?.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        this.sendMessage();
      }
    });

    // Resize handle
    this.setupResizeHandle();

    // Preview frame load
    const previewFrame = document.getElementById('previewFrame');
    previewFrame?.addEventListener('load', () => {
      this.onPreviewLoad();
    });

    // History panel
    document.getElementById('btnCloseHistory')?.addEventListener('click', () => {
      UI.toggleHistoryPanel();
    });

    // History filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const category = e.target.getAttribute('data-category');
        UI.loadHistoryItems(category);
      });
    });

    // History search
    const historySearch = document.getElementById('historySearch');
    historySearch?.addEventListener('input', (e) => {
      const keyword = e.target.value.trim();
      if (keyword) {
        const results = Storage.History.search(keyword);
        this.renderSearchResults(results);
      } else {
        const activeCategory = document.querySelector('.filter-btn.active')?.getAttribute('data-category') || 'all';
        UI.loadHistoryItems(activeCategory);
      }
    });

    // Export history
    document.getElementById('btnExportHistory')?.addEventListener('click', () => {
      this.exportHistory();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Cmd/Ctrl + K: Open prompt
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        UI.showPromptPopup();
      }

      // Cmd/Ctrl + H: Toggle history
      if ((e.metaKey || e.ctrlKey) && e.key === 'h') {
        e.preventDefault();
        UI.toggleHistoryPanel();
      }

      // Cmd/Ctrl + ,: Open settings
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        UI.showSettingsModal();
      }

      // Escape: Close modals/panels
      if (e.key === 'Escape') {
        UI.closeModal();
        const popupContainer = document.getElementById('popupContainer');
        if (popupContainer) {
          popupContainer.innerHTML = '';
        }
      }
    });
  },

  /**
   * Setup resize handle for panel adjustment
   */
  setupResizeHandle() {
    const resizeHandle = document.getElementById('resizeHandle');
    const previewPanel = document.getElementById('previewPanel');
    const inputPanel = document.getElementById('inputPanel');

    if (!resizeHandle || !previewPanel || !inputPanel) return;

    let startX = 0;
    let startWidth = 0;

    resizeHandle.addEventListener('mousedown', (e) => {
      this.state.isResizing = true;
      startX = e.clientX;
      startWidth = previewPanel.offsetWidth;
      document.body.classList.add('resizing');
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.state.isResizing) return;

      const deltaX = e.clientX - startX;
      const newWidth = startWidth + deltaX;
      const totalWidth = window.innerWidth;
      const percentage = (newWidth / totalWidth) * 100;

      // Min 40%, Max 75%
      if (percentage >= 40 && percentage <= 75) {
        previewPanel.style.width = percentage + '%';
        inputPanel.style.width = (100 - percentage) + '%';
      }
    });

    document.addEventListener('mouseup', () => {
      if (this.state.isResizing) {
        this.state.isResizing = false;
        document.body.classList.remove('resizing');
      }
    });
  },

  /**
   * Set interaction mode (click or screen)
   */
  setMode(mode) {
    this.state.mode = mode;

    const btnClick = document.getElementById('btnClickMode');
    const btnScreen = document.getElementById('btnScreenMode');

    if (mode === 'click') {
      btnClick?.classList.add('active');
      btnClick?.setAttribute('aria-pressed', 'true');
      btnScreen?.classList.remove('active');
      btnScreen?.setAttribute('aria-pressed', 'false');
      
      UI.showNotification('클릭모드 활성화: 요소를 클릭하여 선택하세요', 'info');
    } else {
      btnScreen?.classList.add('active');
      btnScreen?.setAttribute('aria-pressed', 'true');
      btnClick?.classList.remove('active');
      btnClick?.setAttribute('aria-pressed', 'false');
      
      UI.showNotification('스크린모드 활성화: 0.7초 롱프레스로 영역을 선택하세요', 'info');
    }

    // Setup iframe interaction based on mode
    this.setupIframeInteraction();
  },

  /**
   * Setup iframe interaction based on current mode
   */
  setupIframeInteraction() {
    const iframe = document.getElementById('previewFrame');
    if (!iframe || !iframe.contentWindow) return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    if (!iframeDoc) return;

    // Remove existing event listeners (by cloning)
    const body = iframeDoc.body;
    if (!body) return;

    if (this.state.mode === 'click') {
      // Click mode: click to select elements
      body.addEventListener('click', (e) => this.handleElementClick(e), true);
    } else {
      // Screen mode: long press + drag to select area
      body.addEventListener('mousedown', (e) => this.handleScreenModeStart(e));
      body.addEventListener('mousemove', (e) => this.handleScreenModeMove(e));
      body.addEventListener('mouseup', (e) => this.handleScreenModeEnd(e));
    }
  },

  /**
   * Handle element click (Click Mode)
   */
  handleElementClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const target = e.target;

    // Extract data-* attributes
    const dataAttrs = [];
    Array.from(target.attributes).forEach(attr => {
      if (attr.name.startsWith('data-')) {
        dataAttrs.push(`${attr.name}="${attr.value}"`);
      }
    });

    // Build location string
    let location = `[${target.tagName.toLowerCase()}]`;
    
    if (target.id) {
      location += `#${target.id}`;
    }
    
    if (target.className && typeof target.className === 'string') {
      const classes = target.className.split(' ').filter(c => c.trim());
      if (classes.length > 0) {
        location += `.${classes[0]}`;
      }
    }

    if (dataAttrs.length > 0) {
      location += `[${dataAttrs.join('][')}]`;
    }

    // Add to selected elements
    this.state.selectedElements.push(location);
    Storage.SelectedElements.add(location);

    // Render location tag
    UI.renderLocationTag(location, this.state.selectedElements.length - 1);

    // Show notification
    UI.showNotification(`선택됨: ${location}`, 'success', 2000);

    // Highlight element briefly
    this.highlightElement(target);
  },

  /**
   * Highlight element briefly
   */
  highlightElement(element) {
    const originalBg = element.style.backgroundColor;
    const originalBorder = element.style.border;

    element.style.backgroundColor = 'rgba(0, 122, 255, 0.2)';
    element.style.border = '2px solid #007AFF';

    setTimeout(() => {
      element.style.backgroundColor = originalBg;
      element.style.border = originalBorder;
    }, 500);
  },

  /**
   * Handle screen mode start (mousedown)
   */
  handleScreenModeStart(e) {
    // Start long press timer
    this.state.pressTimer = setTimeout(() => {
      this.state.isSelecting = true;
      this.state.selectionStart = {
        x: e.clientX,
        y: e.clientY
      };

      const selectionBox = document.getElementById('selectionBox');
      if (selectionBox) {
        selectionBox.style.display = 'block';
        selectionBox.style.left = e.clientX + 'px';
        selectionBox.style.top = e.clientY + 'px';
        selectionBox.style.width = '0px';
        selectionBox.style.height = '0px';
      }
    }, 700); // 0.7 seconds
  },

  /**
   * Handle screen mode move (mousemove)
   */
  handleScreenModeMove(e) {
    if (!this.state.isSelecting) return;

    const selectionBox = document.getElementById('selectionBox');
    if (!selectionBox) return;

    const startX = this.state.selectionStart.x;
    const startY = this.state.selectionStart.y;
    const currentX = e.clientX;
    const currentY = e.clientY;

    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);
    const left = Math.min(startX, currentX);
    const top = Math.min(startY, currentY);

    selectionBox.style.left = left + 'px';
    selectionBox.style.top = top + 'px';
    selectionBox.style.width = width + 'px';
    selectionBox.style.height = height + 'px';
  },

  /**
   * Handle screen mode end (mouseup)
   */
  handleScreenModeEnd(e) {
    clearTimeout(this.state.pressTimer);

    if (this.state.isSelecting) {
      const selectionBox = document.getElementById('selectionBox');
      if (selectionBox) {
        const rect = selectionBox.getBoundingClientRect();
        const location = `[Screen Area: ${Math.round(rect.width)}x${Math.round(rect.height)} at (${Math.round(rect.left)}, ${Math.round(rect.top)})]`;

        // Add to selected elements
        this.state.selectedElements.push(location);
        Storage.SelectedElements.add(location);

        // Render location tag
        UI.renderLocationTag(location, this.state.selectedElements.length - 1);

        // Hide selection box
        selectionBox.style.display = 'none';

        UI.showNotification(`영역 선택됨: ${Math.round(rect.width)}x${Math.round(rect.height)}`, 'success', 2000);
      }

      this.state.isSelecting = false;
    }
  },

  /**
   * Load preview URL from storage or settings
   */
  loadPreviewUrl() {
    const savedUrl = Storage.PreviewUrl.load();
    const githubRepoUrl = Storage.Settings.loadGithubRepoUrl();

    let previewUrl = savedUrl;

    // If no saved URL but GitHub repo is configured, use GitHub Pages URL
    if (!previewUrl && githubRepoUrl) {
      try {
        previewUrl = API.GitHub.getGitHubPagesUrl(githubRepoUrl);
      } catch (error) {
        console.error('Error generating GitHub Pages URL:', error);
      }
    }

    // Update URL input field
    const urlInput = document.getElementById('urlInput');
    if (urlInput && previewUrl) {
      urlInput.value = previewUrl;
    }

    if (previewUrl) {
      this.loadPreview(previewUrl);
    }
  },

  /**
   * Load URL from input field
   */
  loadUrlFromInput() {
    const urlInput = document.getElementById('urlInput');
    const url = urlInput?.value.trim();
    
    if (!url) {
      UI.showNotification('URL을 입력하세요.', 'warning', 3000);
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      UI.showNotification('올바른 URL 형식이 아닙니다.', 'error', 3000);
      return;
    }

    this.loadPreview(url);
  },

  /**
   * Load preview in iframe
   */
  loadPreview(url) {
    if (!url) return;

    UI.showLoading();

    const iframe = document.getElementById('previewFrame');
    const previewEmpty = document.getElementById('previewEmpty');
    
    if (iframe && previewEmpty) {
      // Hide empty state, show iframe
      previewEmpty.style.display = 'none';
      iframe.style.display = 'block';
      
      iframe.src = url;
      Storage.PreviewUrl.save(url);
      
      // Update URL input
      const urlInput = document.getElementById('urlInput');
      if (urlInput) {
        urlInput.value = url;
      }
    }
  },

  /**
   * On preview iframe load
   */
  onPreviewLoad() {
    UI.hideLoading();

    const iframe = document.getElementById('previewFrame');
    if (!iframe) return;

    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      
      if (iframeDoc) {
        UI.showNotification('미리보기 로드 완료', 'success', 2000);
        
        // Setup interaction based on current mode
        this.setupIframeInteraction();
      }
    } catch (error) {
      console.error('iframe access error:', error);
      UI.showNotification('미리보기 로드 완료 (iframe 접근 제한)', 'warning', 3000);
    }
  },

  /**
   * Refresh preview
   */
  refreshPreview() {
    const iframe = document.getElementById('previewFrame');
    if (!iframe) return;

    // Check if GitHub is connected
    const githubToken = Storage.Settings.loadGithubToken();
    const githubRepoUrl = Storage.Settings.loadGithubRepoUrl();

    if (githubToken && githubRepoUrl) {
      UI.showNotification('GitHub에서 최신 버전을 가져오는 중...', 'info', 0);
      
      // In production, would pull latest from GitHub
      // For now, just reload iframe
      setTimeout(() => {
        iframe.contentWindow.location.reload();
        UI.showNotification('새로고침 완료', 'success');
      }, 1000);
    } else {
      iframe.contentWindow.location.reload();
      UI.showNotification('새로고침 중...', 'info');
    }
  },

  /**
   * Reset input
   */
  resetInput() {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
      messageInput.value = '';
    }

    UI.clearLocationTags();
    this.state.selectedElements = [];

    const btnSend = document.getElementById('btnSend');
    if (btnSend) {
      btnSend.disabled = true;
    }

    UI.showNotification('입력이 초기화되었습니다.', 'info');
  },

  /**
   * Send message to Gemini
   */
  async sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const userInput = messageInput?.value.trim();

    if (!userInput) {
      UI.showNotification('메시지를 입력하세요.', 'warning');
      return;
    }

    // Check if Gemini API key is configured
    const apiKey = Storage.Settings.loadGeminiApiKey();
    if (!apiKey) {
      UI.showNotification('설정에서 Gemini API 키를 입력하세요.', 'error');
      UI.showSettingsModal();
      return;
    }

    // Get location info from selected elements
    const location = this.state.selectedElements.join('\n') || '(위치 정보 없음)';

    // Show user message
    UI.renderChatMessage({
      type: 'user',
      name: '사용자',
      text: userInput,
      info: location !== '(위치 정보 없음)' ? `위치: ${location}` : null
    });

    // Show loading
    UI.showNotification('Gemini AI가 분석 중...', 'info', 0);

    try {
      // Get prompt
      const prompt = Storage.Settings.loadPrompt();

      // Call Gemini API
      const result = await API.Gemini.generateContent(userInput, location, prompt, apiKey);

      // Show Gemini response
      UI.renderChatMessage({
        type: 'gemini',
        name: 'Gemini',
        text: result
      });

      UI.showNotification('변환 완료', 'success');

      // Show copy button
      const btnCopy = document.getElementById('btnCopy');
      if (btnCopy) {
        btnCopy.style.display = 'flex';
      }

      // Change send button to reset
      const btnSend = document.getElementById('btnSend');
      if (btnSend) {
        btnSend.innerHTML = '<span class="icon">🔄</span><span class="btn-text">초기화</span>';
        btnSend.onclick = () => {
          this.resetInput();
          btnSend.innerHTML = '<span class="icon">✨</span><span class="btn-text">변환</span>';
          btnSend.onclick = () => this.sendMessage();
        };
      }

    } catch (error) {
      UI.showNotification(`오류: ${error.message}`, 'error');
      console.error('Send message error:', error);
    }
  },

  /**
   * Copy result and analyze for history
   */
  async copyResult() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const messages = chatMessages.querySelectorAll('.chat-message');
    if (messages.length < 2) return;

    // Get last 2 messages (user + gemini)
    const lastMessages = Array.from(messages).slice(-2);
    let textToCopy = '';

    lastMessages.forEach(msg => {
      const name = msg.querySelector('.chat-message__name')?.textContent;
      const text = msg.querySelector('.chat-message__text')?.textContent;
      const info = msg.querySelector('.chat-message__info')?.textContent;

      textToCopy += `${name}:\n${text}\n`;
      if (info) {
        textToCopy += `${info}\n`;
      }
      textToCopy += '\n';
    });

    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(textToCopy);
      UI.showNotification('클립보드에 복사되었습니다!', 'success');

      // Change button state
      const btnCopy = document.getElementById('btnCopy');
      if (btnCopy) {
        btnCopy.classList.add('copied');
        btnCopy.innerHTML = '<span class="icon">✅</span><span class="btn-text">복사됨</span>';

        setTimeout(() => {
          btnCopy.classList.remove('copied');
          btnCopy.innerHTML = '<span class="icon">📋</span><span class="btn-text">복사</span>';
        }, 2000);
      }

      // Analyze for history
      const apiKey = Storage.Settings.loadGeminiApiKey();
      if (apiKey) {
        this.analyzeForHistory(textToCopy, apiKey);
      }

    } catch (error) {
      UI.showNotification('복사 실패', 'error');
      console.error('Copy error:', error);
    }
  },

  /**
   * Analyze chat for history categorization
   */
  async analyzeForHistory(chatContent, apiKey) {
    try {
      const analysis = await API.Gemini.analyzeForHistory(chatContent, apiKey);

      if (analysis.shouldRecord) {
        // Save to history
        Storage.History.saveItem({
          category: analysis.category,
          location: analysis.location || this.state.selectedElements.join(', ') || '(위치 없음)',
          text: analysis.summary,
          priority: analysis.priority || 'P1'
        });

        UI.showNotification('히스토리에 자동 기록되었습니다.', 'info', 2000);
      }
    } catch (error) {
      console.error('History analysis error:', error);
      // Don't show error to user, just fail silently
    }
  },

  /**
   * Attach file
   */
  attachFile() {
    UI.showNotification('파일 첨부 기능은 곧 추가됩니다.', 'info');
  },

  /**
   * Export history to Markdown
   */
  exportHistory() {
    const markdown = Storage.History.exportToMarkdown();

    // Create blob and download
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `requirements_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);

    UI.showNotification('히스토리가 Markdown 파일로 내보내졌습니다.', 'success');
  },

  /**
   * Render search results
   */
  renderSearchResults(results) {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    historyList.innerHTML = '';

    if (results.length === 0) {
      historyList.innerHTML = `
        <div class="empty-state">
          <p>검색 결과가 없습니다.</p>
        </div>
      `;
      return;
    }

    results.reverse().forEach(item => {
      UI.renderHistoryItem(item);
    });
  },

  /**
   * Check all connections
   */
  async checkConnections() {
    const settings = Storage.Settings.loadAll();

    // Check Gemini
    if (settings.geminiApiKey) {
      this.state.connections.gemini = true;
      UI.updateConnectionStatus('gemini', 'connected');
    } else {
      this.state.connections.gemini = false;
      UI.updateConnectionStatus('gemini', 'disconnected');
    }

    // Check GitHub
    if (settings.githubToken && settings.githubRepoUrl) {
      try {
        UI.updateConnectionStatus('github', 'connecting');
        const result = await API.GitHub.testConnection(settings.githubRepoUrl, settings.githubToken);
        
        if (result.success) {
          this.state.connections.github = true;
          UI.updateConnectionStatus('github', 'connected');
        } else {
          this.state.connections.github = false;
          UI.updateConnectionStatus('github', 'disconnected');
        }
      } catch (error) {
        this.state.connections.github = false;
        UI.updateConnectionStatus('github', 'disconnected');
      }
    } else {
      this.state.connections.github = false;
      UI.updateConnectionStatus('github', 'disconnected');
    }

    // Check Collab GitHub
    if (settings.collabGithubToken && settings.collabGithubRepoUrl) {
      try {
        UI.updateConnectionStatus('collab', 'connecting');
        const result = await API.GitHub.testConnection(settings.collabGithubRepoUrl, settings.collabGithubToken);
        
        if (result.success) {
          this.state.connections.collab = true;
          UI.updateConnectionStatus('collab', 'connected');
        } else {
          this.state.connections.collab = false;
          UI.updateConnectionStatus('collab', 'disconnected');
        }
      } catch (error) {
        this.state.connections.collab = false;
        UI.updateConnectionStatus('collab', 'disconnected');
      }
    } else {
      this.state.connections.collab = false;
      UI.updateConnectionStatus('collab', 'disconnected');
    }
  }
};

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}
