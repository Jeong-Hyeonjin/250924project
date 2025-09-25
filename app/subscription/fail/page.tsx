"use client";

import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { XCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'

export default function PaymentFailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const code = searchParams.get('code')
  const message = searchParams.get('message')
  const orderId = searchParams.get('orderId')

  const getFailureMessage = (code: string | null) => {
    switch (code) {
      case 'PAY_PROCESS_CANCELED':
        return '사용자가 결제를 취소했습니다.'
      case 'PAY_PROCESS_ABORTED':
        return '결제 진행 중 오류가 발생했습니다.'
      case 'REJECT_CARD_COMPANY':
        return '카드사에서 결제를 거절했습니다.'
      case 'INVALID_CARD_EXPIRATION':
        return '카드 유효기간이 만료되었습니다.'
      case 'INSUFFICIENT_FUNDS':
        return '잔액이 부족합니다.'
      case 'EXCEED_MAX_DAILY_PAYMENT_COUNT':
        return '일일 결제 한도를 초과했습니다.'
      case 'NOT_SUPPORTED_INSTALLMENT_PLAN_CARD_OR_MERCHANT':
        return '할부가 지원되지 않는 카드입니다.'
      default:
        return message || '결제 처리 중 오류가 발생했습니다.'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <XCircleIcon className="w-10 h-10 text-red-600" />
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">결제 실패</h1>
        <p className="text-gray-600 mb-6">
          {getFailureMessage(code)}
        </p>

        {code && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-500">
              <div className="flex justify-between items-center mb-1">
                <span>오류 코드:</span>
                <span className="font-mono text-red-600">{code}</span>
              </div>
              {orderId && (
                <div className="flex justify-between items-center">
                  <span>주문 번호:</span>
                  <span className="font-mono text-xs">{orderId}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={() => router.push('/subscription')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            다시 시도하기
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="w-full"
          >
            대시보드로 돌아가기
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            문제가 지속되면{' '}
            <a href="mailto:support@foodsnap.ai" className="text-emerald-600 hover:underline">
              고객센터
            </a>
            로 문의해주세요.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
