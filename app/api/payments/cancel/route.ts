import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Toss Payments Secret Key (서버에서만 사용)
const SECRET_KEY = process.env.TOSS_PAYMENTS_SECRET_KEY!

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, cancelReason, cancelAmount } = await request.json()

    // 필수 파라미터 검증
    if (!paymentKey || !cancelReason) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // Toss Payments API로 결제 취소 요청
    const cancelData: any = {
      cancelReason,
    }
    
    if (cancelAmount) {
      cancelData.cancelAmount = cancelAmount
    }

    const response = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(SECRET_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cancelData),
    })

    const payment = await response.json()

    if (!response.ok) {
      console.error('Toss Payments 결제 취소 실패:', payment)
      return NextResponse.json(
        { error: payment.message || '결제 취소에 실패했습니다.' },
        { status: response.status }
      )
    }

    // 결제 취소 성공 - 데이터베이스 업데이트
    const newStatus = cancelAmount ? 'PARTIAL_CANCELED' : 'CANCELED'
    
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: newStatus,
        metadata: payment,
        updated_at: new Date().toISOString(),
      })
      .eq('payment_key', paymentKey)

    if (updateError) {
      console.error('데이터베이스 업데이트 실패:', updateError)
    }

    return NextResponse.json(payment)
    
  } catch (error) {
    console.error('결제 취소 처리 중 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
