"use client"

import { signOut } from "next-auth/react"

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="btn-primary"
      style={{ 
        background: 'transparent', 
        border: '1px solid var(--danger)', 
        color: 'var(--danger)',
        boxShadow: 'none',
        marginTop: '24px'
      }}
    >
      Sign Out
    </button>
  )
}
