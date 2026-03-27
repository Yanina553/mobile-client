export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user_id: number;
}

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}
