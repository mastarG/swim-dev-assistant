# 스윔 개발자 (Swim Developer Assistant)

> AI 개발 커뮤니케이션 헬퍼 웹 애플리케이션

## 프로젝트 개요

젠스파크(Genspark) 슈퍼에이전트를 이용한 AI 개발 시, 바이브 코딩의 장점은 유지하면서 전문 용어 부족과 반복 작업 문제를 해결하는 웹 애플리케이션입니다.

## 주요 기능

### ✨ 핵심 기능
- 🖱️ **클릭모드**: 요소 클릭 시 `data-*` 속성 자동 추출
- 📸 **스크린모드**: 0.7초 롱프레스로 영역 선택
- 🤖 **Gemini AI 연동**: 텍스트 자동 정리 및 변환
- 📋 **히스토리 자동 기록**: 요구사항 정의서 자동 생성
- 🔗 **GitHub 연동**: 실시간 동기화 및 협업

### 🎨 디자인
- Apple (macOS) 스타일
- Light/Dark 테마
- 반응형 레이아웃 (6:4 분할, 드래그 조절 가능)

## 기술 스택

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 (Design System)
- **APIs**: 
  - Gemini AI API 2.0
  - GitHub REST API
- **Storage**: LocalStorage (암호화)

## 프로젝트 구조

```
webapp/
├── index.html              # 메인 HTML
├── css/
│   ├── design-system.css   # Design System (CSS Variables)
│   ├── components.css      # 컴포넌트 스타일
│   └── layout.css          # 레이아웃
├── js/
│   ├── app.js              # 메인 앱 로직
│   ├── api.js              # API 연동 (Gemini, GitHub)
│   ├── storage.js          # LocalStorage 관리
│   └── ui.js               # UI 컴포넌트
├── assets/
│   └── icons/              # SVG 아이콘
├── docs/
│   ├── PRD.md              # 프로젝트 요구사항 명세서
│   ├── DESIGN_SYSTEM.md    # 디자인 시스템 명세
│   ├── PAGE_SPECS.md       # 페이지 상세 명세
│   ├── API_SPEC.md         # API 명세서
│   └── DATABASE_SCHEMA.md  # 데이터 스키마
└── README.md
```

## 설치 및 실행

### 로컬 환경
```bash
# 단순히 브라우저로 index.html 열기
open index.html

# 또는 로컬 서버 실행
python -m http.server 8000
# http://localhost:8000 접속
```

### GitHub Pages 배포
```bash
# GitHub Repository Settings > Pages
# Source: Deploy from a branch
# Branch: main / (root)
```

## 사용 방법

### 1. 초기 설정
1. 우측 상단 [설정] 클릭
2. Gemini API 키 입력
3. GitHub Repository URL 및 Token 입력
4. [연결 테스트] 후 저장

### 2. 클릭모드 사용
1. 좌측 미리보기 패널에서 요소 클릭
2. 우측 입력창에 위치 정보 자동 입력
3. 수정 사항 작성 후 [엔터] 클릭
4. Gemini AI가 텍스트 정리
5. [복사] 버튼으로 결과 복사

### 3. 스크린모드 사용
1. 요소를 0.7초 이상 길게 누르기
2. 드래그로 영역 선택
3. 선택 완료 시 위치 정보 전달

### 4. 히스토리 확인
1. 우측 상단 [히스토리] 클릭
2. 자동 기록된 요구사항 확인
3. 필터/검색으로 찾기
4. Markdown으로 내보내기

## API 키 발급

### Gemini API
1. https://makersuite.google.com/app/apikey
2. [Create API key] 클릭
3. 프로젝트 선택 후 생성
4. 키 복사하여 설정에 입력

### GitHub Personal Access Token
1. https://github.com/settings/tokens
2. [Generate new token] 클릭
3. 권한 선택: `repo`, `workflow`
4. 토큰 생성 후 복사하여 설정에 입력

## 명세서

- [PRD.md](./PRD.md) - 프로젝트 요구사항 명세서
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - 디자인 시스템
- [PAGE_SPECS.md](./PAGE_SPECS.md) - 페이지 상세 명세
- [API_SPEC.md](./API_SPEC.md) - API 명세서
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - 데이터 스키마

## 브라우저 지원

- ✅ Chrome (최신 버전)
- ✅ Edge (최신 버전)
- ⚠️ Firefox (일부 기능 제한)
- ⚠️ Safari (일부 기능 제한)

**권장**: Chrome 브라우저, 최소 화면 해상도 1920x1080

## 라이선스

MIT License

## 개발자

Product Owner & Developer

---

**버전**: 1.0  
**최종 수정**: 2025-10-30
