"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { 
  CameraIcon, 
  SparklesIcon, 
  ClockIcon, 
  ChartBarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  StarIcon
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // 로그인된 사용자는 대시보드로 리다이렉트
  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FoodSnap AI</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">안녕하세요! 👋</span>
                  <Button onClick={() => router.push('/dashboard')} variant="outline" size="sm">
                    대시보드
                  </Button>
                </div>
              ) : (
                <Button onClick={handleGetStarted} variant="outline" size="sm">
                  로그인
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-emerald-50 rounded-full mb-6">
                <StarIcon className="w-4 h-4 text-emerald-600 mr-2" />
                <span className="text-sm font-medium text-emerald-700">
                  혁신적인 AI 식단 관리
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="text-emerald-600">한 번의 클릭</span>으로<br />
                식단 기록 완성
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                복잡한 입력은 이제 그만! 음식 사진만 찍으면 AI가 자동으로 칼로리부터 영양성분까지 
                모든 것을 분석하고 기록합니다. <strong className="text-gray-900">마찰 없는 기록</strong>의 새로운 경험을 시작하세요.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Button 
                  size="xl" 
                  className="w-full sm:w-auto"
                  onClick={handleGetStarted}
                >
                  <CameraIcon className="w-5 h-5 mr-2" />
                  지금 시작하기
                </Button>
                <Button 
                  variant="outline" 
                  size="xl" 
                  className="w-full sm:w-auto"
                  onClick={handleGetStarted}
                >
                  데모 보기
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>

            {/* Demo Steps */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative max-w-4xl mx-auto"
            >
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-1">
                <div className="bg-white rounded-xl p-8">
                  <div className="grid md:grid-cols-3 gap-6 items-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CameraIcon className="w-8 h-8 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">1. 사진 촬영</h3>
                      <p className="text-sm text-gray-600">음식 사진을 한 장만 찍어주세요</p>
                    </div>
                    
                    <div className="hidden md:flex justify-center">
                      <ArrowRightIcon className="w-6 h-6 text-emerald-500" />
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <SparklesIcon className="w-8 h-8 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">2. AI 자동 분석</h3>
                      <p className="text-sm text-gray-600">AI가 음식을 인식하고 영양성분을 분석</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircleIcon className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">3. 자동 기록 완료</h3>
                    <p className="text-sm text-gray-600">끼니 시간까지 자동으로 분류되어 저장됩니다</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              왜 FoodSnap AI인가요?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              기존 식단 앱의 복잡함을 완전히 제거하고, 정말 필요한 핵심 기능만 남겼습니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <ClockIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">5초 만에 기록</h3>
              <p className="text-gray-600">
                복잡한 검색이나 수동 입력 없이, 사진 한 장으로 모든 기록이 완료됩니다. 
                기존 앱 대비 95% 시간 절약을 경험하세요.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <SparklesIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">정확한 AI 분석</h3>
              <p className="text-gray-600">
                최신 AI 기술로 음식의 종류, 양, 칼로리, 영양성분을 정확하게 분석합니다. 
                수동 입력보다 더 정확하고 일관된 결과를 제공합니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <ChartBarIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">스마트 분석</h3>
              <p className="text-gray-600">
                시간대별 자동 끼니 분류, 일일 칼로리 트래킹, 영양성분 요약까지. 
                복잡한 설정 없이 필요한 모든 인사이트를 자동으로 제공합니다.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              지금 바로 시작하세요
            </h2>
            <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
              복잡한 식단 관리는 이제 그만. 사진 한 장으로 시작하는 새로운 경험을 만나보세요.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="xl" 
                variant="outline"
                className="w-full sm:w-auto bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white border-2 border-emerald-600 shadow-lg font-semibold transition-colors duration-200"
                onClick={handleGetStarted}
              >
                무료로 시작하기
              </Button>
              <p className="text-sm text-emerald-100">
                간편한 이메일 가입으로 시작
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">FoodSnap AI</span>
            </div>
            <p className="text-gray-400 mb-4">
              마찰 없는 식단 기록, 지금 시작하세요
            </p>
            <p className="text-sm text-gray-500">
              © 2024 FoodSnap AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}