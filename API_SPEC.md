# API 명세서 (API Specification)

---

## 📚 목차

1. [Gemini API](#1-gemini-api)
2. [GitHub API](#2-github-api)
3. [로컬 스토리지 API](#3-로컬-스토리지-api)
4. [내부 API (프론트엔드)](#4-내부-api-프론트엔드)

---

## 1. Gemini API

### 1.1 텍스트 변환 (Text Generation)

#### **POST /v1/models/gemini-2.0-flash-exp:generateContent**

**설명:** 사용자 입력 텍스트를 AI 개발 에이전트가 이해하기 쉽게 변환

**요청:**
```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "{프롬프트}\n\n{사용자 입력}\n\n위치: {위치 정보}"
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 2048
  }
}
```

**헤더:**
```
Content-Type: application/json
x-goog-api-key: {GEMINI_API_KEY}
```

**응답 (200):**
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "[Header > btn.primary]\n배경색을 #2196F3(파란색)으로 변경\n현재 색상: #000000\n목표 색상: #2196F3"
          }
        ]
      }
    }
  ]
}
```

**에러 (400):**
```json
{
  "error": {
    "code": 400,
    "message": "Invalid API key",
    "status": "INVALID_ARGUMENT"
  }
}
```

---

### 1.2 히스토리 생성 (History Generation)

#### **POST /v1/models/gemini-2.0-flash-exp:generateContent**

**설명:** 채팅 내용을 분석하여 히스토리 항목 생성

**요청:**
```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "{히스토리 프롬프트}\n\n채팅 내용:\n{사용자 입력}\n{Gemini 응답}\n\n위치: {위치 정보}\n날짜: {현재 날짜}"
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.5,
    "maxOutputTokens": 512
  }
}
```

**응답 (200):**
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "날짜: 2025.10.30\n위치: [Header > btn.primary]\n기능: 버튼 배경색 변경 (#000 → #2196F3)\n카테고리: 스타일"
          }
        ]
      }
    }
  ]
}
```

**카테고리 판단 규칙:**
```
- "스타일": 히스토리에 기록 안 함
- "위치": 히스토리에 기록 안 함
- "기능": 히스토리에 기록
- "요청": 히스토리에 기록
```

---

## 2. GitHub API

### 2.1 Repository 정보 가져오기

#### **GET /repos/{owner}/{repo}**

**설명:** Repository 기본 정보 조회

**헤더:**
```
Authorization: token {GITHUB_TOKEN}
Accept: application/vnd.github.v3+json
```

**응답 (200):**
```json
{
  "name": "project-name",
  "full_name": "username/project-name",
  "html_url": "https://github.com/username/project-name",
  "description": "프로젝트 설명",
  "homepage": "https://username.github.io/project-name",
  "default_branch": "main"
}
```

---

### 2.2 파일 내용 가져오기

#### **GET /repos/{owner}/{repo}/contents/{path}**

**설명:** 특정 파일 내용 조회 (HTML, docs 등)

**헤더:**
```
Authorization: token {GITHUB_TOKEN}
Accept: application/vnd.github.v3+json
```

**예시:**
```
GET /repos/username/project/contents/index.html
GET /repos/username/project/contents/docs/PRD.md
GET /repos/username/project/contents/shared_memory.json
```

**응답 (200):**
```json
{
  "name": "index.html",
  "path": "index.html",
  "sha": "a1b2c3d4...",
  "size": 4532,
  "url": "https://api.github.com/repos/username/project/contents/index.html",
  "html_url": "https://github.com/username/project/blob/main/index.html",
  "download_url": "https://raw.githubusercontent.com/username/project/main/index.html",
  "content": "PCFET0NUWVBFIGh0bWw+...", // Base64 encoded
  "encoding": "base64"
}
```

**디코딩:**
```javascript
const content = atob(response.content);
// → <!DOCTYPE html><html>...
```

---

### 2.3 Commit 로그 가져오기

#### **GET /repos/{owner}/{repo}/commits**

**설명:** 최근 Commit 목록 조회

**파라미터:**
```
?per_page=10 (최대 100)
?page=1
?since=2025-10-30T00:00:00Z
```

