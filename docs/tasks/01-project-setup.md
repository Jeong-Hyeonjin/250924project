# 1. 프로젝트 설정 및 환경 구성

## 📋 태스크 목록

### 1.1 프로젝트 초기화 및 의존성 설치
- [x] ~~Next.js 프로젝트 생성~~ (완료)
- [ ] 필수 패키지 설치
  - [ ] Supabase 클라이언트 (`@supabase/supabase-js`)
  - [ ] UI 라이브러리 (Tailwind CSS, Shadcn UI)
  - [ ] 폼 관리 (react-hook-form, zod)
  - [ ] 상태 관리 (zustand)
  - [ ] 이미지 처리 관련
- [ ] TypeScript 설정 강화
- [ ] ESLint/Prettier 설정

**의존성**: 없음  
**예상 소요 시간**: 2-3시간  
**우선순위**: 🔴 High

### 1.2 개발 환경 설정
- [ ] 환경변수 설정 (.env.local)
  - [ ] Supabase URL 및 키
  - [ ] n8n 웹훅 URL
- [ ] 개발 서버 설정 확인
- [ ] 디렉토리 구조 설계
  - [ ] `/app` 라우팅 구조
  - [ ] `/components` 컴포넌트 구조
  - [ ] `/lib` 유틸리티 함수
  - [ ] `/types` 타입 정의

**의존성**: 1.1 완료 후  
**예상 소요 시간**: 1-2시간  
**우선순위**: 🔴 High

### 1.3 Supabase 프로젝트 초기 설정
- [ ] Supabase 프로젝트 생성
- [ ] 프로젝트 설정 (지역, 비밀번호 등)
- [ ] API 키 및 URL 확인
- [ ] RLS (Row Level Security) 기본 설정

**의존성**: 없음 (병렬 진행 가능)  
**예상 소요 시간**: 30분  
**우선순위**: 🔴 High

### 1.4 데이터베이스 스키마 설계
- [ ] `profiles` 테이블 (사용자 프로필)
  ```sql
  create table profiles (
    id uuid references auth.users on delete cascade,
    email text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (id)
  );
  ```
- [ ] `food_logs` 테이블 (식단 기록)
  ```sql
  create table food_logs (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    image_url text not null,
    meal_type text not null check (meal_type in ('아침', '점심', '저녁', '간식')),
    analysis_result jsonb not null,
    total_calories integer,
    logged_at timestamp with time zone default timezone('utc'::text, now()) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
  );
  ```
- [ ] RLS 정책 설정
- [ ] 인덱스 생성 (성능 최적화)

**의존성**: 1.3 완료 후  
**예상 소요 시간**: 2-3시간  
**우선순위**: 🔴 High

### 1.5 Supabase Storage 설정
- [ ] Storage 버킷 생성 (`food-images`)
- [ ] 버킷 정책 설정 (인증된 사용자만 업로드)
- [ ] 파일 크기 및 타입 제한 설정

**의존성**: 1.3 완료 후  
**예상 소요 시간**: 1시간  
**우선순위**: 🟡 Medium

## 🎯 완료 기준
- [ ] 모든 필수 패키지가 설치되고 프로젝트가 정상 빌드됨
- [ ] Supabase 프로젝트가 생성되고 연결 테스트 성공
- [ ] 데이터베이스 테이블이 생성되고 기본 CRUD 동작 확인
- [ ] 환경변수가 올바르게 설정되어 개발 서버 시작 가능

## 📝 주의사항
- 환경변수는 절대 공개 저장소에 커밋하지 않기
- Supabase 프로젝트의 API 키는 공개키(anon)와 서비스키 구분하여 관리
- 데이터베이스 스키마 변경 시 마이그레이션 파일로 관리

## 🔗 참고 링크
- [Next.js 공식 문서](https://nextjs.org/docs)
- [Supabase 시작하기](https://supabase.com/docs/guides/getting-started)
- [Tailwind CSS 설치](https://tailwindcss.com/docs/installation)
