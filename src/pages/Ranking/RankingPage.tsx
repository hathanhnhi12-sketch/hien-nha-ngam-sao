import React, { useEffect, useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { AccountService } from '../../services/accountService';
import { Trophy, Star, Zap } from 'lucide-react';
import { useMinigameStore } from '../../stores/useMinigameStore';
import { UserAvatar } from '../../components/common/UserAvatar';

export const RankingPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useMinigameStore();

  useEffect(() => {
    AccountService.getRanking().then(res => {
       setUsers(res);
       setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center justify-center gap-3">
           <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
           Bảng Xếp Hạng Lữ Khách
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
           Vinh danh những người bạn đồng hành tích cực nhất dưới Mái Hiên. Tương tác càng nhiều, cấp bậc càng cao.
        </p>
      </div>

      <GlassCard className="p-1 sm:p-2 relative overflow-hidden" variant="default">
        {loading ? (
          <div className="py-20 text-center text-slate-500 flex flex-col items-center gap-4">
             <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
             Đang tải danh sách...
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
             Chưa có dữ liệu bảng xếp hạng.
          </div>
        ) : (
          <div className="space-y-2">
             {users.map((user, index) => {
               const isTop1 = index === 0;
               const isTop2 = index === 1;
               const isTop3 = index === 2;
               const isTop3Any = isTop1 || isTop2 || isTop3;
               const isMe = user.uid === profile.uid;

               return (
                 <div 
                   key={user.uid}
                   className={`relative flex items-center p-3 sm:p-4 rounded-xl border transition-all ${
                     isMe 
                       ? 'bg-indigo-50/80 dark:bg-indigo-900/40 border-indigo-300 dark:border-indigo-500 shadow-md scale-[1.01]'
                       : isTop1
                         ? 'bg-amber-50/80 dark:bg-amber-900/20 border-amber-300/60 dark:border-amber-500/30'
                         : isTop2 || isTop3
                           ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-700/50'
                           : 'bg-white/40 dark:bg-slate-900/20 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                   }`}
                 >
                   <div className={`w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center font-black text-lg sm:text-xl rounded-xl mr-3 sm:mr-4 ${
                     isTop1 ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-white shadow-lg shadow-amber-500/20' :
                     isTop2 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white' :
                     isTop3 ? 'bg-gradient-to-br from-orange-300 to-orange-500 text-white' :
                     'bg-slate-100 dark:bg-slate-800 text-slate-400'
                   }`}>
                     {index + 1}
                   </div>
                   
                   <div className="flex-shrink-0 relative">
                     <UserAvatar 
                       src={user.avatarUrl} 
                       alt={user.nickname}
                       size="lg"
                       shape="circle"
                       ring={isTop3Any ? 'gold' : 'slate'}
                       showCrown={isTop1}
                     />
                   </div>

                   <div className="ml-4 flex-1 min-w-0">
                     <div className="flex items-center gap-2">
                       <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate text-sm sm:text-base">
                         {user.nickname}
                       </h3>
                       {isMe && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">BẠN</span>}
                     </div>
                     <div className="flex items-center gap-3 mt-1 text-xs">
                        <div className="flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400">
                          <Star className="w-3.5 h-3.5" /> Lv.{user.level}
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                          <Zap className="w-3.5 h-3.5" /> {user.exp.toLocaleString()} EXP
                        </div>
                     </div>
                   </div>
                   
                   <div className="ml-auto pl-4 text-right hidden sm:block">
                      <div className="text-xs font-semibold text-slate-400 mb-1">Tiến trình Level</div>
                      <div className="w-32 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500" style={{ width: `${Math.min(100, (user.exp / (user.level * 100)) * 100)}%` }} />
                      </div>
                   </div>
                 </div>
               );
             })}
          </div>
        )}
      </GlassCard>
    </div>
  );
};
