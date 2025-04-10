export interface User {
  id: string
  username: string | undefined
  email: string
  firstName: string
  lastName: string
  roleId: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}
