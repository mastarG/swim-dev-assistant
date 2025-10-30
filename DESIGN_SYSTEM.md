# Design System Specification
# 스윔 개발자 (Swim Developer Assistant)

버전: 1.0  
최종 수정: 2025-10-30  
담당: Design System Team

---

## 목차

1. [디자인 철학](#1-디자인-철학)
2. [색상 시스템](#2-색상-시스템)
3. [타이포그래피](#3-타이포그래피)
4. [간격 시스템](#4-간격-시스템)
5. [컴포넌트 라이브러리](#5-컴포넌트-라이브러리)
6. [레이아웃 시스템](#6-레이아웃-시스템)
7. [아이콘 시스템](#7-아이콘-시스템)
8. [애니메이션 & 트랜지션](#8-애니메이션--트랜지션)
9. [반응형 규칙](#9-반응형-규칙)
10. [접근성](#10-접근성)

---

## 1. 디자인 철학

### 1.1 핵심 원칙

**Apple (macOS) 스타일**
- 미니멀리즘: 불필요한 장식 제거
- 심플함: 직관적인 인터페이스
- 우아함: 부드러운 곡선과 그림자
- 일관성: 예측 가능한 패턴

**사용자 경험 우선**
- 개발자 워크플로우 최적화
- 빠른 액세스 (2클릭 이내)
- 명확한 피드백
- 실수 방지 메커니즘

### 1.2 디자인 언어

```
- Flat Design with Subtle Depth
- Blur Effects (Translucency)
- Rounded Corners (4px, 8px, 12px)
- Soft Shadows
- Clean Typography
- Monochromatic Base + Accent Colors
```

---

## 2. 색상 시스템

### 2.1 Light Theme (기본)

#### Primary Colors
```css
--primary-bg: #F5F5F7;           /* 메인 배경 (연한 회색) */
--secondary-bg: #FFFFFF;         /* 패널 배경 (흰색) */
--tertiary-bg: #FAFAFA;          /* 호버 상태 */
```

#### Text Colors
```css
--text-primary: #1D1D1F;         /* 본문 텍스트 (검은색) */
--text-secondary: #6E6E73;       /* 보조 텍스트 (회색) */
--text-tertiary: #86868B;        /* 비활성 텍스트 (연한 회색) */
--text-link: #007AFF;            /* 링크 (파란색) */
```

#### Border & Divider
```css
--border-light: #E5E5E5;         /* 얇은 경계선 */
--border-medium: #D1D1D6;        /* 일반 경계선 */
--divider: rgba(0, 0, 0, 0.08);  /* 구분선 */
```

#### Accent Colors
```css
--accent-blue: #007AFF;          /* 클릭모드 버튼 */
--accent-purple: #AF52DE;        /* 스크린모드 버튼 */
--accent-green: #34C759;         /* 성공 상태 */
--accent-red: #FF3B30;           /* 경고/오류 */
--accent-orange: #FF9500;        /* 주의 */
--accent-yellow: #FFCC00;        /* 알림 */
```

#### Overlay & Shadow
```css
--overlay: rgba(0, 0, 0, 0.3);   /* 모달 배경 */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.12);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15);
```

### 2.2 Dark Theme

#### Primary Colors
```css
--primary-bg: #1C1C1E;           /* 메인 배경 (다크 그레이) */
--secondary-bg: #2C2C2E;         /* 패널 배경 (검은색) */
--tertiary-bg: #3A3A3C;          /* 호버 상태 */
```

#### Text Colors
```css
--text-primary: #FFFFFF;         /* 본문 텍스트 (흰색) */
--text-secondary: #EBEBF5;       /* 보조 텍스트 (연한 흰색, 60%) */
--text-tertiary: #EBEBF5;        /* 비활성 텍스트 (연한 흰색, 30%) */
--text-link: #0A84FF;            /* 링크 (밝은 파란색) */
```

#### Border & Divider
```css
--border-light: #38383A;         /* 얇은 경계선 */
--border-medium: #48484A;        /* 일반 경계선 */
--divider: rgba(255, 255, 255, 0.1);  /* 구분선 */
```

#### Accent Colors (Dark Mode Adjusted)
```css
--accent-blue: #0A84FF;          /* 클릭모드 버튼 */
--accent-purple: #BF5AF2;        /* 스크린모드 버튼 */
--accent-green: #32D74B;         /* 성공 상태 */
--accent-red: #FF453A;           /* 경고/오류 */
--accent-orange: #FF9F0A;        /* 주의 */
--accent-yellow: #FFD60A;        /* 알림 */
```

#### Overlay & Shadow
```css
--overlay: rgba(0, 0, 0, 0.6);   /* 모달 배경 */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
```

### 2.3 Semantic Colors

```css
/* 상태 색상 */
--success: var(--accent-green);
--warning: var(--accent-orange);
--error: var(--accent-red);
--info: var(--accent-blue);

/* 하이라이트 */
--highlight-yellow: rgba(255, 204, 0, 0.3);  /* 선택된 영역 */
--highlight-blue: rgba(0, 122, 255, 0.1);    /* 호버 영역 */
```

---

## 3. 타이포그래피

### 3.1 폰트 패밀리

```css
--font-system: -apple-system, BlinkMacSystemFont, 
               "SF Pro Display", "SF Pro Text", 
               "Segoe UI", "Helvetica Neue", 
               Arial, sans-serif;

--font-mono: "SF Mono", "Monaco", "Consolas", 
             "Courier New", monospace;
```

### 3.2 폰트 크기 (3단계 조절)

#### Small (기본)
```css
--font-size-xs: 10px;      /* 캡션 */
--font-size-sm: 12px;      /* 본문 작은 텍스트 */
--font-size-base: 14px;    /* 본문 기본 */
--font-size-md: 16px;      /* 제목 */
--font-size-lg: 18px;      /* 큰 제목 */
--font-size-xl: 20px;      /* 섹션 제목 */
--font-size-2xl: 24px;     /* 페이지 제목 */
```

#### Medium (125%)
```css
--font-size-xs: 12px;      /* 캡션 */
--font-size-sm: 14px;      /* 본문 작은 텍스트 */
--font-size-base: 16px;    /* 본문 기본 */
--font-size-md: 18px;      /* 제목 */
--font-size-lg: 20px;      /* 큰 제목 */
--font-size-xl: 24px;      /* 섹션 제목 */
--font-size-2xl: 28px;     /* 페이지 제목 */
```

#### Large (150%)
```css
--font-size-xs: 14px;      /* 캡션 */
--font-size-sm: 16px;      /* 본문 작은 텍스트 */
--font-size-base: 18px;    /* 본문 기본 */
--font-size-md: 20px;      /* 제목 */
--font-size-lg: 24px;      /* 큰 제목 */
--font-size-xl: 28px;      /* 섹션 제목 */
--font-size-2xl: 32px;     /* 페이지 제목 */
```

### 3.3 폰트 무게

```css
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### 3.4 라인 높이

```css
--line-height-tight: 1.2;   /* 제목 */
--line-height-base: 1.5;    /* 본문 */
--line-height-relaxed: 1.8; /* 긴 텍스트 */
```

### 3.5 타이포그래피 적용

```css
/* 제목 */
h1 { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); }
h2 { font-size: var(--font-size-xl); font-weight: var(--font-weight-semibold); }
h3 { font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); }

/* 본문 */
body { font-size: var(--font-size-base); font-weight: var(--font-weight-regular); }
small { font-size: var(--font-size-sm); }

/* 코드 */
code, pre { font-family: var(--font-mono); font-size: var(--font-size-sm); }
```

---

## 4. 간격 시스템

### 4.1 스페이싱 스케일 (8px 기반)

```css
--space-1: 4px;    /* 최소 간격 */
--space-2: 8px;    /* 작은 간격 */
--space-3: 12px;   /* 기본 간격 */
--space-4: 16px;   /* 중간 간격 */
--space-5: 20px;   /* 큰 간격 */
--space-6: 24px;   /* 매우 큰 간격 */
--space-8: 32px;   /* 섹션 간격 */
--space-10: 40px;  /* 페이지 간격 */
--space-12: 48px;  /* 최대 간격 */
```

### 4.2 컴포넌트별 간격

```css
/* 버튼 내부 패딩 */
--btn-padding-sm: var(--space-2) var(--space-3);   /* 8px 12px */
--btn-padding-md: var(--space-3) var(--space-4);   /* 12px 16px */
--btn-padding-lg: var(--space-4) var(--space-6);   /* 16px 24px */

/* 입력 필드 패딩 */
--input-padding: var(--space-3) var(--space-4);    /* 12px 16px */

/* 패널 패딩 */
--panel-padding: var(--space-6);                   /* 24px */

/* 모달 패딩 */
--modal-padding: var(--space-8);                   /* 32px */
```

---

## 5. 컴포넌트 라이브러리

### 5.1 버튼 (Button)

#### 클릭모드 버튼 (Primary)
```css
.btn-click-mode {
  background: var(--accent-blue);
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  padding: var(--btn-padding-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.btn-click-mode:hover {
  background: #0066CC;
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn-click-mode:active {
  background: #0055AA;
  transform: translateY(0);
}

.btn-click-mode.active {
  background: #34C759;
  box-shadow: 0 0 0 4px rgba(52, 199, 89, 0.2);
}
```

#### 스크린모드 버튼 (Secondary)
```css
.btn-screen-mode {
  background: var(--accent-purple);
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  padding: var(--btn-padding-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.btn-screen-mode:hover {
  background: #9D3FC7;
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn-screen-mode.active {
  background: #34C759;
  box-shadow: 0 0 0 4px rgba(191, 90, 242, 0.2);
}
```

#### 새로고침 버튼 (Ghost)
```css
.btn-refresh {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-medium);
  border-radius: 8px;
  padding: var(--btn-padding-sm);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-refresh:hover {
  background: var(--tertiary-bg);
  border-color: var(--text-secondary);
}

.btn-refresh:active {
  transform: rotate(180deg);
}
```

#### 프롬프트 버튼 (Accent)
```css
.btn-prompt {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  padding: var(--btn-padding-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-md);
}

.btn-prompt:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

#### 복사 버튼 (Small)
```css
.btn-copy {
  background: var(--tertiary-bg);
  color: var(--text-secondary);
  border: 1px solid var(--border-light);
  border-radius: 6px;
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-copy:hover {
  background: var(--accent-blue);
  color: #FFFFFF;
  border-color: var(--accent-blue);
}

.btn-copy.copied {
  background: var(--accent-green);
  color: #FFFFFF;
  border-color: var(--accent-green);
}
```

### 5.2 입력 필드 (Input)

#### 텍스트 입력
```css
.input-text {
  background: var(--secondary-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: var(--input-padding);
  font-size: var(--font-size-base);
  font-family: var(--font-system);
  width: 100%;
  transition: all 0.2s ease;
}

.input-text:focus {
  outline: none;
  border-color: var(--accent-blue);
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
}

.input-text::placeholder {
  color: var(--text-tertiary);
}
```

#### 텍스트 영역 (Textarea)
```css
.textarea {
  background: var(--secondary-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: var(--input-padding);
  font-size: var(--font-size-base);
  font-family: var(--font-system);
  width: 100%;
  min-height: 120px;
  resize: vertical;
  transition: all 0.2s ease;
}

.textarea:focus {
  outline: none;
  border-color: var(--accent-blue);
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
}
```

### 5.3 패널 (Panel)

#### 미리보기 패널
```css
.panel-preview {
  background: var(--secondary-bg);
  border-right: 1px solid var(--border-light);
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-preview iframe {
  flex: 1;
  border: none;
  width: 100%;
  height: 100%;
}
```

#### 입력창 패널
```css
.panel-input {
  background: var(--secondary-bg);
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: var(--panel-padding);
}

.panel-input__chat {
  flex: 1;
  overflow-y: auto;
  margin-bottom: var(--space-4);
}

.panel-input__form {
  border-top: 1px solid var(--border-light);
  padding-top: var(--space-4);
}
```

#### 히스토리 패널
```css
.panel-history {
  background: var(--secondary-bg);
  border-left: 1px solid var(--border-light);
  width: 300px;
  height: 100vh;
  overflow-y: auto;
  padding: var(--panel-padding);
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.panel-history.open {
  transform: translateX(0);
}
```

### 5.4 드래그 핸들 (Resize Handle)

```css
.resize-handle {
  width: 4px;
  background: transparent;
  cursor: col-resize;
  position: relative;
  transition: background 0.2s ease;
}

.resize-handle:hover {
  background: var(--accent-blue);
}

.resize-handle::before {
  content: '';
  position: absolute;
  left: -4px;
  right: -4px;
  top: 0;
  bottom: 0;
}
```

### 5.5 모달 (Modal)

#### 설정 모달
```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--overlay);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background: var(--secondary-bg);
  border-radius: 12px;
  padding: var(--modal-padding);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.modal-header h2 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--tertiary-bg);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--accent-red);
  color: #FFFFFF;
}
```

#### 프롬프트 팝업
```css
.popup-prompt {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--secondary-bg);
  border-radius: 16px;
  padding: var(--space-8);
  width: 500px;
  box-shadow: var(--shadow-lg);
  z-index: 2000;
  animation: bounceIn 0.4s ease;
}

.popup-prompt__textarea {
  width: 100%;
  min-height: 200px;
  margin-bottom: var(--space-4);
}

.popup-prompt__actions {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
}
```

### 5.6 채팅 메시지 (Chat Message)

```css
.chat-message {
  display: flex;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  padding: var(--space-3);
  border-radius: 8px;
  transition: background 0.15s ease;
}

.chat-message:hover {
  background: var(--tertiary-bg);
}

.chat-message__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent-blue);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-semibold);
  flex-shrink: 0;
}

.chat-message__content {
  flex: 1;
}

.chat-message__header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-1);
}

.chat-message__name {
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.chat-message__time {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
}

.chat-message__text {
  color: var(--text-primary);
  line-height: var(--line-height-base);
}

.chat-message__info {
  background: var(--tertiary-bg);
  border-left: 3px solid var(--accent-blue);
  padding: var(--space-2) var(--space-3);
  margin-top: var(--space-2);
  border-radius: 4px;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
```

### 5.7 히스토리 아이템 (History Item)

```css
.history-item {
  background: var(--tertiary-bg);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: var(--space-4);
  margin-bottom: var(--space-3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.history-item:hover {
  background: var(--secondary-bg);
  border-color: var(--accent-blue);
  box-shadow: var(--shadow-sm);
  transform: translateX(-2px);
}

.history-item__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-2);
}

.history-item__category {
  display: inline-block;
  background: var(--accent-blue);
  color: #FFFFFF;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  padding: var(--space-1) var(--space-2);
  border-radius: 4px;
}

.history-item__time {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.history-item__text {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  line-height: var(--line-height-base);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
```

### 5.8 토글 스위치 (Toggle)

```css
.toggle {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 28px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle__slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--border-medium);
  border-radius: 28px;
  transition: all 0.3s ease;
}

.toggle__slider::before {
  content: '';
  position: absolute;
  height: 24px;
  width: 24px;
  left: 2px;
  bottom: 2px;
  background: #FFFFFF;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle input:checked + .toggle__slider {
  background: var(--accent-blue);
}

.toggle input:checked + .toggle__slider::before {
  transform: translateX(20px);
}
```

### 5.9 선택 영역 표시 (Selection Box)

```css
.selection-box {
  position: absolute;
  border: 2px dashed var(--accent-purple);
  background: rgba(191, 90, 242, 0.1);
  pointer-events: none;
  z-index: 9999;
  animation: dashAnimation 20s linear infinite;
}

@keyframes dashAnimation {
  to {
    stroke-dashoffset: -1000;
  }
}

.selection-box::after {
  content: '';
  position: absolute;
  top: -8px;
  right: -8px;
  width: 16px;
  height: 16px;
  background: var(--accent-purple);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(191, 90, 242, 0.4);
}
```

### 5.10 로딩 스피너 (Loading)

```css
.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid var(--border-light);
  border-top-color: var(--accent-blue);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--overlay);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
```

---

## 6. 레이아웃 시스템

### 6.1 메인 레이아웃 (6:4 분할)

```css
.layout-main {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: var(--primary-bg);
}

.layout-main__preview {
  width: 60%;
  min-width: 400px;
  max-width: 75%;
}

.layout-main__input {
  width: 40%;
  min-width: 300px;
  max-width: 60%;
}

.layout-main__history {
  position: fixed;
  right: 0;
  top: 0;
}
```

### 6.2 탑 네비게이션

```css
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-6);
  background: var(--secondary-bg);
  border-bottom: 1px solid var(--border-light);
  height: 60px;
}

.top-nav__left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.top-nav__center {
  display: flex;
  gap: var(--space-3);
}

.top-nav__right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
```

### 6.3 그리드 시스템

```css
.grid {
  display: grid;
  gap: var(--space-4);
}

.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }

/* 반응형 그리드 */
@media (max-width: 1024px) {
  .grid-3, .grid-4 { grid-template-columns: repeat(2, 1fr); }
}
```

### 6.4 플렉스 유틸리티

```css
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-center { align-items: center; justify-content: center; }
.flex-between { justify-content: space-between; }
.flex-wrap { flex-wrap: wrap; }
.flex-1 { flex: 1; }
```

---

## 7. 아이콘 시스템

### 7.1 아이콘 스타일 가이드

**크기**: 20px × 20px (기본)  
**스트로크**: 2px  
**스타일**: SF Symbols 스타일 (Apple 아이콘)  
**색상**: 단색 (Monochrome)  

### 7.2 필수 아이콘 목록

```
클릭모드: cursor.click (손가락 클릭)
스크린모드: selection.rectangle (사각형 선택)
새로고침: arrow.clockwise (시계방향 화살표)
프롬프트: sparkles (반짝임)
히스토리: clock.arrow.circlepath (시계 회전)
설정: gearshape (톱니바퀴)
테마: moon.stars / sun.max (달/태양)
폰트크기: textformat.size (텍스트 크기)
GitHub: link (링크)
복사: doc.on.doc (문서 복사)
다운로드: arrow.down.circle (다운로드)
삭제: trash (휴지통)
체크: checkmark.circle (체크마크)
경고: exclamationmark.triangle (경고)
정보: info.circle (정보)
닫기: xmark (X)
```

### 7.3 아이콘 구현

```css
.icon {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
}

.icon-sm { width: 16px; height: 16px; }
.icon-lg { width: 24px; height: 24px; }

/* SVG 아이콘 */
.icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
  fill: none;
  stroke-width: 2px;
  stroke-linecap: round;
  stroke-linejoin: round;
}
```

---

## 8. 애니메이션 & 트랜지션

### 8.1 트랜지션 타이밍

```css
--transition-fast: 0.15s ease;
--transition-base: 0.2s ease;
--transition-slow: 0.3s ease;
--transition-slower: 0.5s ease;
```

### 8.2 이징 함수

```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0.0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 8.3 애니메이션 키프레임

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.05);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### 8.4 호버 효과

```css
/* 부드러운 들어올림 */
.hover-lift {
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* 스케일 확대 */
.hover-scale {
  transition: transform var(--transition-base);
}
.hover-scale:hover {
  transform: scale(1.05);
}
```

---

## 9. 반응형 규칙

### 9.1 브레이크포인트

```css
/* 이 프로젝트는 PC 전용이지만, 최소 너비 정의 */
--breakpoint-min: 1280px;  /* 최소 너비 */
--breakpoint-comfort: 1440px;  /* 권장 너비 */
--breakpoint-max: 1920px;  /* 최대 너비 */
```

### 9.2 최소 요구사항

```css
@media (max-width: 1280px) {
  .layout-main__preview {
    width: 55%;
  }
  .layout-main__input {
    width: 45%;
  }
}

/* 1280px 미만에서는 경고 표시 */
@media (max-width: 1279px) {
  body::before {
    content: '화면 크기가 너무 작습니다. 최소 1280px 이상 필요합니다.';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: var(--accent-red);
    color: #FFFFFF;
    padding: var(--space-3);
    text-align: center;
    z-index: 10000;
  }
}
```

---

## 10. 접근성

### 10.1 포커스 스타일

```css
*:focus {
  outline: none;
}

*:focus-visible {
  outline: 2px solid var(--accent-blue);
  outline-offset: 2px;
  border-radius: 4px;
}
```

### 10.2 키보드 네비게이션

```
Tab: 다음 요소로 이동
Shift + Tab: 이전 요소로 이동
Enter: 버튼 클릭 / 선택
Escape: 모달 닫기 / 모드 취소
Cmd/Ctrl + K: 프롬프트 팝업 열기
Cmd/Ctrl + R: 미리보기 새로고침
Cmd/Ctrl + H: 히스토리 패널 토글
Cmd/Ctrl + ,: 설정 열기
```

### 10.3 ARIA 속성

```html
<!-- 버튼 -->
<button aria-label="클릭모드 활성화" aria-pressed="false">
  <span class="icon"><!-- icon --></span>
</button>

<!-- 토글 -->
<label class="toggle">
  <input type="checkbox" role="switch" aria-checked="false">
  <span class="toggle__slider"></span>
</label>

<!-- 모달 -->
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">설정</h2>
</div>
```

### 10.4 색상 대비

```
텍스트 대비: 최소 4.5:1 (WCAG AA)
큰 텍스트 대비: 최소 3:1
인터랙티브 요소: 최소 3:1
```

---

## 부록 A: CSS 변수 전체 목록

```css
:root {
  /* Light Theme Colors */
  --primary-bg: #F5F5F7;
  --secondary-bg: #FFFFFF;
  --tertiary-bg: #FAFAFA;
  --text-primary: #1D1D1F;
  --text-secondary: #6E6E73;
  --text-tertiary: #86868B;
  --text-link: #007AFF;
  --border-light: #E5E5E5;
  --border-medium: #D1D1D6;
  --divider: rgba(0, 0, 0, 0.08);
  
  /* Accent Colors */
  --accent-blue: #007AFF;
  --accent-purple: #AF52DE;
  --accent-green: #34C759;
  --accent-red: #FF3B30;
  --accent-orange: #FF9500;
  --accent-yellow: #FFCC00;
  
  /* Overlay & Shadow */
  --overlay: rgba(0, 0, 0, 0.3);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15);
  
  /* Typography */
  --font-system: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  --font-mono: "SF Mono", "Monaco", "Consolas", "Courier New", monospace;
  --font-size-xs: 10px;
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --line-height-tight: 1.2;
  --line-height-base: 1.5;
  --line-height-relaxed: 1.8;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  
  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-base: 0.2s ease;
  --transition-slow: 0.3s ease;
  --transition-slower: 0.5s ease;
}

/* Dark Theme */
[data-theme="dark"] {
  --primary-bg: #1C1C1E;
  --secondary-bg: #2C2C2E;
  --tertiary-bg: #3A3A3C;
  --text-primary: #FFFFFF;
  --text-secondary: #EBEBF5;
  --text-tertiary: #EBEBF5;
  --text-link: #0A84FF;
  --border-light: #38383A;
  --border-medium: #48484A;
  --divider: rgba(255, 255, 255, 0.1);
  --accent-blue: #0A84FF;
  --accent-purple: #BF5AF2;
  --accent-green: #32D74B;
  --accent-red: #FF453A;
  --accent-orange: #FF9F0A;
  --accent-yellow: #FFD60A;
  --overlay: rgba(0, 0, 0, 0.6);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
}

/* Font Size - Medium */
[data-font-size="medium"] {
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-md: 18px;
  --font-size-lg: 20px;
  --font-size-xl: 24px;
  --font-size-2xl: 28px;
}

/* Font Size - Large */
[data-font-size="large"] {
  --font-size-xs: 14px;
  --font-size-sm: 16px;
  --font-size-base: 18px;
  --font-size-md: 20px;
  --font-size-lg: 24px;
  --font-size-xl: 28px;
  --font-size-2xl: 32px;
}
```

---

## 부록 B: 디자인 체크리스트

### 구현 전 확인사항

- [ ] CSS 변수 정의 완료
- [ ] Light/Dark 테마 전환 구현
- [ ] 3단계 폰트 크기 조절 구현
- [ ] 모든 컴포넌트 스타일 적용
- [ ] 호버/포커스 상태 구현
- [ ] 애니메이션 적용
- [ ] 반응형 최소 너비 체크
- [ ] 접근성 ARIA 속성 추가
- [ ] 키보드 네비게이션 테스트
- [ ] 색상 대비 검증

### 디자인 QA

- [ ] Apple 스타일 가이드 준수
- [ ] 일관된 간격 시스템 사용
- [ ] 부드러운 트랜지션 동작
- [ ] 아이콘 크기/스타일 일관성
- [ ] 그림자 깊이 적절성
- [ ] 모든 상태 시각적 피드백
- [ ] Dark 모드 가독성
- [ ] 폰트 크기별 레이아웃 유지

---

**문서 끝**

이 디자인 시스템은 스윔 개발자 프로젝트의 모든 UI 컴포넌트와 스타일 가이드를 정의합니다.  
개발 시 이 문서를 참조하여 일관된 사용자 경험을 제공해야 합니다.
