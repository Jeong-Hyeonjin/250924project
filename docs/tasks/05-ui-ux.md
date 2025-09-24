# 5. UI/UX 및 반응형 디자인

## 📋 태스크 목록

### 5.1 디자인 시스템 구축
- [ ] 컬러 팔레트 정의
  - [ ] Primary colors (브랜드 컬러)
  - [ ] Secondary colors (보조 컬러)
  - [ ] Semantic colors (성공, 경고, 에러)
  - [ ] Neutral colors (회색조)
- [ ] 타이포그래피 시스템
  - [ ] 폰트 패밀리 선택 및 로드
  - [ ] 텍스트 크기 체계 (h1-h6, body, caption)
  - [ ] 줄 간격 및 자간 정의
- [ ] 간격 시스템 (spacing scale)
- [ ] 그림자 및 테두리 스타일

**의존성**: 없음 (병렬 진행 가능)  
**예상 소요 시간**: 3-4시간  
**우선순위**: 🔴 High

### 5.2 공통 컴포넌트 라이브러리
- [ ] Button 컴포넌트
  - [ ] 다양한 variant (primary, secondary, outline)
  - [ ] 크기 옵션 (sm, md, lg)
  - [ ] 로딩 상태
  - [ ] 비활성 상태
- [ ] Input 컴포넌트
  - [ ] 다양한 타입 (text, email, password)
  - [ ] 에러 상태 표시
  - [ ] 라벨 및 헬퍼 텍스트
- [ ] Modal/Dialog 컴포넌트
- [ ] Loading Spinner/Skeleton 컴포넌트
- [ ] Toast/Alert 컴포넌트

**의존성**: 5.1 완료 후  
**예상 소요 시간**: 6-8시간  
**우선순위**: 🔴 High

### 5.3 레이아웃 및 네비게이션 시스템
- [ ] 모바일 최적화 네비게이션
  - [ ] 하단 탭 네비게이션 (Bottom Tab)
  - [ ] 햄버거 메뉴 (사이드바)
  - [ ] 브레드크럼 (데스크탑)
- [ ] 헤더 컴포넌트
  - [ ] 로고/브랜딩
  - [ ] 사용자 메뉴
  - [ ] 알림 아이콘
- [ ] 풋터 컴포넌트 (선택사항)
- [ ] 페이지 레이아웃 템플릿

**의존성**: 5.2 완료 후  
**예상 소요 시간**: 4-5시간  
**우선순위**: 🔴 High

### 5.4 반응형 디자인 구현
- [ ] 브레이크포인트 정의
  - [ ] Mobile: 320px - 768px
  - [ ] Tablet: 768px - 1024px
  - [ ] Desktop: 1024px+
- [ ] 그리드 시스템 구현
- [ ] 컨테이너 및 레이아웃 컴포넌트
- [ ] 미디어 쿼리 유틸리티
- [ ] 반응형 이미지 및 아이콘

**의존성**: 5.1 완료 후  
**예상 소요 시간**: 4-5시간  
**우선순위**: 🔴 High

### 5.5 애니메이션 및 인터랙션
- [ ] 페이지 전환 애니메이션
- [ ] 마이크로 인터랙션
  - [ ] 버튼 호버/포커스 효과
  - [ ] 입력 필드 포커스 애니메이션
  - [ ] 로딩 스피너 애니메이션
- [ ] 제스처 지원 (스와이프, 터치)
- [ ] 스크롤 애니메이션 (선택사항)
- [ ] Framer Motion 또는 CSS 애니메이션 활용

**의존성**: 5.2, 5.3 완료 후  
**예상 소요 시간**: 3-4시간  
**우선순위**: 🟡 Medium

### 5.6 접근성 (Accessibility) 개선
- [ ] ARIA 라벨 및 역할 설정
- [ ] 키보드 네비게이션 지원
- [ ] 포커스 표시 개선
- [ ] 스크린 리더 호환성
- [ ] 색상 대비 검증 (WCAG 2.1 AA 기준)
- [ ] 대체 텍스트 (alt text) 설정
- [ ] 시맨틱 HTML 구조

**의존성**: 5.2, 5.3 완료 후  
**예상 소요 시간**: 4-5시간  
**우선순위**: 🟡 Medium

