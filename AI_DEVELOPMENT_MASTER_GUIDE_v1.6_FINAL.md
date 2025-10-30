# 🤖 AI 개발 마스터 가이드 v1.6 (FINAL)
## AI-Executable Development Master Guide - Complete Edition with Design System

> **이 문서 하나면 충분합니다!**  
> Phase 0, 디자인 시스템, 디자인 통합(하이브리드), MCP 검증, 인간 검증 모두 포함

---

## 📚 빠른 네비게이션

| 섹션 | 설명 | 중요도 |
|------|------|--------|
| [⚠️ AI의 한계](#️-ai의-한계-인식) | AI 개발의 위험 요소 이해 | ⭐⭐⭐ |
| [📄 PHASE 0](#-phase-0-사전-문서-작성-의무화) | 필수 5종 문서 작성 | ⭐⭐⭐⭐⭐ |
| [🎨 디자인 시스템](#-디자인-시스템-구축-우선) | **디자인 시스템 우선 구축 (NEW!)** | ⭐⭐⭐⭐⭐ |
| [🔗 디자인 통합](#-디자인-통합-전략-하이브리드) | 하이브리드 방법론 (data-* 속성) | ⭐⭐⭐⭐⭐ |
| [⚙️ AI 룰 설정](#️-ai-룰rule-설정-의무화) | .cursorrules 자동 생성 | ⭐⭐⭐⭐ |
| [🚫 바이브 코딩 금지](#-바이브-코딩-금지) | 맥락 기반 프롬프트 강제 | ⭐⭐⭐⭐ |
| [🔒 통일성 보장](#-멀티-에이전트-통일성-보장-규칙) | 5개 PC 일관성 유지 | ⭐⭐⭐⭐⭐ |
| [🧪 MCP 검증](#-mcp-도구-기반-검증) | AI 자동 테스트 | ⭐⭐⭐ |
| [👤 인간 검증](#-인간-검증-의무화) | Pull Request 체크리스트 | ⭐⭐⭐⭐ |
| [🔄 워크플로우](#-개발-워크플로우-6주) | 전체 개발 프로세스 | ⭐⭐⭐⭐⭐ |

---

## 🎯 v1.6 주요 업데이트

### **새로 추가된 내용:**

```
✅ 디자인 시스템 구축 우선 전략
   └─ 디자인 레퍼런스 활용 (npm 설치 X)
   └─ Design Systems Repo 활용법
   └─ Atomic Design 기반 구조

✅ 디자인 외주 프로세스
   └─ AI 디자이너 에이전트 프롬프트
   └─ 디자인 시스템 체크리스트
   └─ 사업 정보 수집 템플릿

✅ 작업 흐름 명확화
   └─ 표준문서 → AI개발 → 폴더생성 → 질문 → 디자인외주 → AI디자인 → 산출물
```

---

## ⚠️ AI의 한계 인식

### **AI 개발의 위험 요소**

```
❌ 중복 코드 생성: 근처 코드를 재사용하지 않고 같은 코드를 다시 작성
❌ 복잡한 로직 처리 미흡: 비즈니스 로직, 성능 최적화, 보안 취약점 파악 약함
❌ 치매 및 건망증: 이전 대화 맥락을 잊어버리고 일관성 없는 답변
❌ Hallucination: 불충분한 정보로 독자적 판단을 내려 잘못된 코드 생성
```

### **멀티 PC 환경의 위험 증폭**

```
5개 PC의 5개 AI 에이전트 병렬 개발 시:
→ 통일성 및 품질 저하 위험 5배 증가
→ 충돌(Conflict) 발생 가능성 급증
→ 기술 부채 누적 가속화

해결책: 강력한 사전 기획 문서 + 자동화된 통제 메커니즘
```

---

## 📄 PHASE 0: 사전 문서 작성 의무화

> **핵심 원칙: "문서가 없으면 코딩을 시작하지 않는다"**

### **필수 5종 문서**

#### **1. PRD.md (Product Requirements Document)**

프로젝트 요구사항 명세서

```markdown
# 프로젝트 요구사항 명세서

## 1. 프로젝트 개요
- 프로젝트명: [PROJECT_NAME]
- 목적: [핵심 목적 1-2문장]
- 타겟 사용자: [주요 사용자층]

## 2. 핵심 기능
1. 기능 1: [상세 설명]
   - 입력: [무엇을 입력받는가]
   - 처리: [어떤 로직을 수행하는가]
   - 출력: [사용자에게 무엇을 보여주는가]

## 3. 비기능 요구사항
- 성능: [로딩 시간, 처리 속도]
- 보안: [인증, 권한, 데이터 보호]

## 4. 우선순위
- P0 (Must Have): [핵심 기능]
- P1 (Should Have): [중요 기능]
```

#### **2. API_SPEC.md (API 명세서)**

모든 엔드포인트 정의

```markdown
# API 명세서

## POST /auth/login
- 설명: 사용자 로그인
- 요청:
  {
    "email": "user@example.com",
    "password": "password123"
  }
- 응답 (200):
  {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "id": "123", "email": "user@example.com" }
  }
- 에러 (401):
  { "error": "Invalid credentials" }
```

#### **3. DATABASE_SCHEMA.md (DB 스키마)**

테이블 구조 정의

```markdown
# 데이터베이스 스키마

## users 테이블
| 컬럼명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY | 사용자 ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 이메일 |
| password | VARCHAR(255) | NOT NULL | 비밀번호 (해시) |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |

## 관계
- users.id → posts.user_id (1:N)
```

#### **4. DESIGN_SYSTEM.md (디자인 시스템)** ⭐ **v1.6 강화**

**Atomic Design 기반 구조**

```markdown
# DESIGN_SYSTEM.md

## 📚 레퍼런스 출처
- 참고 시스템: Orbit (Kiwi.com)
- 참고 URL: https://orbit.kiwi/
- 참고 날짜: 2025-10-30
- 우리 조정: Primary 색상 동일, Border Radius 8px로 조정

⚠️ **중요: npm 설치하지 않음!**
✅ 디자인 개념만 참고 (영감)
✅ 코드는 직접 작성 (완전한 컨트롤)

## 0. 디자인 토큰 (Design Tokens)

### 색상 팔레트
```css
:root {
  /* Primary - Orbit 참고 */
  --color-primary-50: #E3F2FD;
  --color-primary-500: #2196F3;
  --color-primary-900: #0D47A1;
  
  /* Semantic */
  --color-success: #4CAF50;
  --color-error: #F44336;
}
```

### 타이포그래피
```css
:root {
  --font-family-base: 'Pretendard', -apple-system, sans-serif;
  --font-size-base: 16px;
  --font-weight-semibold: 600;
}
```

### 간격 시스템
```css
:root {
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-4: 16px;
}
```

## 1. 원자 (Atoms)

### 버튼 (Button)

**레퍼런스:** Orbit Button Component
**참고 URL:** https://orbit.kiwi/components/button/
**분석 날짜:** 2025-10-30

**관찰 사항:**
- 높이: 40px
- Padding: 12px 16px
- Border Radius: 4px

**우리 결정:**
- 높이: 40px (동일)
- Border Radius: 8px (더 부드럽게)

**구현:**
```html
<button 
  class="btn btn-primary"
  data-component="button"
  data-variant="primary"
  data-action="submit">
  버튼
</button>
```

```css
.btn {
  height: 40px;
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: 8px;  /* Orbit: 4px → 우리: 8px */
  font-weight: var(--font-weight-semibold);
}
```

[이하 모든 컴포넌트 동일 형식]

## 2. 분자 (Molecules)
[...]

## 3. 유기체 (Organisms)
[...]

## 4. 템플릿 (Templates)
[...]
```

#### **5. PAGE_SPECS.md (페이지 명세)**

각 페이지의 세부 명세

```markdown
# 페이지 명세서

## 1. 홈 페이지 (/)
- URL: /
- 컴포넌트:
  - Header (로고, 네비게이션, 로그인 버튼)
  - Hero Section (제목, 설명, CTA 버튼)
  - Features Section (3가지 핵심 기능 카드)
  - Footer (링크, SNS, 저작권)
- 데이터 요구사항:
  - Features 데이터 (API 불필요, 정적 데이터)
- 인터랙션:
  - CTA 버튼 클릭 → /signup 이동
  - Features 카드 호버 → 확대 애니메이션
- 작업 PC: PC1
- 예상 소요 시간: 1일
```

---

## 🎨 디자인 시스템 구축 우선

> **v1.6 핵심 추가 사항**

### **핵심 원칙**

```
✅ 개발 전에 먼저 디자인 시스템 구축
✅ Atomic Design 방법론 적용
✅ 레퍼런스는 참고만, npm 설치는 절대 금지
✅ data-* 속성으로 구조-로직 분리
```

### **디자인 시스템의 가치**

#### **1. 일관성 유지**
```
✅ 사용자 경험의 일관성
✅ 브랜드 아이덴티티 통일
✅ 개발자 학습 곡선 감소
✅ 제품 신뢰도 증가
```

#### **2. 효율성 향상**
```
✅ 재사용 가능한 컴포넌트
✅ 중복 작업 제거
✅ 빠른 개발 속도
✅ 디자이너-개발자 협업 개선
```

#### **3. 확장성 보장**
```
✅ 새로운 페이지 추가 용이
✅ 일관된 확장
✅ 유지보수 편리
```

### **Atomic Design System**

#### **5단계 계층 구조**

```
0) 디자인 토큰 (Design Tokens)
   └─ 색상, 폰트, 간격 등 기본 변수

1) 원자 (Atoms)
   └─ 버튼, 인풋, 아이콘, 레이블
   
2) 분자 (Molecules)
   └─ 검색바, 탭바, 폼 필드
   
3) 유기체 (Organisms)
   └─ 헤더, 푸터, 제품 카드
   
4) 템플릿 (Templates)
   └─ 와이어프레임, 콘텐츠 구조
   
5) 페이지 (Pages)
   └─ 실제 콘텐츠가 들어간 완성 페이지
```

### **레퍼런스 활용 전략**

#### **절대 금지: npm 설치**

```
❌ 잘못된 방법:
npm install @kiwicom/orbit-components

문제점:
- 버전 업데이트 시 디자인 변경 위험
- 전체 라이브러리 설치 (무거움)
- 외부 의존성 증가
- 완전한 커스터마이징 불가
```

#### **올바른 방법: 참고만 하기**

```
✅ 올바른 방법:
1. Design Systems Repo 검색
2. 유사 산업 시스템 분석
3. 디자인 개념만 참고
4. 우리 코드로 직접 작성

장점:
- 완전한 컨트롤
- 가벼움
- 안정성
- 자유로운 커스터마이징
```

#### **추천 레퍼런스 소스**

```
1. Design Systems Repo
   - https://designsystemsrepo.com/
   - 산업별/용도별 검색 가능

2. 주요 디자인 시스템:
   - Orbit (Kiwi.com) - 여행/예약
   - Atlassian Design System - 협업 도구
   - Material Design (Google) - 범용
   - Goldman Sachs Design - 금융
   - Base Design System - 범용
   - Line Design System - 메신저
```

### **디자인 시스템 구축 프로세스**

#### **Step 1: 레퍼런스 선택 (2시간)**

```
[디자이너 작업]
1. Design Systems Repo 탐색
2. 유사 산업/서비스 검색
3. 3개 레퍼런스 선정
4. 장단점 비교 분석
5. 최종 1개 선택
```

#### **Step 2: 디자인 토큰 정의 (4시간)**

```
[디자이너 작업]
1. 색상 팔레트 (Primary, Secondary, Semantic)
2. 타이포그래피 (Font, Size, Weight)
3. 간격 시스템 (4px / 8px 기반)
4. 그림자, 보더, 애니메이션

산출물: DESIGN_TOKENS.css
```

#### **Step 3: 컴포넌트 설계 (1주)**

```
[디자이너 작업]
1. 원자 컴포넌트 (Atoms) - 10개 이상
2. 분자 컴포넌트 (Molecules) - 5개 이상
3. 유기체 컴포넌트 (Organisms) - 3개 이상

산출물: 
- DESIGN_SYSTEM.md
- Figma Component Library
```

#### **Step 4: data-* 속성 표준화 (2시간)**

```
[디자이너 + 개발자 협업]
각 컴포넌트마다 data-* 속성 정의:
- data-component="[컴포넌트명]"
- data-variant="[변형]"
- data-size="[크기]"
- data-state="[상태]"
- data-action="[액션]"

산출물: data-* 속성 표준 문서
```

### **디자인 외주 프로세스**

#### **DESIGN_OUTSOURCING_BRIEF.md 활용**

```
[PM/리더 작업]
1. DESIGN_OUTSOURCING_BRIEF.md 작성
2. Part 1: 사업 정보 수집 (질문 5개)
3. Part 2: 브랜딩 방향 (질문 6개)

[AI 디자이너 에이전트에게 전달]
4. Part 3: 레퍼런스 검색 및 3개 시안 제시
5. 시안 선택
6. Part 4: 디자인 시스템 생성
7. Part 5: 웹페이지 제작

산출물:
- DESIGN_SYSTEM.md
- DESIGN_TOKENS.css
- Figma Component Library
- HTML/CSS 템플릿
```

---

## 🔗 디자인 통합 전략 (하이브리드)

### **핵심 원리: 구조와 로직의 완전 분리**

#### **data-* 속성 전략**

```html
<!-- 디자이너 작업 (HTML/CSS) -->
<button 
  class="my-custom-button-class awesome-style"
  data-component="button"
  data-variant="primary"
  data-action="submit-form">
  제출하기
</button>
```

```javascript
// AI 개발자 작업 (JavaScript)
// 클래스명 무관! data-* 속성만 참조
document.querySelectorAll('[data-component="button"]').forEach(button => {
  const action = button.dataset.action;
  
  button.addEventListener('click', () => {
    if (action === 'submit-form') {
      handleFormSubmit();
    }
  });
});
```

**장점:**
```
✅ 디자이너가 클래스명/ID 자유롭게 변경 가능
✅ JavaScript 수정 불필요
✅ CSS 프레임워크 교체 가능
✅ 이중 작업 없음
```

### **3가지 방법 비교**

| 방법 | 순서 | 장점 | 단점 | 추천도 |
|------|------|------|------|--------|
| **방법 1** | 디자이너 먼저 → AI 기능 추가 | 디자인 완성도 높음 | AI가 기존 HTML 분석 필요 | ⭐⭐⭐⭐ |
| **방법 2** | AI 기능 먼저 → 디자이너 스타일 교체 | 빠른 프로토타입 | 이중 코딩 발생 | ⭐⭐ (비추천) |
| **방법 3** | 하이브리드 (병렬 작업) | 가장 빠름, 충돌 없음 | 사전 기획 필수 | ⭐⭐⭐⭐⭐ (강력 추천) |

### **하이브리드 워크플로우 (방법 3)**

#### **Step 1: 와이어프레임 작성 (2시간)**

```
[디자이너 작업]
1. 저해상도 와이어프레임 제작
2. 컴포넌트 배치 결정
3. data-* 속성 표기

산출물: wireframe.fig (Figma)
```

#### **Step 2: 병렬 작업 (2일)**

```
[AI 개발자 - PC1, PC2, PC3]
와이어프레임 보고 기능 개발:
- HTML 구조 생성 (data-* 속성 포함)
- JavaScript 로직 작성
- 임시 스타일 (Bootstrap 등)

[디자이너 - 동시에]
Figma에서 고해상도 디자인 완성:
- 색상, 폰트, 간격 정교화
- 애니메이션 정의
- 컴포넌트 라이브러리 구축
```

#### **Step 3: 디자인 오버레이 (1시간)**

```
[디자이너 작업]
1. Figma → HTML/CSS 변환
2. AI가 작성한 HTML의 클래스명만 교체
3. data-* 속성은 그대로 유지

결과:
✅ JavaScript 수정 불필요
✅ 기능 정상 작동
✅ 완벽한 디자인 적용
```

---

## ⚙️ AI 룰(Rule) 설정 의무화

### **.cursorrules 파일 생성**

```
프로젝트 루트에 .cursorrules 파일 필수 생성
→ AI 에이전트가 이 파일을 읽고 코딩 규칙을 강제로 준수
```

### **자동 생성 프롬프트**

```
[AI 에이전트에게 전달]

다음 정보를 바탕으로 .cursorrules 파일을 생성하세요:

기술 스택:
- 프론트엔드: React 18 + TypeScript
- 상태관리: Zustand
- 스타일: Tailwind CSS
- 빌드: Vite

코딩 표준:
- 함수명: camelCase
- 컴포넌트명: PascalCase
- 파일명: kebab-case
- 들여쓰기: 2 spaces
- 따옴표: single quotes
- 세미콜론: 필수

data-* 속성 표준:
- data-component: 컴포넌트 타입
- data-variant: 변형
- data-action: 액션명

금지 사항:
- 바이브 코딩 금지 (맥락 없는 코드 생성 금지)
- 중복 코드 금지
- console.log 커밋 금지
- 하드코딩 금지

필수 사항:
- PRD.md, API_SPEC.md, DATABASE_SCHEMA.md, DESIGN_SYSTEM.md, PAGE_SPECS.md 참조
- 모든 컴포넌트에 data-* 속성 추가
- TypeScript strict 모드
- 에러 처리 필수
```

---

## 🚫 바이브 코딩 금지

### **바이브 코딩이란?**

```
❌ 맥락 없이 즉흥적으로 코드 생성
❌ 문서를 읽지 않고 추측으로 코딩
❌ 일관성 없는 스타일 적용
❌ 중복 코드 양산
```

### **강제 프롬프트 템플릿**

```
[AI 에이전트에게 전달]

당신은 {PROJECT_NAME} 프로젝트의 {PAGE_NAME} 페이지를 개발합니다.

필수 참조 문서:
1. PRD.md - 프로젝트 요구사항
2. API_SPEC.md - API 명세
3. DATABASE_SCHEMA.md - DB 스키마
4. DESIGN_SYSTEM.md - 디자인 시스템
5. PAGE_SPECS.md - 페이지 명세
6. .cursorrules - 코딩 규칙

작업 전 체크리스트:
□ 5종 문서를 모두 읽었는가?
□ data-* 속성 표준을 이해했는가?
□ 중복 코드가 없는지 확인했는가?
□ 디자인 토큰을 사용하는가?

작업:
{구체적인 작업 내용}

주의:
- 추측 금지: 불확실하면 질문하기
- 중복 금지: 기존 코드 재사용
- 표준 준수: .cursorrules 엄격히 따르기
```

---

## 🔒 멀티 에이전트 통일성 보장 규칙

### **5단계 방어선**

#### **1단계: PHASE 0 문서 (사전 차단)**
```
모든 AI가 동일한 5종 문서 참조
→ 기본 방향 통일
```

#### **2단계: .cursorrules (코딩 중 차단)**
```
AI가 코드 생성 시 자동으로 규칙 적용
→ 스타일 통일
```

#### **3단계: 바이브 코딩 금지 (프롬프트 차단)**
```
구조화된 프롬프트 강제
→ 랜덤성 제거
```

#### **4단계: shared_memory.json (실시간 동기화)**
```json
{
  "last_component_id": 42,
  "used_class_names": ["btn-primary", "card-hero"],
  "api_endpoints": ["/auth/login", "/posts"],
  "global_state_keys": ["user", "posts", "loading"]
}
```
```
5개 PC가 shared_memory.json을 읽고 쓰기
→ 중복 방지, ID 충돌 방지
```

#### **5단계: 인간 검증 (사후 차단)**
```
Pull Request 체크리스트로 최종 검증
→ 휴먼 게이트키퍼
```

---

## 🧪 MCP 도구 기반 검증

### **AI 자동 테스트**

```
AI 에이전트가 MCP 도구를 사용해 자동 검증:
- Playwright: E2E 테스트
- Chrome DevTools: 성능, 접근성 검사
- Lighthouse: SEO, PWA 점수
```

### **검증 프롬프트**

```
[AI 에이전트에게 전달]

{PAGE_NAME} 페이지 개발 완료 후:

1. Playwright로 E2E 테스트 실행:
   - 모든 버튼 클릭 가능한지
   - 폼 제출이 정상 작동하는지
   - 에러 처리가 올바른지

2. Chrome DevTools로 검사:
   - Console 에러 없는지
   - Network 요청 실패 없는지
   - 성능 (Lighthouse) 90점 이상인지

3. 접근성 검사:
   - ARIA 레이블 존재하는지
   - 키보드 네비게이션 가능한지
   - 색상 대비 4.5:1 이상인지

결과를 VALIDATION_REPORT.md에 기록하세요.
```

---

## 👤 인간 검증 의무화

### **Pull Request 체크리스트**

```markdown
## PR 체크리스트

### 문서 준수
- [ ] PRD.md 요구사항 충족
- [ ] API_SPEC.md 준수
- [ ] DATABASE_SCHEMA.md 일치
- [ ] DESIGN_SYSTEM.md 준수 (data-* 속성 포함)
- [ ] PAGE_SPECS.md 일치

### 코드 품질
- [ ] .cursorrules 준수
- [ ] 중복 코드 없음
- [ ] console.log 제거
- [ ] TypeScript 에러 없음
- [ ] ESLint 경고 없음

### 디자인 시스템
- [ ] 디자인 토큰 (CSS 변수) 사용
- [ ] data-* 속성 표준 준수
- [ ] 레퍼런스 디자인 시스템과 일치

### 테스트
- [ ] MCP 도구 검증 통과
- [ ] 수동 테스트 완료
- [ ] 크로스 브라우저 테스트

### 협업
- [ ] shared_memory.json 업데이트
- [ ] 코드 리뷰 요청
- [ ] AI Drive 백업 완료
```

---

## 🔄 개발 워크플로우 (6주)

### **Week 0: 디자인 시스템 구축** ⭐ **v1.6 추가**

```
[디자이너 작업]
1. Design Systems Repo 검색 (2시간)
2. 레퍼런스 선택 (3개 시안 제시)
3. 디자인 토큰 정의 (4시간)
4. Atomic Design 컴포넌트 설계 (3일)
5. Figma Component Library 구축 (2일)
6. DESIGN_SYSTEM.md 작성 (1일)

산출물:
✅ DESIGN_SYSTEM.md
✅ DESIGN_TOKENS.css
✅ Figma Component Library
✅ data-* 속성 표준
```

### **Week 1: 기획 (Planning)**

```
[PM/리더 작업]
1. PRD.md 작성
2. API_SPEC.md 작성
3. DATABASE_SCHEMA.md 작성
4. PAGE_SPECS.md 작성
5. 작업 분할 (5개 PC)
6. AI 룰(.cursorrules) 생성

산출물:
✅ 필수 5종 문서
✅ .cursorrules
✅ shared_memory.json (초기화)
```

### **Week 2-3: 병렬 개발 (Development)**

```
[PC1] 홈 페이지 + 헤더/푸터
[PC2] 로그인/회원가입
[PC3] 대시보드
[PC4] 상세 페이지
[PC5] 공통 모듈 (API 클라이언트, 유틸리티)

[디자이너] 고해상도 디자인 완성 (병렬 작업)

각 PC:
- DESIGN_SYSTEM.md 참조
- data-* 속성 적용
- 임시 스타일 사용
- MCP 도구로 자동 검증
- shared_memory.json 업데이트
```

### **Week 4: 디자인 오버레이 (Design Overlay)**

```
[디자이너 작업]
1. Figma → HTML/CSS 변환
2. AI 작성 HTML의 클래스명만 교체
3. data-* 속성 유지
4. 디자인 토큰 적용

[결과]
✅ JavaScript 수정 불필요
✅ 완벽한 디자인 적용
✅ 모든 기능 정상 작동
```

### **Week 5: 통합 및 테스트 (Integration)**

```
[전체 팀 작업]
1. GitHub에 병합
2. 충돌 해결
3. E2E 테스트
4. 성능 최적화
5. 접근성 검사
6. 크로스 브라우저 테스트
```

### **Week 6: 배포 및 모니터링 (Deployment)**

```
1. 프로덕션 빌드
2. 배포
3. 모니터링 설정
4. 사용자 피드백 수집
```

---

## 📁 표준 폴더 구조

```
project-name/
├─ docs/                    # 문서
│  ├─ PRD.md
│  ├─ API_SPEC.md
│  ├─ DATABASE_SCHEMA.md
│  ├─ DESIGN_SYSTEM.md      ⭐ v1.6 강화
│  ├─ PAGE_SPECS.md
│  ├─ DESIGN_OUTSOURCING_BRIEF.md  ⭐ v1.6 추가
│  └─ DESIGN_SYSTEM_CHECKLIST.md   ⭐ v1.6 추가
│
├─ design/                  ⭐ v1.6 추가
│  ├─ DESIGN_TOKENS.css
│  ├─ figma-url.txt
│  └─ design-references/
│     ├─ orbit-reference.png
│     └─ selected-style-guide.pdf
│
├─ src/
│  ├─ components/
│  │  ├─ atoms/            # 원자 컴포넌트
│  │  ├─ molecules/        # 분자 컴포넌트
│  │  └─ organisms/        # 유기체 컴포넌트
│  ├─ pages/
│  ├─ shared/              # 공통 모듈
│  └─ utils/
│
├─ .cursorrules            # AI 룰
├─ shared_memory.json      # 공유 메모리
└─ README.md
```

---

## ✅ 최종 체크리스트

### **프로젝트 시작 전**
- [ ] PRD.md 작성 완료
- [ ] API_SPEC.md 작성 완료
- [ ] DATABASE_SCHEMA.md 작성 완료
- [ ] **DESIGN_SYSTEM.md 작성 완료** ⭐ v1.6
- [ ] **레퍼런스 시스템 선택 완료** ⭐ v1.6
- [ ] **디자인 토큰 정의 완료** ⭐ v1.6
- [ ] PAGE_SPECS.md 작성 완료
- [ ] .cursorrules 생성 완료
- [ ] shared_memory.json 초기화 완료
- [ ] **Figma Component Library 구축 완료** ⭐ v1.6

### **개발 중**
- [ ] 바이브 코딩 금지 준수
- [ ] data-* 속성 표준 적용
- [ ] 디자인 토큰 사용
- [ ] MCP 도구 검증 실행
- [ ] shared_memory.json 업데이트

### **PR 제출 전**
- [ ] 인간 검증 체크리스트 완료
- [ ] 디자인 시스템 준수 확인
- [ ] 코드 리뷰 요청
- [ ] AI Drive 백업 완료

---

## 🔗 관련 문서

- **DESIGN_SYSTEM_CHECKLIST.md** - 디자인 시스템 완성도 체크
- **DESIGN_OUTSOURCING_BRIEF.md** - AI 디자이너 에이전트용 의뢰서
- **CODING_STANDARDS_TEMPLATE.md** - 코딩 표준 템플릿

---

## 📝 버전 이력

### **v1.6 (2025-10-30)** ⭐ 최신
```
✅ 디자인 시스템 구축 우선 전략 추가
✅ Design Systems Repo 활용법 추가
✅ npm 설치 금지 명시
✅ 디자인 외주 프로세스 추가
✅ DESIGN_OUTSOURCING_BRIEF.md 연동
✅ DESIGN_SYSTEM_CHECKLIST.md 연동
✅ Atomic Design 상세 가이드 추가
✅ 작업 흐름 명확화 (Week 0 추가)
```

### v1.5 (이전)
```
✅ Phase 0, 디자인 통합, MCP 검증, 인간 검증 통합
```

---

## 🚀 빠른 시작

### **Step 1: 이 가이드를 AI 에이전트에게 첨부**
```
"이 마스터 가이드를 따라 [프로젝트명] 프로젝트를 시작하세요."
```

### **Step 2: 디자인 시스템 구축** ⭐ v1.6
```
"DESIGN_OUTSOURCING_BRIEF.md를 사용해서 디자인 시스템을 생성하세요.
레퍼런스는 Design Systems Repo에서 찾아주세요."
```

### **Step 3: Phase 0 문서 작성**
```
"PRD.md, API_SPEC.md, DATABASE_SCHEMA.md, DESIGN_SYSTEM.md, PAGE_SPECS.md를 작성하세요."
```

### **Step 4: 개발 시작**
```
"[페이지명]을 개발하세요. DESIGN_SYSTEM.md를 참조하고 data-* 속성을 적용하세요."
```

---

**이 가이드 하나로 5개 PC에서 5개 AI 에이전트가 일관된 산출물을 생성합니다!** 🎉

**버전:** 1.6 (FINAL)
**마지막 업데이트:** 2025-10-30
**작성자:** AI Development Team
