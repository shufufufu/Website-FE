export interface User {
  phone: string;
  password: string;
  nickname: string;
  gender?: 'male' | 'female' | 'other' | '';
  birthday?: string;
  createdAt: string;
}

export interface WatchHistory {
  videoTitle: string;
  videoUrl: string;
  seriesName: string;
  watchedAt: string;
  coverImage?: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  currentUser: User | null;
}