**응답 (200):**
```json
[
  {
    "sha": "a1b2c3d4...",
    "commit": {
      "author": {
        "name": "Developer A",
        "email": "dev-a@example.com",
        "date": "2025-10-30T10:30:00Z"
      },
      "message": "Add header logo"
    },
    "html_url": "https://github.com/username/project/commit/a1b2c3d4"
  },
  {
    "sha": "e5f6g7h8...",
    "commit": {
      "author": {
        "name": "Developer B",
        "email": "dev-b@example.com",
        "date": "2025-10-30T09:15:00Z"
      },
      "message": "Fix footer layout"
    }
  }
]
```

---

### 2.4 특정 파일의 Commit 히스토리

#### **GET /repos/{owner}/{repo}/commits?path={file_path}**

**설명:** 특정 파일의 변경 이력

**예시:**
```
GET /repos/username/project/commits?path=shared_memory.json
```

**응답 (200):**
```json
[
  {
    "sha": "i9j0k1l2...",
    "commit": {
      "message": "Update component_id to 45",
      "author": {
        "name": "Developer A",
        "date": "2025-10-30T11:00:00Z"
      }
    }
  }
]
```

---

### 2.5 GitHub Pages URL 조회

#### **GET /repos/{owner}/{repo}/pages**

**설명:** GitHub Pages 정보 (배포 URL)

**응답 (200):**
```json
{
  "url": "https://username.github.io/project-name/",
  "status": "built",
  "cname": null,
  "html_url": "https://username.github.io/project-name/"
}
```

---

### 2.6 Rate Limit 확인

#### **GET /rate_limit**

**설명:** API 사용량 확인

**응답 (200):**
```json
{
  "resources": {
    "core": {
      "limit": 5000,
      "remaining": 4999,
      "reset": 1699564800
    }
  }
}
```

---

## 3. 로컬 스토리지 API

### 3.1 설정 저장

#### **localStorage.setItem()**

**키-값 쌍:**

```javascript
// Gemini API 키
localStorage.setItem('gemini_api_key', encryptedKey);

// GitHub Token
localStorage.setItem('github_token', encryptedToken);
localStorage.setItem('github_repo_url', 'https://github.com/username/project');

// 협업 GitHub
localStorage.setItem('collab_github_token', encryptedToken);
localStorage.setItem('collab_github_repo_url', 'https://github.com/team/project');

// 프롬프트
localStorage.setItem('prompt_instruction', '다음 내용을...');
localStorage.setItem('prompt_template', 'base64EncodedMdFile');

// 히스토리 프롬프트
localStorage.setItem('history_prompt', '다음 채팅을 분석하여...');
localStorage.setItem('history_template', 'markdown템플릿');

// 테마
localStorage.setItem('theme', 'light'); // light | dark

// 폰트 크기
localStorage.setItem('font_size', 'medium'); // small | medium | large

// 화면 비율
localStorage.setItem('panel_ratio', '0.6'); // 0.4 ~ 0.8

// 미리보기 URL
localStorage.setItem('preview_url', 'https://username.github.io/project');
```

---

### 3.2 히스토리 저장

#### **localStorage.setItem('history', JSON.stringify(historyArray))**

**구조:**
```javascript
const historyArray = [
  {
    id: '1699564800000', // timestamp
    date: '2025.10.30',
    location: '[Header > btn.primary]',
    description: '버튼 배경색 변경 (#000 → #2196F3)',
    category: '기능', // 기능 | 스타일 | 위치
    raw_input: '버튼 색상을 파란색으로 변경해줘',
    gemini_output: '[Header > btn.primary]의 배경색을...',
  },
  {
    id: '1699564900000',
    date: '2025.10.30',
    location: '[Footer > link.contact]',
    description: '링크 텍스트 변경 ("문의하기" → "Contact Us")',
    category: '기능',
  }
];

localStorage.setItem('history', JSON.stringify(historyArray));
```

---

### 3.3 채팅 기록 저장

#### **localStorage.setItem('chat_history', JSON.stringify(chatArray))**