### 5.7 다크 모드 지원
- [ ] 다크 모드 테마 정의
- [ ] 시스템 설정 감지
- [ ] 테마 토글 컴포넌트
- [ ] 로컬 스토리지에 설정 저장
- [ ] CSS 변수 또는 Tailwind dark: 활용

**의존성**: 5.1 완료 후  
**예상 소요 시간**: 3-4시간  
**우선순위**: 🟢 Low

### 5.8 성능 최적화
- [ ] 이미지 최적화
  - [ ] Next.js Image 컴포넌트 활용
  - [ ] WebP 형식 지원
  - [ ] 지연 로딩 (lazy loading)
- [ ] CSS 최적화
  - [ ] 중복 스타일 제거
  - [ ] Critical CSS 인라인
  - [ ] 사용하지 않는 CSS 제거
- [ ] 폰트 최적화
  - [ ] 폰트 프리로드
  - [ ] 가변 폰트 활용
  - [ ] 폰트 디스플레이 최적화

**의존성**: 5.1-5.4 완료 후  
**예상 소요 시간**: 3-4시간  
**우선순위**: 🟡 Medium

### 5.9 에러 상태 및 엣지 케이스 UI
- [ ] 404 페이지 디자인
- [ ] 500 에러 페이지
- [ ] 네트워크 오류 상태
- [ ] 빈 상태 (Empty State) 디자인
- [ ] 로딩 상태 다양한 패턴
- [ ] 오프라인 상태 UI

**의존성**: 5.2 완료 후  
**예상 소요 시간**: 2-3시간  
**우선순위**: 🟡 Medium

## 🎯 완료 기준
- [ ] 모든 화면이 모바일에서 최적화되어 표시됨
- [ ] 주요 상호작용에 적절한 시각적 피드백 제공
- [ ] 일관된 디자인 시스템이 모든 컴포넌트에 적용됨
- [ ] 접근성 기준 (WCAG 2.1 AA) 충족
- [ ] 로딩 시간 최적화 (LCP < 2.5초)

## 📱 모바일 우선 설계 원칙

### 터치 인터페이스 최적화
- [ ] 최소 터치 타겟 크기: 44px × 44px
- [ ] 충분한 여백으로 실수 클릭 방지
- [ ] 스와이프 제스처 활용
- [ ] Pull-to-refresh 패턴

### 콘텐츠 우선순위
- [ ] 가장 중요한 정보를 상단에 배치
- [ ] 스크롤 최소화를 위한 정보 계층화
- [ ] 한 손 조작 가능한 네비게이션

## 🎨 디자인 토큰 예시

```typescript
// design-tokens.ts
export const colors = {
  primary: {
    50: '#f0fdf4',
    500: '#22c55e',
    900: '#14532d',
  },
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
} as const;

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
} as const;

export const typography = {
  h1: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.2 },
  h2: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.3 },
  body: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
} as const;
```

## 🔧 기술 도구 및 라이브러리

### UI 컴포넌트
- **Headless UI**: 접근성이 좋은 기본 컴포넌트
- **Radix UI**: 고품질 헤드리스 컴포넌트
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크

### 애니메이션
- **Framer Motion**: React 애니메이션 라이브러리
- **CSS Transitions**: 간단한 애니메이션

### 아이콘
- **Heroicons**: Tailwind팀이 만든 아이콘 세트
- **Lucide React**: 가벼운 아이콘 라이브러리

## 📏 성능 목표

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5초
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### 추가 메트릭스
- **TTI (Time to Interactive)**: < 3.5초
- **TBT (Total Blocking Time)**: < 200ms

## 📝 테스트 시나리오
- [ ] 다양한 화면 크기에서 레이아웃 확인
- [ ] 터치 인터페이스 사용성 테스트
- [ ] 키보드 네비게이션 테스트
- [ ] 스크린 리더 호환성 테스트
- [ ] 느린 네트워크에서 로딩 성능 테스트
- [ ] 다양한 브라우저에서 호환성 확인

## 🔗 참고 링크
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [WCAG 2.1 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design](https://material.io/design)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Web.dev Performance](https://web.dev/performance/)
