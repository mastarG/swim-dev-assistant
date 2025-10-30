/**
 * API Module - Swim Developer Assistant
 * Gemini AI and GitHub API integration
 * 
 * Based on API_SPEC.md specifications
 */

const API = {
  /**
   * Gemini AI API
   */
  Gemini: {
    BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',
    MODEL: 'gemini-1.5-flash',

    /**
     * Generate content using Gemini API
     * @param {string} userInput - User's input text
     * @param {string} location - Element location info
     * @param {string} prompt - System prompt
     * @param {string} apiKey - Gemini API key
     * @returns {Promise<string>} - Generated text
     */
    async generateContent(userInput, location, prompt, apiKey) {
      if (!apiKey) {
        throw new Error('Gemini API 키가 설정되지 않았습니다.');
      }

      // Use query parameter for API key instead of header
      const url = `${this.BASE_URL}/models/${this.MODEL}:generateContent?key=${apiKey}`;
      
      const requestBody = {
        contents: [{
          parts: [{
            text: `${prompt}\n\n사용자 입력:\n${userInput}\n\n위치 정보:\n${location || '(없음)'}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      };

      console.log('🤖 Calling Gemini API:', {
        url: url.replace(/key=.*/,  'key=***'),
        model: this.MODEL
      });

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'API 호출 실패');
        }

        const data = await response.json();
        
        if (!data.candidates || data.candidates.length === 0) {
          throw new Error('응답을 생성할 수 없습니다.');
        }

        const generatedText = data.candidates[0].content.parts[0].text;
        return generatedText;

      } catch (error) {
        console.error('Gemini API Error:', error);
        throw error;
      }
    },

    /**
     * Test API connection
     */
    async testConnection(apiKey) {
      try {
        const result = await this.generateContent(
          '안녕하세요',
          '[test]',
          '간단히 인사해주세요.',
          apiKey
        );
        return { success: true, message: '연결 성공' };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },

    /**
     * Analyze for history categorization
     */
    async analyzeForHistory(chatContent, apiKey) {
      const analysisPrompt = `다음 채팅 내용을 분석하여 히스토리에 기록할지 결정하세요.

기록 기준:
- 기능 변경: 기록 O
- 사용자 요청/의견: 기록 O  
- 디자인 변경 (색상, 크기, 위치): 기록 X
- 단순 수정: 기록 X

응답 형식 (JSON):
{
  "shouldRecord": true/false,
  "category": "ui" | "function" | "style" | "bug" | "other",
  "summary": "요약 내용 (한 줄)",
  "location": "위치 정보",
  "priority": "P0" | "P1" | "P2"
}`;

      try {
        const result = await this.generateContent(
          chatContent,
          '',
          analysisPrompt,
          apiKey
        );

        // Parse JSON response
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }

        return { shouldRecord: false };
      } catch (error) {
        console.error('History analysis error:', error);
        return { shouldRecord: false };
      }
    }
  },

  /**
   * GitHub API
   */
  GitHub: {
    BASE_URL: 'https://api.github.com',

    /**
     * Parse GitHub repo URL
     * @param {string} repoUrl - GitHub repository URL
     * @returns {object} - { owner, repo }
     */
    parseRepoUrl(repoUrl) {
      const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) {
        throw new Error('올바른 GitHub Repository URL이 아닙니다.');
      }
      return {
        owner: match[1],
        repo: match[2].replace('.git', '')
      };
    },

    /**
     * Test connection
     */
    async testConnection(repoUrl, token) {
      try {
        const { owner, repo } = this.parseRepoUrl(repoUrl);
        const url = `${this.BASE_URL}/repos/${owner}/${repo}`;

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (!response.ok) {
          throw new Error('Repository에 접근할 수 없습니다.');
        }

        return { success: true, message: '연결 성공' };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },

    /**
     * Get repository info
     */
    async getRepoInfo(repoUrl, token) {
      const { owner, repo } = this.parseRepoUrl(repoUrl);
      const url = `${this.BASE_URL}/repos/${owner}/${repo}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error('Repository 정보를 가져올 수 없습니다.');
      }

      return await response.json();
    },

    /**
     * Get file content
     */
    async getFileContent(repoUrl, token, filePath) {
      const { owner, repo } = this.parseRepoUrl(repoUrl);
      const url = `${this.BASE_URL}/repos/${owner}/${repo}/contents/${filePath}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error(`파일을 찾을 수 없습니다: ${filePath}`);
      }

      const data = await response.json();
      
      // Decode base64 content
      if (data.content) {
        return atob(data.content);
      }

      throw new Error('파일 내용이 없습니다.');
    },

    /**
     * Get repository structure
     */
    async getRepoStructure(repoUrl, token) {
      const { owner, repo } = this.parseRepoUrl(repoUrl);
      const url = `${this.BASE_URL}/repos/${owner}/${repo}/git/trees/main?recursive=1`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error('Repository 구조를 가져올 수 없습니다.');
      }

      const data = await response.json();
      return data.tree;
    },

    /**
     * Get HTML files with data-* attributes
     */
    async getHtmlFiles(repoUrl, token) {
      const structure = await this.getRepoStructure(repoUrl, token);
      const htmlFiles = structure.filter(item => 
        item.type === 'blob' && item.path.endsWith('.html')
      );

      const filesWithContent = await Promise.all(
        htmlFiles.map(async file => {
          try {
            const content = await this.getFileContent(repoUrl, token, file.path);
            return {
              path: file.path,
              content: content
            };
          } catch (error) {
            console.error(`Error loading ${file.path}:`, error);
            return null;
          }
        })
      );

      return filesWithContent.filter(f => f !== null);
    },

    /**
     * Extract data-* attributes from HTML
     */
    extractDataAttributes(htmlContent) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const elementsWithData = doc.querySelectorAll('[data-component], [data-type], [data-variant]');

      const attributes = [];
      elementsWithData.forEach(el => {
        const dataAttrs = {};
        Array.from(el.attributes).forEach(attr => {
          if (attr.name.startsWith('data-')) {
            dataAttrs[attr.name] = attr.value;
          }
        });

        if (Object.keys(dataAttrs).length > 0) {
          attributes.push({
            tag: el.tagName.toLowerCase(),
            attributes: dataAttrs,
            path: this.getElementPath(el)
          });
        }
      });

      return attributes;
    },

    /**
     * Get element path (CSS selector path)
     */
    getElementPath(element) {
      const path = [];
      let current = element;

      while (current && current !== document.body) {
        let selector = current.tagName.toLowerCase();
        
        if (current.id) {
          selector += `#${current.id}`;
        } else if (current.className) {
          const classes = current.className.split(' ').filter(c => c);
          if (classes.length > 0) {
            selector += `.${classes[0]}`;
          }
        }

        path.unshift(selector);
        current = current.parentElement;
      }

      return path.join(' > ');
    },

    /**
     * Get GitHub Pages URL
     */
    getGitHubPagesUrl(repoUrl) {
      const { owner, repo } = this.parseRepoUrl(repoUrl);
      return `https://${owner}.github.io/${repo}/`;
    },

    /**
     * Get latest commits
     */
    async getLatestCommits(repoUrl, token, count = 10) {
      const { owner, repo } = this.parseRepoUrl(repoUrl);
      const url = `${this.BASE_URL}/repos/${owner}/${repo}/commits?per_page=${count}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error('Commit 정보를 가져올 수 없습니다.');
      }

      return await response.json();
    },

    /**
     * Check for shared_memory.json (collaboration)
     */
    async getSharedMemory(repoUrl, token) {
      try {
        const content = await this.getFileContent(repoUrl, token, 'shared_memory.json');
        return JSON.parse(content);
      } catch (error) {
        console.log('shared_memory.json not found, collaboration disabled');
        return null;
      }
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = API;
}
