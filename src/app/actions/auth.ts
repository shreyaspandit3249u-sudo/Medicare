"use server"

import { db } from "@/lib/database"
import bcrypt from "bcryptjs"

export async function registerUser(formData: FormData) {
  const normalizedEmail = (formData.get("email") as string)?.toLowerCase();
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  if (!normalizedEmail || !password) {
    return { error: "Email and password are required" }
  }

  try {
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (existingUser) {
      return { error: "This email is already registered. Please log in." }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await db.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: name || "User",
      }
    })

    return { success: true }
  } catch (rawErr: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = rawErr as any;
    if (err?.code === 'P2002') {
      return { error: "This email is already registered. Please log in." }
    }
    
    // Check for specific Prisma initialization errors
    if (err?.message?.includes('URL_INVALID') || err?.message?.includes('datasource')) {
      console.error("[CRITICAL] Database Connection Error:", err.message);
      return { error: "The database is currently offline or misconfigured. Please contact support." }
    }

    console.error("Registration error details:", {
      message: err.message,
      code: err.code
    });
    return { error: `Registration failed. Please try again.` }
  }
}
