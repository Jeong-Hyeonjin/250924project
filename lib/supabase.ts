import { createClient } from '@supabase/supabase-js'

// Supabase 환경 변수
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// 타입 정의
export type User = {
  id: string
  email: string
  created_at: string
  email_confirmed_at?: string
  last_sign_in_at?: string
}

export type AuthSession = {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at?: number
  token_type: string
  user: User
}

export type AuthError = {
  name: string
  message: string
  status?: number
}

// 인증 관련 유틸리티 함수들
export const auth = {
  // 이메일과 비밀번호로 회원가입
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  },

  // 이메일과 비밀번호로 로그인
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // 로그아웃
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // 현재 세션 가져오기
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // 현재 사용자 가져오기
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // 인증 상태 변화 감지
  onAuthStateChange: (callback: (event: string, session: AuthSession | null) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}
