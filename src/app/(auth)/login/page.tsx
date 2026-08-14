"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [greeting, setGreeting] = useState("Welcome Back")
  const router = useRouter()

  useEffect(() => {
    const hours = new Date().getHours()
    if (hours < 12) setGreeting("Good Morning")
    else if (hours < 18) setGreeting("Good Afternoon")
    else setGreeting("Good Evening")
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        router.push("/medicines")
        router.refresh()
      }
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="text-center">
          <div className="brand-icon-large">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <h1 className="creative-greeting">{greeting}</h1>
          <p className="text-muted" style={{ marginBottom: '32px' }}>Sign in to continue to Medicare+</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div style={{ background: 'var(--md-sys-color-error-container)', color: 'var(--md-sys-color-on-error-container)', padding: '12px 16px', borderRadius: '12px', fontSize: '0.875rem', fontWeight: '500' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="form-group">
            <div className="flex-row justify-between" style={{ marginBottom: '0' }}>
               <label className="form-label">Password</label>
               <Link href="/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-primary)', fontWeight: '600', marginRight: '4px' }}>
                 Forgot?
               </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ marginTop: '12px', height: '56px' }}
          >
            {loading ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
              </svg>
            ) : "Sign In to Account"}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-muted text-sm">
            New to Medicare?{" "}
            <Link href="/register" style={{ color: 'var(--md-sys-color-primary)', fontWeight: '700' }}>
              Create Account
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
