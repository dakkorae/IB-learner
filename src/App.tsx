import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  Settings,
  Trophy,
  ChevronRight,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Calendar,
  Award,
  HelpCircle,
  Heart,
  MessageSquare,
  Trash2,
  User,
  Clock,
  Check,
  CheckSquare2,
  Info,
  ChevronDown,
  ChevronUp,
  Download,
  Upload,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LearnerProfileKey, DailyRecord, ViewType, TimePeriod, Badge } from './types';
import { 
  PROFILE_DATA, 
  generateMockHistory, 
  calculateStats, 
  getPastDateString,
  getMissionForDay,
  getBadgesList,
  reconstructHistoryFromShared
} from './data';
import RadarChart from './components/RadarChart';
import HistoryBarChart from './components/HistoryBarChart';
import Confetti from './components/Confetti';


export default function App() {
  // --- STATE ---
  const [history, setHistory] = useState<DailyRecord[]>([]);
  const [userInfo, setUserInfo] = useState({
    name: '김현우',
    grade: '5',
    classroom: '3',
    school: 'IB World School'
  });
  const [selectedMissions, setSelectedMissions] = useState<LearnerProfileKey[]>([]);
  const [memoText, setMemoText] = useState('');
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [statsPeriod, setStatsPeriod] = useState<TimePeriod>('week');
  const [showCelebrateModal, setShowCelebrateModal] = useState(false);
  const [submittedToday, setSubmittedToday] = useState(false);
  const [isEditingToday, setIsEditingToday] = useState(false);
  const [expandedProfileKey, setExpandedProfileKey] = useState<LearnerProfileKey | null>(null);

  // Sharing Mode States
  const [isShareMode, setIsShareMode] = useState(false);
  const [sharedUserInfo, setSharedUserInfo] = useState({
    name: '김현우',
    grade: '5',
    classroom: '3',
    school: 'IB World School'
  });

  // Badge Unlock States
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<Badge[]>([]);
  const [showBadgeUnlockModal, setShowBadgeUnlockModal] = useState(false);

  // Today's date string YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // Helper to calculate badge progress
  const getBadgeProgress = (badge: Badge, records: DailyRecord[]): number => {
    if (badge.type === 'profile_count' && badge.profileKey) {
      return records.reduce((sum, r) => sum + (r.completed.includes(badge.profileKey!) ? 1 : 0), 0);
    }
    if (badge.type === 'total_days') {
      return records.filter((r) => r.submitted).length;
    }
    return 0;
  };

  // Format today's date for display (e.g., 2026년 7월 14일 화요일)
  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    };
    return new Date(todayStr).toLocaleDateString('ko-KR', options);
  };

  // --- INITIALIZATION & LOCALSTORAGE ---
  useEffect(() => {
    // 1. Check for URL Shared Portfolio Link (?share=...)
    const urlParams = new URLSearchParams(window.location.search);
    const shareParam = urlParams.get('share');

    if (shareParam) {
      try {
        const decoded = decodeURIComponent(atob(shareParam));
        const parsed = JSON.parse(decoded);
        if (parsed.u && parsed.stats) {
          setIsShareMode(true);
          setSharedUserInfo(parsed.u);
          setUserInfo(parsed.u); // Also overwrite user info for visual consistency

          const dummyHistory = reconstructHistoryFromShared(parsed.stats);
          setHistory(dummyHistory);
          // Set submittedToday to prevent any write-back actions
          setSubmittedToday(true);
          return; // Skip reading from localStorage
        }
      } catch (e) {
        console.error('공유 데이터를 해석하는데 실패했습니다.', e);
        alert('❌ 올바르지 않거나 손상된 공유 링크입니다. 일반 모드로 접속합니다.');
      }
    }

    // 2. Load User Info from LocalStorage
    const storedUser = localStorage.getItem('ib_user_info');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }

    // 3. Load History from LocalStorage
    const storedHistory = localStorage.getItem('ib_portfolio_history');
    if (storedHistory) {
      const parsedHistory = JSON.parse(storedHistory) as DailyRecord[];
      setHistory(parsedHistory);
      checkTodaySubmission(parsedHistory);
    } else {
      // First time user: generate 1 year of rich mock history to support all period filters!
      const mockHistory = generateMockHistory();
      localStorage.setItem('ib_portfolio_history', JSON.stringify(mockHistory));
      setHistory(mockHistory);
      checkTodaySubmission(mockHistory);
    }
  }, []);

  const checkTodaySubmission = (records: DailyRecord[]) => {
    const todayRecord = records.find((r) => r.date === todayStr);
    if (todayRecord && todayRecord.submitted) {
      setSubmittedToday(true);
      setSelectedMissions(todayRecord.completed);
      setMemoText(todayRecord.memo || '');
    } else {
      setSubmittedToday(false);
      // Reset daily selection if not submitted
      setSelectedMissions([]);
      setMemoText('');
    }
  };

  // --- ACTIONS ---
  // Toggle mission selection
  const handleToggleMission = (key: LearnerProfileKey) => {
    if (isShareMode) return; // Prevent modification in share mode
    if (submittedToday && !isEditingToday) return; // Prevent modification if submitted & not editing

    setSelectedMissions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Submit today's checklist
  const handleSubmitDaily = (e: React.FormEvent) => {
    e.preventDefault();
    if (isShareMode) return;

    const newRecord: DailyRecord = {
      date: todayStr,
      completed: selectedMissions,
      submitted: true,
      memo: memoText.trim()
    };

    // Filter out existing today record if any, and add the new one
    const updatedHistory = history.filter((r) => r.date !== todayStr);
    const finalHistory = [...updatedHistory, newRecord];

    // Compute newly unlocked achievements before updating state
    const previousBadges = getBadgesList(history);
    const previousUnlockedIds = previousBadges
      .filter((b) => getBadgeProgress(b, history) >= b.requiredCount)
      .map((b) => b.id);

    const currentBadges = getBadgesList(finalHistory);
    const newlyUnlocked = currentBadges.filter((b) => {
      const isNowUnlocked = getBadgeProgress(b, finalHistory) >= b.requiredCount;
      const wasUnlockedBefore = previousUnlockedIds.includes(b.id);
      return isNowUnlocked && !wasUnlockedBefore;
    });

    localStorage.setItem('ib_portfolio_history', JSON.stringify(finalHistory));
    setHistory(finalHistory);
    setSubmittedToday(true);
    setIsEditingToday(false);

    if (newlyUnlocked.length > 0) {
      setNewlyUnlockedBadges(newlyUnlocked);
      setShowBadgeUnlockModal(true);
    } else {
      // Trigger default daily celebration
      setShowCelebrateModal(true);
    }
  };

  // Enable editing today's submitted data
  const handleEnableEdit = () => {
    if (isShareMode) return;
    setIsEditingToday(true);
  };

  // Reset entire application data
  const handleResetData = () => {
    if (isShareMode) return;
    if (confirm('정말로 모든 포트폴리오 데이터를 초기화하시겠습니까?\n초기화 후에는 1년치 기본 가상 데이터가 새로 생성됩니다.')) {
      const mockHistory = generateMockHistory();
      localStorage.setItem('ib_portfolio_history', JSON.stringify(mockHistory));
      setHistory(mockHistory);
      checkTodaySubmission(mockHistory);
      alert('데이터가 초기화되었고 가상 데이터가 재설정되었습니다.');
    }
  };

  // Add sample historical data
  const handleGenerateSampleData = () => {
    if (isShareMode) return;
    const mockHistory = generateMockHistory();
    localStorage.setItem('ib_portfolio_history', JSON.stringify(mockHistory));
    setHistory(mockHistory);
    checkTodaySubmission(mockHistory);
    alert('샘플 역사 데이터(1년 분량)가 로컬 스토리지에 재생성되었습니다.');
  };

  // Save profile settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (isShareMode) return;
    localStorage.setItem('ib_user_info', JSON.stringify(userInfo));
    alert('학적 정보가 저장되었습니다!');
  };

  // Share portfolio via Base64 encoded URL
  const handleSharePortfolio = () => {
    // Calculate cumulative stats for each profile key
    const profileTotals: Record<string, number> = {};
    PROFILE_DATA.forEach((p) => {
      profileTotals[p.key] = 0;
    });
    
    history.forEach((record) => {
      record.completed.forEach((key) => {
        if (profileTotals[key] !== undefined) {
          profileTotals[key] += 1;
        }
      });
    });

    const payload = {
      u: userInfo,
      stats: profileTotals
    };

    try {
      const jsonStr = JSON.stringify(payload);
      // UTF-8 safe base64 encoding
      const base64Str = btoa(encodeURIComponent(jsonStr));
      const shareUrl = `${window.location.origin}${window.location.pathname}?share=${base64Str}`;
      
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('🎉 성장 포트폴리오를 친구들과 선생님, 부모님께 공유할 수 있는 링크가 복사되었습니다!\n원하는 곳에 붙여넣기(Ctrl+V) 하여 자랑해 보세요.');
      }).catch(() => {
        prompt('링크 복사에 실패했습니다. 아래 링크를 수동으로 복사해주세요:', shareUrl);
      });
    } catch (e) {
      alert('공유 링크 생성에 실패했습니다.');
    }
  };

  // Export portfolio history as JSON file download
  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify(history, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'ib_portfolio_data.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (e) {
      alert('백업 파일 생성 중 오류가 발생했습니다.');
    }
  };

  // Import, validate and restore portfolio history from JSON file
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isShareMode) {
      alert('공유 모드에서는 데이터를 가져올 수 없습니다.');
      return;
    }

    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          
          if (!Array.isArray(parsed)) {
            throw new Error("올바른 백업 파일 형식이 아닙니다. (데이터는 배열 형태여야 합니다.)");
          }

          // Strict structural validation
          for (let i = 0; i < parsed.length; i++) {
            const item = parsed[i];
            
            // Validate date string
            if (typeof item.date !== 'string') {
              throw new Error(`인덱스 ${i}번 데이터의 날짜 규격(date)이 올바르지 않습니다.`);
            }
            
            // Validate completed array
            if (!Array.isArray(item.completed)) {
              throw new Error(`인덱스 ${i}번 데이터의 실천 목록(completed)이 올바르지 않습니다.`);
            }
            
            // Validate submission flag
            if (typeof item.submitted !== 'boolean') {
              throw new Error(`인덱스 ${i}번 데이터의 제출 여부(submitted) 정보가 누락되었습니다.`);
            }
          }

          // If validation passes, save and overwrite
          localStorage.setItem('ib_portfolio_history', JSON.stringify(parsed));
          setHistory(parsed);
          checkTodaySubmission(parsed);
          
          alert('🎉 성공적으로 포트폴리오 데이터를 복원했습니다!\n이제 새로 채워진 데이터를 종합 대시보드와 미션 탭에서 확인할 수 있습니다.');
        } catch (err: any) {
          alert(`❌ 데이터 복원 실패: ${err.message}\n올바르게 생성된 ib_portfolio_data.json 파일인지 확인 후 다시 시도해 주세요.`);
        }
      };
    }
  };


  // --- STATS COMPUTATION ---
  const stats = calculateStats(history, statsPeriod);

  // Count total historical completed missions across all records
  const totalMissionsCount = history.reduce((sum, r) => sum + r.completed.length, 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col md:flex-row text-slate-800">
      {/* Confetti celebration */}
      <Confetti active={showCelebrateModal} />

      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-200 flex flex-col shrink-0 border-r border-slate-800">
        {/* Brand / Title */}
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md">
            <Trophy size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-md font-bold tracking-tight text-white">IB 학습자상</h1>
            <p className="text-[10px] text-slate-400 font-medium">PORTFOLIO DASHBOARD</p>
          </div>
        </div>

        {/* User Card */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-lg font-bold">
              {userInfo.name[0]}
            </div>
            <div>
              <div className="text-xs text-slate-400">{userInfo.school}</div>
              <div className="text-sm font-bold text-white">
                {userInfo.grade}학년 {userInfo.classroom}반 {userInfo.name}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              currentView === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard size={18} />
            <span>종합 대시보드</span>
          </button>

          <button
            onClick={() => setCurrentView('mission')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              currentView === 'mission'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <CheckSquare size={18} />
              <span>오늘의 미션 도전</span>
            </div>
            {submittedToday ? (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                완료
              </span>
            ) : (
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                대기
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentView('badges')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              currentView === 'badges'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Trophy size={18} />
              <span>나의 배지 전당</span>
            </div>
            <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/30 font-bold">
              {getBadgesList(history).filter(b => getBadgeProgress(b, history) >= b.requiredCount).length} / 56
            </span>
          </button>

          <button
            onClick={() => setCurrentView('profiles')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              currentView === 'profiles'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <BookOpen size={18} />
            <span>10대 학습자상 탐구</span>
          </button>

          <button
            onClick={() => setCurrentView('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              currentView === 'settings'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Settings size={18} />
            <span>환경 설정</span>
          </button>
        </nav>

        {/* Footer info */}
        <div className="p-6 border-t border-slate-800 text-center">
          <p className="text-[10px] text-slate-500 font-mono">IB Learner Profile v1.2</p>
          <p className="text-[9px] text-slate-600 mt-0.5">Designed for Elementary Grade 5</p>
        </div>
      </aside>

      {/* --- MAIN WORKSPACE --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Share Mode Banner */}
        {isShareMode && (
          <div className="bg-gradient-to-r from-indigo-950 to-indigo-800 text-white px-6 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs font-bold border-b border-indigo-700 shadow-lg">
            <div className="flex items-center space-x-2.5">
              <span className="bg-indigo-500 text-white px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider animate-pulse">공유 모드</span>
              <span className="font-medium text-indigo-100">
                🏫 <span className="text-white font-extrabold">{sharedUserInfo.school} {sharedUserInfo.grade}학년 {sharedUserInfo.classroom}반 {sharedUserInfo.name}</span> 어린이의 포트폴리오를 열람 중입니다. (읽기 전용)
              </span>
            </div>
            <button
              onClick={() => {
                window.location.href = window.location.pathname;
              }}
              className="bg-white text-indigo-950 hover:bg-indigo-50 px-3.5 py-1.5 rounded-xl font-extrabold transition-all text-xs shadow-md shrink-0 self-start sm:self-center"
            >
              내 대시보드로 돌아가기
            </button>
          </div>
        )}

        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
              <Calendar size={13} />
              <span>{getFormattedDate()}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mt-0.5">
              {currentView === 'dashboard' && '종합 성장 대시보드'}
              {currentView === 'mission' && '오늘의 IB 학습자 미션 도전!'}
              {currentView === 'badges' && '나의 영예로운 배지 전당'}
              {currentView === 'profiles' && 'IB 10대 학습자상 상세 안내'}
              {currentView === 'settings' && '계정 및 환경 설정'}
            </h2>
          </div>

          {/* Quick Stat Badge & Share Button */}
          <div className="flex items-center space-x-3">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-1.5 flex items-center space-x-2">
              <span className="text-xs font-medium text-slate-500">총 실천 횟수</span>
              <span className="text-sm font-extrabold text-indigo-600">{totalMissionsCount}회</span>
            </div>

            <button
              onClick={handleSharePortfolio}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-2xl flex items-center space-x-2 text-xs font-bold shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Share2 size={13} />
              <span>포트폴리오 공유</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* ======================================= */}
          {/* ① VIEW: DASHBOARD                       */}
          {/* ======================================= */}
          {currentView === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Top Summary Stats Cards */}
              <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
                  <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Calendar size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">총 기록 일수</p>
                    <p className="text-xl font-black text-slate-800">{history.length}일째 실천 중</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
                  <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <Award size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">하루 평균 실천 수</p>
                    <p className="text-xl font-black text-slate-800">{stats.averageCompletedPerDay}개</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
                  <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl">
                    <Sparkles size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">오늘 완료 여부</p>
                    <p className={`text-xl font-black ${submittedToday ? 'text-emerald-600' : 'text-amber-500'}`}>
                      {submittedToday ? '제출 완료 🎉' : '미제출 (진행중)'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chart Filters & Radar Chart Column (L: 5) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-500">분석 기준 기간</span>
                  <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setStatsPeriod('day')}
                      className={`text-[11px] px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                        statsPeriod === 'day' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      오늘
                    </button>
                    <button
                      onClick={() => setStatsPeriod('week')}
                      className={`text-[11px] px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                        statsPeriod === 'week' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      7일
                    </button>
                    <button
                      onClick={() => setStatsPeriod('month')}
                      className={`text-[11px] px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                        statsPeriod === 'month' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      14일
                    </button>
                    <button
                      onClick={() => setStatsPeriod('3months')}
                      className={`text-[11px] px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                        statsPeriod === '3months' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      3개월
                    </button>
                    <button
                      onClick={() => setStatsPeriod('6months')}
                      className={`text-[11px] px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                        statsPeriod === '6months' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      6개월
                    </button>
                    <button
                      onClick={() => setStatsPeriod('1year')}
                      className={`text-[11px] px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                        statsPeriod === '1year' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      1년
                    </button>
                  </div>
                </div>

                {/* Radar Chart Visual */}
                <RadarChart data={stats.chartData} maxSubmittedDays={stats.totalSubmittedDays} />
              </div>

              {/* Strengths / Growth & Stats List Column (L: 7) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Strengths vs Growth Highlight cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Strength Card */}
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100/50 rounded-2xl p-5 relative overflow-hidden shadow-sm">
                    <div className="absolute top-2 right-2 text-indigo-200">
                      <Trophy size={64} className="opacity-45" />
                    </div>
                    <span className="text-[10px] bg-indigo-600 text-white font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      나의 대표 강점
                    </span>
                    {stats.strongest ? (
                      <div className="mt-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-3xl">{stats.strongest.emoji}</span>
                          <div>
                            <h4 className="text-base font-bold text-slate-800">{stats.strongest.name}</h4>
                            <p className="text-[10px] text-slate-400 font-mono">{stats.strongest.englishName}</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 mt-3 line-clamp-2">
                          {PROFILE_DATA.find((p) => p.key === stats.strongest?.key)?.description}
                        </p>
                        <div className="mt-4 flex items-center text-xs text-indigo-600 font-bold">
                          <span>이 기간 동안 총 {stats.strongest.value}회 실천 완료!</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 text-slate-400 text-xs py-4">
                        실천 데이터를 쌓아 대표 강점을 알아보세요!
                      </div>
                    )}
                  </div>

                  {/* Growth Needed Card */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100/50 rounded-2xl p-5 relative overflow-hidden shadow-sm">
                    <div className="absolute top-2 right-2 text-amber-200">
                      <AlertCircle size={64} className="opacity-45" />
                    </div>
                    <span className="text-[10px] bg-amber-600 text-white font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      도전과 노력이 필요한 상
                    </span>
                    {stats.weakest ? (
                      <div className="mt-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-3xl">{stats.weakest.emoji}</span>
                          <div>
                            <h4 className="text-base font-bold text-slate-800">{stats.weakest.name}</h4>
                            <p className="text-[10px] text-slate-400 font-mono">{stats.weakest.englishName}</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 mt-3 line-clamp-2">
                          {PROFILE_DATA.find((p) => p.key === stats.weakest?.key)?.description}
                        </p>
                        <div className="mt-4 flex items-center text-xs text-amber-700 font-bold">
                          <span>앞으로 조금만 더 신경 써보면 어떨까요?</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 text-slate-400 text-xs py-4">
                        앞으로 더 많은 학습자상 도전에 도전해 보아요!
                      </div>
                    )}
                  </div>
                </div>

                {/* History Bar Chart */}
                <HistoryBarChart history={history} />

                {/* Feed of Recent Journals / Actions */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                    <h3 className="text-sm font-bold text-slate-800">최근 하교 일지 기록</h3>
                    <span className="text-xs text-slate-400">지속적인 성장의 기록</span>
                  </div>

                  <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                    {[...history]
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .slice(0, 4)
                      .map((record) => (
                        <div key={record.date} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-indigo-600">{record.date}</span>
                            <div className="flex -space-x-1 overflow-hidden">
                              {record.completed.map((key) => {
                                const prof = PROFILE_DATA.find((p) => p.key === key);
                                return (
                                  <span
                                    key={key}
                                    title={prof?.name}
                                    className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] border border-slate-200 shadow-sm"
                                  >
                                    {prof?.emoji}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                          {record.memo && (
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                              "{record.memo}"
                            </p>
                          )}
                        </div>
                      ))}

                    {history.length === 0 && (
                      <p className="text-center text-xs text-slate-400 py-6">일지 기록이 아직 없습니다.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* ② VIEW: MISSION CHALLENGE (CHECKLIST)   */}
          {/* ======================================= */}
          {currentView === 'mission' && (
            <div className="space-y-6">
              {/* Daily Checklist Header Guide */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-indigo-50 text-indigo-600 text-xs px-2.5 py-0.5 rounded-full font-bold">
                      오늘의 미션 도전 현황
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      성공 시 체크박스를 클릭해주세요!
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-800">
                    10대 학습자상을 학교생활에서 실천하고, 스스로를 칭찬해주세요.
                  </h3>
                  <p className="text-xs text-slate-500">
                    각 카드의 체크는 오늘 하루 해당 가치(Learner Profile)를 일상에서 드러낸 순간을 인증하는 체크입니다.
                  </p>
                </div>

                <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 shrink-0 text-center md:text-right">
                  <p className="text-[10px] font-bold text-indigo-500">오늘의 완성도</p>
                  <p className="text-2xl font-black text-indigo-600">
                    {selectedMissions.length} <span className="text-sm font-normal text-slate-400">/ 10</span>
                  </p>
                </div>
              </div>

              {/* Submission Status Alert for submitted days */}
              {submittedToday && !isEditingToday && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">🎉</span>
                    <div>
                      <h4 className="text-sm font-bold">오늘의 포트폴리오 제출이 완료되었습니다!</h4>
                      <p className="text-xs text-emerald-600">오늘 기록한 값은 대시보드 통계에 안전하게 합산되었습니다.</p>
                    </div>
                  </div>
                  <button
                    onClick={handleEnableEdit}
                    className="bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all shrink-0 self-start sm:self-center"
                  >
                    오늘 기록 수정하기
                  </button>
                </div>
              )}

              {/* Grid of Missions */}
              <form onSubmit={handleSubmitDaily} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PROFILE_DATA.map((profile, idx) => {
                    const isSelected = selectedMissions.includes(profile.key);
                    const disabled = submittedToday && !isEditingToday;

                    return (
                      <div
                        key={profile.key}
                        onClick={() => !disabled && handleToggleMission(profile.key)}
                        className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                          isSelected
                            ? `${profile.borderColor} ${profile.bgColor} ring-2 ring-indigo-500/15 shadow-md`
                            : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                        } ${disabled ? 'cursor-not-allowed opacity-85' : 'cursor-pointer'}`}
                      >
                        {/* Upper line: Emoji, Badge, Checkbox */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2.5">
                            <span className="text-3xl">{profile.emoji}</span>
                            <div>
                              <div className="flex items-center space-x-1.5">
                                <h4 className="font-bold text-slate-800 text-sm sm:text-base">
                                  {profile.name}
                                </h4>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${profile.bgColor} ${profile.textColor}`}>
                                  {profile.englishName}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">MISSION #{idx + 1}</p>
                            </div>
                          </div>

                          {/* Custom Checkbox UI */}
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                              isSelected
                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                : 'border-slate-200 bg-slate-50 text-transparent'
                            }`}
                          >
                            <Check size={14} strokeWidth={3} />
                          </div>
                        </div>

                        {/* Mid Section: Real 5th-grade Mission */}
                        <div className="mt-4 p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-slate-100">
                          <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                            {getMissionForDay(profile.key, todayStr)}
                          </p>
                        </div>

                        {/* Bottom Hint Tip */}
                        <div className="mt-3 flex items-center text-[10px] text-slate-400 font-medium">
                          <Info size={11} className="mr-1.5 text-slate-300" />
                          <span>배우고 실천했다면 카드를 눌러 체크하세요.</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Submit Form Elements */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">
                      💭 오늘의 성찰 및 배운 점 기록 (선택)
                    </label>
                    <textarea
                      value={memoText}
                      onChange={(e) => setMemoText(e.target.value)}
                      disabled={submittedToday && !isEditingToday}
                      placeholder="오늘 하루 10대 학습자상을 실천하며 느꼈던 기쁨, 아쉬웠던 점, 또는 다짐을 짧게 적어보세요. (예: 오늘 발표할 때 조금 떨렸지만 도전하는 사람이 된 것 같아 엄청 기뻤어요!)"
                      className="w-full h-24 p-4 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-slate-700 placeholder-slate-400 transition-all resize-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Submission Action */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <p className="text-xs text-slate-400 font-medium text-center sm:text-left">
                      💡 기록을 제출하면 대시보드 보고서에 오늘의 실천 성향이 안전하게 추가 반영됩니다.
                    </p>

                    {submittedToday && !isEditingToday ? (
                      <button
                        type="button"
                        onClick={() => setCurrentView('dashboard')}
                        className="w-full sm:w-auto bg-slate-800 text-white hover:bg-slate-700 text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
                      >
                        <span>📊 대시보드로 돌아가 성적 확인하기</span>
                        <ChevronRight size={14} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-extrabold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/15 flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <span>🚀 하교 전 포트폴리오 제출하기</span>
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ======================================= */}
          {/* ③ VIEW: 10 LEARNER PROFILES INFO        */}
          {/* ======================================= */}
          {currentView === 'profiles' && (
            <div className="space-y-6">
              {/* Introduction header */}
              <div className="bg-indigo-900 text-white p-6 rounded-2xl relative overflow-hidden shadow-md">
                <div className="absolute right-0 bottom-0 translate-x-10 translate-y-6 opacity-10">
                  <BookOpen size={200} />
                </div>
                <span className="text-[10px] bg-indigo-500/40 text-white font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  IB 초등과정 (PYP) 필독서
                </span>
                <h3 className="text-lg font-black text-white mt-3">IB 학습자상(Learner Profile)이 무엇인가요?</h3>
                <p className="text-xs text-indigo-200 mt-2 max-w-2xl leading-relaxed">
                  인터내셔널 바칼로레아(IB)는 나이와 국가에 상관없이 모든 학습자가 더 평화롭고 나은 세상을 만드는 일에
                  기여할 수 있는 글로벌 시민으로 성장하도록 돕습니다. 10가지 학습자상은 우리가 매일 실천해야 할 약속이자
                  빛나는 북극성입니다.
                </p>
              </div>

              {/* Interactive Accordion Profiles List */}
              <div className="space-y-3">
                {PROFILE_DATA.map((profile, idx) => {
                  const isExpanded = expandedProfileKey === profile.key;

                  return (
                    <div
                      key={profile.key}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                    >
                      {/* Accordion Trigger Header */}
                      <button
                        onClick={() => setExpandedProfileKey(isExpanded ? null : profile.key)}
                        className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50/50 transition-all focus:outline-none"
                      >
                        <div className="flex items-center space-x-3.5">
                          <span className="text-3xl">{profile.emoji}</span>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-slate-400 font-mono">PROFILE {idx + 1}</span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${profile.bgColor} ${profile.textColor}`}>
                                {profile.englishName}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-slate-800 mt-0.5">
                              {profile.name}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-slate-400 hidden sm:inline-block">자세히 알아보기</span>
                          <div className="text-slate-400 p-1.5 bg-slate-50 rounded-lg">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>
                      </button>

                      {/* Accordion Content Body */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-slate-50"
                          >
                            <div className="p-5 bg-slate-50/50 space-y-4">
                              {/* Overall Description */}
                              <div className="space-y-1">
                                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                  뜻과 철학 (What it means)
                                </h5>
                                <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white p-3.5 rounded-xl border border-slate-100">
                                  {profile.description}
                                </p>
                              </div>

                              {/* Real Mission Text */}
                              <div className="space-y-1">
                                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                  오늘 학교에서의 도전 미션 (Daily Action Mission)
                                </h5>
                                <p className="text-xs text-indigo-900 font-semibold leading-relaxed bg-indigo-50/40 p-3.5 rounded-xl border border-indigo-100/50">
                                  📌 "{getMissionForDay(profile.key, todayStr)}"
                                </p>
                              </div>

                              {/* Practical Action Tips (bullets) */}
                              <div className="space-y-1.5">
                                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                  실천 가이드 & 팁 (Practical Practice Tips)
                                </h5>
                                <div className="grid grid-cols-1 gap-2.5">
                                  {profile.tips.map((tip, tipIdx) => (
                                    <div
                                      key={tipIdx}
                                      className="flex items-start space-x-2 bg-white p-3 rounded-xl border border-slate-100 text-xs font-semibold text-slate-600"
                                    >
                                      <span className="text-indigo-500 font-bold shrink-0">✔</span>
                                      <span>{tip}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* ⑤ VIEW: BADGES HALL OF FAME              */}
          {/* ======================================= */}
          {currentView === 'badges' && (
            <div className="space-y-8">
              {/* Top Banner */}
              <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white p-6 rounded-3xl relative overflow-hidden shadow-lg shadow-yellow-500/10">
                <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10">
                  <Trophy size={180} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] bg-white/20 text-white font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                      성실 실천 명예의 전당
                    </span>
                    <h3 className="text-xl font-black text-white mt-2">나의 영예로운 배지 전당 🏆</h3>
                    <p className="text-xs text-amber-50 mt-1 max-w-xl leading-relaxed">
                      매일 꾸준하게 10가지 IB 학습자상을 실천할 때마다 성장의 배지가 잠금해제됩니다! 총 56개의 숨겨진 업적 배지를 모두 모아보세요.
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 self-start md:self-center">
                    <span className="text-[10px] font-bold text-amber-100 block">달성한 총 배지 개수</span>
                    <span className="text-2xl font-black text-white">
                      {getBadgesList(history).filter(b => getBadgeProgress(b, history) >= b.requiredCount).length} <span className="text-sm font-normal text-amber-200">/ 56개</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 1: MILESTONES */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Award className="text-amber-500" size={20} />
                  <h3 className="text-base font-bold text-slate-800">성장 마일스톤 배지 (누적 성찰 배지)</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getBadgesList(history).filter(b => b.type === 'total_days').map((badge) => {
                    const currentProgress = getBadgeProgress(badge, history);
                    const isUnlocked = currentProgress >= badge.requiredCount;
                    const progressPercent = Math.min(Math.round((currentProgress / badge.requiredCount) * 100), 100);

                    return (
                      <div
                        key={badge.id}
                        className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                          isUnlocked
                            ? 'bg-white border-yellow-200 shadow-md ring-1 ring-yellow-400/10'
                            : 'bg-white/60 border-slate-100 opacity-60'
                        }`}
                      >
                        <div className="flex items-start space-x-3.5">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-sm ${
                            isUnlocked ? 'bg-amber-100/60 text-amber-600 border border-amber-200' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {isUnlocked ? badge.emoji : '🔒'}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
                              <span>{badge.name}</span>
                              {isUnlocked && <span className="text-[10px] bg-yellow-50 text-yellow-600 px-1.5 py-0.5 rounded font-bold border border-yellow-200">완료</span>}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-relaxed">{badge.description}</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4 pt-2 border-t border-slate-50 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                            <span>달성 목표: {badge.requiredCount}일 제출</span>
                            <span className={isUnlocked ? 'text-indigo-600' : 'text-slate-500'}>
                              {currentProgress} / {badge.requiredCount}일 ({progressPercent}%)
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${isUnlocked ? 'bg-amber-500' : 'bg-slate-300'}`}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: LEARNER PROFILES SPECIFIC BADGES */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Sparkles className="text-indigo-500" size={20} />
                  <h3 className="text-base font-bold text-slate-800">학습자상별 전문 실천 배지 (Tiers 1~5)</h3>
                </div>

                <div className="space-y-4">
                  {PROFILE_DATA.map((profile) => {
                    // Filter badges corresponding to this profile
                    const profileBadges = getBadgesList(history).filter(b => b.profileKey === profile.key);
                    const currentCount = history.reduce((sum, r) => sum + (r.completed.includes(profile.key) ? 1 : 0), 0);
                    
                    return (
                      <div key={profile.key} className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        {/* Profile Header Line */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-50 pb-3 gap-2">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{profile.emoji}</span>
                            <div>
                              <h4 className="text-sm font-bold text-slate-800">{profile.name} 배지 패키지</h4>
                              <p className="text-[10px] text-slate-400 font-medium">실천을 쌓아 5가지 등급 배지를 획득하세요.</p>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full ${profile.bgColor} ${profile.textColor} text-xs font-bold self-start`}>
                            누적 실천: {currentCount}회
                          </div>
                        </div>

                        {/* Badges row for this profile */}
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5 pt-1">
                          {profileBadges.map((badge) => {
                            const isUnlocked = currentCount >= badge.requiredCount;
                            const progressPercent = Math.min(Math.round((currentCount / badge.requiredCount) * 100), 100);

                            return (
                              <div
                                key={badge.id}
                                className={`p-3 rounded-2xl border flex flex-col justify-between text-center transition-all ${
                                  isUnlocked
                                    ? 'bg-slate-50/50 border-slate-200 hover:shadow-sm ring-1 ring-slate-100'
                                    : 'bg-white border-dashed border-slate-100 opacity-45'
                                }`}
                              >
                                <div className="space-y-2">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl mx-auto ${
                                    isUnlocked ? 'bg-white shadow-sm border border-slate-100' : 'bg-slate-50 text-slate-400'
                                  }`}>
                                    {isUnlocked ? badge.emoji : '🔒'}
                                  </div>
                                  <div className="space-y-0.5">
                                    <h5 className="text-[11px] font-black text-slate-800 truncate">{badge.name}</h5>
                                    <p className="text-[9px] text-indigo-600 font-bold">{badge.requiredCount}회 달성</p>
                                  </div>
                                </div>

                                <div className="mt-3.5 space-y-1">
                                  <div className="flex justify-between text-[8px] font-extrabold text-slate-400">
                                    <span>진행도</span>
                                    <span>{currentCount} / {badge.requiredCount}</span>
                                  </div>
                                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${isUnlocked ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                      style={{ width: `${progressPercent}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* ④ VIEW: SETTINGS                        */}
          {/* ======================================= */}
          {currentView === 'settings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Profile Setup Form */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
                <div className="flex items-center space-x-3 pb-3 border-b border-slate-50">
                  <User className="text-indigo-500" size={18} />
                  <h3 className="text-sm font-bold text-slate-800">학적 정보 및 프로필 변경</h3>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">이름</label>
                    <input
                      type="text"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                      className="w-full text-xs font-semibold p-3 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-slate-700"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">학년</label>
                      <select
                        value={userInfo.grade}
                        onChange={(e) => setUserInfo({ ...userInfo, grade: e.target.value })}
                        className="w-full text-xs font-semibold p-3 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-slate-700"
                      >
                        {['1', '2', '3', '4', '5', '6'].map((g) => (
                          <option key={g} value={g}>
                            {g}학년
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">반</label>
                      <input
                        type="text"
                        value={userInfo.classroom}
                        onChange={(e) => setUserInfo({ ...userInfo, classroom: e.target.value })}
                        className="w-full text-xs font-semibold p-3 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-slate-700"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">학교명</label>
                    <input
                      type="text"
                      value={userInfo.school}
                      onChange={(e) => setUserInfo({ ...userInfo, school: e.target.value })}
                      className="w-full text-xs font-semibold p-3 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-slate-700"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    학적 정보 저장하기
                  </button>
                </form>
              </div>

              {/* Data Management Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
                <div className="flex items-center space-x-3 pb-3 border-b border-slate-50">
                  <RefreshCw className="text-amber-500" size={18} />
                  <h3 className="text-sm font-bold text-slate-800">데이터 관리 및 초기화</h3>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-700">로컬 브라우저 데이터 (LocalStorage)</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      이 애플리케이션의 모든 활동 데이터(과거 실천 이력, 학적 세팅)는 사용자 브라우저의 내부 메모리(localStorage)에
                      안전하고 즉시 저장됩니다. 별도의 외부 서버 연동 없이 독립적으로 동작합니다.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {/* Backup & Restore Block */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-1">
                      <button
                        onClick={handleExportData}
                        className="flex items-center justify-center space-x-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold p-3.5 rounded-xl text-xs border border-indigo-100 transition-all cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <Download size={14} className="shrink-0" />
                        <span>포트폴리오 백업 (JSON)</span>
                      </button>

                      <label className="flex items-center justify-center space-x-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold p-3.5 rounded-xl text-xs border border-emerald-100 transition-all cursor-pointer shadow-sm hover:shadow-md relative">
                        <Upload size={14} className="shrink-0" />
                        <span>포트폴리오 복원 (JSON)</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportData}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </label>
                    </div>

                    <button
                      onClick={handleGenerateSampleData}
                      className="w-full text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between transition-all group cursor-pointer"
                    >
                      <div>
                        <h5 className="text-xs font-bold text-slate-700">가상 샘플 데이터 다시 채우기</h5>
                        <p className="text-[10px] text-slate-400 mt-0.5">최근 1개년 치의 풍부한 실천 포트폴리오 데이터를 로컬에 추가합니다.</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <button
                      onClick={handleResetData}
                      className="w-full text-left bg-rose-50/50 hover:bg-rose-50 border border-rose-100 rounded-xl p-3.5 flex items-center justify-between transition-all group cursor-pointer"
                    >
                      <div>
                        <h5 className="text-xs font-bold text-rose-700">전체 기록 데이터 초기화</h5>
                        <p className="text-[10px] text-rose-400/80 mt-0.5">저장된 기록과 설정을 완전히 삭제하고 초기화합니다.</p>
                      </div>
                      <Trash2 size={16} className="text-rose-400 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- CELEBRATION CONGRATS MODAL --- */}
      <AnimatePresence>
        {showCelebrateModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 relative overflow-hidden"
            >
              {/* Confetti element decoration inside card */}
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-50 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-rose-50 rounded-full blur-2xl pointer-events-none" />

              <div className="text-center space-y-4 relative">
                <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-400/20 text-3xl animate-bounce">
                  ✨
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] bg-indigo-50 text-indigo-600 font-extrabold px-2.5 py-0.5 rounded-full">
                    성장 완료! 하교 승인 완료
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-800 pt-1">
                    멋져요, {userInfo.name} 어린이!
                  </h3>
                  <p className="text-xs text-indigo-600 font-bold">
                    오늘의 {selectedMissions.length}가지 학습자상을 성실하게 실천했습니다!
                  </p>
                </div>

                {/* Micro checklist list of what was completed today */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left max-h-[160px] overflow-y-auto space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">오늘 빛낸 핵심 가치들</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMissions.map((key) => {
                      const prof = PROFILE_DATA.find((p) => p.key === key);
                      return (
                        <span
                          key={key}
                          className="inline-flex items-center space-x-1 bg-white border border-slate-100 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm"
                        >
                          <span>{prof?.emoji}</span>
                          <span>{prof?.name}</span>
                        </span>
                      );
                    })}
                    {selectedMissions.length === 0 && (
                      <span className="text-xs text-slate-400 font-medium">아쉽게도 오늘은 선택된 핵심 가치가 없지만, 마음만은 이미 훌륭해요!</span>
                    )}
                  </div>
                </div>

                {/* Short encouragement message */}
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  "우리가 실천하는 오늘의 작은 약속이 더 나은 평화로운 내일을 만듭니다. 오늘 밤 푹 자고, 내일 더 튼튼한
                  모습으로 교실에서 만나요!"
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setShowCelebrateModal(false);
                      setCurrentView('dashboard');
                    }}
                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-extrabold py-3.5 rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
                  >
                    성장 확인하고 홈으로 가기
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- BADGE UNLOCK CELEBRATION MODAL --- */}
      <AnimatePresence>
        {showBadgeUnlockModal && newlyUnlockedBadges.length > 0 && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <Confetti active={showBadgeUnlockModal} />
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="bg-gradient-to-b from-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-800 relative overflow-hidden"
            >
              {/* Star light background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0,transparent_100%)] pointer-events-none" />
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="text-center space-y-5 relative">
                <div className="w-20 h-20 bg-gradient-to-tr from-yellow-300 via-amber-400 to-yellow-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-yellow-500/20 text-4xl animate-pulse">
                  👑
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] bg-yellow-500/20 text-yellow-400 font-extrabold px-3 py-1 rounded-full border border-yellow-500/30 uppercase tracking-widest animate-bounce">
                    명예로운 업적 잠금 해제!
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white pt-2 leading-tight">
                    대단해요, {userInfo.name} 어린이!
                  </h3>
                  <p className="text-xs text-indigo-300 font-medium">
                    끊임없는 실천과 성찰로 영광스러운 배지를 획득했습니다!
                  </p>
                </div>

                {/* Display Newly Unlocked Badges */}
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl text-center space-y-3">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">오늘 잠금해제된 배지</p>
                  <div className="space-y-4">
                    {newlyUnlockedBadges.map((badge) => (
                      <div key={badge.id} className="flex items-center space-x-3.5 text-left bg-indigo-900/30 border border-indigo-500/20 p-3.5 rounded-xl">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-3xl shrink-0 shadow-inner">
                          {badge.emoji}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-white text-sm">{badge.name}</h4>
                          <p className="text-[10px] text-indigo-200 mt-0.5 leading-relaxed font-medium">
                            {badge.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Celebration Letter */}
                <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
                  "배움을 마음에 품고 끝없이 행동하는 사람은 미래를 더 아름답게 빛낼 주인공입니다. 여러분의 소중한 성장은 이미 배지 전당에 영원히 기록되었습니다!"
                </p>

                <div className="pt-2 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setShowBadgeUnlockModal(false);
                      setShowCelebrateModal(true); // Trigger standard submission success next
                    }}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold py-3.5 rounded-xl transition-all cursor-pointer"
                  >
                    확인
                  </button>

                  <button
                    onClick={() => {
                      setShowBadgeUnlockModal(false);
                      setCurrentView('badges');
                    }}
                    className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 text-xs font-black py-3.5 rounded-xl transition-all shadow-md shadow-yellow-500/10 cursor-pointer"
                  >
                    배지 전당가서 자랑하기 🏆
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
