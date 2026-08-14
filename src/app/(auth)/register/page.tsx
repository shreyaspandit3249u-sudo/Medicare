"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { registerUser } from "@/app/actions/auth"
import { signIn } from "next-auth/react"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)
      formData.append("name", name)

      const result = await registerUser(formData)

      if (result?.error) {
        setError(result.error)
      } else {
        // Auto-login after registration
        const loginResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        if (loginResult?.error) {
          router.push("/login")
        } else {
          router.push("/medicines")
          router.refresh()
        }
      }
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="glass-panel w-full max-w-md p-8" style={{ padding: '32px' }}>
        <div className="text-center mb-8">
          <h1 className="page-title text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted">Join Medicare+ for personalized tracking</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-muted">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="glass-panel"
              style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--surface-border)' }}
              placeholder="Alex User"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-panel"
              style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--surface-border)' }}
              placeholder="alex@example.com"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-muted">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-panel"
              style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--surface-border)' }}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-danger text-sm font-medium mt-2" style={{ color: 'var(--danger)' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-4"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-muted text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-bold" style={{ color: 'var(--primary)' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
