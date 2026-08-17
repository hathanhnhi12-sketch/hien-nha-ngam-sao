import { auth } from './firebase';
import { signInWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged, User } from 'firebase/auth';

const ALLOWED_ADMIN_EMAILS = [
  'thanhnhi12@gmail.com'
];

export class AuthService {
  private static currentUser: User | null = null;
  private static authStateListeners: ((isAdmin: boolean) => void)[] = [];

  static init() {
    if (auth) {
      onAuthStateChanged(auth, (user) => {
        this.currentUser = user;
        const isAdmin = this.isAdminLoggedIn();
        this.authStateListeners.forEach(listener => listener(isAdmin));
      });
    }
  }

  static onAuthStateChanged(listener: (isAdmin: boolean) => void) {
    this.authStateListeners.push(listener);
    listener(this.isAdminLoggedIn());
    return () => {
      this.authStateListeners = this.authStateListeners.filter(l => l !== listener);
    };
  }

  static isOwnerEmail(email: string | null | undefined): boolean {
    if (!email) return false;
    const normalized = email.trim().toLowerCase();
    return ALLOWED_ADMIN_EMAILS.includes(normalized);
  }

  static async loginAdmin(email: string, password: string): Promise<{ success: boolean; message?: string }> {
    const cleanEmail = email.trim().toLowerCase();

    if (!this.isOwnerEmail(cleanEmail)) {
      return { success: false, message: 'Thông tin quản trị không hợp lệ.' };
    }

    if (!auth) {
      return { success: false, message: 'Hệ thống xác thực Firebase chưa được cấu hình. Vui lòng thiết lập Firebase để sử dụng tính năng quản trị.' };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      if (this.isOwnerEmail(userCredential.user.email)) {
        return { success: true };
      } else {
        await fbSignOut(auth);
        return { success: false, message: 'Bạn không có quyền quản trị.' };
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
      // Determine if it's because the user hasn't been created yet
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        return { success: false, message: 'Thông tin đăng nhập không đúng hoặc tài khoản quản trị chưa được tạo trong Firebase Authentication.' };
      }
      if (error.code === 'auth/configuration-not-found') {
        return { success: false, message: 'Chưa bật Email/Password trong Firebase Console. Vui lòng vào Authentication > Sign-in method để bật.' };
      }
      return { success: false, message: 'Thông tin quản trị không hợp lệ (' + error.code + ').' };
    }
  }

  static isAdminLoggedIn(): boolean {
    if (!auth || !this.currentUser) return false;
    return this.isOwnerEmail(this.currentUser.email);
  }

  static async logoutAdmin(): Promise<void> {
    if (auth) {
      try {
        await fbSignOut(auth);
      } catch (e) {
        console.error(e);
      }
    }
  }
}
