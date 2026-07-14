import React from 'react';
import { DailyRecord } from '../types';

interface HistoryBarChartProps {
  history: DailyRecord[];
}

export default function HistoryBarChart({ history }: HistoryBarChartProps) {
  // Take last 7 records for standard week-at-a-glance or 10 records
  const displayHistory = [...history].sort((a, b) => a.date.localeCompare(b.date)).slice(-7);

  const getDayLabel = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      return `${date.getDate()}일(${days[date.getDay()]})`;
    } catch {
      return dateStr;
    }
  };

  const maxCompleted = 10; // Total 10 profiles
  const height = 120; // SVG height

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">최근 일주일 실천 트렌드</h3>
          <p className="text-xs text-slate-400">하루에 몇 개의 학습자상을 실천했을까요?</p>
        </div>
        <span className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-bold">
          최대 10개
        </span>
      </div>

      <div className="flex items-end justify-between h-[150px] pt-4 px-2 select-none">
        {displayHistory.map((day, idx) => {
          const completedCount = day.completed.length;
          // Percentage of 10
          const pct = (completedCount / maxCompleted) * 100;
          // Cap bar height ratio
          const barHeight = Math.max((completedCount / maxCompleted) * height, 6); // at least 6px

          return (
            <div key={day.date} className="flex flex-col items-center flex-1 group">
              {/* Tooltip on hover */}
              <div className="relative mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded-md whitespace-nowrap z-10 shadow-md">
                  {completedCount}개 실천!
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                </div>
              </div>

              {/* Bar container */}
              <div className="w-6 sm:w-8 bg-slate-50 rounded-full h-[120px] flex items-end overflow-hidden relative border border-slate-100">
                {/* Active bar fill */}
                <div
                  style={{ height: `${pct}%` }}
                  className={`w-full rounded-full transition-all duration-500 ease-out flex items-start justify-center pt-1.5 ${
                    completedCount >= 8
                      ? 'bg-gradient-to-t from-emerald-400 to-emerald-500'
                      : completedCount >= 5
                      ? 'bg-gradient-to-t from-indigo-400 to-indigo-500'
                      : 'bg-gradient-to-t from-amber-400 to-amber-500'
                  }`}
                >
                  {/* Emoji inside bar if tall enough */}
                  {completedCount > 3 && (
                    <span className="text-[10px] text-white font-bold leading-none animate-bounce">
                      ⭐
                    </span>
                  )}
                </div>
              </div>

              {/* Labels */}
              <span className="text-[11px] font-semibold text-slate-500 mt-2 whitespace-nowrap">
                {getDayLabel(day.date)}
              </span>
            </div>
          );
        })}

        {displayHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center w-full h-full text-slate-400 text-xs py-8">
            <span className="text-2xl mb-1">📅</span>
            <span>아직 실천 기록이 없습니다.</span>
            <span>첫 미션을 등록해보세요!</span>
          </div>
        )}
      </div>
    </div>
  );
}
