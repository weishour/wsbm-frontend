export interface User {
  id: number;
  username: string;
  email: string;
  rememberMe: boolean;
  avatar?: string;
  status?: string;
  accessToken: string;
  refreshToken: string;
  lastTime?: string;
}
