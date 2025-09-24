import { NextRequest, NextResponse } from 'next/server';

// n8n 웹훅 URL (추후 환경 변수로 이동 권장: process.env.N8N_WEBHOOK_URL)
const N8N_WEBHOOK_URL = 'https://hjjeong.app.n8n.cloud/webhook/282fe775-0bdb-433a-968a-c0a79aa90381';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const userId = formData.get('userId') as string;

    // 입력 값 검증
    if (!image) {
      return NextResponse.json(
        { success: false, error: { code: 'NO_IMAGE', message: '이미지가 제공되지 않았습니다.' } },
        { status: 400 }
      );
    }

    // 파일 크기 체크 (5MB 제한)
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: { code: 'FILE_TOO_LARGE', message: '파일 크기가 5MB를 초과합니다.' } },
        { status: 400 }
      );
    }

    // 파일 타입 체크
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_FILE_TYPE', message: '이미지 파일만 업로드 가능합니다.' } },
        { status: 400 }
      );
    }

    // n8n 웹훅으로 전송할 FormData 생성
    const n8nFormData = new FormData();
    n8nFormData.append('image', image);
    n8nFormData.append('userId', userId || 'anonymous');

    console.log('n8n 웹훅으로 이미지 전송 시작:', {
      fileName: image.name,
      fileSize: image.size,
      fileType: image.type,
      userId: userId || 'anonymous'
    });

    // n8n 웹훅에 요청 전송 (AI 분석 시간을 고려하여 충분한 시간 설정)
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      body: n8nFormData,
      // timeout 설정 (2분) - AI 분석 시간 고려
      signal: AbortSignal.timeout(120000),
    });

    console.log('n8n 응답 상태:', response.status);

    if (!response.ok) {
      console.error('n8n 웹훅 오류:', response.status, response.statusText);
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'WEBHOOK_ERROR', 
            message: `분석 서비스에 연결할 수 없습니다. (${response.status})` 
          } 
        },
        { status: 502 }
      );
    }

    // n8n에서 받은 응답 데이터
    let result;
    const responseText = await response.text();
    console.log('n8n 원시 응답:', responseText);
    
    try {
      result = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      // 빈 응답이나 잘못된 JSON인 경우 기본값 설정
      result = { 
        success: false, 
        error: { 
          code: 'INVALID_RESPONSE', 
          message: 'n8n에서 올바르지 않은 응답을 받았습니다.' 
        } 
      };
    }
    
    console.log('n8n 분석 결과:', result);

    // 응답 데이터 검증 및 표준화
    if (result.success === false) {
      return NextResponse.json({
        success: false,
        error: {
          code: result.error?.code || 'ANALYSIS_FAILED',
          message: result.error?.message || '음식 분석에 실패했습니다.'
        }
      }, { status: 400 });
    }

    // n8n에서 단순히 "Workflow was started" 메시지만 온 경우 처리
    if (result.message === 'Workflow was started' && !result.data) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'WORKFLOW_STARTED',
          message: 'n8n 워크플로우가 시작되었지만 분석 결과를 받지 못했습니다. 잠시 후 다시 시도해주세요.'
        }
      }, { status: 202 }); // 202 Accepted - 요청이 접수되었지만 아직 처리되지 않음
    }

    // 성공 응답 표준화
    return NextResponse.json({
      success: true,
      data: result.data || result // n8n에서 받은 데이터를 그대로 전달
    });

  } catch (error) {
    console.error('API 라우트 오류:', error);

    // 타임아웃 에러 처리
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'TIMEOUT', 
            message: '분석 시간이 초과되었습니다. 다시 시도해주세요.' 
          } 
        },
        { status: 408 }
      );
    }

    // 네트워크 에러 처리
    if (error instanceof Error && error.message.includes('fetch')) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'NETWORK_ERROR', 
            message: '네트워크 연결을 확인해주세요.' 
          } 
        },
        { status: 503 }
      );
    }

    // 기타 서버 에러
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' 
        } 
      },
      { status: 500 }
    );
  }
}
