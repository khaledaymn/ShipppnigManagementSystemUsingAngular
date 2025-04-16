export interface User {
  id: string
  username?: string
  email: string
  firstName?: string
  lastName?: string
  roleId: string
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface UserCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  id: string
  message: string
  token: string
  role: string
  permissions: {
    [moduleName: string]: string[]
  }
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  password: string
  email: string
  token: string
}
