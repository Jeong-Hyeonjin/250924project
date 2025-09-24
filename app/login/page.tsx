"use client";

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  UserPlusIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { user, signIn, signUp, loading } = useAuth()
  
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // 이미 로그인된 사용자는 대시보드로 리다이렉트
  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setAuthLoading(true)

    try {
      if (isSignUp) {
        // 회원가입 로직
        if (password !== confirmPassword) {
          setError('비밀번호가 일치하지 않습니다.')
          setAuthLoading(false)
          return
        }

        if (password.length < 6) {
          setError('비밀번호는 최소 6자 이상이어야 합니다.')
          setAuthLoading(false)
          return
        }

        const { error } = await signUp(email, password)
        
        if (error) {
          if (error.message.includes('already registered')) {
            setError('이미 등록된 이메일입니다.')
          } else if (error.message.includes('Invalid email')) {
            setError('올바른 이메일 주소를 입력해주세요.')
          } else {
            setError(error.message || '회원가입 중 오류가 발생했습니다.')
          }
        } else {
          setSuccess('회원가입이 완료되었습니다! 이메일을 확인해주세요.')
          setIsSignUp(false)
          setEmail('')
          setPassword('')
          setConfirmPassword('')
        }
      } else {
        // 로그인 로직
        const { error } = await signIn(email, password)
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError('이메일 또는 비밀번호가 올바르지 않습니다.')
          } else if (error.message.includes('Email not confirmed')) {
            setError('이메일 인증을 완료해주세요.')
          } else {
            setError(error.message || '로그인 중 오류가 발생했습니다.')
          }
        }
        // 성공 시 useEffect에서 리다이렉트 처리
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setAuthLoading(false)
    }
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setError('')
    setSuccess('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        {/* 헤더 */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto h-16 w-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6"
          >
            🍽️
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isSignUp ? '회원가입' : '로그인'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp 
              ? 'AI 식단 관리 서비스에 가입하세요' 
              : 'AI 식단 관리 서비스에 로그인하세요'
            }
          </p>
        </div>

        {/* 폼 */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="이메일을 입력하세요"
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* 비밀번호 확인 (회원가입 시에만) */}
            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="비밀번호를 다시 입력하세요"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* 에러 메시지 */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* 성공 메시지 */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm"
              >
                {success}
              </motion.div>
            )}

            {/* 제출 버튼 */}
            <Button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 text-base font-medium"
            >
              {authLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isSignUp ? '가입 중...' : '로그인 중...'}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {isSignUp ? (
                    <>
                      <UserPlusIcon className="w-5 h-5 mr-2" />
                      회원가입
                    </>
                  ) : (
                    <>
                      <ArrowRightIcon className="w-5 h-5 mr-2" />
                      로그인
                    </>
                  )}
                </div>
              )}
            </Button>
          </div>

          {/* 모드 전환 */}
          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-emerald-600 hover:text-emerald-500 font-medium"
            >
              {isSignUp 
                ? '이미 계정이 있으신가요? 로그인하기' 
                : '계정이 없으신가요? 회원가입하기'
              }
            </button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  )
}
