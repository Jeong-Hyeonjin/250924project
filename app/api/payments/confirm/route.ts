import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Toss Payments Secret Key (서버에서만 사용)
const SECRET_KEY = process.env.TOSS_PAYMENTS_SECRET_KEY!

if (!SECRET_KEY) {
  throw new Error('TOSS_PAYMENTS_SECRET_KEY가 설정되지 않았습니다.')
}

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json()

    // 필수 파라미터 검증
    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // Toss Payments API로 결제 승인 요청
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(SECRET_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    })

    const payment = await response.json()

    if (!response.ok) {
      console.error('Toss Payments 결제 승인 실패:', payment)
      
      // 데이터베이스에 실패 정보 저장
      await supabase
        .from('payments')
        .update({
          status: 'FAILED',
          failed_at: new Date().toISOString(),
          failure_code: payment.code,
          failure_message: payment.message,
          updated_at: new Date().toISOString(),
        })
        .eq('order_id', orderId)

      return NextResponse.json(
        { error: payment.message || '결제 승인에 실패했습니다.' },
        { status: response.status }
      )
    }

    // 결제 승인 성공 - 데이터베이스 업데이트
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        payment_key: paymentKey,
        status: 'DONE',
        method: payment.method,
        approved_at: new Date().toISOString(),
        metadata: payment,
        updated_at: new Date().toISOString(),
      })
      .eq('order_id', orderId)

    if (updateError) {
      console.error('데이터베이스 업데이트 실패:', updateError)
      // 결제는 성공했지만 DB 업데이트 실패 - 관리자에게 알림 필요
    }

    return NextResponse.json(payment)
    
  } catch (error) {
    console.error('결제 승인 처리 중 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
