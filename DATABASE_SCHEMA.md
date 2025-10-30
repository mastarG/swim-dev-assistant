# 데이터베이스 스키마 (Database Schema)

**주의:** 이 프로젝트는 **서버리스(Serverless)** 프론트엔드 애플리케이션으로, 전통적인 데이터베이스를 사용하지 않습니다.

모든 데이터는 **로컬 스토리지(Local Storage)**와 **GitHub**에 저장됩니다.

---

## 📚 목차

1. [로컬 스토리지 스키마](#1-로컬-스토리지-스키마)
2. [GitHub 저장 데이터](#2-github-저장-데이터)
3. [데이터 흐름](#3-데이터-흐름)

---

## 1. 로컬 스토리지 스키마

### 1.1 설정 데이터 (Settings)

#### **gemini_api_key** (string)
```javascript
// 암호화된 Gemini API 키
localStorage.setItem('gemini_api_key', encryptedKey);

예시: "AES_ENCRYPTED_STRING..."
```

#### **github_token** (string)
```javascript
// 암호화된 GitHub Personal Access Token
localStorage.setItem('github_token', encryptedToken);

예시: "AES_ENCRYPTED_STRING..."
```

#### **github_repo_url** (string)
```javascript
// 개발 페이지 GitHub Repository URL
localStorage.setItem('github_repo_url', url);

예시: "https://github.com/username/project"
```

#### **collab_github_token** (string)
```javascript
// 협업 GitHub Token
localStorage.setItem('collab_github_token', encryptedToken);
```

#### **collab_github_repo_url** (string)
```javascript
// 협업 GitHub Repository URL
localStorage.setItem('collab_github_repo_url', url);

예시: "https://github.com/team/shared-project"
```

#### **prompt_instruction** (string)
```javascript
// Gemini 변환 프롬프트 지침
localStorage.setItem('prompt_instruction', instruction);

예시: "다음 내용을 AI 개발 에이전트가 이해하기 쉽게 정리해줘..."
```

#### **prompt_template** (string, base64)
```javascript
// 프롬프트 템플릿 (MD 파일, base64 인코딩)
localStorage.setItem('prompt_template', base64String);

예시: "IyDtlZzsnpXtirwKCi0g7JyE7LmYOiB7fQ=="
```

#### **history_prompt** (string)
```javascript
// 히스토리 생성 프롬프트
localStorage.setItem('history_prompt', prompt);

예시: "다음 채팅 내용을 분석하여 요구사항 정의서 항목으로 작성해줘..."
```

#### **history_template** (string, base64)
```javascript
// 히스토리 템플릿
localStorage.setItem('history_template', base64String);
```

#### **theme** (string)
```javascript
// 테마 설정
localStorage.setItem('theme', theme);

값: "light" | "dark"
기본값: "light"
```

#### **font_size** (string)
```javascript
// 폰트 크기
localStorage.setItem('font_size', size);

값: "small" | "medium" | "large"
기본값: "medium"

매핑:
- small: 12px (본문), 16px (제목)
- medium: 14px (본문), 18px (제목)
- large: 16px (본문), 20px (제목)
```

#### **panel_ratio** (number, string)
```javascript
// 화면 분할 비율 (미리보기 패널 비율)
localStorage.setItem('panel_ratio', '0.6');

값: 0.4 ~ 0.8
기본값: 0.6 (60%)
```

#### **preview_url** (string)
```javascript
// 미리보기 URL
localStorage.setItem('preview_url', url);

예시: "https://username.github.io/project"
또는: "http://localhost:3000"
```

---

### 1.2 히스토리 데이터 (History)

#### **history** (JSON Array)

**구조:**
```typescript
interface HistoryItem {
  id: string;                // timestamp (unique)
  date: string;              // YYYY.MM.DD
  location: string;          // [경로 > 요소]
  description: string;       // 기능 설명
  category: string;          // 기능 | 스타일 | 위치 | 요청
  raw_input: string;         // 사용자 원본 입력
  gemini_output: string;     // Gemini 변환 결과
  saved_to_history: boolean; // 히스토리 저장 여부
}

type History = HistoryItem[];
```

**예시:**
```json
[
  {
    "id": "1699564800000",
    "date": "2025.10.30",
    "location": "[Header > btn.primary]",
    "description": "버튼 배경색 변경 (#000 → #2196F3)",
    "category": "기능",
    "raw_input": "버튼 색상을 파란색으로 변경해줘",
    "gemini_output": "[Header > btn.primary]의 배경색을 #2196F3로 변경\n현재 색상: #000000",
    "saved_to_history": true
  },
  {
    "id": "1699564900000",
    "date": "2025.10.30",
    "location": "[Footer > link.contact]",
    "description": "링크 텍스트 변경 (\"문의하기\" → \"Contact Us\")",
    "category": "기능",
    "raw_input": "문의하기를 영어로 변경",
    "gemini_output": "[Footer > link.contact]의 텍스트를 \"Contact Us\"로 변경",
    "saved_to_history": true
  },
  {
    "id": "1699565000000",
    "date": "2025.10.30",
    "location": "[Header > logo]",
    "description": "로고 크기 조정",
    "category": "스타일",
    "raw_input": "로고를 좀 더 크게",
    "gemini_output": "[Header > logo]의 width를 200px로 변경",
    "saved_to_history": false
  }
]
```

**저장:**
```javascript
localStorage.setItem('history', JSON.stringify(historyArray));
```

**조회:**
```javascript
const history = JSON.parse(localStorage.getItem('history') || '[]');
```

**필터링:**
```javascript
// 날짜 필터
const filtered = history.filter(item => item.date === '2025.10.30');

// 위치 필터
const filtered = history.filter(item => item.location.includes('Header'));

// 키워드 검색
const filtered = history.filter(item => 
  item.description.includes('버튼') ||
  item.raw_input.includes('버튼')
);

// 카테고리 필터
const functionalOnly = history.filter(item => 
  item.category === '기능' && item.saved_to_history === true
);
```

---

### 1.3 채팅 기록 (Chat History)

#### **chat_history** (JSON Array)

**구조:**
```typescript
interface ChatMessage {
  timestamp: number;         // Unix timestamp (ms)
  role: 'user' | 'gemini';  // 발신자
  content: string;           // 메시지 내용
  location?: string;         // 위치 정보 (user만)
  attachments?: string[];    // 이미지 URL 배열 (user만)
  formatted?: boolean;       // 변환됨 여부 (gemini만)
}

type ChatHistory = ChatMessage[];
```

**예시:**
```json
[
  {
    "timestamp": 1699564800000,
    "role": "user",
    "content": "버튼 색상을 파란색으로 변경해줘",
    "location": "[Header > btn.primary]",
    "attachments": []
  },
  {
    "timestamp": 1699564805000,
    "role": "gemini",
    "content": "[Header > btn.primary]의 배경색을 #2196F3(파란색)으로 변경\n현재 색상: #000000\n목표 색상: #2196F3",
    "formatted": true
  },
  {
    "timestamp": 1699564900000,
    "role": "user",
    "content": "이미지도 함께 첨부합니다",
    "location": "[Hero > image]",
    "attachments": [
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
    ]
  }
]
```

**저장:**
```javascript
localStorage.setItem('chat_history', JSON.stringify(chatArray));
```

**조회:**
```javascript
const chatHistory = JSON.parse(localStorage.getItem('chat_history') || '[]');
```

**세션 관리:**
```javascript
// 세션 시작 시 이전 기록 유지
const existingChat = JSON.parse(localStorage.getItem('chat_history') || '[]');

// 최대 100개 메시지만 유지 (성능)
if (existingChat.length > 100) {
  existingChat.splice(0, existingChat.length - 100);
  localStorage.setItem('chat_history', JSON.stringify(existingChat));
}
```

---

### 1.4 임시 데이터 (Temporary)

#### **temp_locations** (JSON Array)
```javascript
// 현재 입력 중인 위치 정보 (여러 개)
localStorage.setItem('temp_locations', JSON.stringify([
  '[Header > btn.primary]',
  '[Footer > link.about]'
]));
```

#### **last_sync_time** (number)
```javascript
// 마지막 GitHub 동기화 시간
localStorage.setItem('last_sync_time', Date.now().toString());
```

#### **connection_status** (JSON Object)
```javascript
// 연결 상태
const status = {
  gemini: 'connected', // connected | disconnected | error
  github: 'connected',
  collab_github: 'disconnected'
};

localStorage.setItem('connection_status', JSON.stringify(status));
```

---

## 2. GitHub 저장 데이터

### 2.1 개발 페이지 Repository

#### **파일 구조:**
```
username/project/
├─ index.html                    # 메인 HTML
├─ components/
│  ├─ header.html
│  ├─ footer.html
│  └─ ...
├─ css/
│  └─ style.css
├─ js/
│  └─ main.js
└─ ... (기타 파일)
```

#### **읽어올 정보:**
1. **HTML 파일 내용**
   - data-* 속성 추출
   - DOM 구조 파싱

2. **GitHub Pages URL**
   - 미리보기에 표시

3. **Commit 로그**
   - 변경 이력 추적
   - 최근 업데이트 확인

---

### 2.2 협업 Repository

#### **파일 구조 (v1.6 표준):**
```
team/shared-project/
├─ docs/
│  ├─ PRD.md
│  ├─ API_SPEC.md
│  ├─ DATABASE_SCHEMA.md
│  ├─ DESIGN_SYSTEM.md
│  └─ PAGE_SPECS.md
├─ src/
│  ├─ components/
│  │  ├─ atoms/
│  │  ├─ molecules/
│  │  └─ organisms/
│  └─ pages/
├─ shared_memory.json            # 핵심!
└─ .cursorrules
```

#### **shared_memory.json 구조:**
```json
{
  "last_component_id": 45,
  "used_class_names": [
    "btn-primary",
    "card-hero",
    "input-email"
  ],
  "api_endpoints": [
    "/auth/login",
    "/posts",
    "/users"
  ],
  "global_state_keys": [
    "user",
    "posts",
    "loading"
  ],
  "locks": [
    {
      "location": "[Header > btn.primary]",
      "developer": "Developer A",
      "start_time": "2025-10-30T10:00:00Z",
      "estimated_end": "2025-10-30T10:30:00Z",
      "status": "working"
    },
    {
      "location": "[Footer]",
      "developer": "Developer B",
      "start_time": "2025-10-30T09:00:00Z",
      "estimated_end": "2025-10-30T10:00:00Z",
      "status": "completed"
    }
  ],
  "last_updated": "2025-10-30T10:15:00Z",
  "version": "1.0"
}
```

#### **Commit 로그 활용:**
```javascript
// Commit 정보에서 작업자 및 파일 추출
const commits = await fetchGitHubCommits();

commits.forEach(commit => {
  const developer = commit.commit.author.name;
  const files = commit.files; // 변경된 파일 목록
  const message = commit.commit.message;
  
  // 충돌 감지에 활용
  if (files.includes('components/header.html')) {
    console.log(`${developer}가 Header 작업 중`);
  }
});
```

---

## 3. 데이터 흐름

### 3.1 초기 로드
```
[앱 시작]
   ↓
[로컬 스토리지 읽기]
   ├─ 설정 (API 키, URL, 프롬프트)
   ├─ 히스토리
   └─ 채팅 기록
   ↓
[GitHub 동기화]
   ├─ Repository 정보
   ├─ shared_memory.json
   └─ Commit 로그
   ↓
[UI 렌더링]
```

### 3.2 사용자 작업
```
[사용자 클릭]
   ↓
[위치 정보 추출]
   ↓
[충돌 감지]
   ├─ shared_memory.json 확인
   └─ 작업 잠금 여부 확인
   ↓
[입력창에 표시]
   ↓
[사용자 입력]
   ↓
[Gemini 변환]
   ↓
[채팅 기록 저장] (로컬 스토리지)
   ↓
[복사 버튼 클릭]
   ↓
[히스토리 생성]
   ├─ Gemini 분석
   ├─ 카테고리 판단
   └─ 히스토리 저장 (if 기능)
```

### 3.3 GitHub 동기화
```
[10초마다 또는 수동 새로고침]
   ↓
[GitHub API 호출]
   ├─ shared_memory.json 읽기
   ├─ 최근 Commit 조회
   └─ 작업 잠금 정보 업데이트
   ↓
[연결 상태 표시]
   └─ ●(녹색/빨간색)
```

### 3.4 히스토리 내보내기
```
[히스토리 패널]
   ↓
[내보내기 버튼 클릭]
   ↓
[로컬 스토리지에서 히스토리 읽기]
   ↓
[Markdown 형식으로 변환]
   ↓
[파일 다운로드]
   └─ requirements_YYYYMMDD.md
```

---

## 4. 데이터 용량 관리

### 4.1 로컬 스토리지 제한
```
- 브라우저 제한: 5~10MB
- 예상 사용량:
  - 설정: ~10KB
  - 히스토리: ~1MB (1000개 항목)
  - 채팅 기록: ~2MB (100개 대화)
  
총: ~3MB (안전)
```

### 4.2 정리 전략
```javascript
// 히스토리 1000개 초과 시 오래된 것 삭제
const history = JSON.parse(localStorage.getItem('history') || '[]');

if (history.length > 1000) {
  history.sort((a, b) => b.id - a.id); // 최신순
  const trimmed = history.slice(0, 1000);
  localStorage.setItem('history', JSON.stringify(trimmed));
}

// 채팅 기록 100개 초과 시 삭제
const chatHistory = JSON.parse(localStorage.getItem('chat_history') || '[]');

if (chatHistory.length > 100) {
  const trimmed = chatHistory.slice(-100); // 최근 100개만
  localStorage.setItem('chat_history', JSON.stringify(trimmed));
}
```

---

## 5. 데이터 보안

### 5.1 암호화
```javascript
// API 키 암호화 (AES-256)
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'user-specific-key'; // 브라우저 fingerprint 기반

// 암호화
const encrypted = CryptoJS.AES.encrypt(apiKey, SECRET_KEY).toString();
localStorage.setItem('gemini_api_key', encrypted);

// 복호화
const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY).toString(CryptoJS.enc.Utf8);
```

### 5.2 민감 정보
```
암호화 대상:
✅ gemini_api_key
✅ github_token
✅ collab_github_token

평문 저장:
✅ prompt_instruction (민감하지 않음)
✅ history (민감하지 않음)
✅ chat_history (민감하지 않음)
```

---

## 6. 백업 및 복원

### 6.1 내보내기
```javascript
// 전체 데이터 내보내기
function exportAllData() {
  const data = {
    settings: {
      theme: localStorage.getItem('theme'),
      font_size: localStorage.getItem('font_size'),
      // ... (API 키 제외)
    },
    history: JSON.parse(localStorage.getItem('history') || '[]'),
    chat_history: JSON.parse(localStorage.getItem('chat_history') || '[]')
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `swim-developer-backup-${Date.now()}.json`;
  a.click();
}
```

### 6.2 가져오기
```javascript
// 백업 파일에서 복원
function importData(file) {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    const data = JSON.parse(e.target.result);
    
    // 설정 복원
    localStorage.setItem('theme', data.settings.theme);
    localStorage.setItem('font_size', data.settings.font_size);
    
    // 히스토리 복원
    localStorage.setItem('history', JSON.stringify(data.history));
    localStorage.setItem('chat_history', JSON.stringify(data.chat_history));
    
    alert('복원 완료!');
    location.reload();
  };
  
  reader.readAsText(file);
}
```

---

**버전:** 1.0
**작성일:** 2025-10-30
