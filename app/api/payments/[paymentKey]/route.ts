import { NextRequest, NextResponse } from 'next/server'

// Toss Payments Secret Key (서버에서만 사용)
const SECRET_KEY = process.env.TOSS_PAYMENTS_SECRET_KEY!

export async function GET(
  request: NextRequest,
  { params }: { params: { paymentKey: string } }
) {
  try {
    const { paymentKey } = params

    if (!paymentKey) {
      return NextResponse.json(
        { error: 'paymentKey가 필요합니다.' },
        { status: 400 }
      )
    }

    // Toss Payments API로 결제 정보 조회
    const response = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(SECRET_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
    })

    const payment = await response.json()

    if (!response.ok) {
      console.error('Toss Payments 결제 조회 실패:', payment)
      return NextResponse.json(
        { error: payment.message || '결제 정보 조회에 실패했습니다.' },
        { status: response.status }
      )
    }

    return NextResponse.json(payment)
    
  } catch (error) {
    console.error('결제 조회 처리 중 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
