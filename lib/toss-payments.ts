import { loadTossPayments } from '@tosspayments/payment-sdk'

// Toss Payments 클라이언트 키 (환경변수에서 가져오기)
const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY!

if (!clientKey) {
  throw new Error('NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY가 설정되지 않았습니다.')
}

// Toss Payments 클라이언트 초기화
export const getTossPayments = async () => {
  return await loadTossPayments(clientKey)
}

// 결제 요청 타입 정의
export interface PaymentRequest {
  amount: number
  orderId: string
  orderName: string
  customerName?: string
  customerEmail?: string
  successUrl: string
  failUrl: string
}

// 결제 승인 타입 정의
export interface PaymentApproval {
  paymentKey: string
  orderId: string
  amount: number
}

// 결제 상태 타입
export type PaymentStatus = 'PENDING' | 'DONE' | 'CANCELED' | 'PARTIAL_CANCELED' | 'FAILED'

// 결제 방법 타입
export type PaymentMethod = 
  | '카드' 
  | '가상계좌' 
  | '계좌이체' 
  | '휴대폰' 
  | '상품권' 
  | '토스페이' 
  | '문화상품권' 
  | '도서문화상품권'

// 결제 정보 타입
export interface Payment {
  paymentKey: string
  orderId: string
  orderName: string
  method: PaymentMethod
  totalAmount: number
  balanceAmount: number
  status: PaymentStatus
  requestedAt: string
  approvedAt?: string
  useEscrow: boolean
  lastTransactionKey?: string
  suppliedAmount: number
  vat: number
  cultureExpense: boolean
  taxFreeAmount: number
  taxExemptionAmount: number
  cancels?: any[]
  isPartialCancelable: boolean
  card?: any
  virtualAccount?: any
  transfer?: any
  mobilePhone?: any
  giftCertificate?: any
  cashReceipt?: any
  cashReceipts?: any[]
  discount?: any
  country: string
  failure?: {
    code: string
    message: string
  }
}

// 주문 ID 생성 함수
export const generateOrderId = (): string => {
  const timestamp = new Date().getTime()
  const random = Math.random().toString(36).substring(2, 15)
  return `ORDER_${timestamp}_${random}`
}

// 금액 포맷팅 함수
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('ko-KR').format(amount)
}

// 결제 요청 함수
export const requestPayment = async (request: PaymentRequest) => {
  const tossPayments = await getTossPayments()
  
  return await tossPayments.requestPayment('카드', {
    amount: request.amount,
    orderId: request.orderId,
    orderName: request.orderName,
    customerName: request.customerName,
    customerEmail: request.customerEmail,
    successUrl: request.successUrl,
    failUrl: request.failUrl,
  })
}

// 결제 승인 API 호출 함수
export const confirmPayment = async (approval: PaymentApproval): Promise<Payment> => {
  const response = await fetch('/api/payments/confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(approval),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '결제 승인에 실패했습니다.')
  }

  return await response.json()
}

// 결제 조회 함수
export const getPayment = async (paymentKey: string): Promise<Payment> => {
  const response = await fetch(`/api/payments/${paymentKey}`)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '결제 정보 조회에 실패했습니다.')
  }

  return await response.json()
}

// 결제 취소 함수
export const cancelPayment = async (paymentKey: string, cancelReason: string, cancelAmount?: number) => {
  const response = await fetch('/api/payments/cancel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      paymentKey,
      cancelReason,
      cancelAmount,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '결제 취소에 실패했습니다.')
  }

  return await response.json()
}
