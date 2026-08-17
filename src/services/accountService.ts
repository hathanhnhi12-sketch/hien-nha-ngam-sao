import { db, isConfigured } from './firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, Unsubscribe, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { UserProfile, MailboxMessage, RewardPackage } from '../types';
import { StorageService } from './storageService';

type ProfileCallback = (profile: UserProfile) => void;

export class AccountService {
  private static unsubscribe: Unsubscribe | null = null;
  private static mailboxUnsubscribe: Unsubscribe | null = null;

  static async linkAccount(
    email: string, 
    localProfile: UserProfile, 
    onUpdate?: ProfileCallback, 
    onMailboxUpdate?: (msgs: MailboxMessage[]) => void
  ): Promise<UserProfile> {
    const normalizedEmail = email.trim().toLowerCase();
    const userId = normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_'); 

    // Save linked email to localStorage for persistent session
    try {
      localStorage.setItem('stargazer_user_email', normalizedEmail);
      localStorage.setItem('stargazer_user_id', userId);
    } catch {}

    if (!isConfigured || !db) {
      const merged: UserProfile = {
        ...localProfile,
        email: normalizedEmail,
        uid: userId,
        nickname: localProfile.nickname || localProfile.displayName || 'Lữ Khách Đêm',
      };
      StorageService.saveUserProfile(merged);
      if (onMailboxUpdate) {
        onMailboxUpdate(StorageService.getUserMailbox(userId));
      }
      return merged;
    }

    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      let persistentProfile: UserProfile;

      if (userSnap.exists()) {
        persistentProfile = userSnap.data() as UserProfile;
        // Merge with local changes if necessary
        StorageService.saveUserProfile(persistentProfile);
      } else {
        persistentProfile = {
          ...localProfile,
          uid: userId,
          email: normalizedEmail,
          nickname: localProfile.nickname || localProfile.displayName || 'Lữ Khách Đêm',
          createdAt: Date.now()
        };
        await setDoc(userRef, persistentProfile);
        StorageService.saveUserProfile(persistentProfile);
      }

      // Set up real-time listener for profile
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      if (onUpdate) {
        this.unsubscribe = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            StorageService.saveUserProfile(data);
            onUpdate(data);
          }
        });
      }

      // Set up real-time listener for mailbox
      if (this.mailboxUnsubscribe) {
         this.mailboxUnsubscribe();
      }
      if (onMailboxUpdate) {
         const mailboxRef = collection(db, 'users', userId, 'mailbox');
         this.mailboxUnsubscribe = onSnapshot(mailboxRef, (snap) => {
            if (!snap.empty) {
              const msgs = snap.docs.map(d => d.data() as MailboxMessage).sort((a,b) => b.createdAt - a.createdAt);
              onMailboxUpdate(msgs);
            } else {
              // Local fallback if remote mailbox collection is empty
              const localMsgs = StorageService.getUserMailbox(userId);
              onMailboxUpdate(localMsgs);
            }
         });
      }

      return persistentProfile;
    } catch (e) {
      console.warn('Firebase sync failed, using local profile fallback', e);
      const merged: UserProfile = {
        ...localProfile,
        email: normalizedEmail,
        uid: userId,
        nickname: localProfile.nickname || localProfile.displayName || 'Lữ Khách Đêm',
      };
      StorageService.saveUserProfile(merged);
      if (onMailboxUpdate) {
        onMailboxUpdate(StorageService.getUserMailbox(userId));
      }
      return merged;
    }
  }

  static async updatePublicFields(userId: string, updates: Partial<UserProfile>) {
    const safeUpdates: any = {};
    if (updates.displayName !== undefined) safeUpdates.displayName = updates.displayName;
    if (updates.nickname !== undefined) safeUpdates.nickname = updates.nickname;
    if (updates.bio !== undefined) safeUpdates.bio = updates.bio;
    if (updates.avatarUrl !== undefined) safeUpdates.avatarUrl = updates.avatarUrl;
    if (updates.email !== undefined) safeUpdates.email = updates.email;

    // 1. Try server-side endpoint first (avoids client-side permission restrictions)
    try {
      const res = await fetch(`/api/user/${userId}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: safeUpdates })
      });
      if (res.ok) {
        return;
      }
    } catch {}

    // 2. Direct client-side Firestore fallback
    if (!isConfigured || !db) return;
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, safeUpdates);
    } catch (e: any) {
      console.warn('Direct Firestore user update notice:', e?.message || e);
    }
  }

  // Calls backend API for secure actions or falls back locally
  static async secureAction(userId: string, action: string, payload: any): Promise<any> {
    try {
      const res = await fetch(`/api/user/${userId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
      });
      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch (e) {
      console.warn('Backend action API unreachable, checking fallback', e);
    }

    // Local fallback for actions
    const currentProfile = StorageService.getUserProfile();
    if (action === 'redeem_code') {
      return StorageService.redeemCodeLocal(userId, payload.codeId, currentProfile);
    }

    return { success: false, message: 'Thao tác không thành công.' };
  }

  static async getRanking(): Promise<any[]> {
    try {
      const res = await fetch(`/api/users/ranking`);
      if (res.ok) {
        const data = await res.json();
        if (data.users && data.users.length > 0) return data.users;
      }
    } catch (e) {
      console.warn('Ranking endpoint fetch error', e);
    }
    
    // Local users fallback for ranking
    const allUsers = StorageService.getAllUsers();
    return allUsers.map(u => ({
      uid: u.uid,
      nickname: u.nickname || u.displayName,
      avatarUrl: u.avatarUrl,
      level: u.stats?.level || 1,
      exp: u.stats?.exp || 0
    })).sort((a, b) => b.level !== a.level ? b.level - a.level : b.exp - a.exp);
  }

  static async claimMailboxReward(userId: string, messageId: string, currentProfile?: UserProfile): Promise<any> {
    try {
      const res = await fetch(`/api/mailbox/${userId}/claim/${messageId}`, { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        if (json.success) return json;
      }
    } catch (e) {
      console.warn('Mailbox claim server fallback', e);
    }

    // Local fallback
    const profile = currentProfile || StorageService.getUserProfile();
    return StorageService.claimUserMailboxReward(userId, messageId, profile);
  }

  static async markMailAsRead(userId: string, messageId: string) {
    StorageService.markMailAsReadLocal(userId, messageId);
    if (!isConfigured || !db) return;
    try {
      const msgRef = doc(db, 'users', userId, 'mailbox', messageId);
      await updateDoc(msgRef, { isRead: true });
    } catch (e) {}
  }

  static async sendDirectReward(
    adminEmail: string, 
    targetUserId: string, 
    title: string, 
    message: string, 
    rewardPackage: RewardPackage
  ): Promise<any> {
    try {
      const res = await fetch(`/api/admin/reward/direct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminEmail, targetUserId, title, message, rewardPackage })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) return json;
      }
    } catch (e) {
      console.warn('Direct reward API error, using local fallback', e);
    }

    // Local fallback
    const msg = StorageService.sendDirectMailboxReward(targetUserId, title, message, rewardPackage);
    return { success: true, message: 'Đã gửi phần thưởng thành công!', data: msg };
  }
}
