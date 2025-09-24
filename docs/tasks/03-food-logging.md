# 3. 식단 기록 핵심 기능

## 📋 태스크 목록

### 3.1 이미지 업로드 UI 구현
- [ ] 메인 페이지 레이아웃 (`/app/page.tsx`)
- [ ] 중앙 '식단 기록하기' 버튼/아이콘
- [ ] 이미지 선택 인터페이스
  - [ ] 카메라 촬영 옵션
  - [ ] 갤러리 선택 옵션
  - [ ] 파일 드래그 앤 드롭 (데스크탑)
- [ ] 이미지 미리보기 기능
- [ ] 이미지 크기/형식 유효성 검사

**의존성**: 02-authentication.md의 2.2, 2.5 완료 후  
**예상 소요 시간**: 4-5시간  
**우선순위**: 🔴 High

### 3.2 이미지 처리 및 최적화
- [ ] 이미지 압축 기능
- [ ] 이미지 리사이징 (최대 크기 제한)
- [ ] 지원 형식 제한 (JPEG, PNG, WebP)
- [ ] 파일 크기 제한 (예: 5MB)
- [ ] 이미지 회전 정보 처리 (EXIF)

**의존성**: 3.1 완료 후  
**예상 소요 시간**: 3-4시간  
**우선순위**: 🟡 Medium

### 3.3 n8n 웹훅 연동 클라이언트
- [ ] API 클라이언트 함수 구현 (`/lib/api/food-logging.ts`)
  ```typescript
  interface UploadImageRequest {
    image: File;
    userId: string;
  }
  
  interface UploadImageResponse {
    success: boolean;
    data?: FoodAnalysisResult;
    error?: ApiError;
  }
  ```
- [ ] multipart/form-data 요청 구현
- [ ] 요청 타임아웃 설정
- [ ] 재시도 로직 구현
- [ ] 에러 응답 처리

**의존성**: 3.1 완료 후  
**예상 소요 시간**: 3-4시간  
**우선순위**: 🔴 High

### 3.4 로딩 상태 관리 및 UI
- [ ] 업로드 진행률 표시
- [ ] 로딩 스피너/애니메이션
- [ ] 단계별 상태 표시
  - [ ] "이미지 업로드 중..."
  - [ ] "AI 분석 중..."
  - [ ] "결과 저장 중..."
- [ ] 취소 기능 구현
- [ ] 백그라운드 처리 상태 관리

**의존성**: 3.3 완료 후  
**예상 소요 시간**: 2-3시간  
**우선순위**: 🔴 High

### 3.5 에러 핸들링 및 사용자 피드백
- [ ] 에러 타입별 처리
  - [ ] 네트워크 오류
  - [ ] 파일 형식 오류
  - [ ] 파일 크기 초과
  - [ ] AI 분석 실패 (`NO_FOOD_DETECTED`)
  - [ ] 서버 오류 (500번대)
- [ ] 사용자 친화적 에러 메시지
- [ ] 재시도 옵션 제공
- [ ] 에러 로깅 (개발자용)

**의존성**: 3.3 완료 후  
**예상 소요 시간**: 3-4시간  
**우선순위**: 🔴 High

### 3.6 성공 피드백 및 결과 표시
- [ ] 성공 알림 UI ("기록 완료!")
- [ ] 분석 결과 간단 미리보기
  - [ ] 감지된 음식 목록
  - [ ] 총 칼로리
  - [ ] 끼니 분류 결과
- [ ] 상세 결과 페이지로 이동 옵션
- [ ] 추가 기록 유도 UX

**의존성**: 3.3, 3.4 완료 후  
**예상 소요 시간**: 2-3시간  
**우선순위**: 🟡 Medium

### 3.7 오프라인 지원 및 동기화
- [ ] 오프라인 상태 감지
- [ ] 로컬 스토리지 임시 저장
- [ ] 온라인 복구 시 자동 업로드
- [ ] 동기화 상태 표시

**의존성**: 3.3 완료 후  
**예상 소요 시간**: 4-5시간  
**우선순위**: 🟢 Low

### 3.8 성능 최적화
- [ ] 이미지 압축 최적화
- [ ] 요청 중복 방지
- [ ] 메모리 사용량 최적화
- [ ] 배치 업로드 지원 (여러 이미지)

**의존성**: 3.1-3.6 완료 후  
**예상 소요 시간**: 3-4시간  
**우선순위**: 🟢 Low

## 🎯 완료 기준
- [ ] 사용자가 버튼 클릭으로 이미지 선택 가능
- [ ] 선택한 이미지가 자동으로 n8n 웹훅으로 전송
- [ ] 로딩 상태가 명확하게 표시됨
- [ ] 성공/실패에 대한 적절한 피드백 제공
- [ ] 에러 상황에서도 사용자가 다시 시도 가능

## 📱 사용자 경험 목표
- [ ] **원클릭**: 버튼 하나로 모든 과정 완료
- [ ] **즉시성**: 이미지 선택 즉시 업로드 시작
- [ ] **피드백**: 진행 상황 실시간 표시
- [ ] **신뢰성**: 실패 시 명확한 안내 및 재시도 옵션

## 🔧 기술 구현 세부사항

### API 엔드포인트 설계
```typescript
// /app/api/upload-food/route.ts
export async function POST(request: Request) {
  const formData = await request.formData();
  const image = formData.get('image') as File;
  const userId = formData.get('userId') as string;
  
  // n8n 웹훅으로 포워딩
  // 에러 처리 및 응답 변환
}
```

### 타입 정의
```typescript
interface FoodItem {
  foodName: string;
  confidence: number;
  quantity: string;
  calories: number;
  nutrients: NutrientInfo;
}

interface FoodAnalysisResult {
  items: FoodItem[];
  summary: {
    totalCalories: number;
    totalCarbohydrates: { value: number; unit: string };
    totalProtein: { value: number; unit: string };
    totalFat: { value: number; unit: string };
  };
}
```

## 📝 테스트 시나리오
- [ ] 정상적인 음식 사진 업로드
- [ ] 음식이 없는 이미지 업로드
- [ ] 지원하지 않는 파일 형식 업로드
- [ ] 크기가 큰 이미지 업로드
- [ ] 네트워크 연결 불안정 상황
- [ ] n8n 서버 응답 지연 상황

## 🔗 참고 링크
- [File API MDN 문서](https://developer.mozilla.org/en-US/docs/Web/API/File)
- [FormData MDN 문서](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [Next.js 파일 업로드](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#formdata)
- [n8n 웹훅 문서](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
