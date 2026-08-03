import React, { useState } from 'react';
import { UserPlus, Flame } from 'lucide-react';
import { StudyBuddy as BuddyType } from '../types';
import { MOCK_BUDDIES } from '../constants';
import { GlowCard } from './GlowCard';

export const StudyBuddy: React.FC = () => {
  const [buddies] = useState<BuddyType[]>(MOCK_BUDDIES);

  return (
    <div className="space-y-6">
      <GlowCard className="rounded-[2.5rem]">
        <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm space-y-6 transition-colors duration-300">
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest block mb-1">
                AI Matchmaker
              </span>
              <h2 className="text-3xl font-black text-slate-950 dark:text-white">線上 AI 學伴與讀書室</h2>
            </div>

            <div className="flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-500/20 px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-500/30">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-black text-emerald-950 dark:text-emerald-300">142 人同步讀書中</span>
            </div>
          </div>

          {/* Meet Our Buddies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {buddies.map((buddy) => (
              <GlowCard key={buddy.id} className="rounded-[2rem]">
                <div className="bg-[#f4f6fb] dark:bg-slate-950 p-6 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 space-y-4 flex flex-col justify-between h-full">
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                      <img src={buddy.avatar} alt={buddy.name} className="w-12 h-12 rounded-full border-2 border-slate-950 dark:border-indigo-500" />
                      <div>
                        <h4 className="font-extrabold text-slate-950 dark:text-white text-base">{buddy.name}</h4>
                        <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400">{buddy.grade} · {buddy.target}</span>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl text-xs space-y-1.5 border border-slate-200 dark:border-slate-800 font-semibold">
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>研讀科目:</span>
                        <span className="text-slate-950 dark:text-white font-extrabold">{buddy.activeSubject}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>專注打卡:</span>
                        <span className="text-amber-600 dark:text-amber-400 font-extrabold flex items-center space-x-1">
                          <Flame className="w-3.5 h-3.5 fill-current inline" />
                          <span>{buddy.streakDays} 天</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-slate-950 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-extrabold text-xs rounded-full transition flex items-center justify-center space-x-2">
                    <UserPlus className="w-4 h-4" />
                    <span>邀請番茄鐘共讀</span>
                  </button>

                </div>
              </GlowCard>
            ))}
          </div>

        </div>
      </GlowCard>
    </div>
  );
};
