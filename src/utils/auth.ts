import type { User, WatchHistory } from '../types/user';

const USERS_KEY = 'xiangyin_users';
const CURRENT_USER_KEY = 'xiangyin_current_user';
const WATCH_HISTORY_KEY = 'xiangyin_watch_history';

// 用户管理
export const getAllUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

export const saveUser = (user: User): void => {
  const users = getAllUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getUserByPhone = (phone: string): User | null => {
  const users = getAllUsers();
  return users.find(u => u.phone === phone) || null;
};

export const updateUser = (phone: string, updates: Partial<User>): boolean => {
  const users = getAllUsers();
  const index = users.findIndex(u => u.phone === phone);
  
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // 如果是当前登录用户，也更新当前用户信息
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.phone === phone) {
      setCurrentUser(users[index]);
    }
    
    return true;
  }
  
  return false;
};

// 当前用户管理
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const logout = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// 注册
export const register = (phone: string, password: string): { success: boolean; message: string } => {
  // 验证手机号
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return { success: false, message: '请输入有效的手机号码' };
  }
  
  // 验证密码
  if (password.length < 6) {
    return { success: false, message: '密码至少需要6位' };
  }
  
  // 检查用户是否已存在
  const existingUser = getUserByPhone(phone);
  if (existingUser) {
    return { success: false, message: '该手机号已注册' };
  }
  
  // 创建新用户
  const newUser: User = {
    phone,
    password,
    nickname: `用户${phone.slice(-4)}`,
    gender: '',
    birthday: '',
    createdAt: new Date().toISOString(),
  };
  
  saveUser(newUser);
  
  return { success: true, message: '注册成功' };
};

// 登录
export const login = (phone: string, password: string): { success: boolean; message: string; user?: User } => {
  const user = getUserByPhone(phone);
  
  if (!user) {
    return { success: false, message: '用户不存在' };
  }
  
  if (user.password !== password) {
    return { success: false, message: '密码错误' };
  }
  
  setCurrentUser(user);
  
  return { success: true, message: '登录成功', user };
};

// 观看历史管理
export const getWatchHistory = (phone: string): WatchHistory[] => {
  const historyJson = localStorage.getItem(`${WATCH_HISTORY_KEY}_${phone}`);
  return historyJson ? JSON.parse(historyJson) : [];
};

export const addWatchHistory = (phone: string, history: Omit<WatchHistory, 'watchedAt'>): void => {
  const histories = getWatchHistory(phone);
  
  // 检查是否已存在相同视频，如果存在则更新时间
  const existingIndex = histories.findIndex(h => h.videoUrl === history.videoUrl);
  
  const newHistory: WatchHistory = {
    ...history,
    watchedAt: new Date().toISOString(),
  };
  
  if (existingIndex !== -1) {
    histories[existingIndex] = newHistory;
  } else {
    histories.unshift(newHistory);
  }
  
  // 只保留最近50条记录
  const limitedHistories = histories.slice(0, 50);
  
  localStorage.setItem(`${WATCH_HISTORY_KEY}_${phone}`, JSON.stringify(limitedHistories));
};

export const clearWatchHistory = (phone: string): void => {
  localStorage.removeItem(`${WATCH_HISTORY_KEY}_${phone}`);
};
