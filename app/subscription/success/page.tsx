"use client";

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { confirmPayment, getPayment } from '@/lib/toss-payments'
import { supabase } from '@/lib/supabase'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isConfirming, setIsConfirming] = useState(true)
  const [payment, setPayment] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const confirmPaymentProcess = async () => {
      try {
        const paymentKey = searchParams.get('paymentKey')
        const orderId = searchParams.get('orderId')
        const amount = searchParams.get('amount')

        if (!paymentKey || !orderId || !amount) {
          throw new Error('필수 결제 정보가 누락되었습니다.')
        }

        // 결제 승인 요청
        const confirmedPayment = await confirmPayment({
          paymentKey,
          orderId,
          amount: parseInt(amount),
        })

        setPayment(confirmedPayment)

        // 구독 정보 활성화 (결제가 성공한 경우)
        if (confirmedPayment.status === 'DONE') {
          // 현재 사용자의 기존 구독 비활성화
          await supabase
            .from('user_subscriptions')
            .update({ status: 'CANCELED', canceled_at: new Date().toISOString() })
            .eq('user_id', confirmedPayment.metadata?.user_id)

          // 새 구독 활성화
          const expiresAt = new Date()
          expiresAt.setMonth(expiresAt.getMonth() + 1) // 1개월 후

          await supabase
            .from('user_subscriptions')
            .insert({
              user_id: confirmedPayment.metadata?.user_id,
              plan_id: confirmedPayment.metadata?.plan_id,
              status: 'ACTIVE',
              expires_at: expiresAt.toISOString(),
            })
        }

      } catch (err: any) {
        console.error('결제 승인 실패:', err)
        setError(err.message || '결제 승인에 실패했습니다.')
      } finally {
        setIsConfirming(false)
      }
    }

    confirmPaymentProcess()
  }, [searchParams])

  if (isConfirming) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">결제를 승인하고 있습니다...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">결제 실패</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Button
              onClick={() => router.push('/subscription')}
              className="w-full"
            >
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
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircleIcon className="w-10 h-10 text-emerald-600" />
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">결제 완료!</h1>
        <p className="text-gray-600 mb-6">
          구독이 성공적으로 활성화되었습니다.<br />
          이제 프리미엄 기능을 모두 이용하실 수 있습니다.
        </p>

        {payment && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">결제 정보</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>상품명:</span>
                <span>{payment.orderName}</span>
              </div>
              <div className="flex justify-between">
                <span>결제 금액:</span>
                <span>{payment.totalAmount?.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span>결제 방법:</span>
                <span>{payment.method}</span>
              </div>
              <div className="flex justify-between">
                <span>주문 번호:</span>
                <span className="font-mono text-xs">{payment.orderId}</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
          >
            대시보드로 이동
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/subscription')}
            className="w-full"
          >
            구독 관리
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