**구조:**
```javascript
const chatArray = [
  {
    timestamp: 1699564800000,
    role: 'user',
    content: '버튼 색상을 파란색으로 변경해줘',
    location: '[Header > btn.primary]',
    attachments: [] // 이미지 URL 배열
  },
  {
    timestamp: 1699564805000,
    role: 'gemini',
    content: '[Header > btn.primary]의 배경색을 #2196F3로 변경',
    formatted: true
  }
];

localStorage.setItem('chat_history', JSON.stringify(chatArray));
```

---

## 4. 내부 API (프론트엔드)

### 4.1 위치 정보 추출

#### **extractLocationInfo(element)**

**입력:** DOM Element

**출력:**
```javascript
{
  selector: '[data-component="button"][data-variant="primary"]',
  path: 'Header > Navigation > Button',
  attributes: {
    'data-component': 'button',
    'data-variant': 'primary',
    'data-action': 'submit'
  },
  element: HTMLButtonElement
}
```

**알고리즘:**
```javascript
function extractLocationInfo(element) {
  // 1. data-* 속성 우선
  const dataAttrs = Array.from(element.attributes)
    .filter(attr => attr.name.startsWith('data-'))
    .map(attr => `[${attr.name}="${attr.value}"]`)
    .join('');
  
  if (dataAttrs) {
    return {
      selector: dataAttrs,
      path: getElementPath(element),
      attributes: getDataAttributes(element),
      element: element
    };
  }
  
  // 2. ID 또는 Class
  const id = element.id ? `#${element.id}` : '';
  const classes = element.className ? `.${element.className.split(' ').join('.')}` : '';
  
  return {
    selector: id || classes,
    path: getElementPath(element),
    element: element
  };
}

function getElementPath(element) {
  const path = [];
  let current = element;
  
  while (current && current !== document.body) {
    const tag = current.tagName.toLowerCase();
    const dataComponent = current.getAttribute('data-component');
    
    if (dataComponent) {
      path.unshift(dataComponent);
    } else {
      path.unshift(tag);
    }
    
    current = current.parentElement;
  }
  
  return path.join(' > ');
}
```

---

### 4.2 스크린 영역 선택

#### **selectScreenArea(startX, startY, endX, endY)**

**입력:** 드래그 시작/끝 좌표

**출력:**
```javascript
{
  elements: [element1, element2, element3],
  locations: [
    '[data-component="button"]',
    '[data-component="input"]',
    '[data-component="label"]'
  ]
}
```

**알고리즘:**
```javascript
function selectScreenArea(startX, startY, endX, endY) {
  const rect = {
    left: Math.min(startX, endX),
    top: Math.min(startY, endY),
    right: Math.max(startX, endX),
    bottom: Math.max(startY, endY)
  };
  
  const allElements = document.querySelectorAll('*');
  const selectedElements = [];
  
  allElements.forEach(el => {
    const elRect = el.getBoundingClientRect();
    
    if (isIntersecting(rect, elRect)) {
      selectedElements.push(el);
    }
  });
  
  return {
    elements: selectedElements,
    locations: selectedElements.map(el => extractLocationInfo(el).selector)
  };
}

