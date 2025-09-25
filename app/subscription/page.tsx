"use client";

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  CheckIcon, 
  SparklesIcon,
  StarIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { generateOrderId, requestPayment, formatAmount } from '@/lib/toss-payments'
import { supabase } from '@/lib/supabase'

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  billing_cycle: string
  features: string[]
}

export default function SubscriptionPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // 인증 확인
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // 구독 플랜 로드
  useEffect(() => {
    const loadPlans = async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true })

      if (error) {
        console.error('구독 플랜 로드 실패:', error)
      } else {
        setPlans(data || [])
      }
    }

    loadPlans()
  }, [])

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!user) {
      router.push('/login')
      return
    }

    setIsProcessing(true)
    setSelectedPlanId(plan.id)

    try {
      const orderId = generateOrderId()

      // 데이터베이스에 결제 정보 미리 저장
      const { error: insertError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          order_id: orderId,
          amount: plan.price,
          status: 'PENDING',
          metadata: {
            plan_id: plan.id,
            plan_name: plan.name,
          },
        })

      if (insertError) {
        throw new Error('결제 정보 저장에 실패했습니다.')
      }

      // Toss Payments 결제 요청
      await requestPayment({
        amount: plan.price,
        orderId,
        orderName: `${plan.name} 구독`,
        customerName: user.email?.split('@')[0] || 'Customer',
        customerEmail: user.email || '',
        successUrl: `${window.location.origin}/subscription/success?orderId=${orderId}`,
        failUrl: `${window.location.origin}/subscription/fail?orderId=${orderId}`,
      })

    } catch (error) {
      console.error('결제 요청 실패:', error)
      alert('결제 요청에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsProcessing(false)
      setSelectedPlanId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">구독 플랜</h1>
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard')}
            >
              대시보드로 돌아가기
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              AI 식단 관리를 더욱 <span className="text-emerald-600">스마트하게</span>
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              프리미엄 플랜으로 무제한 식단 분석과 개인 맞춤 추천을 받아보세요
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-xl p-8 ${
                  plan.name === '프로' ? 'ring-2 ring-emerald-500 transform scale-105' : ''
                }`}
              >
                {plan.name === '프로' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                      <StarIcon className="w-4 h-4 mr-1" />
                      추천
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  {plan.name === '프리미엄' ? (
                    <SparklesIcon className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  ) : (
                    <StarIcon className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  )}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="text-center">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatAmount(plan.price)}
                    </span>
                    <span className="text-gray-600 ml-1">원/월</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckIcon className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Subscribe Button */}
                <Button
                  onClick={() => handleSubscribe(plan)}
                  disabled={isProcessing}
                  className={`w-full py-3 text-lg font-semibold ${
                    plan.name === '프로'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  } text-white transition-all duration-200`}
                >
                  {isProcessing && selectedPlanId === plan.id ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      처리 중...
                    </div>
                  ) : (
                    `${plan.name} 구독하기`
                  )}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-2">무료 체험</h3>
              <p className="text-gray-600 mb-4">매일 3회까지 무료로 식단 분석 가능</p>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="w-full"
              >
                무료로 계속 사용하기
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
