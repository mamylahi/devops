export type UserRole = 'admin' | 'developer' | 'viewer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  role: UserRole;
  is_active?: boolean;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: UserRole;
  is_active?: boolean;
}