function isIntersecting(rect1, rect2) {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}
```

---

### 4.3 Gemini 텍스트 변환

#### **transformText(input, locations, attachments)**

**입력:**
```javascript
{
  input: '버튼 색상을 파란색으로 변경해줘',
  locations: ['[data-component="button"][data-variant="primary"]'],
  attachments: ['data:image/png;base64,...'] // 선택
}
```

**출력:**
```javascript
{
  success: true,
  transformed: '[Header > btn.primary]의 배경색을 #2196F3로 변경\n현재 색상: #000000\n목표 색상: #2196F3',
  raw: '원본 Gemini 응답'
}
```

**프로세스:**
```javascript
async function transformText(input, locations, attachments) {
  // 1. 프롬프트 로드
  const prompt = localStorage.getItem('prompt_instruction');
  const template = localStorage.getItem('prompt_template');
  
  // 2. 프롬프트 조합
  const fullPrompt = `${prompt}\n\n${template || ''}\n\n사용자 입력: ${input}\n위치: ${locations.join(', ')}`;
  
  // 3. Gemini API 호출
  const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-exp:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': getApiKey()
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: fullPrompt }] }]
    })
  });
  
  const data = await response.json();
  const transformed = data.candidates[0].content.parts[0].text;
  
  return {
    success: true,
    transformed,
    raw: data
  };
}
```

---

### 4.4 히스토리 자동 생성

#### **generateHistory(chatContent)**

**입력:**
```javascript
{
  userInput: '버튼 색상을 파란색으로 변경해줘',
  geminiOutput: '[Header > btn.primary]의 배경색을...',
  location: '[Header > btn.primary]',
  date: '2025.10.30'
}
```

**출력:**
```javascript
{
  shouldSave: true, // 히스토리에 저장 여부
  historyItem: {
    id: '1699564800000',
    date: '2025.10.30',
    location: '[Header > btn.primary]',
    description: '버튼 배경색 변경 (#000 → #2196F3)',
    category: '기능'
  }
}
```

**프로세스:**
```javascript
async function generateHistory(chatContent) {
  // 1. 히스토리 프롬프트 로드
  const historyPrompt = localStorage.getItem('history_prompt');
  
  // 2. Gemini에게 분석 요청
  const prompt = `${historyPrompt}\n\n${JSON.stringify(chatContent)}`;
  
  const response = await fetch('...', {
    // Gemini API 호출
  });
  
  const analysis = await response.json();
  const result = analysis.candidates[0].content.parts[0].text;
  
  // 3. 카테고리 판단
  const category = extractCategory(result);
  
  if (category === '스타일' || category === '위치') {
    return { shouldSave: false };
  }
  
  // 4. 히스토리 항목 생성
  return {
    shouldSave: true,
    historyItem: {
      id: Date.now().toString(),
      date: chatContent.date,
      location: chatContent.location,
      description: extractDescription(result),
      category
    }
  };
}
```

---

### 4.5 GitHub 동기화

#### **syncWithGitHub()**

**프로세스:**
```javascript
async function syncWithGitHub() {
  // 1. Repository 정보 가져오기
  const repoInfo = await fetchGitHubRepo();
  
  // 2. shared_memory.json 가져오기
  const sharedMemory = await fetchGitHubFile('shared_memory.json');
  
  // 3. 최근 Commit 로그 가져오기
  const commits = await fetchGitHubCommits();
  
  // 4. 작업 잠금 정보 파싱
  const locks = parseWorkLocks(commits, sharedMemory);
  
  // 5. 상태 업데이트
  updateConnectionStatus('github', 'connected');
  updateLockInfo(locks);
  
  return {
    repoInfo,
    sharedMemory,
    commits,
    locks
  };
}
```

---

### 4.6 충돌 감지

#### **detectConflict(location)**

**입력:** 클릭한 위치 정보

**출력:**
```javascript
{
  hasConflict: true,
  conflictInfo: {
    developer: 'Developer A',
    location: '[Header > btn.primary]',
    startTime: '2025-10-30T10:00:00Z',
    estimatedEnd: '2025-10-30T10:30:00Z',
    status: 'working'
  }
}
```

**알고리즘:**
```javascript
function detectConflict(location) {
  // 1. shared_memory.json에서 잠금 정보 확인
  const sharedMemory = getSharedMemory();
  const locks = sharedMemory.locks || [];
  
  // 2. 해당 위치의 잠금 확인
  const lock = locks.find(l => l.location === location);
  
  if (lock && lock.status === 'working') {
    return {
      hasConflict: true,
      conflictInfo: lock
    };
  }
  
  return { hasConflict: false };
}
```

---

## 5. 에러 처리

### 5.1 Gemini API 에러

```javascript
{
  400: 'Invalid API key',
  403: 'API key expired or invalid',
  429: 'Rate limit exceeded',
  500: 'Gemini server error'
}
```

### 5.2 GitHub API 에러

```javascript
{
  401: 'Unauthorized - Check your token',
  403: 'Rate limit exceeded',
  404: 'Repository not found',
  422: 'Validation failed'
}
```

### 5.3 내부 에러

```javascript
{
  'INVALID_LOCATION': '위치 정보를 찾을 수 없습니다',
  'SYNC_FAILED': 'GitHub 동기화 실패',
  'CONFLICT_DETECTED': '다른 개발자가 작업 중입니다'
}
```

---

**버전:** 1.0
**작성일:** 2025-10-30
