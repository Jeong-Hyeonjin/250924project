"use client";

import { createContext, useContext, useEffect, useState } from 'react'
import { auth, User, AuthSession } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: AuthSession | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 초기 세션 확인
    const getInitialSession = async () => {
      try {
        const { session, error } = await auth.getSession()
        
        if (error) {
          console.error('세션 확인 오류:', error)
        } else {
          setSession(session)
          setUser(session?.user || null)
        }
      } catch (error) {
        console.error('초기 세션 로드 오류:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // 인증 상태 변화 감지
    const { data: { subscription } } = auth.onAuthStateChange(
      async (event, session) => {
        console.log('인증 상태 변화:', event, session)
        
        setSession(session)
        setUser(session?.user || null)
        setLoading(false)
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await auth.signIn(email, password)
      
      if (error) {
        console.error('로그인 오류:', error)
        return { error }
      }

      return { error: null }
    } catch (error) {
      console.error('로그인 예외:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await auth.signUp(email, password)
      
      if (error) {
        console.error('회원가입 오류:', error)
        return { error }
      }

      return { error: null }
    } catch (error) {
      console.error('회원가입 예외:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await auth.signOut()
      
      if (error) {
        console.error('로그아웃 오류:', error)
        return { error }
      }

      return { error: null }
    } catch (error) {
      console.error('로그아웃 예외:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
