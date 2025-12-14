import { LoginData, RegisterData } from "@/types/auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function registerUser(data: RegisterData) {
  const res = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "Error registering user")
  }

  return res.json()
}

export async function loginUser(data: LoginData) {
  const formData = new URLSearchParams()
  formData.append("username", data.email) 
  formData.append("password", data.password)

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "Invalid credentials")
  }

  return res.json()
}
