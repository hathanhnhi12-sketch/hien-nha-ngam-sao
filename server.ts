import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import admin from 'firebase-admin';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = http.createServer(app);

  app.use(cors());
  app.use(express.json());

  // Initialize Firebase Admin
  let db: any = null;
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        // @ts-ignore
        credential: admin.credential.cert(serviceAccount)
      });
      // @ts-ignore
      db = admin.firestore();
      console.log('Firebase Admin initialized with service account.');
    } else if (process.env.VITE_FIREBASE_PROJECT_ID) {
      admin.initializeApp({
         projectId: process.env.VITE_FIREBASE_PROJECT_ID
      });
      // @ts-ignore
      db = admin.firestore();
      console.log('Firebase Admin initialized with Project ID.');
    } else {
      console.warn('Firebase Admin skipped: No FIREBASE_SERVICE_ACCOUNT_KEY or VITE_FIREBASE_PROJECT_ID provided.');
    }
  } catch (e) {
    console.warn('Firebase Admin init failed:', e);
  }

  // --- SECURE API ROUTES ---

  app.post('/api/user/:userId/profile', async (req, res) => {
    const { userId } = req.params;
    const { updates } = req.body;
    
    if (!updates) {
      return res.status(400).json({ success: false, message: 'No updates provided' });
    }

    const safeUpdates: any = { updatedAt: Date.now() };
    if (updates.displayName !== undefined) safeUpdates.displayName = String(updates.displayName).slice(0, 50);
    if (updates.nickname !== undefined) safeUpdates.nickname = String(updates.nickname).slice(0, 50);
    if (updates.bio !== undefined) safeUpdates.bio = String(updates.bio).slice(0, 200);
    if (updates.avatarUrl !== undefined) safeUpdates.avatarUrl = String(updates.avatarUrl);
    if (updates.email !== undefined) safeUpdates.email = String(updates.email);

    if (db) {
      try {
        const userRef = db.collection('users').doc(userId);
        await userRef.set(safeUpdates, { merge: true });
        return res.json({ success: true });
      } catch (e: any) {
        console.warn('Server firestore profile update warning:', e.message);
      }
    }

    res.json({ success: true, localCached: true });
  });

  app.post('/api/user/:userId/action', async (req, res) => {
    if (!db) {
      return res.status(500).json({ success: false, message: 'Database not available' });
    }
    
    const { userId } = req.params;
    const { action, payload } = req.body;
    
    try {
      const userRef = db.collection('users').doc(userId);
      
      await db.runTransaction(async (t) => {
        const userSnap = await t.get(userRef);
        if (!userSnap.exists) {
          throw new Error('User not found');
        }
        
        let userData = userSnap.data() as any;
        let stats = userData.stats || {};
        
        switch (action) {
          case 'add_exp':
            stats.exp = (stats.exp || 0) + (payload.amount || 0);
            
            // Calculate Level progression
            let requiredExp = stats.level * 100;
            while (stats.exp >= requiredExp) {
              stats.level = stats.level + 1;
              stats.exp = stats.exp - requiredExp;
              requiredExp = stats.level * 100; // Next level requirement
            }
            t.update(userRef, { stats });
            break;
            
          case 'redeem_code':
            const codeId = payload.codeId;
            const codeRef = db!.collection('rewardCodes').doc(codeId);
            const codeSnap = await t.get(codeRef);
            if (!codeSnap.exists) throw new Error('Code not found');
            const codeData = codeSnap.data() as any;
            
            if (!codeData.isActive) throw new Error('Code is inactive');
            if (codeData.maxUses && codeData.currentUses >= codeData.maxUses) throw new Error('Code limit reached');
            if (codeData.expiresAt && codeData.expiresAt < Date.now()) throw new Error('Code expired');
            
            const redemptionsRef = db!.collection('rewardCodes').doc(codeId).collection('redemptions').doc(userId);
            const redemptionSnap = await t.get(redemptionsRef);
            if (redemptionSnap.exists) throw new Error('Already redeemed');
            
            // Process rewards
            const rewards = codeData.rewardPackage?.rewards || [];
            let inventory = userData.inventory || [];
            
            for (const reward of rewards) {
              if (reward.type === 'coin') stats.coins = (stats.coins || 0) + reward.amount;
              if (reward.type === 'stardust') stats.stardust = (stats.stardust || 0) + reward.amount;
              if (reward.type === 'energy') stats.energy = (stats.energy || 0) + reward.amount;
              if (reward.type === 'exp') {
                 stats.exp = (stats.exp || 0) + reward.amount;
                 let rExp = stats.level * 100;
                 while (stats.exp >= rExp) {
                   stats.level = stats.level + 1;
                   stats.exp = stats.exp - rExp;
                   rExp = stats.level * 100;
                 }
              }
              if (reward.type === 'item') {
                const item = inventory.find((i: any) => i.itemId === reward.itemId);
                if (item) item.quantity += reward.amount;
                else inventory.push({ itemId: reward.itemId, quantity: reward.amount });
              }
            }
            
            t.update(userRef, { stats, inventory });
            // @ts-ignore
            t.update(codeRef, { currentUses: admin.firestore.FieldValue.increment(1) });
            t.set(redemptionsRef, { redeemedAt: Date.now(), reward: codeData.rewardPackage });
            break;
            
          default:
            throw new Error('Unknown action');
        }
      });
      
      res.json({ success: true });
    } catch (e: any) {
      console.error('Transaction failed:', e);
      res.status(400).json({ success: false, message: e.message });
    }
  });

  // Get Public Ranking
  app.get('/api/users/ranking', async (req, res) => {
    if (!db) {
       // Return empty or fallback
       return res.json({ users: [] });
    }
    try {
      const snapshot = await db.collection('users')
        .orderBy('stats.level', 'desc')
        .orderBy('stats.exp', 'desc')
        .limit(100)
        .get();
        
      const users = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          uid: data.uid,
          nickname: data.nickname || data.displayName,
          avatarUrl: data.avatarUrl,
          level: data.stats?.level || 1,
          exp: data.stats?.exp || 0
        };
      });
      res.json({ users });
    } catch (e) {
      console.error('Ranking fetch failed', e);
      res.status(500).json({ success: false });
    }
  });

  // Admin Direct Reward
  app.post('/api/admin/reward/direct', async (req, res) => {
    if (!db) return res.status(500).json({ success: false });
    const { adminEmail, targetUserId, title, message, rewardPackage } = req.body;
    
    if (adminEmail !== 'thanhnhi12@gmail.com') {
       return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    
    try {
      const msgRef = db.collection('users').doc(targetUserId).collection('mailbox').doc();
      await msgRef.set({
        id: msgRef.id,
        sender: 'Người Trông Coi',
        title,
        message,
        rewardPackage,
        isRead: false,
        isClaimed: false,
        createdAt: Date.now()
      });
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  // Claim Mailbox Reward
  app.post('/api/mailbox/:userId/claim/:messageId', async (req, res) => {
    if (!db) return res.status(500).json({ success: false });
    const { userId, messageId } = req.params;
    
    try {
      const userRef = db.collection('users').doc(userId);
      const msgRef = db.collection('users').doc(userId).collection('mailbox').doc(messageId);
      
      await db.runTransaction(async (t) => {
        const msgSnap = await t.get(msgRef);
        if (!msgSnap.exists) throw new Error('Message not found');
        const msgData = msgSnap.data() as any;
        
        if (msgData.isClaimed) throw new Error('Already claimed');
        
        const userSnap = await t.get(userRef);
        let userData = userSnap.data() as any;
        let stats = userData.stats || {};
        let inventory = userData.inventory || [];
        
        const rewards = msgData.rewardPackage?.rewards || [];
        
        for (const reward of rewards) {
          if (reward.type === 'coin') stats.coins = (stats.coins || 0) + reward.amount;
          if (reward.type === 'stardust') stats.stardust = (stats.stardust || 0) + reward.amount;
          if (reward.type === 'energy') stats.energy = (stats.energy || 0) + reward.amount;
          if (reward.type === 'exp') {
             stats.exp = (stats.exp || 0) + reward.amount;
             let rExp = stats.level * 100;
             while (stats.exp >= rExp) {
               stats.level = stats.level + 1;
               stats.exp = stats.exp - rExp;
               rExp = stats.level * 100;
             }
          }
          if (reward.type === 'item') {
            const item = inventory.find((i: any) => i.itemId === reward.itemId);
            if (item) item.quantity += reward.amount;
            else inventory.push({ itemId: reward.itemId, quantity: reward.amount });
          }
        }
        
        t.update(userRef, { stats, inventory });
        t.update(msgRef, { isClaimed: true, isRead: true });
      });
      
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server: httpServer },
        watch: isHmrDisabled ? null : undefined,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
